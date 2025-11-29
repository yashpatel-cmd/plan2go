import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase";
import { loginActivityService } from "../services/loginActivity";
import { getDetailedLocationInfo } from "../services/geoLocation";
import GoogleLogo from "../assets/google-logo.png"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clear fields on component mount
  useEffect(() => {
    setEmail("");
    setPassword("");
    setError("");
  }, []);

  const ensureUserProfile = async (user: any) => {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        provider: user.providerData?.[0]?.providerId || "password",
        emailVerified: user.emailVerified,
        lastLoginAt: serverTimestamp(),
      });
    } else {
      // Update last login timestamp
      await setDoc(userRef, { 
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
  };

  const logLoginActivity = async (userId: string, userEmail: string, method: 'email' | 'google', success: boolean, errorMessage?: string) => {
    try {
      const locationInfo = await getDetailedLocationInfo();
      const deviceInfo = loginActivityService.getDeviceInfo(navigator.userAgent);
      const sessionId = loginActivityService.generateSessionId();

      await loginActivityService.logLoginActivity({
        userId,
        email: userEmail,
        loginMethod: method,
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
      console.error('Failed to log login activity:', logError);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await ensureUserProfile(cred.user);
      
      // Log successful login
      await logLoginActivity(cred.user.uid, cred.user.email || email, 'email', true);
      
      console.log("User logged in and profile ensured");
      
      // Redirect to profile page
      navigate("/profile");
      
    } catch (err: any) {
      setError(err.message);
      
      // Log failed login attempt
      await logLoginActivity('', email, 'email', false, err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await ensureUserProfile(cred.user);
      
      // Log successful Google login
      await logLoginActivity(cred.user.uid, cred.user.email || '', 'google', true);
      
      console.log("Google login successful and profile ensured");
      
      // Redirect to profile page
      navigate("/profile");
      
    } catch (err: any) {
      setError(err.message);
      
      // Log failed Google login attempt
      await logLoginActivity('', '', 'google', false, err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff] px-4">
        <div className="flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden max-w-3xl w-full bg-white">
          {/* Left Side - Image (Hidden on Small Screens) */}
          <div className="md:w-1/2 hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1464278533981-50106e6176b1"
              alt="Scenic Mountain"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-[#4086F4] text-center mb-2">
              WELCOME
            </h1>
            <p className="text-gray-600 text-center mb-6">Login with Email</p>

            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center border border-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Id"
                  className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="new-email"
                  autoFocus
                />
                {email && (
                  <button
                    type="button"
                    onClick={() => setEmail("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-12 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded font-semibold transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Clear Fields Button */}
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={clearFields}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear Fields
              </button>
            </div>

            {/* OR Divider */}
            <div className="relative flex items-center my-4">
              <div className="w-full border-t border-gray-300"></div>
              <span className="px-2 bg-white text-gray-500">OR</span>
              <div className="w-full border-t border-gray-300"></div>
            </div>

            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className={`w-full flex items-center justify-center border border-gray-300 py-3 rounded hover:bg-gray-50 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <img
                src={GoogleLogo}
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              <span className="text-gray-700">
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </span>
            </button>

            {/* Register Link */}
            <p className="text-center text-gray-600 mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 font-semibold hover:underline">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
