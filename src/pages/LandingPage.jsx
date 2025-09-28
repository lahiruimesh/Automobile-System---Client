import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="h-screen container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">Welcome to AutoService</h1>
      <p className="text-lg mb-8">
        Your one-stop solution for all automobile services.
      </p>
      <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
        Get Started
      </Link>
    </div>
  );
}
