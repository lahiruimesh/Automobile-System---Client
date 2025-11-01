import { useState, useEffect } from "react";
import { getAllRequests, updateRequestStatus } from "../api/serviceRequests";
import { useAuth } from "../context/AuthContext";

export default function AdminRequestManager() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const data = await getAllRequests();
      console.log("Admin API Response:", data);
      setRequests(data.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, [user]);

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
                      onClick={() => handleStatusUpdate(request.id, "in-progress", 10)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Start Work
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
    </div>
  );
}