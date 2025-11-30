import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

export default function EditProfile() {
  const { user, setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  // Saat user dari context sudah ada, isi form awal
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
        password: "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setSuccessMsg("");
    setErrors((prev) => ({ ...prev, api: null }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name cannot be empty.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number cannot be empty.";
    } else if (!/^[0-9]+$/.test(form.phone)) {
      newErrors.phone = "Phone number must contain only digits.";
    } else if (form.phone.length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits.";
    }

    // Password optional: kalau diisi, minimal 6 karakter
    if (form.password && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:5000/profile", {
        method: "PUT",
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
          api: data.message || "Failed to update profile.",
        }));
        return;
      }

      // update user di AuthContext supaya navbar & halaman lain ikut berubah
      setUser(data.data);

      setSuccessMsg("Profile updated successfully.");
      setForm((prev) => ({
        ...prev,
        password: "", // kosongkan field password setelah update
      }));
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

      <div className="min-h-screen bg-slate-50">
        <div className="pt-32 pb-16 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-xl px-8 py-10 border border-slate-200 w-full max-w-md">
            {/* Title */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">
              Edit Profile
            </h1>
            <p className="text-black block text-lg font-normal mt-1">
              Manage your account
            </p>

            {/* Success message */}
            {successMsg && (
              <p className="mt-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                {successMsg}
              </p>
            )}

            {/* Error dari API */}
            {errors.api && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {errors.api}
              </p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-slate-50 border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-400 ring-red-200"
                      : "border-slate-200 ring-blue-400"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-slate-50 border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? "border-red-400 ring-red-200"
                      : "border-slate-200 ring-blue-400"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-600">
                    New Password
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Leave blank if you don't want to change
                  </span>
                </div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <Link
                  to="/detection"
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-medium border border-slate-300 text-slate-600 bg-white hover:bg-slate-50 text-center flex items-center justify-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-sky-400 hover:opacity-90 transition shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
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
