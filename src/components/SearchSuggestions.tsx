import React from 'react';
import { MapPin, Clock, TrendingUp } from 'lucide-react';

interface SearchSuggestionsProps {
  onSelectDestination: (destination: string) => void;
  onClose: () => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ onSelectDestination, onClose }) => {
  const popularDestinations = [
    { name: "New York, NY", country: "United States", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=100&h=100&fit=crop" },
    { name: "London, UK", country: "United Kingdom", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=100&h=100&fit=crop" },
    { name: "Paris, France", country: "France", image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=100&h=100&fit=crop" },
    { name: "Tokyo, Japan", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&h=100&fit=crop" },
    { name: "Sydney, Australia", country: "Australia", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=100&h=100&fit=crop" },
    { name: "Dubai, UAE", country: "United Arab Emirates", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100&h=100&fit=crop" }
  ];

  const recentSearches = [
    "Miami Beach, FL",
    "San Francisco, CA",
    "Las Vegas, NV",
    "Orlando, FL"
  ];

  const trendingDestinations = [
    "Bali, Indonesia",
    "Santorini, Greece",
    "Kyoto, Japan",
    "Machu Picchu, Peru"
  ];

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
      <div className="p-4">
        {/* Recent Searches */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium text-gray-900">Recent Searches</h3>
          </div>
          <div className="space-y-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => onSelectDestination(search)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md text-gray-700 hover:text-gray-900 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium text-gray-900">Popular Destinations</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {popularDestinations.map((destination, index) => (
              <button
                key={index}
                onClick={() => onSelectDestination(destination.name)}
                className="text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{destination.name}</p>
                    <p className="text-xs text-gray-500">{destination.country}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Trending Destinations */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-4 w-4 text-red-500" />
            <h3 className="font-medium text-gray-900">Trending Now</h3>
          </div>
          <div className="space-y-2">
            {trendingDestinations.map((destination, index) => (
              <button
                key={index}
                onClick={() => onSelectDestination(destination)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md text-gray-700 hover:text-gray-900 transition-colors"
              >
                {destination}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestions; 