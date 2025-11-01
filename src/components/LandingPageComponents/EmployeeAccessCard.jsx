import React from 'react';
import { Link } from 'react-router-dom';

// Note: Update this path to your actual employee-focused image asset
const EMPLOYEE_IMAGE = '/assets/employee-logging-preview.jpg'; 

const EmployeeAccessCard = () => {
  return (
    <div 
      className="flex flex-col md:flex-row-reverse items-center bg-white rounded-2xl mb-24 shadow-2xl overflow-hidden max-w-6xl mx-auto border border-gray-100 transition duration-500 hover:shadow-3xl"
    >
      
      {/* Image on Right */}
      <div className="w-full md:w-1/2 h-64 md:h-96">
        <img 
          src={EMPLOYEE_IMAGE} 
          alt="Employee Time Logging Portal" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content on Left */}
      <div className="w-full md:w-1/2 p-8 lg:p-12 space-y-6">
        <h4 className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          For Our Staff
        </h4>
        
        <h3 className="text-3xl font-bold text-gray-900">
          Employee Time & Project Portal
        </h3>
        
        <p className="text-gray-600">
          Easily **log time** against specific services and projects, update repair statuses, and monitor your upcoming workload and appointments efficiently.
        </p>
        
        <Link 
          to="/employee" 
          className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition duration-200 shadow-md"
        >
          Start Work Session
        </Link>
      </div>

    </div>
  );
};

export default EmployeeAccessCard;