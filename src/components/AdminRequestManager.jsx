import { useState, useEffect } from "react";
import { getAllRequests, updateRequestStatus } from "../api/serviceRequests";
import { getAllEmployees, assignEmployeeToService } from "../api/timeLog";
import { useAuth } from "../context/AuthContext";

export default function AdminRequestManager() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [assigningEmployee, setAssigningEmployee] = useState(false);

  const fetchRequests = async () => {
    try {
      console.log("🔍 Fetching service requests...");
      const data = await getAllRequests();
      console.log("📦 Admin API Response:", data);
      console.log("📋 Requests data:", data.data);
      console.log("📊 Number of requests:", data.data?.length || 0);
      setRequests(data.data || []);
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
      console.error("Error details:", error.response?.data || error.message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchRequests();
      fetchEmployees();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchEmployees = async () => {
    try {
      console.log("🔍 Fetching employees for assignment...");
      const response = await getAllEmployees();
      console.log("📦 Employees API Response:", response);
      console.log("📋 All employees:", response.data);
      
      // Filter only active employees
      const activeEmployees = (response.data || []).filter(emp => emp.is_active);
      console.log("✅ Active employees:", activeEmployees);
      console.log("📊 Number of active employees:", activeEmployees.length);
      
      setEmployees(activeEmployees);
    } catch (error) {
      console.error("❌ Error fetching employees:", error);
      console.error("Error details:", error.response?.data || error.message);
      setEmployees([]);
    }
  };

  const handleOpenAssignModal = (requestId) => {
    console.log("🔓 Opening assignment modal for request:", requestId);
    console.log("👥 Available employees:", employees);
    console.log("📊 Number of employees:", employees.length);
    setSelectedRequestId(requestId);
    setSelectedEmployeeId("");
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedRequestId(null);
    setSelectedEmployeeId("");
  };

  const handleAssignEmployee = async () => {
    if (!selectedEmployeeId || !selectedRequestId) {
      alert("Please select an employee");
      return;
    }

    setAssigningEmployee(true);
    try {
      await assignEmployeeToService(selectedRequestId, selectedEmployeeId);
      alert("Employee assigned successfully!");
      handleCloseAssignModal();
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error("Error assigning employee:", error);
      alert("Failed to assign employee. Please try again.");
    } finally {
      setAssigningEmployee(false);
    }
  };

  const handleStatusUpdate = async (requestId, status, progress = 0) => {
    try {
      await updateRequestStatus(requestId, { status, progress });
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <div className="text-center py-4">Loading requests...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Manage Service Requests</h3>
      </div>
      
      {requests.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No service requests found.
        </div>
      ) : (
        <div className="divide-y">
          {requests.map((request) => (
            <div key={request.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{request.service_type}</h4>
                  <p className="text-sm text-gray-500">Customer: {request.customer_name || request.customer?.name || 'Unknown'}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-2">{request.description}</p>
              
              <div className="text-sm text-gray-500 mb-3">
                <p>Vehicle: {request.vehicle_info?.year} {request.vehicle_info?.make} {request.vehicle_info?.model}</p>
                <p>Created: {new Date(request.created_at).toLocaleDateString()}</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                {request.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleOpenAssignModal(request.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Assign Employee
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request.id, "cancelled")}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </>
                )}
                
                {request.status === "in-progress" && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(request.id, "in-progress", 50)}
                      className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                    >
                      50% Complete
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request.id, "in-progress", 90)}
                      className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                    >
                      90% Complete
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request.id, "completed", 100)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Complete
                    </button>
                  </>
                )}
              </div>

              {request.progress > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{request.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${request.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Employee Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Assign Employee to Service</h3>
                <button 
                  onClick={handleCloseAssignModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Employee
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select an Employee --</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.full_name || employee.name} - {employee.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCloseAssignModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={assigningEmployee}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignEmployee}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={!selectedEmployeeId || assigningEmployee}
                >
                  {assigningEmployee ? "Assigning..." : "Assign"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}