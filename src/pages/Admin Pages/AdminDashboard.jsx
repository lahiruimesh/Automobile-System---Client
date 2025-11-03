import { useEffect, useState } from "react";
import { getPendingEmployees, approveEmployee } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import AdminNavbar from "../../components/adminNavbar.jsx";
import { getTotalEmployees, getTotalCustomers, getTotalAppointments, getCompletedServices } from "../../api/timeLog";
import { Users, Calendar, Wrench, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";


export default function AdminDashboard({children}) {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);

  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalCustomers: 0,
    totalAppointments: 0,
    totalServices: 0,
  });
  
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
  

  const [barData, setBarData] = useState([
    { name: "Jan", appointments: 20 },
    { name: "Feb", appointments: 40 },
    { name: "Mar", appointments: 25 },
    { name: "Apr", appointments: 50 },
    { name: "May", appointments: 30 },
  ]);

  const [pieData, setPieData] = useState([
    { name: "Completed", value: 33 },
    { name: "Pending", value: 12 },
    { name: "Cancelled", value: 5 },
  ]);

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];


  useEffect(() => {
    getPendingEmployees(user.token).then((res) => setEmployees(res.data));
  }, [user]);

  const approve = async (id) => {
    await approveEmployee(id, user.token);
    setEmployees(employees.filter((e) => e.id !== id));
  };

  return (
    <>
      <AdminNavbar />
      <div className="pt-20 px-8 pb-10 bg-gray-50 min-h-screen">
        {/* Page Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <TrendingUp size={20} /> Monthly Appointments
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Wrench size={20} /> Service Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity (Placeholder) */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Calendar size={20} /> Recent Activities
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li>✅ Appointment #1023 marked as completed</li>
              <li>👩‍🔧 New employee “Alex” registered</li>
              <li>📅 Appointment booked by customer “John Doe”</li>
              <li>🛠️ Service request updated by technician “Sara”</li>
            </ul>
          </div>
        </div>
      </div>
    </>
    );
}

function DashboardCard({ title, value, icon, color }) {
  return (
    <div className={`flex items-center justify-between ${color} text-white p-5 rounded-xl shadow-md`}>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
      <div className="bg-white/20 p-3 rounded-full">{icon}</div>
    </div>
  );
}
