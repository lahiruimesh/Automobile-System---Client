import { useEffect, useState } from "react";
import { Calendar, UserCheck, Clock, CheckCircle, XCircle } from "lucide-react";
import AdminNavbar from "../../components/adminNavbar";
import { getAllAppointments, getAllEmployees } from "../../api/timeLog";
import { assignEmployeeToAppointment } from "../../api/appointments";

export default function AppointmentsManagement() {
  const [appointments, setAppointments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, employeesData] = await Promise.all([
        getAllAppointments(),
        getAllEmployees()
      ]);
      
      setAppointments(appointmentsData.appointments || []);
      setEmployees(employeesData.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      showNotification("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleAssignEmployee = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedEmployee(appointment.assigned_employee_id || "");
    setShowAssignModal(true);
  };

  const handleSubmitAssignment = async () => {
    if (!selectedEmployee) {
      showNotification("Please select an employee", "error");
      return;
    }

    try {
      await assignEmployeeToAppointment(selectedAppointment.id, selectedEmployee);
      showNotification("Employee assigned successfully!", "success");
      setShowAssignModal(false);
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error assigning employee:", error);
      showNotification(
        error.response?.data?.message || "Failed to assign employee",
        "error"
      );
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
      confirmed: { bg: "bg-blue-100", text: "text-blue-700", icon: CheckCircle },
      in_progress: { bg: "bg-purple-100", text: "text-purple-700", icon: UserCheck },
      completed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
      cancelled: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text} flex items-center gap-1 w-fit`}>
        <Icon size={14} />
        {status?.replace(/_/g, " ").toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="pt-20 px-8 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading appointments...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="pt-20 px-8 bg-gray-50 min-h-screen">
        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-24 right-8 px-6 py-3 rounded-lg shadow-lg z-50 ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {notification.message}
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar size={32} className="text-sky-600" />
          Appointments Management
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-blue-600">{appointments.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {appointments.filter(a => a.status === 'completed').length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-purple-600">
                {appointments.filter(a => a.status === 'in_progress').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {appointments.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-sky-600 text-white">
                  <th className="p-3">ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Service Type</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Assigned Employee</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3 font-medium text-gray-700">#{appointment.id}</td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-gray-800">{appointment.customer_name}</p>
                        <p className="text-sm text-gray-500">{appointment.customer_email}</p>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{appointment.customer_phone}</td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-gray-800">{appointment.license_plate}</p>
                        <p className="text-sm text-gray-500">
                          {appointment.vehicle_make} {appointment.vehicle_model} ({appointment.vehicle_year})
                        </p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="bg-sky-100 text-sky-700 px-2 py-1 rounded text-sm">
                        {appointment.service_type?.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-gray-800">
                          {new Date(appointment.appointment_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.start_time} - {appointment.end_time}
                        </p>
                      </div>
                    </td>
                    <td className="p-3">{getStatusBadge(appointment.status)}</td>
                    <td className="p-3">
                      {appointment.assigned_employee_name ? (
                        <div className="flex items-center gap-2">
                          <UserCheck size={16} className="text-green-600" />
                          <span className="text-gray-800">{appointment.assigned_employee_name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Not assigned</span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleAssignEmployee(appointment)}
                        className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1"
                      >
                        <UserCheck size={16} />
                        {appointment.assigned_employee_name ? "Reassign" : "Assign"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Assign Employee Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <UserCheck className="text-sky-600" />
              Assign Employee
            </h2>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Appointment:</span> #{selectedAppointment?.id}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Customer:</span> {selectedAppointment?.customer_name}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-semibold">Service:</span> {selectedAppointment?.service_type?.replace(/_/g, " ").toUpperCase()}
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Employee <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="">-- Select Employee --</option>
                {employees
                  .filter(emp => emp.is_active)
                  .map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.full_name} ({employee.email})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmitAssignment}
                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg font-semibold transition"
              >
                Assign Employee
              </button>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedEmployee("");
                }}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
