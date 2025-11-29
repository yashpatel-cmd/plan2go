import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcez5_N7G4t6hejfa08EXCk2BD0ZZa0dQ",
  authDomain: "plan2go-c1e9e.firebaseapp.com",
  projectId: "plan2go-c1e9e",
  storageBucket: "plan2go-c1e9e.appspot.com",
  messagingSenderId: "110185506525",
  appId: "1:110185506525:web:cb82a3f4f37cbf9fff5d34",
  measurementId: "G-58DVTZ3ZL5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
