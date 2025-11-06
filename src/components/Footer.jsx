import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Twitter, Facebook, Linkedin } from 'lucide-react'; // Social media icons

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navigateToPage = (path, state = {}) => {
    navigate(path, { state });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
              <li><button onClick={() => navigateToPage('/')} className="hover:text-blue-400 transition text-left">Home</button></li>
              <li><button onClick={() => scrollToSection('services')} className="hover:text-blue-400 transition text-left">Our Services</button></li>
              <li><button onClick={() => scrollToSection('about')} className="hover:text-blue-400 transition text-left">About Us</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="hover:text-blue-400 transition text-left">Contact</button></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => navigateToPage('/login', { userType: 'customer' })} 
                  className="hover:text-blue-400 transition text-left"
                >
                  Customer Login
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateToPage('/login', { userType: 'employee' })} 
                  className="hover:text-blue-400 transition text-left"
                >
                  Employee Login
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateToPage('/signup')} 
                  className="hover:text-blue-400 transition text-left"
                >
                  Sign Up
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => navigateToPage('/privacy')} 
                  className="hover:text-blue-400 transition text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateToPage('/terms')} 
                  className="hover:text-blue-400 transition text-left"
                >
                  Terms of Service
                </button>
              </li>
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