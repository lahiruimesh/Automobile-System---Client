import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CustomerDashboard from "./pages/CustomerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeProfile from "./pages/EmployeeProfile";
import AdminDashboard from "./pages/Admin Pages/AdminDashboard";
import PendingApproval from "./pages/PendingApproval";
import LandingPage from "./pages/LandingPage";
import AppointmentBooking from "./pages/AppointmentBooking";
import AppointmentConfirmation from "./pages/AppointmentConfirmation";
import MyAppointments from "./pages/MyAppointments";
import TrackProgress from "./pages/TrackProgress";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import AdminNavbar from "./components/adminNavbar";
import EmployeeManagement from "./pages/Admin Pages/EmployeeManagement";
import CustomerList from "./pages/Admin Pages/CustomerList";
import AppointmentManagement from "./pages/Admin Pages/AppointmentManagement";
import Reports from "./pages/Admin Pages/Reports";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Show AdminNavbar for admin routes, regular Navbar for others */}
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/employee/profile" element={<EmployeeProfile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employee-management" element={<EmployeeManagement />} />
        <Route path="/admin/customers" element={<CustomerList />} />
        <Route path="/admin/appointments" element={<AppointmentManagement />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/pending" element={<PendingApproval />} />
        
        {/* Appointment Routes */}
        <Route path="/appointments/book" element={<AppointmentBooking />} />
        <Route path="/appointments/confirmation" element={<AppointmentConfirmation />} />
        <Route path="/appointments/my-appointments" element={<MyAppointments />} />
        <Route path="/appointments/track-progress" element={<TrackProgress />} />
      </Routes>
<<<<<<< Updated upstream
<<<<<<< Updated upstream

      <Footer />
=======
=======
>>>>>>> Stashed changes
      
      {/* Hide Footer on admin routes */}
      {!isAdminRoute && <Footer />}
      
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      <Chatbot />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}