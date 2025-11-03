import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import 'antd/dist/reset.css';
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CustomerDashboard from "./pages/CustomerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/Admin Pages/AdminDashboard";
import PendingApproval from "./pages/PendingApproval";
import LandingPage from "./pages/LandingPage";
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
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employee-management" element={<EmployeeManagement />} />
        <Route path="/admin/customers" element={<CustomerList />} />
        <Route path="/admin/appointments" element={<AppointmentManagement />} />
        <Route path="/pending" element={<PendingApproval />} />
        <Route path="/admin/reports" element={<Reports />} />
      </Routes>

      <Footer />
      <Chatbot />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default function App() {


  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
