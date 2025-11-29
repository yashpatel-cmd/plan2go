import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state as {
    room: string;
    price: number;
    checkIn: string;
    checkOut: string;
    guests: number;
  };

  const handlePayment = () => {
    // After payment success →
    navigate("/confirmation", { state: data });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Checkout & Payment</h1>

      <div className="mb-4">
        <p><strong>Room:</strong> {data.room}</p>
        <p><strong>Price:</strong> ₹{data.price}</p>
        <p><strong>Guests:</strong> {data.guests}</p>
        <p><strong>Check-in:</strong> {data.checkIn}</p>
        <p><strong>Check-out:</strong> {data.checkOut}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Choose Payment Method</h2>

      <div className="space-y-3">
        <button className="w-full py-3 border rounded-lg">UPI</button>
        <button className="w-full py-3 border rounded-lg">Credit/Debit Card</button>
        <button className="w-full py-3 border rounded-lg">Net Banking</button>
      </div>

      <button
        onClick={handlePayment}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        Pay Now
      </button>
    </div>
  );
}
