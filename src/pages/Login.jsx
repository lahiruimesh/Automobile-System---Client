import { useState } from "react";
import { login as loginAPI } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/loginbg2.png";


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
      console.log(res.data.user);
      login(res.data.user);

      localStorage.setItem("token", res.data.token); 

      if (res.data.user.role === "customer") navigate("/customer");
      else if (res.data.user.role === "employee" && res.data.is_active)
        navigate("/employee");
      else if (res.data.user.role === "employee" && !res.data.is_active)
        navigate("/pending");
      else if (res.data.user.role === "admin") navigate("/admin");
    } catch (err) {
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
      <div className="flex-col mt-4 justify-center p-24">
        <form
          onSubmit={handleSubmit}
          className="p-4 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-600">
            Login
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
