import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import Navbar from "../components/Navbar";
import GoogleLogo from "../assets/google-logo.png"; // Ensure this file exists

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Google login successful");
    } catch (err: any) {
      setError(err.message);
    }
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

            <input
              type="email"
              placeholder="Email Id"
              className="w-full px-4 py-3 rounded border border-gray-300 mb-3 focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded border border-gray-300 mb-3 focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Forgot Password Link */}
            <div className="text-right mb-4">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Login & Cancel Buttons */}
            <div className="flex space-x-3 mb-4">
              <button
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded hover:bg-gray-300"
                onClick={() => {
                  setEmail("");
                  setPassword("");
                  setError("");
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-black text-white py-3 rounded hover:bg-gray-800"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>

            {/* OR Divider */}
            <div className="relative flex items-center mb-4">
              <div className="w-full border-t border-gray-300"></div>
              <span className="px-2 bg-white text-gray-500">OR</span>
              <div className="w-full border-t border-gray-300"></div>
            </div>

            {/* Google Sign-In Button */}
            <button
              className="w-full flex items-center justify-center border border-gray-300 py-3 rounded hover:bg-gray-50"
              onClick={handleGoogleLogin}
            >
              <img
                src={GoogleLogo}
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              <span className="text-gray-700">Sign in with Google</span>
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
