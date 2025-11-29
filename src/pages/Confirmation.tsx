import React from "react";
import { useLocation } from "react-router-dom";

export default function Confirmation() {
  const location = useLocation();
  const data = location.state;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Booking Confirmed!</h1>

      <p className="text-sm mb-6">Your reservation has been successfully confirmed.</p>

      <h2 className="text-xl font-semibold mb-4">Details</h2>

      <p><strong>Room:</strong> {data.room}</p>
      <p><strong>Price Paid:</strong> ₹{data.price}</p>
      <p><strong>Guests:</strong> {data.guests}</p>
      <p><strong>Check-in:</strong> {data.checkIn}</p>
      <p><strong>Check-out:</strong> {data.checkOut}</p>
    </div>
  );
}
