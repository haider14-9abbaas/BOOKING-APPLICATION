import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Wifi, Car, Utensils, Waves } from 'lucide-react';

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

interface HotelCardProps {
  hotel: Hotel;
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  'Free WiFi': <Wifi className="h-4 w-4" />,
  'Swimming Pool': <Waves className="h-4 w-4" />,
  'Restaurant': <Utensils className="h-4 w-4" />,
  'Parking': <Car className="h-4 w-4" />,
};

export default function HotelCard({ hotel }: HotelCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={hotel.image} 
          alt={hotel.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium">{hotel.rating}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-2 text-gray-600 mb-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{hotel.location}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{hotel.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities.slice(0, 4).map((amenity, index) => (
            <div key={index} className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
              {amenityIcons[amenity]}
              <span className="text-xs text-gray-700">{amenity}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600">{hotel.priceRange}</span>
            <span className="text-gray-500 text-sm">/night</span>
          </div>
          <Link 
            to={`/hotel/${hotel._id}`}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}