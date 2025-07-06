import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Users, ArrowLeft, Calendar, CreditCard } from 'lucide-react';

interface Room {
  _id: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  description: string;
  available: boolean;
  hotelId: {
    _id: string;
    name: string;
    location: string;
    rating: number;
  };
}

export default function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRoomDetails();
    }
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
      const data = await response.json();
      setRoom(data);
    } catch (error) {
      console.error('Error fetching room details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-64 bg-gray-300 animate-pulse"></div>
            <div className="p-8">
              <div className="h-8 bg-gray-300 rounded animate-pulse mb-4"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div className="h-20 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Room not found</h2>
          <p className="text-gray-600">The room you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to={`/hotel/${room.hotelId._id}`}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Hotel</span>
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Room Image */}
          <div className="relative h-64 md:h-80">
            <img 
              src={room.images[0]} 
              alt={room.type}
              className="w-full h-full object-cover"
            />
            {!room.available && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-xl font-bold">Not Available</span>
              </div>
            )}
          </div>

          <div className="p-8">
            {/* Hotel Info */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm">{room.hotelId.rating} • {room.hotelId.location}</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">{room.hotelId.name}</h3>
            </div>

            {/* Room Details */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <Users className="h-5 w-5" />
                <span>Up to {room.capacity} guests</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{room.type}</h1>
              <p className="text-lg text-gray-600 mb-6">{room.description}</p>

              {/* Amenities */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Room Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                      <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing and Booking */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">${room.price}</span>
                    <span className="text-gray-500 ml-2">per night</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Free cancellation</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CreditCard className="h-4 w-4" />
                      <span>Cash on delivery</span>
                    </div>
                  </div>
                </div>

                {room.available ? (
                  <Link 
                    to={`/booking/${room._id}`}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
                  >
                    Book This Room
                  </Link>
                ) : (
                  <button 
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-4 px-6 rounded-lg cursor-not-allowed font-medium"
                  >
                    Room Not Available
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}