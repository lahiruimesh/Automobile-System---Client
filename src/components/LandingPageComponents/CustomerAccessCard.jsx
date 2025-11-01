import React from 'react';
import { Link } from 'react-router-dom';

// Note: Update this path to your actual customer-focused image asset
const CUSTOMER_IMAGE = '/assets/customer-dashboard-preview.jpg'; 

const CustomerAccessCard = () => {
  return (
    <div 
      className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-2xl overflow-hidden max-w-6xl mx-auto border border-gray-100 transition duration-500 hover:shadow-3xl"
    >
      
      {/* Image on Left */}
      <div className="w-full md:w-1/2 h-64 md:h-96">
        <img 
          src={CUSTOMER_IMAGE} 
          alt="Customer Dashboard Preview" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content on Right */}
      <div className="w-full md:w-1/2 p-8 lg:p-12 space-y-6">
        <h4 className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          For Car Owners
        </h4>
        
        <h3 className="text-3xl font-bold text-gray-900">
          Customer Progress Dashboard
        </h3>
        
        <p className="text-gray-600">
          Easily book new services, track your vehicle's repair progress in **real-time**, and review detailed employee time logs for maximum transparency.
        </p>
        
        <Link 
          to="/customer" 
          className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition duration-200 shadow-md"
        >
          Go to My Dashboard
        </Link>
      </div>

    </div>
  );
};

export default CustomerAccessCard;