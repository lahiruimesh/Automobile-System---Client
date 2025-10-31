import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.full_name || user?.email}!</h1>
          <p className="text-sky-100">Manage your vehicle services and appointments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer border-l-4 border-sky-500"
            onClick={() => navigate("/appointments/book")}
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📅</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Book Appointment</h3>
                <p className="text-gray-600">Schedule a service</p>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer border-l-4 border-blue-500"
            onClick={() => navigate("/appointments/my-appointments")}
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📋</div>
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
              <div className="text-4xl">🔍</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Track Progress</h3>
                <p className="text-gray-600">See service status</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Overview */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🛢️", name: "Oil Change", time: "30-45 min" },
              { icon: "🔄", name: "Tire Rotation", time: "45 min" },
              { icon: "🛑", name: "Brake Service", time: "1-2 hours" },
              { icon: "🔧", name: "Engine Diagnostic", time: "1 hour" },
              { icon: "⚙️", name: "Transmission", time: "2-3 hours" },
              { icon: "❄️", name: "AC Service", time: "1 hour" },
              { icon: "🔍", name: "General Maintenance", time: "Varies" },
              { icon: "✨", name: "Detailing", time: "2-4 hours" },
              { icon: "🎨", name: "Custom Work", time: "Varies" },
            ].map((service) => (
              <div
                key={service.name}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-sky-50 transition"
              >
                <span className="text-2xl">{service.icon}</span>
                <div>
                  <div className="font-semibold text-gray-800">{service.name}</div>
                  <div className="text-sm text-gray-600">{service.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Actions */}
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
