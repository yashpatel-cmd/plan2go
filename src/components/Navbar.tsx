import React from 'react';
import { Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-blue-500">PLAN2GO</span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-500">About</Link>
            <Link to="/destination" className="text-gray-700 hover:text-blue-500">Destination</Link>
            <Link to="/companion" className="text-gray-700 hover:text-blue-500">Companion</Link>
            <Link 
              to="/login" 
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
             Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;