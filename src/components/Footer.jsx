import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Twitter, Facebook, Linkedin } from 'lucide-react'; // Social media icons

const Footer = () => {
  const location = useLocation();

  // Hide footer on dashboard pages and other authenticated pages
  const hiddenPages = [
    '/customer',
    '/employee',
    '/admin',
    '/pending',
    '/appointments/book',
    '/appointments/confirmation',
    '/appointments/my-appointments',
    '/appointments/track-progress'
  ];
  const isProfilePage = location.pathname.startsWith('/employee/profile');
  
  if (hiddenPages.includes(location.pathname) || isProfilePage) {
    return null;
  }

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-b border-gray-700 pb-8 mb-8">
          
          {/* Logo & Slogan */}
          <div className="col-span-2 lg:col-span-2 space-y-3">
            <Link to="/" className="text-2xl font-bold tracking-wide">
              Auto<span className="text-blue-400">Service</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-xs">
              Modernizing vehicle service with live tracking, appointment management, and time transparency.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
              <li><Link to="/services" className="hover:text-blue-400 transition">Our Services</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/login" className="hover:text-blue-400 transition">Customer Login</Link></li>
              <li><Link to="/employee-login" className="hover:text-blue-400 transition">Employee Login</Link></li>
              <li><Link to="/signup" className="hover:text-blue-400 transition">Sign Up</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition">Terms of Service</Link></li>
            </ul>
          </div>
          
        </div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AutoService. All rights reserved.
          </p>
          
          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 transition">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-400 transition">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-400 transition">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;