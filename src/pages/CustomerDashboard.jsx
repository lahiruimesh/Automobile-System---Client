import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Alert, Snackbar } from "@mui/material";

export default function CustomerDashboard() {
  const { user, logout } = useAuth(); // auth context
  const navigate = useNavigate();
  const [refreshRequests, setRefreshRequests] = useState(0);

  const [activeStatus, setActiveStatus] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [projectHistory, setProjectHistory] = useState([]);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch dashboard data with token from localStorage
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        navigate("/login");
        throw new Error("Session expired or invalid token. Please login again.");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch profile data (${response.status})`);
      }

      const data = await response.json();

      // Set dashboard state safely
      setActiveStatus(data.activeService || null);
      setServiceHistory(Array.isArray(data.services) ? data.services : []);
      setProjectHistory(Array.isArray(data.projects) ? data.projects : []);
      setVehicleCount(Array.isArray(data.vehicles) ? data.vehicles.length : 0);

    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message);
      showSnackbar(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token"); // remove token on logout
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress size={60} />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gray-50 mt-20">
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Welcome Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Hello, {user?.fullName || "Customer"} 👋
          </h2>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's an overview of your vehicles and services.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total Vehicles</div>
          <div className="text-2xl font-bold text-blue-600">{vehicleCount}</div>
        </div>
      </div>

      {/* Active Service Status */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Active Service Status</h3>
        {activeStatus ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700 font-medium">{activeStatus.type}</p>
                <p className="text-gray-600 text-sm">Vehicle: {activeStatus.vehicle}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                activeStatus.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {activeStatus.status}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No active services currently.</p>
        )}
      </div>

      {/* Service History */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Service History</h3>
        {serviceHistory.length === 0 ? (
          <p className="text-gray-500">No service history found.</p>
        ) : (
          serviceHistory.map((item) => (
            <div key={item.id} className="p-3 border rounded-lg mb-2">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{item.vehicle}</p>
                  <p className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>{item.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Logout */}
      <div className="mt-6 text-center">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {error && <Alert severity="error" className="mt-4">{error}</Alert>}
    </div>
  );
}
