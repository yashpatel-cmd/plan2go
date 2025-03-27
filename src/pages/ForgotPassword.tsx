import React, { useState } from "react";
import { auth } from "../firebase"; // Ensure firebase is properly configured
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (err: any) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff] px-4">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#4086F4] mb-4">
          Reset Password
        </h2>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 rounded border border-gray-300 mb-3 focus:outline-none focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="w-full bg-[#4086F4] text-white py-3 rounded hover:bg-blue-600"
          onClick={handleResetPassword}
        >
          Send Reset Link
        </button>
        <p className="text-center text-gray-600 mt-4">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-500 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
