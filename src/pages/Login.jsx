import { useState } from "react";
import { login as loginAPI } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAPI(form);
      login(res.data);

      if (res.data.role === "customer") navigate("/customer");
      else if (res.data.role === "employee" && res.data.is_active)
        navigate("/employee");
      else if (res.data.role === "employee" && !res.data.is_active)
        navigate("/pending");
      else if (res.data.role === "admin") navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-md bg-white/80 border border-gray-200 shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Login
        </h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-4 py-3 mb-6 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
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
  );
}
