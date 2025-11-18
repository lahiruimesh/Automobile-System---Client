import { useState, useEffect } from "react";
import { login as loginAPI } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import bgImage from "../assets/loginbg2.png";


export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the user type from navigation state
  const userType = location.state?.userType || 'customer';

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAPI(form);
      console.log('Login response:', res.data);
      
      // Add token to user object before saving
      const userWithToken = { ...res.data.user, token: res.data.token };
      login(userWithToken);

      localStorage.setItem("token", res.data.token); 

      // Route based on user role
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else if (res.data.user.role === "customer") {
        navigate("/customer");
      } else if (res.data.user.role === "employee") {
        // Check if employee is active
        if (res.data.user.isActive) {
          navigate("/employee");
        } else {
          navigate("/pending");
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Empty left side for illustration */}
      <div className="hidden lg:flex flex-1"></div>

      {/* Form on the right */}
      <div className="flex flex-col justify-center p-8 lg:p-24 pt-20">
        <form
          onSubmit={handleSubmit}
          className="p-4 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-600">
            Login to Your Account
          </h2>

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="backdrop-blur-md w-full px-4 py-4 mb-4 rounded-lg border bg-white/10 border-gray-200 shadow-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="backdrop-blur-md w-full px-4 py-4 mb-8 rounded-lg bg-white/10 border border-gray-200 shadow-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-sky-500 text-white font-semibold shadow-lg hover:bg-sky-600 transition"
          >
            Login
          </button>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-sky-600 cursor-pointer hover:underline"
            >
              Signup
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
