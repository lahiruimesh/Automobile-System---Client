import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react'; // Assuming you use lucide-react or similar icons

const ContactUs = () => {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2">
            Get in Touch
          </h2>
          <h3 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            We're Here to Help
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Information Column */}
          <div className="lg:col-span-1 space-y-8 p-8 bg-gray-50 rounded-xl shadow-lg border border-gray-100">
            <h4 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h4>
            
            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Email Us</p>
                <p className="text-gray-600 hover:text-blue-600 transition">support@autoservice.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Call Us</p>
                <p className="text-gray-600 hover:text-blue-600 transition">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Visit Our Center</p>
                <p className="text-gray-600">123 Auto Lane, Service City, US 90210</p>
              </div>
            </div>
            
            <hr className="border-gray-200"/>

            <p className="text-sm text-gray-500">
                Operating Hours: Mon - Fri: 8:00 AM - 6:00 PM
            </p>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2 p-8 bg-white rounded-xl shadow-xl border border-gray-100">
            <h4 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h4>
            <form className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <input 
                type="text" 
                placeholder="Subject" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
              />

              <textarea 
                placeholder="Your Message" 
                rows="5" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
              ></textarea>

              <button 
                type="submit" 
                className="w-full md:w-auto bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition duration-200 shadow-lg"
              >
                Submit Message
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ContactUs;