import React, { useEffect, useMemo, useState } from "react";
import { MapPin, Calendar, Users, Plus, Filter, MessageSquare, Trash2, Edit2, Star } from "lucide-react";
import { answerQuery } from '../services/ai';

interface CompanionPost {
  id: string;
  author: string;
  destination: string;
  country: string;
  startDate: string; // yyyy-mm-dd
  endDate: string;   // yyyy-mm-dd
  peopleNeeded: number;
  budget: string; // text e.g. "$500-800"
  interests: string[];
  notes: string;
  contact: string; // email/phone/handle
  createdAt: number;
}

const DEFAULT_POSTS: CompanionPost[] = [
  {
    id: "p1",
    author: "Ava",
    destination: "Goa",
    country: "India",
    startDate: "2025-09-18",
    endDate: "2025-09-22",
    peopleNeeded: 2,
    budget: "$300-500",
    interests: ["Beaches", "Food", "Nightlife"],
    notes: "Looking for easygoing folks to explore beaches and cafes.",
    contact: "ava@example.com",
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "p2",
    author: "Leo",
    destination: "Tokyo",
    country: "Japan",
    startDate: "2025-10-05",
    endDate: "2025-10-12",
    peopleNeeded: 1,
    budget: "$1000+",
    interests: ["Anime", "Tech", "Food"],
    notes: "First time in Japan. Open to sharing itinerary.",
    contact: "@leotravels",
    createdAt: Date.now() - 86400000 * 5,
  },
];

