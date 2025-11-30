import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // handle perubahan input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // validasi FE
  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name cannot be empty.";
    }

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

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number cannot be empty.";
    } else if (!/^[0-9]+$/.test(form.phone)) {
      newErrors.phone = "Phone number must contain only digits.";
    } else if (form.phone.length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // valid jika tidak ada error
  };

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors((prev) => ({
          ...prev,
          api: data.message || "Register failed.",
        }));
        return;
      }

       navigate("/login");
      
    } catch (err) {
      console.error(err);
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

          <div className="bg-white rounded-3xl shadow-xl px-10 py-10 border border-slate-200 w-full max-w-md z-10">

            {/* Title */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">
              Register
            </h1>

            <p className="pt-2 text-black block text-lg font-normal">
              Acne Detection
            </p>

            {errors.api && (
              <p className="text-red-500 text-xs mt-2 text-center">{errors.api}</p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              {/* Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-slate-50 border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                    errors.name ? "border-red-400 ring-red-200" : "border-slate-200 ring-blue-400"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-slate-50 border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                    errors.email ? "border-red-400 ring-red-200" : "border-slate-200 ring-blue-400"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
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
                    errors.password ? "border-red-400 ring-red-200" : "border-slate-200 ring-blue-400"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-slate-50 border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                    errors.phone ? "border-red-400 ring-red-200" : "border-slate-200 ring-blue-400"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-4 hover:cursor-pointer px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-sky-400 hover:opacity-90 transition shadow-md"
              >
                Register
              </button>
            </form>

            {/* Back to home */}
            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-blue-600 hover:underline">
                Back to home
              </Link>
            </div>
          </div>

          {/* Wave */}
          <img
            src="/auth-wave.svg"
            className="pointer-events-none select-none absolute bottom-0 left-0 w-full object-cover z-0"
          />
        </div>
      </div>
    </>
  );
}