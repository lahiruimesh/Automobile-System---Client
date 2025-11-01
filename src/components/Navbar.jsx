import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Hide navbar on dashboard pages - they have their own headers
  const dashboardPages = ['/employee', '/admin'];
  const isProfilePage = location.pathname.startsWith('/employee/profile');
  
  if (dashboardPages.includes(location.pathname) || isProfilePage) {
    return null;
  }

  return (
    // !!! --- CHANGES APPLIED: 'fixed top-0 left-0 w-full z-50' --- !!!
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent text-gray-900 h-16 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Auto<span className="text-blue-600">Service</span>
        </Link>

        {/* Navigation - Primary Links */}
        <nav className="flex space-x-6">
          <Link to="/" className="hover:underline hover:text-blue-600">
            Home
          </Link>
          <Link to="/services" className="hover:underline hover:text-blue-600">
            Services
          </Link>
          <Link to="/about" className="hover:underline hover:text-blue-600">
            About
          </Link>
          <Link to="/contact" className="hover:underline hover:text-blue-600">
            Contact
          </Link>
        </nav>

        {/* Navigation - Auth Links */}
        <nav className="flex space-x-6">
          {user ? (
            <>
              {user.role === "customer" && (
                <Link to="/customer" className="hover:text-blue-600">
                  Dashboard
                </Link>
              )}
              {user.role === "employee" && user.is_active && (
                <Link to="/employee" className="hover:text-blue-600">
                  Dashboard
                </Link>
              )}
              {user.role === "admin" && (
                <Link to="/admin" className="hover:text-blue-600">
                  Admin
                </Link>
              )}
              <ProfileDrawer user={user} logout={logout} />
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>
              <Link to="/signup" className="hover:text-blue-600">
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}