const Companion: React.FC = () => {
  const [tab, setTab] = useState<"browse" | "post" | "mine" | "profile" | "friends">("browse");
  const [posts, setPosts] = useState<CompanionPost[]>([]);

  // Filters
  const [country, setCountry] = useState("");
  const [date, setDate] = useState("");
  const [interestFilter, setInterestFilter] = useState("");

  // Post form
  const [destination, setDestination] = useState("");
  const [countryInput, setCountryInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [peopleNeeded, setPeopleNeeded] = useState(1);
  const [budget, setBudget] = useState("");
  const [interests, setInterests] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [contact, setContact] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Profile and friends (localStorage-backed)
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileLocation, setProfileLocation] = useState("");
  const [friends, setFriends] = useState<string[]>([]);
  const [friendInput, setFriendInput] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string>("");

  // Chat state
  type ChatMessage = { id: string; from: string; text: string; time: number };
  const [selectedFriend, setSelectedFriend] = useState<string>("");
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({});
  const [chatInput, setChatInput] = useState("");

  // Load from localStorage once
  useEffect(() => {
    const raw = localStorage.getItem("plan2go_companion_posts");
    if (raw) {
      setPosts(JSON.parse(raw));
    } else {
      setPosts(DEFAULT_POSTS);
    }
    const prof = localStorage.getItem("plan2go_profile");
    if (prof) {
      try {
        const p = JSON.parse(prof);
        setProfileName(p.name || "");
        setProfileBio(p.bio || "");
        setProfileLocation(p.location || "");
        setContact(p.contact || "");
        setProfilePhoto(p.photo || "");
      } catch {}
    }
    const fr = localStorage.getItem("plan2go_friends");
    if (fr) setFriends(JSON.parse(fr));
    const ch = localStorage.getItem("plan2go_chats");
    if (ch) setChats(JSON.parse(ch));
  }, []);

  useEffect(() => {
    localStorage.setItem("plan2go_companion_posts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("plan2go_profile", JSON.stringify({ name: profileName, bio: profileBio, location: profileLocation, contact, photo: profilePhoto }));
  }, [profileName, profileBio, profileLocation, contact, profilePhoto]);

  useEffect(() => {
    localStorage.setItem("plan2go_friends", JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem("plan2go_chats", JSON.stringify(chats));
  }, [chats]);

  const filtered = useMemo(() => {
    let items = [...posts];
    const n = (s: string) => s.toLowerCase();
    if (country) items = items.filter(p => n(p.country).includes(n(country)) || n(p.destination).includes(n(country)));
    if (date) items = items.filter(p => p.startDate <= date && p.endDate >= date);
    if (interestFilter) items = items.filter(p => p.interests.some(i => n(i).includes(n(interestFilter))));
    // newest first
    items.sort((a, b) => b.createdAt - a.createdAt);
    return items;
  }, [posts, country, date, interestFilter]);

  const myPosts = useMemo(() => {
    // naive: treat contact as key to identify "me"
    return posts.filter(p => p.contact && contact && p.contact === contact);
  }, [posts, contact]);

  const resetForm = () => {
    setDestination("");
    setCountryInput("");
    setStartDate("");
    setEndDate("");
    setPeopleNeeded(1);
    setBudget("");
    setInterests("");
    setNotes("");
    // keep contact to show "my posts"
  };

  const savePost = () => {
    if (!destination || !countryInput || !startDate || !endDate || !contact) return;
    const payload: CompanionPost = {
      id: editingId || Math.random().toString(36).slice(2),
      author: contact.split("@")[0] || "You",
      destination,
      country: countryInput,
      startDate,
      endDate,
      peopleNeeded,
      budget,
      interests: interests.split(",").map(s => s.trim()).filter(Boolean),
      notes,
      contact,
      createdAt: editingId ? posts.find(p => p.id === editingId)?.createdAt || Date.now() : Date.now(),
    };

    if (editingId) {
      setPosts(prev => prev.map(p => (p.id === editingId ? payload : p)));
      setEditingId(null);
    } else {
      setPosts(prev => [payload, ...prev]);
    }
    resetForm();
    setTab("mine");
  };

  const editPost = (post: CompanionPost) => {
    setEditingId(post.id);
    setDestination(post.destination);
    setCountryInput(post.country);
    setStartDate(post.startDate);
    setEndDate(post.endDate);
    setPeopleNeeded(post.peopleNeeded);
    setBudget(post.budget);
    setInterests(post.interests.join(", "));
    setNotes(post.notes);
    setContact(post.contact);
    setTab("post");
  };

  const removePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#EAF6FF]">
      <head>
        <title>Travel Companion – Find People to Travel With | PLAN2GO</title>
        <meta name="description" content="Find or post travel companion plans. Chat, manage friends, and coordinate trips on PLAN2GO." />
        <link rel="canonical" href="https://plan2go.com/companion" />
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Travel Companion', url: 'https://plan2go.com/companion' })}</script>
      </head>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-white rounded-2xl border shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-bold">Travel Companion</h1>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button onClick={() => setTab("browse")} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm ${tab==='browse'?'bg-black text-white':'bg-white'}`}>Browse</button>
              <button onClick={() => setTab("post")} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm ${tab==='post'?'bg-black text-white':'bg-white'}`}>Post a Trip</button>
              <button onClick={() => setTab("mine")} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm ${tab==='mine'?'bg-black text-white':'bg-white'}`}>My Posts</button>
              <button onClick={() => setTab("profile")} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm ${tab==='profile'?'bg-black text-white':'bg-white'}`}>My Profile</button>
              <button onClick={() => setTab("friends")} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm ${tab==='friends'?'bg-black text-white':'bg-white'}`}>Friends</button>
            </div>
          </div>
        </div>

        {tab === 'browse' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl border shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-xs sm:text-sm font-medium mb-1">Country / Destination</label>
                  <input value={country} onChange={(e)=>setCountry(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base" placeholder="e.g., India or Goa" />
                </div>
                <div className="w-full sm:w-auto">
                  <label className="block text-xs sm:text-sm font-medium mb-1">Date</label>
                  <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full sm:w-auto border rounded-lg px-3 py-2 text-sm sm:text-base" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs sm:text-sm font-medium mb-1">Interest</label>
                  <input value={interestFilter} onChange={(e)=>setInterestFilter(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base" placeholder="e.g., Beaches" />
                </div>
              </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{p.destination}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{p.country}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs bg-black text-white px-2 py-1 rounded-full">
                        <Users className="h-3.5 w-3.5 mr-1" /> Need {p.peopleNeeded}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3 text-sm text-gray-700">
                      <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {p.startDate} → {p.endDate}</div>
                      <div className="hidden md:block">•</div>
                      <div>{p.budget}</div>
                      <div className="hidden md:block">•</div>
                      <div>People needed: {p.peopleNeeded}</div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.interests.map(i => (
                        <span key={i} className="text-xs bg-[#EAF6FF] text-gray-700 px-2 py-1 rounded-full">{i}</span>
                      ))}
                    </div>

                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">{p.notes}</p>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-600">Contact: {p.contact}</span>
                      <button className="bg-black text-white rounded-full px-3 py-1.5 text-sm flex items-center"><MessageSquare className="h-4 w-4 mr-1" /> Message</button>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center text-gray-600">No posts match your filters yet.</div>
              )}
            </div>
          </div>
        )}

        {tab === 'post' && (
          <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Destination</label>
                <input value={destination} onChange={(e)=>setDestination(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="e.g., Goa" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input value={countryInput} onChange={(e)=>setCountryInput(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="e.g., India" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">People Needed</label>
                <select value={peopleNeeded} onChange={(e)=>setPeopleNeeded(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Budget</label>
                <input value={budget} onChange={(e)=>setBudget(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="$500-800" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Interests (comma separated)</label>
                <input value={interests} onChange={(e)=>setInterests(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Beaches, Food, Hiking" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} className="w-full border rounded-lg px-3 py-2" rows={3} placeholder="Tell others about your plan" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Contact (email/handle)</label>
                <input value={contact} onChange={(e)=>setContact(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="you@example.com or @you" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={savePost} className="bg-black text-white rounded-full px-5 py-2 flex items-center"><Plus className="h-4 w-4 mr-2" /> {editingId? 'Update Post':'Publish Post'}</button>
              {editingId && <button onClick={()=>{ setEditingId(null); resetForm(); }} className="px-4 py-2 rounded-full border">Cancel</button>}
            </div>
          </div>
        )}

        {tab === 'mine' && (
          <div className="space-y-4">
            {myPosts.length === 0 && (
              <div className="bg-white rounded-2xl border shadow-sm p-6 text-gray-600">No posts yet. Create one in "Post a Trip".</div>
            )}
            {myPosts.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{p.destination} • {p.country}</h3>
                    <div className="text-sm text-gray-600">{p.startDate} → {p.endDate} • {p.budget} • Need {p.peopleNeeded}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>editPost(p)} className="px-3 py-1.5 rounded-full border flex items-center"><Edit2 className="h-4 w-4 mr-1" /> Edit</button>
                    <button onClick={()=>removePost(p.id)} className="px-3 py-1.5 rounded-full border text-red-600 border-red-300 flex items-center"><Trash2 className="h-4 w-4 mr-1" /> Delete</button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2">{p.notes}</p>
                <div className="text-sm text-gray-600 mt-2">Contact: {p.contact}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border shadow-sm p-4 lg:col-span-2">
              <h2 className="text-lg font-semibold mb-3">Your Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <img src={profilePhoto || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(profileName || 'Traveler')} alt="avatar" className="h-16 w-16 rounded-full object-cover border" />
                    <input type="file" accept="image/*" onChange={(e)=>{
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => setProfilePhoto(String(reader.result));
                      reader.readAsDataURL(file);
                    }} />
                    {profilePhoto && (
                      <button onClick={()=>setProfilePhoto("")} className="px-3 py-2 rounded-full border text-sm">Remove</button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input value={profileName} onChange={(e)=>setProfileName(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input value={profileLocation} onChange={(e)=>setProfileLocation(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="City, Country" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Contact (email/handle)</label>
                  <input value={contact} onChange={(e)=>setContact(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="you@example.com or @you" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea value={profileBio} onChange={(e)=>setProfileBio(e.target.value)} className="w-full border rounded-lg px-3 py-2" rows={3} placeholder="Tell others about you" />
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-3">Profile saves automatically.</div>
            </div>
            <div className="bg-white rounded-2xl border shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-3">Public Preview</h2>
              <div className="rounded-xl border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={profilePhoto || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(profileName || 'Traveler')} alt="avatar" className="h-10 w-10 rounded-full object-cover border" />
                    <div>
                      <div className="font-semibold">{profileName || 'Traveler'}</div>
                      <div className="text-sm text-gray-600">{profileLocation || 'Your location'}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs bg-black text-white px-2 py-1 rounded-full"><span className="mr-1">★</span> Verified</div>
                </div>
                <p className="text-sm text-gray-700 mt-3">{profileBio || 'Write a short bio to help companions know you better.'}</p>
                <div className="text-sm text-gray-600 mt-3">Contact: {contact || 'Add your contact'}</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'friends' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border shadow-sm p-4 lg:col-span-2">
              <h2 className="text-lg font-semibold mb-3">Your Friends</h2>
              <div className="flex gap-2 mb-4">
                <input value={friendInput} onChange={(e)=>setFriendInput(e.target.value)} className="flex-1 border rounded-lg px-3 py-2" placeholder="Enter friend's handle or email" />
                <button onClick={()=>{ if(friendInput.trim()){ setFriends(prev=> Array.from(new Set([friendInput.trim(), ...prev]))); setFriendInput(''); } }} className="bg-black text-white rounded-full px-4 py-2">Add</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <div className="text-sm font-medium mb-2">Friends</div>
                  <div className="space-y-2">
                    {friends.length === 0 && <div className="text-gray-600">No friends yet.</div>}
                    {friends.map(f => (
                      <button key={f} onClick={()=>setSelectedFriend(f)} className={`w-full text-left px-3 py-2 rounded-lg border ${selectedFriend===f?'bg-black text-white':'bg-white'}`}>{f}</button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm font-medium mb-2">Chat</div>
                  {!selectedFriend && <div className="text-gray-600">Select a friend to start chatting.</div>}
                  {selectedFriend && (
                    <div className="rounded-xl border h-80 flex flex-col">
                      <div className="flex-1 overflow-auto p-3 space-y-2">
                        {(chats[selectedFriend] || []).map(m => (
                          <div key={m.id} className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${m.from==='me'?'bg-black text-white ml-auto':'bg-[#EAF6FF] text-gray-800'}`}>
                            <div>{m.text}</div>
                            <div className="text-[10px] opacity-70 mt-1">{new Date(m.time).toLocaleTimeString()}</div>
                          </div>
                        ))}
                      </div>
                      <div className="p-2 border-t flex gap-2">
                        <input value={chatInput} onChange={(e)=>setChatInput(e.target.value)} className="flex-1 border rounded-lg px-3 py-2" placeholder={`Message ${selectedFriend}`} />
                        <button onClick={async () =>{
                          if (!chatInput.trim()) return;
                          const msg: ChatMessage = { id: Math.random().toString(36).slice(2), from: 'me', text: chatInput.trim(), time: Date.now() };
                          setChats(prev => ({ ...prev, [selectedFriend]: [ ...(prev[selectedFriend]||[]), msg ] }));
                          setChatInput('');
                          const ai = await answerQuery(msg.text);
                          const reply: ChatMessage = { id: Math.random().toString(36).slice(2), from: selectedFriend, text: ai, time: Date.now() };
                          setChats(prev => ({ ...prev, [selectedFriend]: [ ...(prev[selectedFriend]||[]), reply ] }));
                        }} className="bg-black text-white rounded-full px-4">Send</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-3">Suggestions</h2>
              <div className="space-y-2 text-sm text-gray-700">
                <button onClick={()=>setFriendInput('@plan2go_ally')} className="underline">@plan2go_ally</button>
                <div>• Goa • Beaches</div>
                <button onClick={()=>setFriendInput('@hikewith_ari')} className="underline">@hikewith_ari</button>
                <div>• Himachal • Hiking</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companion; 