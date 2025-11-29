import type { } from 'react';

export interface Hotel {
  id: string | number;
  name: string;
  location: string;
  country: string;
  rating: number;
  price: number;
  originalPrice?: number;
  image: string;
  amenities: string[];
  description: string;
  discount?: number;
}

const MOCK_HOTELS: Hotel[] = [
  {
    id: 1,
    name: "Grand Plaza Hotel & Resort",
    location: "Downtown, City Center",
    country: "United States",
    rating: 4.8,
    price: 189,
    originalPrice: 250,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    amenities: ["Free WiFi", "Pool", "Spa", "Restaurant"],
    description: "Luxury hotel in the heart of the city with stunning views",
    discount: 24
  },
  {
    id: 2,
    name: "Seaside Boutique Hotel",
    location: "Beachfront, Coastal Area",
    country: "Australia",
    rating: 4.6,
    price: 145,
    originalPrice: 180,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    amenities: ["Beach Access", "Free WiFi", "Bar", "Garden"],
    description: "Charming boutique hotel with direct beach access",
    discount: 19
  },
  {
    id: 3,
    name: "Business Center Hotel",
    location: "Financial District",
    country: "United Kingdom",
    rating: 4.4,
    price: 120,
    originalPrice: 150,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
    amenities: ["Business Center", "Free WiFi", "Gym", "Conference Rooms"],
    description: "Perfect for business travelers with modern amenities",
    discount: 20
  },
  {
    id: 4,
    name: "Mountain View Lodge",
    location: "Mountain Range, Scenic Area",
    country: "Japan",
    rating: 4.7,
    price: 220,
    originalPrice: 280,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    amenities: ["Mountain Views", "Hiking Trails", "Restaurant", "Fireplace"],
    description: "Rustic lodge with breathtaking mountain views",
    discount: 21
  },
  // India sample entries across states to improve search realism
  { id: 'in-mum-1', name: 'Marine Drive View Hotel', location: 'Mumbai, Maharashtra', country: 'India', rating: 4.6, price: 110, originalPrice: 140, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop', amenities: ['Free WiFi', 'Restaurant', 'Gym'], description: 'Sea-facing rooms near Marine Drive', discount: 15 },
  { id: 'in-del-1', name: 'Connaught Central Hotel', location: 'New Delhi, Delhi', country: 'India', rating: 4.4, price: 85, image: 'https://images.unsplash.com/photo-1551776235-dde6d4829808?w=400&h=300&fit=crop', amenities: ['Free WiFi', 'Spa', 'Restaurant'], description: 'Close to Connaught Place and metro', discount: 10 },
  { id: 'in-blr-1', name: 'Tech Park Suites', location: 'Bengaluru, Karnataka', country: 'India', rating: 4.5, price: 95, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop', amenities: ['Free WiFi', 'Business Center', 'Gym'], description: 'Ideal for workcations in Whitefield/Outer Ring Road' },
  { id: 'in-goa-1', name: 'Calangute Beach Resort', location: 'Calangute, Goa', country: 'India', rating: 4.2, price: 70, image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop', amenities: ['Beach Access', 'Bar', 'Pool'], description: 'Steps from the beach with sunset views', discount: 12 },
  { id: 'in-udr-1', name: 'Lake Pichola Heritage Haveli', location: 'Udaipur, Rajasthan', country: 'India', rating: 4.7, price: 120, image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop', amenities: ['Historic Architecture', 'Restaurant', 'Concierge'], description: 'Heritage stay with lake views' },
  { id: 'in-jpr-1', name: 'Pink City Palace Hotel', location: 'Jaipur, Rajasthan', country: 'India', rating: 4.5, price: 90, image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=400&h=300&fit=crop', amenities: ['Free WiFi', 'Spa', 'Restaurant'], description: 'Traditional charm near Hawa Mahal' },
  { id: 'in-chn-1', name: 'Marina Business Hotel', location: 'Chennai, Tamil Nadu', country: 'India', rating: 4.3, price: 80, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop', amenities: ['Free WiFi', 'Gym', 'Restaurant'], description: 'Near Marina Beach and business hubs' },
  { id: 'in-hyd-1', name: 'Charminar View Suites', location: 'Hyderabad, Telangana', country: 'India', rating: 4.4, price: 88, image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop', amenities: ['Free WiFi', 'Restaurant'], description: 'Convenient base to explore the old city' },
  { id: 'in-pune-1', name: 'Koregaon Park Stays', location: 'Pune, Maharashtra', country: 'India', rating: 4.1, price: 72, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop', amenities: ['Free WiFi', 'Gym'], description: 'Boutique stay in KP with cafes nearby' },
  { id: 'in-ccu-1', name: 'Park Street Classic', location: 'Kolkata, West Bengal', country: 'India', rating: 4.2, price: 78, image: 'https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?w=400&h=300&fit=crop', amenities: ['Free WiFi', 'Restaurant'], description: 'Classic vibes near Park Street' },
  { id: 'in-ktm-1', name: 'Backwaters Bay Retreat', location: 'Kochi, Kerala', country: 'India', rating: 4.6, price: 105, image: 'https://images.unsplash.com/photo-1573281488044-5079e21084cc?w=400&h=300&fit=crop', amenities: ['Free WiFi', 'Restaurant', 'Spa'], description: 'Calm retreat near the backwaters' },
  { id: 'in-manali-1', name: 'Himalayan View Lodge', location: 'Manali, Himachal Pradesh', country: 'India', rating: 4.5, price: 98, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop', amenities: ['Mountain Views', 'Hiking Trails', 'Fireplace'], description: 'Cozy mountain lodge with great trails' },
  { id: 'in-shimla-1', name: 'Mall Road Heritage Hotel', location: 'Shimla, Himachal Pradesh', country: 'India', rating: 4.3, price: 89, image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop', amenities: ['Free WiFi', 'Restaurant'], description: 'Heritage property near Mall Road' }
];

export interface SearchParams {
  country?: string;
  q?: string; // city/state/landmark
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export async function searchHotels(params: SearchParams): Promise<Hotel[]> {
  const { country, q } = params;

  // Example provider keys (not present by default)
  const amadeusKey = import.meta.env.VITE_AMADEUS_API_KEY as string | undefined;
  const amadeusSecret = import.meta.env.VITE_AMADEUS_API_SECRET as string | undefined;
  const epsKey = import.meta.env.VITE_EPS_API_KEY as string | undefined;

  try {
    if (amadeusKey && amadeusSecret) {
      // Placeholder: Integrate Amadeus Hotel APIs here (requires server token exchange)
      // For now, throw to fall back gracefully.
      throw new Error('Amadeus integration not configured in frontend');
    }

    if (epsKey) {
      // Placeholder: Integrate EPS Rapid API (server-side recommended)
      throw new Error('EPS integration not configured in frontend');
    }

    // No provider configured: return filtered mock data (country + free text)
    const lowerCountry = (country || '').trim().toLowerCase();
    const lowerQ = (q || '').trim().toLowerCase();
    let items = MOCK_HOTELS;
    if (lowerCountry) items = items.filter(h => h.country.toLowerCase().includes(lowerCountry));
    if (lowerQ) items = items.filter(h => h.name.toLowerCase().includes(lowerQ) || h.location.toLowerCase().includes(lowerQ));
    return items;
  } catch (err) {
    console.error('Hotel search failed, using mock data:', err);
    const lowerCountry = (country || '').trim().toLowerCase();
    const lowerQ = (q || '').trim().toLowerCase();
    let items = MOCK_HOTELS;
    if (lowerCountry) items = items.filter(h => h.country.toLowerCase().includes(lowerCountry));
    if (lowerQ) items = items.filter(h => h.name.toLowerCase().includes(lowerQ) || h.location.toLowerCase().includes(lowerQ));
    return items;
  }
} 