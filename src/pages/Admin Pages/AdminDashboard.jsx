import { useEffect, useState } from "react";
import { getPendingEmployees, approveEmployee } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import AdminNavbar from "../../components/adminNavbar.jsx";
import {
  getTotalEmployees,
  getTotalCustomers,
  getTotalAppointments,
  getCompletedServices,
  getServiceStatusSummary,
} from "../../api/timeLog";
import { Users, Calendar, Wrench, UserCheck } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalCustomers: 0,
    totalAppointments: 0,
    completedServices: 0,
  });
  const [pieData, setPieData] = useState([]);

  // Fetch Summary Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const totalEmployees = await getTotalEmployees();
        const totalCustomers = await getTotalCustomers();
        const totalAppointments = await getTotalAppointments();
        const completedServices = await getCompletedServices();

        setStats({
          totalEmployees: totalEmployees.count || 0,
          totalCustomers: totalCustomers.count || 0,
          totalAppointments: totalAppointments.count || 0,
          completedServices: completedServices.count || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Fetch Pending Employee Requests
  useEffect(() => {
    if (user?.token) {
      getPendingEmployees(user.token)
        .then((res) => setEmployees(res.data))
        .catch((err) => console.error("Error fetching pending employees:", err));
    }
  }, [user]);

  // Fetch Service Status Pie Chart Data
  useEffect(() => {
    const fetchServiceStatus = async () => {
      try {
        const data = await getServiceStatusSummary();
        setPieData([
          { name: "Completed", value: data.completed || 0 },
          { name: "In Progress", value: data.in_progress || 0 },
          { name: "Cancelled", value: data.cancelled || 0 },
        ]);
      } catch (error) {
        console.error("Error fetching service status summary:", error);
      }
    };
    fetchServiceStatus();
  }, []);

  const handleApprove = async (id) => {
    if (!user?.token) {
      alert("You must be logged in to approve employees");
      return;
    }
    
    try {
      const response = await approveEmployee(id, user.token);
      console.log("Employee approved:", response.data);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      alert("Employee approved successfully!");
    } catch (error) {
      console.error("Error approving employee:", error);
      alert(error.response?.data?.message || "Failed to approve employee");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="pt-20 px-8 pb-10 bg-gray-50 min-h-screen">
        {/* Page Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={<Users size={28} />}
            color="bg-blue-500"
          />
          <DashboardCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={<Users size={28} />}
            color="bg-green-500"
          />
          <DashboardCard
            title="Appointments"
            value={stats.totalAppointments}
            icon={<Calendar size={28} />}
            color="bg-yellow-500"
          />
          <DashboardCard
            title="Completed Services"
            value={stats.completedServices}
            icon={<Wrench size={28} />}
            color="bg-purple-500"
          />
        </div>

        {/* Charts and Pending Requests Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Status Pie Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Wrench size={20} /> Service Status Distribution
            </h2>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
              <ResponsiveContainer width={300} height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend with counts */}
              <div className="space-y-3">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    ></div>
                    <span className="text-gray-700 font-medium">
                      {entry.name}:{" "}
                      <span className="text-gray-900 font-bold">
                        {entry.value}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Employee Requests */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Users size={20} /> Pending Employee Requests
              </h2>
            </div>
            {employees.length === 0 ? (
              <p className="text-gray-500 text-sm">No pending requests.</p>
            ) : (
              <ul className="space-y-4">
                {employees.map((emp) => (
                  <li
                    key={emp.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {emp.full_name}
                      </p>
                      <p className="text-sm text-gray-500">{emp.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(emp.id)}
                        className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                      >
                        <UserCheck size={16} /> Approve
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// DashboardCard Component
function DashboardCard({ title, value, icon, color }) {
  return (
    <div
      className={`flex items-center justify-between ${color} text-white p-5 rounded-xl shadow-md`}
    >
      <div>
        <p className="text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
      <div className="bg-white/20 p-3 rounded-full">{icon}</div>
    </div>
  );
}
