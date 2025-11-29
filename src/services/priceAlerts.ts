import { auth } from '../firebase';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const db = getFirestore();

export interface PriceAlert {
  hotelId: number | string;
  threshold: number;
  currency?: string;
}

export async function createPriceAlert(alert: PriceAlert): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  await addDoc(collection(db, `users/${user.uid}/priceAlerts`), {
    ...alert,
    createdAt: Date.now(),
  });
}

export async function listPriceAlerts(hotelId?: number | string): Promise<PriceAlert[]> {
  const user = auth.currentUser;
  if (!user) return [];
  const col = collection(db, `users/${user.uid}/priceAlerts`);
  const q = hotelId ? query(col, where('hotelId', '==', hotelId)) : col;
  const snap = await getDocs(q as any);
  return snap.docs.map(d => d.data() as PriceAlert);
}







