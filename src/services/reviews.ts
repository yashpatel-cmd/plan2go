export interface ReviewInput {
  hotelId: number | string;
  rating: number;
  comment: string;
}

// Placeholder — later swap to Firestore-backed reviews
export async function submitReview(_input: ReviewInput): Promise<void> {
  return;
}







