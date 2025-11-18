import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaTasks, FaClipboardCheck, FaCalendarAlt } from 'react-icons/fa';

const EmployeeAccessCard = () => {
  return (
    <div 
      className="flex flex-col md:flex-row-reverse items-center bg-white rounded-2xl mb-24 shadow-2xl overflow-hidden max-w-6xl mx-auto border border-gray-100 transition duration-500 hover:shadow-3xl"
    >
      
      {/* Visual Element on Right */}
      <div className="w-full md:w-1/2 h-64 md:h-96 bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-8">
        <div className="grid grid-cols-2 gap-8 w-full max-w-md">
          <div className="flex flex-col items-center space-y-4 bg-white/10 backdrop-blur-lg p-6 rounded-xl">
            <FaClock className="text-white text-5xl" />
            <p className="text-white text-sm font-semibold text-center">Time Logging</p>
          </div>
          <div className="flex flex-col items-center space-y-4 bg-white/10 backdrop-blur-lg p-6 rounded-xl">
            <FaTasks className="text-white text-5xl" />
            <p className="text-white text-sm font-semibold text-center">Task Management</p>
          </div>
          <div className="flex flex-col items-center space-y-4 bg-white/10 backdrop-blur-lg p-6 rounded-xl">
            <FaClipboardCheck className="text-white text-5xl" />
            <p className="text-white text-sm font-semibold text-center">Status Updates</p>
          </div>
          <div className="flex flex-col items-center space-y-4 bg-white/10 backdrop-blur-lg p-6 rounded-xl">
            <FaCalendarAlt className="text-white text-5xl" />
            <p className="text-white text-sm font-semibold text-center">Appointments</p>
          </div>
        </div>
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
          to="/login"
          className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition duration-200 shadow-md"
        >
          Start Work Session
        </Link>
      </div>

    </div>
  );
};

export default EmployeeAccessCard;