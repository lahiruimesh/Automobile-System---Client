import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ServiceRequestForm from "../components/ServiceRequestForm";
import ServiceRequestList from "../components/ServiceRequestList";

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [refreshRequests, setRefreshRequests] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRequestSuccess = () => {
    setRefreshRequests(prev => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, {user?.role.toUpperCase()}!
        </h2>
       
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ServiceRequestForm onSuccess={handleRequestSuccess} />
        </div>
        <div>
          <ServiceRequestList refresh={refreshRequests} />
        </div>
      </div>
    </div>
  );
}
