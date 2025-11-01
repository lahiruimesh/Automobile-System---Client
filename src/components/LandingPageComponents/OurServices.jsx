import React from 'react';

// Card data
const serviceFeatures = [
  {
    icon: '📅',
    title: 'Appointment Management',
    description: 'Easily book your next service slot online. View upcoming appointments, request modifications, and receive instant confirmations.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: '⚙️',
    title: 'Live Service Progress',
    description: 'Track your vehicle’s status in real-time via your personalized dashboard. Know exactly where your service stands, from start to completion.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: '⏱️',
    title: 'Transparent Time Logging',
    description: 'See the exact time our certified employees spend on your vehicle. Our system logs time against specific projects for maximum accountability.',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    icon: '📱',
    title: 'Mobile-Friendly Updates',
    description: 'Receive instant notifications and access your dashboard on any device, ensuring you are always in the loop, wherever you are.',
    color: 'bg-purple-100 text-purple-600',
  },
];

const OurServices = () => {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2">
            Our Core Features
          </h2>
          <h3 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Simplifying Vehicle Service
          </h3>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {serviceFeatures.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-full flex items-center justify-center text-2xl mb-6`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h4>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
          
        </div>
      </div>
    </section>
  );
};

export default OurServices;