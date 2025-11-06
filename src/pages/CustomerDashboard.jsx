import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMyAppointments } from "../api/appointments";
import { format } from "date-fns";
import { 
  FiCalendar, 
  FiClipboard, 
  FiTrendingUp,
  FiDroplet,
  FiDisc,
  FiAlertOctagon,
  FiTool,
  FiSettings,
  FiWind,
  FiCheckCircle,
  FiStar,
  FiZap,
  FiClock,
  FiAlertCircle
} from "react-icons/fi";

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, appointments, services

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await getMyAppointments();
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentStats = () => {
    const pending = appointments.filter(apt => apt.status === 'pending').length;
    const confirmed = appointments.filter(apt => apt.status === 'confirmed').length;
    const inProgress = appointments.filter(apt => apt.status === 'in_progress').length;
    const completed = appointments.filter(apt => apt.status === 'completed').length;
    
    return { pending, confirmed, inProgress, completed };
  };

  const getUpcomingAppointments = () => {
    return appointments
      .filter(apt => ['pending', 'confirmed', 'in_progress'].includes(apt.status))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  };

  const stats = getAppointmentStats();
  const upcomingAppointments = getUpcomingAppointments();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome, {user?.full_name || user?.email}!</h1>
              <p className="text-sky-100">Manage your vehicle services and appointments</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-white text-sky-600 rounded-lg hover:bg-sky-50 transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-4 transition ${
                activeTab === "overview"
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiTrendingUp size={20} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-4 transition ${
                activeTab === "appointments"
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiCalendar size={20} />
              My Appointments
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-4 transition ${
                activeTab === "services"
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiTool size={20} />
              Services
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer border-l-4 border-sky-500"
                onClick={() => navigate("/appointments/book")}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center">
                    <FiCalendar className="text-sky-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Book Appointment</h3>
                    <p className="text-gray-600">Schedule a service</p>
                  </div>
                </div>
              </div>

              <div
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer border-l-4 border-blue-500"
                onClick={() => setActiveTab("appointments")}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiClipboard className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">My Appointments</h3>
                    <p className="text-gray-600">View & manage</p>
                  </div>
                </div>
              </div>

              <div
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer border-l-4 border-green-500"
                onClick={() => navigate("/appointments/track-progress")}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <FiTrendingUp className="text-green-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Track Progress</h3>
                    <p className="text-gray-600">See service status</p>
                  </div>
                </div>
              </div>
            </div>

        {/* Appointment Statistics & Upcoming */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Statistics Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointment Statistics</h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500">
                  <div className="flex items-center gap-2 mb-2">
                    <FiClock className="text-amber-600" />
                    <span className="text-sm font-medium text-gray-600">Pending</span>
                  </div>
                  <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-2">
                    <FiCheckCircle className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Confirmed</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{stats.confirmed}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-500">
                  <div className="flex items-center gap-2 mb-2">
                    <FiTool className="text-indigo-600" />
                    <span className="text-sm font-medium text-gray-600">In Progress</span>
                  </div>
                  <p className="text-3xl font-bold text-indigo-600">{stats.inProgress}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center gap-2 mb-2">
                    <FiCheckCircle className="text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Completed</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Appointments Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Upcoming Appointments</h2>
              <button
                onClick={() => navigate("/appointments/my-appointments")}
                className="text-sky-600 hover:text-sky-700 text-sm font-semibold"
              >
                View All →
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <FiAlertCircle className="mx-auto text-gray-300 mb-2" size={48} />
                <p className="text-gray-500">No upcoming appointments</p>
                <button
                  onClick={() => navigate("/appointments/book")}
                  className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                >
                  Book Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer border-l-4 border-sky-500"
                    onClick={() => navigate("/appointments/my-appointments")}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-gray-800">
                        {apt.vehicle_make} {apt.vehicle_model}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        'bg-indigo-100 text-indigo-700'
                      }`}>
                        {apt.status === 'in_progress' ? 'In Progress' : 
                         apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        {apt.date && format(new Date(apt.date), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock size={14} />
                        {apt.start_time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Services Overview */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: FiDroplet, name: "Oil Change", time: "30-45 min", color: "text-amber-600", bg: "bg-amber-50" },
              { icon: FiDisc, name: "Tire Rotation", time: "45 min", color: "text-gray-700", bg: "bg-gray-100" },
              { icon: FiAlertOctagon, name: "Brake Service", time: "1-2 hours", color: "text-red-600", bg: "bg-red-50" },
              { icon: FiTool, name: "Engine Diagnostic", time: "1 hour", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: FiSettings, name: "Transmission", time: "2-3 hours", color: "text-purple-600", bg: "bg-purple-50" },
              { icon: FiWind, name: "AC Service", time: "1 hour", color: "text-cyan-600", bg: "bg-cyan-50" },
              { icon: FiCheckCircle, name: "General Maintenance", time: "Varies", color: "text-teal-600", bg: "bg-teal-50" },
              { icon: FiStar, name: "Detailing", time: "2-4 hours", color: "text-yellow-600", bg: "bg-yellow-50" },
              { icon: FiZap, name: "Custom Work", time: "Varies", color: "text-indigo-600", bg: "bg-indigo-50" },
            ].map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.name}
                  className={`flex items-center gap-3 p-4 ${service.bg} rounded-lg hover:shadow-md transition border border-gray-100`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
                    <IconComponent className={`${service.color} text-xl`} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{service.name}</div>
                    <div className="text-sm text-gray-600">{service.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <FiCalendar className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Appointments Yet</h3>
                <p className="text-gray-500 mb-6">You haven't booked any appointments</p>
                <button
                  onClick={() => navigate("/appointments/book")}
                  className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition font-semibold"
                >
                  Book Your First Appointment
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                    onClick={() => navigate("/appointments/my-appointments")}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {apt.vehicle_make} {apt.vehicle_model}
                        </h3>
                        <p className="text-sm text-gray-600">{apt.service_type}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        apt.status === 'in_progress' ? 'bg-indigo-100 text-indigo-700' :
                        apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {apt.status === 'in_progress' ? 'In Progress' : 
                         apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-2">
                        <FiCalendar />
                        {apt.date && format(new Date(apt.date), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-2">
                        <FiClock />
                        {apt.start_time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: FiDroplet, name: "Oil Change", time: "30-45 min", color: "text-amber-600", bg: "bg-amber-50", desc: "Regular oil change service" },
                { icon: FiDisc, name: "Tire Rotation", time: "45 min", color: "text-gray-700", bg: "bg-gray-100", desc: "Tire rotation and balancing" },
                { icon: FiAlertOctagon, name: "Brake Service", time: "1-2 hours", color: "text-red-600", bg: "bg-red-50", desc: "Brake inspection and repair" },
                { icon: FiTool, name: "Engine Diagnostic", time: "1 hour", color: "text-blue-600", bg: "bg-blue-50", desc: "Complete engine check" },
                { icon: FiSettings, name: "Transmission", time: "2-3 hours", color: "text-purple-600", bg: "bg-purple-50", desc: "Transmission service" },
                { icon: FiWind, name: "AC Service", time: "1 hour", color: "text-cyan-600", bg: "bg-cyan-50", desc: "AC maintenance and repair" },
                { icon: FiCheckCircle, name: "General Maintenance", time: "Varies", color: "text-teal-600", bg: "bg-teal-50", desc: "Regular maintenance check" },
                { icon: FiStar, name: "Detailing", time: "2-4 hours", color: "text-yellow-600", bg: "bg-yellow-50", desc: "Complete car detailing" },
                { icon: FiZap, name: "Custom Work", time: "Varies", color: "text-indigo-600", bg: "bg-indigo-50", desc: "Custom modifications" },
              ].map((service) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={service.name}
                    className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-l-4 ${service.bg.replace('bg-', 'border-')}`}
                  >
                    <div className={`w-12 h-12 rounded-lg ${service.bg} flex items-center justify-center mb-4`}>
                      <IconComponent className={`${service.color} text-2xl`} />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{service.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{service.desc}</p>
                    <p className={`text-sm font-medium ${service.color}`}>{service.time}</p>
                    <button
                      onClick={() => navigate("/appointments/book")}
                      className="mt-4 w-full px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition text-sm font-medium"
                    >
                      Book Now
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Account Actions - No longer needed here since logout is in header */}
      </div>
    </div>
  );
}
