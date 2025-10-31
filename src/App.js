import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CustomerDashboard from "./pages/CustomerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeProfile from "./pages/EmployeeProfile";
import AdminDashboard from "./pages/AdminDashboard";
import PendingApproval from "./pages/PendingApproval";
import LandingPage from "./pages/LandingPage";
import AppointmentBooking from "./pages/AppointmentBooking";
import AppointmentConfirmation from "./pages/AppointmentConfirmation";
import MyAppointments from "./pages/MyAppointments";
import TrackProgress from "./pages/TrackProgress";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/employee/profile" element={<EmployeeProfile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/pending" element={<PendingApproval />} />
            
            {/* Appointment Routes */}
            <Route path="/appointments/book" element={<AppointmentBooking />} />
            <Route path="/appointments/confirmation" element={<AppointmentConfirmation />} />
            <Route path="/appointments/my-appointments" element={<MyAppointments />} />
            <Route path="/appointments/track-progress" element={<TrackProgress />} />
          </Routes>
          <Footer />
          <Chatbot />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}
