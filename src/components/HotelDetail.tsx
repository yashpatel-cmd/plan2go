import React, { useState } from 'react';
import {
  MapPin, Star, Heart, Share2, Phone, Mail, Globe,
  Users, Wifi, Waves, Car, Utensils, Dumbbell
} from 'lucide-react';
import BookingConfirmation from './BookingConfirmation';
import { formatUsdAsInr } from '../services/currency';
import { createPriceAlert } from '../services/priceAlerts';

interface HotelDetailProps {
  hotel: {
    id: number;
    name: string;
    location: string;
    rating: number;
    price: number;
    originalPrice: number;
    image: string;
    amenities: string[];
    description: string;
    discount: number;
    images?: string[];
    rooms?: Room[];
    reviews?: Review[];
    policies?: string[];
  };
  onClose: () => void;
}

interface Room {
  id: number;
  type: string;
  capacity: number;
  price: number;
  amenities: string[];
  available: boolean;
}

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

const HotelDetail: React.FC<HotelDetailProps> = ({ hotel, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  const hotelData = {
    ...hotel,
    images: hotel.images || [
      hotel.image,
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop"
    ],
    rooms: hotel.rooms || [
      {
        id: 1,
        type: "Standard Room",
        capacity: 2,
        price: hotel.price,
        amenities: ["Queen Bed", "Private Bathroom", "Free WiFi", "TV"],
        available: true
      },
      {
        id: 2,
        type: "Deluxe Room",
        capacity: 3,
        price: hotel.price + 50,
        amenities: ["King Bed", "Private Bathroom", "Free WiFi", "TV", "Mini Bar"],
        available: true
      },
      {
        id: 3,
        type: "Suite",
        capacity: 4,
        price: hotel.price + 120,
        amenities: ["King Bed + Sofa Bed", "Living Room", "Private Bathroom", "Free WiFi", "TV", "Mini Bar", "Balcony"],
        available: true
      }
    ],
    reviews: hotel.reviews || [
      {
        id: 1,
        user: "John D.",
        rating: 5,
        comment: "Excellent stay! Clean and comfortable.",
        date: "2024-01-15"
      },
      {
        id: 2,
        user: "Sarah M.",
        rating: 4,
        comment: "Very nice hotel with good amenities.",
        date: "2024-01-10"
      }
    ],
    policies: hotel.policies || [
      "Check-in: 3:00 PM",
      "Check-out: 11:00 AM",
      "Free cancellation until 24 hours before check-in",
      "No smoking",
      "Pets not allowed",
      "Free WiFi"
    ]
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-5 w-5" />;
      case 'pool': return <Waves className="h-5 w-5" />;
      case 'parking': return <Car className="h-5 w-5" />;
      case 'restaurant': return <Utensils className="h-5 w-5" />;
      case 'gym': return <Dumbbell className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{hotelData.name}</h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Heart className="h-5 w-5" />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
            </div>
          </div>

          <div className="p-6">

            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative h-96 rounded-lg overflow-hidden mb-4">
                <img
                  src={hotelData.images[selectedImage]}
                  alt={hotelData.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex space-x-2 overflow-x-auto">
                {hotelData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${hotelData.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* MAIN CONTENT */}
              <div className="lg:col-span-2">

                {/* HOTEL INFO */}
                <div className="mb-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold">{hotelData.name}</h3>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{hotelData.location}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(hotelData.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span>{hotelData.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mt-4">{hotelData.description}</p>
                </div>

                {/* AMENITIES */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4">Amenities</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hotelData.amenities.map((a) => (
                      <div key={a} className="flex items-center space-x-2">
                        {getAmenityIcon(a)}
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ROOMS */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4">Available Rooms</h4>
                  <div className="space-y-4">
                    {hotelData.rooms.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`border rounded-lg p-4 cursor-pointer ${
                          selectedRoom?.id === room.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <h5 className="font-semibold">{room.type}</h5>
                            <div className="flex items-center text-gray-600">
                              <Users className="h-4 w-4 mr-1" />
                              Up to {room.capacity} guests
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                              {room.amenities.map((am) => (
                                <span key={am} className="bg-gray-100 text-xs px-2 py-1 rounded">
                                  {am}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xl font-bold">{formatUsdAsInr(room.price)}</span>
                            <p className="text-sm text-gray-500">per night</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* REVIEWS */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4">Guest Reviews</h4>

                  {hotelData.reviews.map((r) => (
                    <div key={r.id} className="border-b pb-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{r.user}</span>

                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < r.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-gray-700">{r.comment}</p>
                      <span className="text-xs text-gray-500">{r.date}</span>
                    </div>
                  ))}
                </div>

                {/* POLICIES */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-2">Policies</h4>
                  {hotelData.policies.map((p, i) => (
                    <div key={i} className="flex space-x-2">
                      <span className="text-blue-500">•</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOOKING SIDEBAR */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-24">

                  <h4 className="text-lg font-semibold mb-4">Book Your Stay</h4>

                  {/* Date Selection */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm">Check-in</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm">Check-out</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm">Guests</label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        {[1,2,3,4,5,6,7,8].map(n => (
                          <option key={n} value={n}>{n} Guests</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Selected Room */}
                  {selectedRoom && (
                    <div className="bg-white p-4 rounded-lg border mb-6">
                      <h5 className="font-semibold mb-1">{selectedRoom.type}</h5>
                      <p className="text-xl font-bold">{formatUsdAsInr(selectedRoom.price)}</p>
                      <p className="text-sm text-gray-600">per night</p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between">
                      <span>Total Estimated</span>
                      <span className="text-xl font-bold">
                        {formatUsdAsInr(selectedRoom ? selectedRoom.price : hotelData.price)}
                      </span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    disabled={!checkIn || !checkOut || !selectedRoom}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-400"
                    onClick={() => {
                      const booking = {
                        id: Math.random().toString(36).slice(2),
                        hotelName: hotelData.name,
                        checkIn,
                        checkOut,
                        guests,
                        roomType: selectedRoom!.type,
                        totalPrice: selectedRoom!.price,
                        confirmationNumber:
                          `BK${Math.random().toString(36).slice(2).toUpperCase()}`
                      };
                      setBookingData(booking);
                      setShowBookingConfirmation(true);
                    }}
                  >
                    Book Now
                  </button>

                  {/* Price Alert */}
                  <button
                    className="w-full mt-3 border py-2 rounded-lg"
                    onClick={() => createPriceAlert({
                      hotelId: hotelData.id,
                      threshold: selectedRoom ? selectedRoom.price : hotelData.price
                    })}
                  >
                    Set Price Alert
                  </button>

                  {/* Contact */}
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>info@hotel.com</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>www.hotel.com</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showBookingConfirmation && bookingData && (
        <BookingConfirmation
          booking={bookingData}
          onClose={() => {
            setShowBookingConfirmation(false);
            setBookingData(null);
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default HotelDetail;
