import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, {user?.role.toUpperCase()}!
        </h2>
        <p className="text-gray-600 mb-4">
          You are logged in as <span className="font-medium">{user?.email}</span>
        </p>

        <h3 className="text-xl font-semibold text-gray-700 mb-2">Employee Features (coming soon)</h3>
        <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
          <li>Log time against services/projects</li>
          <li>Update service/project status</li>
          <li>View upcoming appointments</li>
        </ul>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
