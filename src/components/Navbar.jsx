import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileDrawer from "../components/ProfileDrawer";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-sky-500 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Auto<span className="text-yellow-300">Service</span>
        </Link>

        {/* Main Navigation */}
        <nav className="flex space-x-6">
          <Link to="/" className="hover:underline hover:text-yellow-300">Home</Link>
          <Link to="/services" className="hover:underline hover:text-yellow-300">Services</Link>
          <Link to="/about" className="hover:underline hover:text-yellow-300">About</Link>
          <Link to="/contact" className="hover:underline hover:text-yellow-300">Contact</Link>
        </nav>

        {/* Right Side - Auth & Profile */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Dashboard Link by Role */}
              {user.role === "customer" && (
                <Link to="/customer" className="hover:text-yellow-300">Dashboard</Link>
              )}
              {user.role === "employee" && user.is_active && (
                <Link to="/employee" className="hover:text-yellow-300">Dashboard</Link>
              )}
              {user.role === "admin" && (
                <Link to="/admin" className="hover:text-yellow-300">Admin</Link>
              )}

              {/* Profile Drawer */}
              <ProfileDrawer user={user} logout={logout} />
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300">Login</Link>
              <Link to="/signup" className="hover:text-yellow-300">Signup</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
