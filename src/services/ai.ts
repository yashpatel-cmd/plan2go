// Minimal AI service stubs. Replace with real API calls later.

export type Vibe = 'romantic' | 'workcation' | 'family' | 'budget' | 'luxury' | 'photogenic' | 'foodie';

export interface HotelLite {
  id: number | string;
  name: string;
  rating: number;
  price: number;
  amenities?: string[];
  description?: string;
}

export async function rankHotelsByVibe(hotels: HotelLite[], vibe: Vibe): Promise<HotelLite[]> {
  // Simple heuristic placeholder
  const score = (h: HotelLite): number => {
    const a = (h.amenities || []).map(x => x.toLowerCase());
    switch (vibe) {
      case 'romantic':
        return (h.rating || 0) * 2 + (a.includes('spa') ? 2 : 0) + (a.includes('view') ? 1 : 0);
      case 'workcation':
        return (a.includes('wifi') ? 3 : 0) + (a.includes('business center') ? 2 : 0) + (h.rating || 0);
      case 'family':
        return (a.includes('pool') ? 2 : 0) + (a.includes('restaurant') ? 1 : 0) + (h.rating || 0);
      case 'budget':
        return 1000 / Math.max(1, h.price);
      case 'luxury':
        return (h.rating || 0) * 3 + (h.price || 0) / 50;
      case 'photogenic':
        return (h.rating || 0) * 2 + (a.includes('view') ? 2 : 0) + (a.includes('garden') ? 1 : 0);
      case 'foodie':
        return (a.includes('restaurant') ? 3 : 0) + (a.includes('bar') ? 1 : 0) + (h.rating || 0);
      default:
        return h.rating || 0;
    }
  };
  return [...hotels].sort((a, b) => score(b) - score(a));
}

export async function answerQuery(prompt: string): Promise<string> {
  // Placeholder AI response
  if (!prompt.trim()) return 'Tell me what you are looking for (dates, vibe, budget).';
  if (/budget|cheap|low/i.test(prompt)) return 'Try sorting by Price Low and set price alerts for drops.';
  if (/romantic|honeymoon/i.test(prompt)) return 'Consider higher-rated properties with spa and great views.';
  if (/work|wifi|business/i.test(prompt)) return 'Look for Free WiFi, Business Center, and quiet locations.';
  return 'I suggest filtering by 2–3 priorities, then compare your top picks.';
}

export async function suggestItinerary(destination: string, days: number = 3): Promise<Array<{ day: number; title: string; time?: string; notes?: string }>> {
  const d = (destination || '').toLowerCase();
  const plans: Record<string, Array<{ title: string; time?: string; notes?: string }>> = {
    'goa': [
      { title: 'Beach day at Calangute/Baga', time: '10:00', notes: 'Sunset at Fort Aguada' },
      { title: 'Old Goa churches + Panaji', time: '11:00', notes: 'River cruise in the evening' },
      { title: 'South Goa beaches', time: '10:00', notes: 'Colva/Palolem' },
    ],
    'jaipur': [
      { title: 'Amber Fort + Panna Meena ka Kund', time: '09:00', notes: 'Evening at Jal Mahal' },
      { title: 'City Palace + Jantar Mantar + Hawa Mahal', time: '10:00', notes: 'Shop at Bapu Bazaar' },
      { title: 'Nahargarh Fort + Stepwell', time: '15:00', notes: 'Sunset view of Pink City' },
    ],
    'mumbai': [
      { title: 'Gateway of India + Colaba', time: '10:00', notes: 'Marine Drive sunset' },
      { title: 'Elephanta Caves or Bandra heritage walk', time: '11:00', notes: 'Bandra bandstand in evening' },
      { title: 'Food trail at Mohammed Ali Road/Matunga', time: '19:00', notes: 'Local trains experience' },
    ],
    'udaipur': [
      { title: 'City Palace + Boat ride on Pichola', time: '16:00', notes: 'Bagore ki Haveli show' },
      { title: 'Sajjangarh Monsoon Palace + Fateh Sagar', time: '17:00', notes: 'Ambae Viewpoint' },
      { title: 'Old City lanes + local crafts', time: '11:00', notes: 'Rooftop dinner by the lake' },
    ],
  };
  const key = Object.keys(plans).find(k => d.includes(k));
  const chosen = key ? plans[key] : [
    { title: 'Old town walking tour', time: '10:00', notes: 'Local food tasting' },
    { title: 'Top museum/landmark', time: '11:00', notes: 'Sunset viewpoint' },
    { title: 'Parks/Markets/Waterfront', time: '10:00', notes: 'Souvenir shopping' },
  ];
  const out: Array<{ day: number; title: string; time?: string; notes?: string }> = [];
  for (let i = 0; i < Math.min(days, chosen.length); i++) {
    out.push({ day: i + 1, ...chosen[i] });
  }
  return out;
}


