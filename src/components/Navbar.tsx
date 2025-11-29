import React, { useState } from 'react';
import { Plane, MapPin, User, LogOut, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {
  const [user, loading] = useAuthState(auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMobileMenuOpen(false); // Close mobile menu after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm fixed inset-x-0 top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-1 sm:space-x-2" onClick={closeMobileMenu}>
              <Plane className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-500">PLAN2GO</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-500 transition-colors text-sm lg:text-base">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-500 transition-colors text-sm lg:text-base">About</Link>
            <Link to="/destination" className="text-gray-700 hover:text-blue-500 transition-colors inline-flex items-center text-sm lg:text-base">
              {/* <MapPin className="h-4 w-4 lg:h-5 lg:w-5 mr-1 lg:mr-2" /> */}
              {/* <span className="hidden lg:inline">Destination</span> */}
              <span className="lg:hidden">Dest</span>
            </Link>
            <Link to="/companion" className="text-gray-700 hover:text-blue-500 transition-colors text-sm lg:text-base">Companion</Link>
            <Link to="/itinerary" className="text-gray-700 hover:text-blue-500 transition-colors text-sm lg:text-base">Itinerary</Link>
            
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 lg:h-5 lg:w-5 border-b-2 border-blue-500"></div>
                <span className="text-gray-600 text-sm lg:text-base">Loading...</span>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-1 lg:space-x-2 bg-blue-600 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-full hover:bg-blue-700 transition-colors text-sm lg:text-base"
                >
                  <User className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 lg:space-x-2 text-gray-700 hover:text-red-600 transition-colors text-sm lg:text-base"
                  title="Logout"
                >
                  <LogOut className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-black text-white px-4 lg:px-6 py-1.5 lg:py-2 rounded-full hover:bg-gray-800 transition-colors text-sm lg:text-base"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-blue-500 transition-colors p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
              {/* Navigation Links */}
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link
                to="/destination"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Destination
                </div>
              </Link>
              <Link
                to="/companion"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Companion
              </Link>
              <Link
                to="/itinerary"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-500 hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Itinerary
              </Link>
              
              {/* User Actions */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                {loading ? (
                  <div className="flex items-center justify-center px-3 py-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-600">Loading...</span>
                  </div>
                ) : user ? (
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      className="flex items-center px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full text-center px-3 py-2 text-base font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
