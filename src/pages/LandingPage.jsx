import React from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/LandingPageComponents/HeroSection";
import OurServices from "../components/LandingPageComponents/OurServices";
import AboutUs from "../components/LandingPageComponents/AboutUs";
//import ContactUs from "../components/LandingPageComponents/ContactUs";
import CustomerAccessCard from "../components/LandingPageComponents/CustomerAccessCard";
import EmployeeAccessCard from "../components/LandingPageComponents/EmployeeAccessCard";

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <div id="services">
        <OurServices />
      </div>
      <CustomerAccessCard />
      <div id="about">
        <AboutUs />
      </div>
      <EmployeeAccessCard />
      <div id="contact">
        {/* Contact section - you can add ContactUs component here later */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-8">Get in touch with us for any inquiries</p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <p className="text-gray-600">info@autoservice.com</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Address</h3>
                <p className="text-gray-600">123 Auto Street, City, State 12345</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
