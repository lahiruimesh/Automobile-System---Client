import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  Users,
  UserCircle,
  Calendar,
  BarChart2,
  LogOut,
} from "lucide-react";

export default function AdminNavbar() {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Home size={18} /> },
    {
      name: "Employees",
      path: "/admin/employee-management",
      icon: <Users size={18} />,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: <UserCircle size={18} />,
    },
    {
      name: "Appointments",
      path: "/admin/appointments",
      icon: <Calendar size={18} />,
    },
    { name: "Reports", path: "/admin/reports", icon: <BarChart2 size={18} /> },
  ];

  return (
    <header className="bg-sky-600 text-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <Link
          to="/admin/dashboard"
          className="text-2xl font-bold tracking-wide"
        >
          Auto<span className="text-yellow-300">Service</span>
          <span className="text-sm font-normal ml-1">Admin</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex space-x-6 items-center">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-1 text-sm font-medium transition ${
                location.pathname === item.path
                  ? "text-yellow-300 border-b-2 border-yellow-300 pb-1"
                  : "hover:text-yellow-200"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-sky-800 text-white px-4 py-2 rounded-lg hover:bg-white hover:text-sky-800 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}
