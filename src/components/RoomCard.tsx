import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Bed, Wifi, Car, Coffee, Bath } from 'lucide-react';

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

interface RoomCardProps {
  room: Room;
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  'King Bed': <Bed className="h-4 w-4" />,
  'Free WiFi': <Wifi className="h-4 w-4" />,
  'Parking': <Car className="h-4 w-4" />,
  'Coffee Maker': <Coffee className="h-4 w-4" />,
  'Private Bath': <Bath className="h-4 w-4" />,
};

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={room.images[0]} 
          alt={room.type}
          className="w-full h-48 object-cover"
        />
        {!room.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-lg font-bold">Not Available</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-2 text-gray-600 mb-2">
          <Users className="h-4 w-4" />
          <span className="text-sm">Up to {room.capacity} guests</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{room.type}</h3>
        <p className="text-gray-600 mb-4">{room.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.slice(0, 4).map((amenity, index) => (
            <div key={index} className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
              {amenityIcons[amenity] || <span className="h-4 w-4 bg-gray-400 rounded-full"></span>}
              <span className="text-xs text-gray-700">{amenity}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600">${room.price}</span>
            <span className="text-gray-500 text-sm">/night</span>
          </div>
          {room.available ? (
            <Link 
              to={`/room/${room._id}`}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Book Now
            </Link>
          ) : (
            <button 
              disabled
              className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg cursor-not-allowed font-medium"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}