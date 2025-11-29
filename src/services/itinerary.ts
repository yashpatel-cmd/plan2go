import { auth } from '../firebase';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const db = getFirestore();

export interface ItineraryItem {
  day: number;
  title: string;
  time?: string;
  notes?: string;
}

export async function addItineraryItem(item: ItineraryItem): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    try {
      const raw = localStorage.getItem('plan2go_itinerary_guest');
      const list: (ItineraryItem & { id: string })[] = raw ? JSON.parse(raw) : [];
      list.push({ ...item, id: Math.random().toString(36).slice(2) });
      localStorage.setItem('plan2go_itinerary_guest', JSON.stringify(list));
    } catch {}
    return;
  }
  await addDoc(collection(db, `users/${user.uid}/itinerary`), { ...item, createdAt: Date.now() });
}

export async function getItinerary(): Promise<Array<ItineraryItem & { id: string }>> {
  const user = auth.currentUser;
  if (!user) {
    try {
      const raw = localStorage.getItem('plan2go_itinerary_guest');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  const snap = await getDocs(collection(db, `users/${user.uid}/itinerary`));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as ItineraryItem) }));
}

export async function updateItineraryItem(id: string, updates: Partial<ItineraryItem>): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    try {
      const raw = localStorage.getItem('plan2go_itinerary_guest');
      const list: (ItineraryItem & { id: string })[] = raw ? JSON.parse(raw) : [];
      const next = list.map(it => it.id === id ? { ...it, ...updates } : it);
      localStorage.setItem('plan2go_itinerary_guest', JSON.stringify(next));
    } catch {}
    return;
  }
  const ref = doc(db, `users/${user.uid}/itinerary/${id}`);
  await updateDoc(ref, { ...updates });
}

export async function deleteItineraryItem(id: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    try {
      const raw = localStorage.getItem('plan2go_itinerary_guest');
      const list: (ItineraryItem & { id: string })[] = raw ? JSON.parse(raw) : [];
      const next = list.filter(it => it.id !== id);
      localStorage.setItem('plan2go_itinerary_guest', JSON.stringify(next));
    } catch {}
    return;
  }
  const ref = doc(db, `users/${user.uid}/itinerary/${id}`);
  await deleteDoc(ref);
}


