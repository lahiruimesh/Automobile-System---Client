import { useState } from "react";
import { signup as signupAPI } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer"
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signupAPI(form);
      alert(res.data.message);
      navigate("/"); // redirect to login after signup
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-md bg-white/80 border border-gray-200 shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Signup
        </h2>

        <input
          name="full_name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

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
          className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <select
          name="role"
          onChange={handleChange}
          className="w-full px-4 py-3 mb-6 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value="customer">Customer</option>
          <option value="employee">Employee</option>
        </select>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-sky-500 text-white font-semibold shadow-lg hover:bg-sky-600 transition"
        >
          Signup
        </button>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-sky-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
