import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { getUserRequests } from "../api/serviceRequests";

export default function ServiceRequestList({ refresh }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const data = await getUserRequests();
      console.log("API Response:", data); // Debug log
      
      // Handle different response formats
      let requestsArray = [];
      if (Array.isArray(data)) {
        requestsArray = data;
      } else if (data && Array.isArray(data.requests)) {
        requestsArray = data.requests;
      } else if (data && Array.isArray(data.data)) {
        requestsArray = data.data;
      }
      
      setRequests(requestsArray);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [refresh]);

  // Listen for real-time updates for service requests
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (payload) => {
      const { requestId, status, progress, note, updatedAt } = payload;
      setRequests((prev) =>
        prev.map((r) => {
          const rid = r.id || r._id || r.request_id || r.requestId;
          if (String(rid) === String(requestId)) {
            return {
              ...r,
              status: status ?? r.status,
              progress: typeof progress === 'number' ? progress : r.progress,
              last_note: note ?? r.last_note,
              updated_at: updatedAt ?? r.updated_at,
            };
          }
          return r;
        })
      );
    };

    socket.on("serviceRequestStatusUpdate", handleUpdate);
    return () => {
      socket.off("serviceRequestStatusUpdate", handleUpdate);
    };
  }, [socket]);

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
        <h3 className="text-lg font-semibold">My Service Requests</h3>
      </div>
      
      {requests.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No service requests found. Create your first request above.
        </div>
      ) : (
        <div className="divide-y">
          {Array.isArray(requests) && requests.map((request) => (
            <div key={request.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{request.service_type}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-2">{request.description}</p>
              
              <div className="text-sm text-gray-500">
                <p>Vehicle: {request.vehicle_info?.year} {request.vehicle_info?.make} {request.vehicle_info?.model}</p>
                <p>Created: {new Date(request.created_at).toLocaleDateString()}</p>
                {request.progress > 0 && (
                  <div className="mt-2">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}