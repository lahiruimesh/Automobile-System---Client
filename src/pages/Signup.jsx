import { useState } from "react";
import { signup as signupAPI } from "../api/auth";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/signupbg.png"; // your background image

export default function Signup() {
  const [form, setForm] = useState({
    fullName: "",
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
    <div
      className="flex min-h-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Form on the left */}
      <div className="flex flex-1 mt-16 justify-center">
        <form
          onSubmit={handleSubmit}
          className="p-2 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-600">
            Signup
          </h2>

          <input
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            className="backdrop-blur-md w-full px-4 py-4 mb-4 rounded-lg border bg-white/10 border-gray-200 shadow-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

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
            className="backdrop-blur-md w-full px-4 py-4 mb-4 rounded-lg border bg-white/10 border-gray-200 shadow-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <div className="flex gap-4 mb-8">
            <input
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                className="backdrop-blur-md flex-1 px-4 py-4 rounded-lg border bg-white/10 border-gray-200 shadow-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />

            <select
                name="role"
                onChange={handleChange}
                className="backdrop-blur-md flex-1 px-4 py-4 rounded-lg border bg-white/10 border-gray-200 shadow-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
                <option value="customer">Customer</option>
                <option value="employee">Employee</option>
            </select>
            </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-sky-500 text-white font-semibold shadow-lg hover:bg-sky-600 transition"
          >
            Signup
          </button>

          <p className="text-sm text-gray-600 mt-3 text-center">
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

      {/* Right side empty for illustration */}
      <div className="hidden lg:flex flex-1"></div>
    </div>
  );
}
