import { auth } from '../firebase';
import { getFirestore, doc, collection, setDoc, deleteDoc, getDocs } from 'firebase/firestore';

const db = getFirestore();

export interface WishlistItem {
  hotelId: number | string;
  name: string;
  image: string;
  price: number;
  location?: string;
}

export async function addToWishlist(item: WishlistItem): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  const ref = doc(collection(db, `users/${user.uid}/wishlist`));
  await setDoc(ref, { ...item, createdAt: Date.now() });
}

export async function removeFromWishlist(docId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  const ref = doc(db, `users/${user.uid}/wishlist/${docId}`);
  await deleteDoc(ref);
}

export async function listWishlist(): Promise<Array<WishlistItem & { id: string }>> {
  const user = auth.currentUser;
  if (!user) return [];
  const snap = await getDocs(collection(db, `users/${user.uid}/wishlist`));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as WishlistItem) }));
}







