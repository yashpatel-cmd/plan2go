import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import LoginWithGoogle from "./pages/LoginwithGoogle";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f0f9ff] flex flex-col">
        {/* Navbar is included only once */}
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/login-google" element={<LoginWithGoogle />} />
          </Routes>
        </main>

        {/* Footer included only once */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
