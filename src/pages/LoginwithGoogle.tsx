import React from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import GoogleLogo from "../assets/google-logo.png"; // Ensure you have this image

const LoginWithGoogle = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Google login successful");
      navigate("/"); // Redirect to home page after login
    } catch (error: any) {
      console.error("Error logging in with Google:", error.message);
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
