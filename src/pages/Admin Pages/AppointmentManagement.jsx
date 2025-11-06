import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import AdminNavbar from "../../components/adminNavbar";
import { getAllAppointments } from "../../api/timeLog";

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAllAppointments();
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="pt-20 px-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar size={28} /> Appointment Management
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-sky-100">
                <th className="p-3">Service ID</th>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Vehicle No</th>
                <th className="p-3">Vehicle Model</th>
                <th className="p-3">Service Type</th>
                <th className="p-3">Title</th>
                <th className="p-3">Status</th>
                <th className="p-3">Estimate Hours</th>
                <th className="p-3">Total Hours Logged</th>
                <th className="p-3">Scheduled Date</th>
                <th className="p-3">Completion Date</th>
                <th className="p-3">Assigned Employee</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.service_id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{a.service_id}</td>
                  <td className="p-3">{a.customer_name}</td>
                  <td className="p-3">{a.customer_phone}</td>
                  <td className="p-3">{a.vehicle_number}</td>
                  <td className="p-3">{a.vehicle_model}</td>
                  <td className="p-3">{a.service_type}</td>
                  <td className="p-3">{a.title}</td>
                  <td
                    className={`p-3 font-medium ${
                      a.status === "completed"
                        ? "text-green-600"
                        : a.status === "pending"
                        ? "text-yellow-600"
                        : a.status === "in-progress"
                        ? "text-blue-600"
                        : a.status === "cancelled"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {a.status}
                  </td>
                  <td className="p-3">{a.estimated_hours}</td>
                  <td className="p-3">{a.total_hours_logged}</td>
                  <td className="p-3">
                    {new Date(a.scheduled_date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {a.completion_date
                      ? new Date(a.completion_date).toLocaleDateString()
                      : "Pending"}
                  </td>
                  <td className="p-3">{a.employee_name || "Not Assigned"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
