// src/pages/Login.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ✅ gunakan AuthContext DI DALAM component
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, api: null }));
  };

  const validate = () => {
    let newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email cannot be empty.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password cannot be empty.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrors((prev) => ({
          ...prev,
          api: data.message || "Login failed.",
        }));
        return;
      }

      setUser(data.data);
      navigate("/detection");
    } catch (err) {
      console.error("Error di handleSubmit login:", err);
      setErrors((prev) => ({
        ...prev,
        api: "Something went wrong. Please try again.",
      }));
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white">
        <div className="pb-0 relative min-h-screen overflow-hidden flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-xl px-10 py-10 border border-slate-200 w-full max-w-md">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">
              Log In
            </h1>
            <p className="text-black block text-lg font-normal mt-1">
              Acne Detection
            </p>

            {errors.api && (
              <p className="text-red-500 text-xs mt-2 text-center">
                {errors.api}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-slate-50 border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-400 ring-red-200"
                      : "border-slate-200 ring-blue-400"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-slate-50 border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-400 ring-red-200"
                      : "border-slate-200 ring-blue-400"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-2 hover:cursor-pointer px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-sky-400 hover:opacity-90 transition shadow-md"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-blue-600 hover:underline">
                Back to home
              </Link>
            </div>
          </div>

          <img
            src="/auth-wave.svg"
            alt=""
            className="pointer-events-none select-none absolute bottom-0 left-0 w-full object-cover"
          />
        </div>
      </div>
    </>
  );
}
