import React, { useEffect, useState } from 'react';
import { addItineraryItem, getItinerary, ItineraryItem, updateItineraryItem, deleteItineraryItem } from '../services/itinerary';
import { suggestItinerary } from '../services/ai';

const Itinerary: React.FC = () => {
  const [items, setItems] = useState<Array<ItineraryItem & { id?: string }>>([]);
  const [day, setDay] = useState(1);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [suggestDest, setSuggestDest] = useState('');
  const [suggestDays, setSuggestDays] = useState(3);

  useEffect(() => {
    (async () => {
      const data = await getItinerary();
      setItems(data);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      <head>
        <title>Trip Itinerary Planner – PLAN2GO</title>
        <meta name="description" content="Create and manage your travel itinerary. Add, edit, delete items or import AI-suggested plans by destination." />
        <link rel="canonical" href="https://plan2go.com/itinerary" />
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Itinerary Planner', url: 'https://plan2go.com/itinerary' })}</script>
      </head>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Itinerary</h1>
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input value={suggestDest} onChange={(e)=>setSuggestDest(e.target.value)} className="border rounded px-3 py-2 sm:col-span-2" placeholder="Suggest for destination (e.g., Goa, Jaipur)" />
            <input type="number" min={1} max={7} value={suggestDays} onChange={(e)=>setSuggestDays(Number(e.target.value))} className="border rounded px-3 py-2" placeholder="Days" />
            <button onClick={async ()=>{ const recs = await suggestItinerary(suggestDest, suggestDays); for (const r of recs){ await addItineraryItem({ day: r.day, title: r.title, time: r.time, notes: r.notes }); } const data = await getItinerary(); setItems(data); }} className="bg-gray-800 text-white rounded px-3 py-2">Add suggested</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input type="number" min={1} value={day} onChange={(e) => setDay(Number(e.target.value))} className="border rounded px-3 py-2" placeholder="Day" />
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="border rounded px-3 py-2 sm:col-span-2" placeholder="Title" />
            <input value={time} onChange={(e) => setTime(e.target.value)} className="border rounded px-3 py-2" placeholder="Time" />
          </div>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="border rounded px-3 py-2 w-full mt-3" placeholder="Notes" />
          <div className="mt-3 flex gap-2">
            <button
              onClick={async () => {
                if (!title) return;
                if (editingId) {
                  await updateItineraryItem(editingId, { day, title, time, notes });
                  setEditingId(null);
                } else {
                  await addItineraryItem({ day, title, time, notes });
                }
                const data = await getItinerary();
                setItems(data);
                setTitle(''); setTime(''); setNotes('');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {editingId ? 'Update' : 'Add'} item
            </button>
            {editingId && (
              <button onClick={()=>{ setEditingId(null); setTitle(''); setTime(''); setNotes(''); }} className="border px-4 py-2 rounded">Cancel</button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {items.sort((a, b) => a.day - b.day).map((it) => (
            <div key={(it as any).id || `${it.day}-${it.title}`} className="border-b p-4">
              <div className="text-sm text-gray-500">Day {it.day}{it.time ? ` • ${it.time}` : ''}</div>
              <div className="font-semibold">{it.title}</div>
              {it.notes && <div className="text-gray-700 text-sm">{it.notes}</div>}
              <div className="mt-2 flex gap-2">
                {(it as any).id && (
                  <>
                    <button onClick={()=>{ setEditingId((it as any).id as string); setDay(it.day); setTitle(it.title); setTime(it.time||''); setNotes(it.notes||''); }} className="text-blue-600 text-sm">Edit</button>
                    <button onClick={async ()=>{ await deleteItineraryItem((it as any).id as string); const data = await getItinerary(); setItems(data); }} className="text-red-600 text-sm">Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="p-6 text-center text-gray-600">No items yet</div>}
        </div>
      </div>
    </div>
  );
};

export default Itinerary;


