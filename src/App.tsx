// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";
// import LoginWithGoogle from "./pages/LoginwithGoogle";
// import About from "./pages/About";
// import HotelBooking from "./pages/Hotelbooking";
// import Companion from "./pages/Companion";
// import Admin from "./pages/Admin";
// import Profile from "./pages/Profile";
// import Itinerary from "./pages/Itinerary";
// import Checkout from "./pages/Checkout";  // <-- IMPORTANT: Add this

// // Simple Destination page
// const Destination: React.FC = () => (
//   <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
//     <div className="text-center">
//       <h1 className="text-4xl font-bold text-blue-600 mb-4">Destination Page</h1>
//       <p className="text-xl text-gray-700">Coming Soon!</p>
//     </div>
//   </div>
// );

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-[#f0f9ff] flex flex-col pt-14 sm:pt-16">
//         <Navbar />
//         <main className="flex-grow">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/login-google" element={<LoginWithGoogle />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/destination" element={<Destination />} />
//             <Route path="/agoda" element={<HotelBooking />} />
//             <Route path="/checkout" element={<Checkout />} /> {/* <-- Added */}
//             <Route path="/companion" element={<Companion />} />
//             <Route path="/admin" element={<Admin />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/itinerary" element={<Itinerary />} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import LoginWithGoogle from "./pages/LoginwithGoogle";
import About from "./pages/About";
import HotelBooking from "./pages/Hotelbooking";
import Companion from "./pages/Companion";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Itinerary from "./pages/Itinerary";
// import Destination from "./pages/Destination";

// Temporary Destination Page
// const Destination: React.FC = () => (
//   <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
//     <div className="text-center">
//       <h1 className="text-4xl font-bold text-blue-600 mb-4">
//         Destination Page
//       </h1>
//       <p className="text-xl text-gray-700">Coming Soon!</p>
//     </div>
//   </div>
// );

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#f0f9ff] flex flex-col pt-14 sm:pt-16">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/login-google" element={<LoginWithGoogle />} />
            <Route path="/about" element={<About />} />
            {/* <Route path="/destination" element={<Destination />} /> */}
            <Route path="/agoda" element={<HotelBooking />} />
            <Route path="/companion" element={<Companion />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/itinerary" element={<Itinerary />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
