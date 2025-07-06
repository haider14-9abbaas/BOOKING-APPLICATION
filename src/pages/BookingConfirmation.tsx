import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Users, CreditCard, MapPin, Phone, Mail } from 'lucide-react';

export default function BookingConfirmation() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h2>
          <p className="text-gray-600 mb-6">Unable to find your booking information.</p>
          <Link 
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-600 text-white p-8 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-lg opacity-90">
              Your reservation has been successfully created
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Booking Details */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Hotel Information</span>
                    </div>
                    <div className="ml-8">
                      <p className="font-bold text-lg">{booking.room.hotelId.name}</p>
                      <p className="text-gray-600">{booking.room.hotelId.location}</p>
                      <p className="text-gray-600">{booking.room.type}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Stay Dates</span>
                    </div>
                    <div className="ml-8">
                      <p><strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
                      <p><strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                      <p><strong>Nights:</strong> {booking.nights}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Users className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Guest Information</span>
                    </div>
                    <div className="ml-8">
                      <p><strong>Guests:</strong> {booking.guests}</p>
                      <p><strong>Name:</strong> {booking.customerDetails.fullName}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Payment</span>
                    </div>
                    <div className="ml-8">
                      <p><strong>Method:</strong> Cash on Delivery</p>
                      <p><strong>Total Amount:</strong> <span className="text-2xl font-bold text-blue-600">${booking.totalPrice}</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Details</h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Contact Information</span>
                    </div>
                    <div className="ml-8 space-y-2">
                      <p><strong>Email:</strong> {booking.customerDetails.email}</p>
                      <p><strong>Phone:</strong> {booking.customerDetails.phone}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Address</span>
                    </div>
                    <div className="ml-8">
                      <p>{booking.customerDetails.address}</p>
                      <p>{booking.customerDetails.city}, {booking.customerDetails.country}</p>
                    </div>
                  </div>
                  
                  {booking.customerDetails.specialRequests && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="h-5 w-5 bg-gray-400 rounded-full"></span>
                        <span className="font-medium text-gray-900">Special Requests</span>
                      </div>
                      <div className="ml-8">
                        <p>{booking.customerDetails.specialRequests}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4">Important Information</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• Please arrive at the hotel on your check-in date</li>
                <li>• Payment will be collected in cash upon arrival</li>
                <li>• Check-in time is usually 3:00 PM, check-out is 11:00 AM</li>
                <li>• Please bring a valid ID for check-in</li>
                <li>• For any changes or cancellations, please contact the hotel directly</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
              >
                Book Another Hotel
              </Link>
              <button
                onClick={() => window.print()}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Print Confirmation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}