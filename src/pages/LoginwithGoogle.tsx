import React from "react";
import { auth, googleProvider, db } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { loginActivityService } from "../services/loginActivity";
import { getLocationInfo } from "../services/geoLocation";
import GoogleLogo from "../assets/google-logo.png";

const LoginWithGoogle = () => {
  const navigate = useNavigate();

  const ensureUserProfile = async (user: any) => {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        provider: user.providerData?.[0]?.providerId || "google.com",
      });
    } else {
      // Optionally update last login/update timestamp
      await setDoc(userRef, { updatedAt: serverTimestamp() }, { merge: true });
    }
  };

  const logLoginActivity = async (userId: string, userEmail: string, success: boolean, errorMessage?: string) => {
    try {
      const locationInfo = await getLocationInfo();
      const deviceInfo = loginActivityService.getDeviceInfo(navigator.userAgent);
      const sessionId = loginActivityService.generateSessionId();

      await loginActivityService.logLoginActivity({
        userId,
        email: userEmail,
        loginMethod: 'google',
        success,
        errorMessage,
        ipAddress: locationInfo.ip,
        userAgent: navigator.userAgent,
        sessionId,
        deviceInfo,
        location: {
          country: locationInfo.country,
          city: locationInfo.city,
          region: locationInfo.region
        }
      });
    } catch (logError) {
      console.error('Failed to log login activity:', logError);
      // Don't throw error here as it shouldn't break the login flow
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await ensureUserProfile(cred.user);
      
      // Log successful Google login
      await logLoginActivity(cred.user.uid, cred.user.email || '', true);
      
      console.log("Google login successful");
      navigate("/"); // Redirect to home page after login
    } catch (error: any) {
      console.error("Error logging in with Google:", error.message);
      
      // Log failed Google login attempt
      await logLoginActivity('', '', false, error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff] px-4">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-[#4086F4] mb-6">Login with Google</h2>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center border border-gray-300 py-3 rounded hover:bg-gray-50"
        >
          <img src={GoogleLogo} alt="Google" className="w-6 h-6 mr-2" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginWithGoogle;
