import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Users, Star, Heart, Filter } from 'lucide-react';
import { rankHotelsByVibe, answerQuery, Vibe } from '../services/ai';
import { addToWishlist } from '../services/wishlist';
import { formatUsdAsInr } from '../services/currency';
import HotelDetail from '../components/HotelDetail';
import SearchSuggestions from '../components/SearchSuggestions';
import { searchHotels } from '../services/hotels';

interface Hotel {
  id: number;
  name: string;
  location: string;
  country: string;
  rating: number;
  price: number;
  originalPrice: number;
  image: string;
  amenities: string[];
  description: string;
  discount: number;
}

const HotelBooking: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [showMapView, setShowMapView] = useState<boolean>(false);
  const [compareSet, setCompareSet] = useState<number[]>([]);
  const [vibe, setVibe] = useState<Vibe | ''>('');
  const [aiInput, setAiInput] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string>('');

  const seed: Hotel[] = [];
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(seed);

  // Load query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const country = params.get('country') || '';
    const date = params.get('date') || '';
    const people = params.get('people') || '';
    if (country) setSearchQuery(country);
    if (date) setCheckIn(date);
    if (people) setGuests(Number(people) || 2);
  }, []);

  // Load hotels
  useEffect(() => {
    const load = async () => {
      const results = await searchHotels({ country: searchQuery, checkIn, checkOut, guests });
      const mapped = (results || []).map((h: any, idx: number) => ({
        id: h.id ?? idx,
        name: h.name,
        location: h.location,
        country: h.country,
        rating: h.rating,
        price: h.price,
        originalPrice: h.originalPrice ?? h.price,
        image: h.image,
        amenities: h.amenities,
        description: h.description,
        discount: h.discount ?? 0,
      })) as Hotel[];
      setFilteredHotels(mapped);
    };
    load();
  }, [searchQuery, checkIn, checkOut, guests]);

  // Apply sorting + amenities
  useEffect(() => {
    let items = [...filteredHotels];
    if (selectedAmenities.length) {
      items = items.filter(h => selectedAmenities.some(a => h.amenities.includes(a)));
    }
    switch (sortBy) {
      case 'price-low':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        items.sort((a, b) => b.discount - a.discount);
        break;
    }
    setFilteredHotels(items);
  }, [selectedAmenities, sortBy]);

  // Close suggestions if clicked outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <head>
        <title>Hotels in India – PLAN2GO</title>
        <meta name="description" content="Search and compare hotels in India" />
        <link rel="canonical" href="https://plan2go.com/agoda" />
      </head>

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-white text-3xl font-bold mb-2 text-center">Find Your Perfect Stay</h2>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* DESTINATION */}
            <div className="relative" ref={searchRef}>
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Where are you going?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchSuggestions(true)}
                className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {showSearchSuggestions && (
                <SearchSuggestions
                  onSelectDestination={(value: string) => {
                    setSearchQuery(value);
                    setShowSearchSuggestions(false);
                  }}
                  onClose={() => setShowSearchSuggestions(false)}
                />
              )}
            </div>

            {/* CHECK-IN */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* CHECK-OUT */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* GUESTS */}
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* HOTEL LIST */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-gray-600 mb-4">{filteredHotels.length} hotels found</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map(hotel => (
            <div key={hotel.id} className="bg-white rounded-lg border shadow hover:shadow-md transition">

              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop';
                }}
              />

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{hotel.name}</h3>

                <p className="text-gray-600 text-sm mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  {hotel.location}
                </p>

                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(hotel.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>

                <div className="text-xl font-bold mb-3">{formatUsdAsInr(hotel.price)}</div>

                <button
                  onClick={() => setSelectedHotel(hotel)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {selectedHotel && (
        <HotelDetail hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />
      )}
    </div>
  );
};

export default HotelBooking;
