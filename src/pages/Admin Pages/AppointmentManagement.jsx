import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import AdminNavbar from "../../components/adminNavbar";

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // fetch("/api/admin/appointments").then(res => res.json()).then(setAppointments);
    setAppointments([
      { id: 1, customer: "John Doe", date: "2025-11-01", status: "Completed" },
      { id: 2, customer: "Nina Silva", date: "2025-11-03", status: "Pending" },
    ]);
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="pt-20 px-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar size={28} /> Appointment Management
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-sky-100">
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{a.customer}</td>
                  <td className="p-3">{a.date}</td>
                  <td className={`p-3 font-medium ${
                    a.status === "Completed" ? "text-green-600" : "text-yellow-600"
                  }`}>
                    {a.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
