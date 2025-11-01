import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Pages where Navbar should be hidden (dashboard layouts)
  const hideOnRoutes = ['/employee', '/customer', '/admin'];
  const isDashboardPage = hideOnRoutes.some(route => location.pathname.startsWith(route));

  if (isDashboardPage) return null;

  return (
    <header className="fixed top-0 left-0 w-full z-[999] bg-white text-gray-900 h-16 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Auto<span className="text-blue-600">Service</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex space-x-6">
          <Link to="/" className="hover:text-blue-600 hover:underline">Home</Link>
          <Link to="/services" className="hover:text-blue-600 hover:underline">Services</Link>
          <Link to="/about" className="hover:text-blue-600 hover:underline">About</Link>
          <Link to="/contact" className="hover:text-blue-600 hover:underline">Contact</Link>
        </nav>

        {/* Auth Links */}
        <nav className="flex space-x-6">
          {user ? (
            <>
              {/* Role-Based Navigation */}
              {user.role === "customer" && (
                <Link to="/customer" className="hover:text-blue-600">Dashboard</Link>
              )}
              {user.role === "employee" && user.is_active && (
                <Link to="/employee" className="hover:text-blue-600">Dashboard</Link>
              )}
              {user.role === "admin" && (
                <Link to="/admin" className="hover:text-blue-600">Admin</Link>
              )}

              <button
                onClick={logout}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition border border-blue-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
              <Link to="/signup" className="hover:text-blue-600">Signup</Link>
            </>
          )}
        </nav>

      </div>
    </header>
  );
}
