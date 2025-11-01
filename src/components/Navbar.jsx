import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-sky-500 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Auto<span className="text-yellow-300">Service</span>
        </Link>

        {/* Navigation */}
        <nav className="flex space-x-6">
          <Link to="/" className="hover:underline hover:text-yellow-300">
            Home
          </Link>
          <Link to="/services" className="hover:underline hover:text-yellow-300">
            Services
          </Link>
          <Link to="/about" className="hover:underline hover:text-yellow-300">
            About
          </Link>
          <Link to="/contact" className="hover:underline hover:text-yellow-300">
            Contact
          </Link>
        </nav>

        {/* Navigation */}
        <nav className="flex space-x-6">
          {user ? (
            <>
              {user.role === "customer" && (
                <Link to="/customer" className="hover:text-yellow-300">
                  Dashboard
                </Link>
              )}
              {user.role === "employee" && user.is_active && (
                <Link to="/employee" className="hover:text-yellow-300">
                  Dashboard
                </Link>
              )}
              {user.role === "admin" && (
                <Link to="/admin" className="hover:text-yellow-300">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300">
                Login
              </Link>
              <Link to="/signup" className="hover:text-yellow-300">
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
