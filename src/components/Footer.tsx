import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">PLAN2GO</span>
            </Link>
            <div className="text-gray-600">VADODARA, GUJARAT, INDIA</div>
            <div className="text-gray-600">+91 9879879787</div>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            2025 © Plan2Go LLC
          </div>
          <div className="text-sm text-gray-600">
            <Link to="/terms" className="hover:text-gray-900">Terms & Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;