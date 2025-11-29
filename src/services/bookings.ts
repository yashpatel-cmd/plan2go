import { auth } from '../firebase';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const db = getFirestore();

export interface BookingRecord {
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  totalPrice: number;
  confirmationNumber: string;
}

export async function saveBooking(record: BookingRecord): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  await addDoc(collection(db, `users/${user.uid}/bookings`), {
    ...record,
    createdAt: Date.now(),
  });
}

export async function listBookings(): Promise<Array<BookingRecord & { id: string }>> {
  const user = auth.currentUser;
  if (!user) return [];
  const snap = await getDocs(collection(db, `users/${user.uid}/bookings`));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as BookingRecord) }));
}







