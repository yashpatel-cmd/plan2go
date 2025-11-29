import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { loginActivityService } from "../services/loginActivity";
import { getDetailedLocationInfo } from "../services/geoLocation";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createUserProfile = async (user: any) => {
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName || "",
        phoneNumber: phoneNumber || "",
        photoURL: user.photoURL || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        provider: "password",
        emailVerified: user.emailVerified,
        lastLoginAt: serverTimestamp(),
      });
      console.log("User profile created successfully");
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  };

  const logRegistrationActivity = async (userId: string, userEmail: string, success: boolean, errorMessage?: string) => {
    try {
      const locationInfo = await getDetailedLocationInfo();
      const deviceInfo = loginActivityService.getDeviceInfo(navigator.userAgent);
      const sessionId = loginActivityService.generateSessionId();

      await loginActivityService.logLoginActivity({
        userId,
        email: userEmail,
        loginMethod: 'email',
        success,
        errorMessage: errorMessage || undefined,
        ipAddress: locationInfo.ip,
        userAgent: navigator.userAgent,
        sessionId,
        deviceInfo,
        location: {
          country: locationInfo.country,
          city: locationInfo.city,
          region: locationInfo.region,
          timezone: locationInfo.timezone,
          latitude: locationInfo.latitude,
          longitude: locationInfo.longitude,
          accuracy: locationInfo.accuracy
        }
      });
    } catch (logError) {
      console.error('Failed to log registration activity:', logError);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    if (!email) {
      setError("Please enter a valid email address!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with additional info using the imported updateProfile function
      if (displayName || phoneNumber) {
        await updateProfile(user, {
          displayName: displayName || user.displayName,
          phoneNumber: phoneNumber || user.phoneNumber,
        });
      }

      // Create user profile in Firestore
      await createUserProfile(user);

      // Log successful registration
      await logRegistrationActivity(user.uid, user.email || email, true);

      // Show success message
      setError("");
      
      // Redirect to profile page after successful registration
      navigate("/profile");
      
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message);
      
      // Log failed registration
      await logRegistrationActivity("", email, false, err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff] px-4">
        <div className="shadow-lg rounded-lg overflow-hidden max-w-md w-full bg-white p-8">
          <h1 className="text-3xl font-bold text-[#4086F4] text-center mb-2">
            CREATE ACCOUNT
          </h1>
          <p className="text-gray-600 text-center mb-6">Sign up with Email</p>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center border border-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Full Name (Optional)"
                className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Id"
                className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phone Number (Optional)"
                className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-3 pr-12 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 pr-12 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded font-semibold transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 font-semibold hover:underline">
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
