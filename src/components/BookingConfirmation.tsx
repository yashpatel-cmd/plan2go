import React from 'react';
import { CheckCircle, Calendar, Users, MapPin, Download, Share2 } from 'lucide-react';
import { formatUsdAsInr } from '../services/currency';

interface BookingConfirmationProps {
  booking: {
    id: string;
    hotelName: string;
    location: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    roomType: string;
    totalPrice: number;
    confirmationNumber: string;
  };
  onClose: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateNights = () => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-green-50 border-b border-green-200 p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600">Your reservation has been successfully confirmed</p>
          </div>

          <div className="p-6">
            {/* Confirmation Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Confirmation Number</h3>
                <p className="text-2xl font-bold text-blue-600 font-mono">{booking.confirmationNumber}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="font-semibold text-gray-900">{formatDate(booking.checkIn)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-semibold text-gray-900">{formatDate(booking.checkOut)}</p>
                </div>
              </div>
            </div>

            {/* Hotel Details */}
            <div className="border rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Hotel Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{booking.hotelName}</p>
                    <p className="text-sm text-gray-600">{booking.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{calculateNights()} {calculateNights() === 1 ? 'Night' : 'Nights'}</span>
                </div>
              </div>
            </div>

            {/* Room Details */}
            <div className="border rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Room Details</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{booking.roomType}</p>
                  <p className="text-sm text-gray-600">Room Type</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{formatUsdAsInr(booking.totalPrice)}</p>
                  <p className="text-sm text-gray-600">Total Amount</p>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Information</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Check-in time: 3:00 PM</li>
                <li>• Check-out time: 11:00 AM</li>
                <li>• Please bring a valid ID and the credit card used for booking</li>
                <li>• Free cancellation until 24 hours before check-in</li>
                <li>• Contact the hotel directly for any special requests</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Download Receipt</span>
              </button>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                <Share2 className="h-5 w-5" />
                <span>Share Booking</span>
              </button>
            </div>

            {/* Close Button */}
            <div className="mt-6 text-center">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 