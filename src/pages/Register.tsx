import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Ensure Firebase is set up correctly
import Navbar from "../components/Navbar";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered successfully");
    } catch (err: any) {
      setError(err.message);
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
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center">
              Firebase: {error}
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

          <button
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
            onClick={handleRegister}
          >
            Register
          </button>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 font-semibold">
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
