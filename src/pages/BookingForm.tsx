import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, User, MapPin, Phone, Mail } from 'lucide-react';

interface Room {
  _id: string;
  type: string;
  price: number;
  capacity: number;
  hotelId: {
    _id: string;
    name: string;
    location: string;
  };
}

interface BookingData {
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  customerDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    specialRequests: string;
  };
}

export default function BookingForm() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    customerDetails: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      specialRequests: ''
    }
  });

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  const fetchRoomDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`);
      const data = await response.json();
      setRoom(data);
    } catch (error) {
      console.error('Error fetching room details:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate) return 0;
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const calculateTotal = () => {
    if (!room) return 0;
    return room.price * calculateNights();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotelId: room.hotelId._id,
          roomId: room._id,
          ...bookingData,
          totalPrice: calculateTotal()
        }),
      });

      if (response.ok) {
        navigate('/confirmation', { 
          state: { 
            booking: {
              ...bookingData,
              room,
              totalPrice: calculateTotal(),
              nights: calculateNights()
            }
          }
        });
      } else {
        alert('Error creating booking. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Error creating booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
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
          <p className="text-gray-600">Unable to load room details for booking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">Complete Your Booking</h1>
            <p className="opacity-90">{room.hotelId.name} - {room.type}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Booking Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Stay Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingData.checkInDate}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          checkInDate: e.target.value
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingData.checkOutDate}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          checkOutDate: e.target.value
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Guests
                    </label>
                    <select
                      value={bookingData.guests}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        guests: parseInt(e.target.value)
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Array.from({ length: room.capacity }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Customer Details */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Guest Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.customerDetails.fullName}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          customerDetails: {
                            ...bookingData.customerDetails,
                            fullName: e.target.value
                          }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={bookingData.customerDetails.email}
                          onChange={(e) => setBookingData({
                            ...bookingData,
                            customerDetails: {
                              ...bookingData.customerDetails,
                              email: e.target.value
                            }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={bookingData.customerDetails.phone}
                          onChange={(e) => setBookingData({
                            ...bookingData,
                            customerDetails: {
                              ...bookingData.customerDetails,
                              phone: e.target.value
                            }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.customerDetails.address}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          customerDetails: {
                            ...bookingData.customerDetails,
                            address: e.target.value
                          }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Street address"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookingData.customerDetails.city}
                          onChange={(e) => setBookingData({
                            ...bookingData,
                            customerDetails: {
                              ...bookingData.customerDetails,
                              city: e.target.value
                            }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="City"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookingData.customerDetails.country}
                          onChange={(e) => setBookingData({
                            ...bookingData,
                            customerDetails: {
                              ...bookingData.customerDetails,
                              country: e.target.value
                            }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={bookingData.customerDetails.specialRequests}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          customerDetails: {
                            ...bookingData.customerDetails,
                            specialRequests: e.target.value
                          }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any special requests or requirements..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hotel:</span>
                      <span className="font-medium">{room.hotelId.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room:</span>
                      <span className="font-medium">{room.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nights:</span>
                      <span className="font-medium">{calculateNights()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per night:</span>
                      <span className="font-medium">${room.price}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">${calculateTotal()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2 text-blue-800">
                      <CreditCard className="h-5 w-5" />
                      <span className="font-medium">Payment Method</span>
                    </div>
                    <p className="text-blue-700 mt-2">
                      Cash on Delivery - Pay when you arrive at the hotel
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting || calculateNights() <= 0}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {submitting ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}