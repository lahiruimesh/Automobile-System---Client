import { useEffect, useState } from "react";
import { getPendingEmployees, approveEmployee } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import AdminRequestManager from "../components/AdminRequestManager";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");

  useEffect(() => {
    console.log('[AdminDashboard] Component mounted');
    console.log('[AdminDashboard] User:', user);
    if (user?.token) {
      console.log('[AdminDashboard] Fetching pending employees...');
      getPendingEmployees(user.token)
        .then((res) => {
          console.log('[AdminDashboard] Pending employees response:', res.data);
          setEmployees(res.data);
        })
        .catch((error) => {
          console.error('[AdminDashboard] Error fetching pending employees:', error);
          console.error('[AdminDashboard] Error details:', error.response?.data);
          setEmployees([]);
        });
    } else {
      console.log('[AdminDashboard] No user token available');
    }
  }, [user]);

  const approve = async (id) => {
    console.log('[AdminDashboard] Approving employee:', id);
    if (user?.token) {
      try {
        const response = await approveEmployee(id, user.token);
        console.log('[AdminDashboard] Approve response:', response.data);
        setEmployees(employees.filter((e) => e.id !== id));
        alert('Employee approved successfully!');
      } catch (error) {
        console.error('[AdminDashboard] Error approving employee:', error);
        console.error('[AdminDashboard] Error details:', error.response?.data);
        alert(error.response?.data?.message || 'Failed to approve employee');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pt-20">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("requests")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "requests"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Service Requests
            </button>
            <button
              onClick={() => setActiveTab("employees")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "employees"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Pending Employees ({employees.length})
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "requests" && <AdminRequestManager />}

      {activeTab === "employees" && (
        <div>
          {employees.length === 0 ? (
            <p className="text-gray-500">No pending employees.</p>
          ) : (
            <div className="space-y-4">
              {employees.map((e) => (
                <div
                  key={e.id}
                  className="flex justify-between items-center p-4 bg-white shadow rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{e.full_name}</p>
                    <p className="text-gray-500 text-sm">{e.email}</p>
                  </div>
                  <button
                    onClick={() => approve(e.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
