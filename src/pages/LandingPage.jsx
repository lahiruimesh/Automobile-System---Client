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
      <OurServices />
      <CustomerAccessCard />
      <AboutUs />
      <EmployeeAccessCard />
    </div>
  );
}
