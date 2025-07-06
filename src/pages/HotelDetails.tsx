import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Wifi, Car, Utensils, Waves, Dumbbell, Coffee } from 'lucide-react';
import RoomCard from '../components/RoomCard';

interface Hotel {
  _id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  amenities: string[];
  priceRange: string;
}

interface Room {
  _id: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  description: string;
  available: boolean;
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  'Free WiFi': <Wifi className="h-5 w-5" />,
  'Swimming Pool': <Waves className="h-5 w-5" />,
  'Restaurant': <Utensils className="h-5 w-5" />,
  'Parking': <Car className="h-5 w-5" />,
  'Fitness Center': <Dumbbell className="h-5 w-5" />,
  'Room Service': <Coffee className="h-5 w-5" />,
};

export default function HotelDetails() {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchHotelDetails();
      fetchRooms();
    }
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/hotels/${id}`);
      const data = await response.json();
      setHotel(data);
    } catch (error) {
      console.error('Error fetching hotel details:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/hotels/${id}/rooms`);
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hotel not found</h2>
          <p className="text-gray-600">The hotel you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hotel Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img 
              src={hotel.image} 
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="font-medium">{hotel.rating}</span>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex items-center space-x-2 text-gray-600 mb-4">
              <MapPin className="h-5 w-5" />
              <span>{hotel.location}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {hotel.name}
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              {hotel.description}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {hotel.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                  {amenityIcons[amenity] || <span className="h-5 w-5 bg-gray-400 rounded-full"></span>}
                  <span className="text-sm text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <span className="text-3xl font-bold text-blue-600">{hotel.priceRange}</span>
              <span className="text-gray-500 ml-2">per night</span>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Available Rooms
          </h2>
          
          {rooms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No rooms available at this hotel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map(room => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}