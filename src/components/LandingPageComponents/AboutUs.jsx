import React from 'react';
// You might add an image here later, e.g., import GarageImage from '../../assets/garage.jpg';

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

          {/* Placeholder/Visual Element (You can insert an image here) */}
          <div className="hidden md:block">
            <div className="bg-gray-200 h-96 rounded-2xl shadow-xl flex items-center justify-center border-4 border-white">
              {/*  */}
              <p className="text-gray-500 font-semibold">Image Placeholder: Modern Garage/Team</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;