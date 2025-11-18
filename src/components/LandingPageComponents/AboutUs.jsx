import React from 'react';
import { FaCar, FaTools, FaChartLine } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <section className="py-20 sm:py-28 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2">
            Who We Are
          </h2>
          <h3 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Driven by Transparency and Technology
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-6">
            <p className="text-xl text-gray-700 leading-relaxed">
              We are **AutoService**, a company dedicated to modernizing the vehicle maintenance experience. We believe that vehicle service should be just as smooth and transparent as driving the car itself.
            </p>
            <p className="text-gray-600">
              Unlike traditional shops, our unique system offers customers a live dashboard to view **real-time progress**, track employee time logs, and manage appointments effortlessly. We bridge the gap between our expert mechanics and you, the car owner.
            </p>
            
            <ul className="space-y-3 pt-4">
              <li className="flex items-center text-gray-800">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.275a1.12 1.12 0 011.233 1.233l-.066.071L12 18l-7.391-7.233a1.12 1.12 0 011.233-1.233l.071.066L12 15.385l5.618-5.558z"></path></svg>
                <span className="font-medium">Real-Time Progress Tracking</span>
              </li>
              <li className="flex items-center text-gray-800">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="font-medium">Easy Online Booking & Modification Requests</span>
              </li>
              <li className="flex items-center text-gray-800">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                <span className="font-medium">Detailed Employee Time Logging for Accountability</span>
              </li>
            </ul>
          </div>

          {/* Visual Element with Icons */}
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 h-96 rounded-2xl shadow-xl flex flex-col items-center justify-center border-4 border-white p-8 space-y-8">
              <div className="grid grid-cols-3 gap-8 w-full">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white/20 backdrop-blur-lg p-6 rounded-full">
                    <FaCar className="text-white text-5xl" />
                  </div>
                  <p className="text-white text-sm font-semibold text-center">Vehicle Care</p>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white/20 backdrop-blur-lg p-6 rounded-full">
                    <FaTools className="text-white text-5xl" />
                  </div>
                  <p className="text-white text-sm font-semibold text-center">Expert Service</p>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white/20 backdrop-blur-lg p-6 rounded-full">
                    <FaChartLine className="text-white text-5xl" />
                  </div>
                  <p className="text-white text-sm font-semibold text-center">Live Tracking</p>
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-white text-2xl font-bold mb-2">Modern Auto Service</h4>
                <p className="text-white/90 text-sm">Technology-Driven Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;