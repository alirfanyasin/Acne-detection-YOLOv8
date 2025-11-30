import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const isHome = path === "/";
  const isRegister = path === "/register";
  const isLogin = path === "/login";
  const isApp = path === "/detection" || path === "/history" || path === "/edit-profile";

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (isApp) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isApp]);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">

        {/* ---------- LOGO (PUBLIC FOLDER) ---------- */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo-acne.png"    // <- langsung akses dari folder public
            alt="Acne Detection Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* ---------- NAVBAR LANDING / AUTH ---------- */}
        {!isApp && (
          <>
            {isHome && (
              <div className="flex items-center gap-3">
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-full border border-blue-500 text-blue-500 text-sm font-medium hover:bg-blue-50 transition"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="px-9 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-sky-400 hover:opacity-90 transition"
                >
                  Login
                </Link>
              </div>
            )}

            {isRegister && (
              <Link
                to="/login"
                className="px-9 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-sky-400 hover:opacity-90 transition"
              >
                Login
              </Link>
            )}

            {isLogin && (
              <Link
                to="/register"
                className="px-6 py-2 rounded-full border border-blue-500 text-blue-500 text-sm font-medium hover:bg-blue-50 transition"
              >
                Register
              </Link>
            )}
          </>
        )}

        {/* ---------- NAVBAR HALAMAN APP (LOGIN AREA) ---------- */}
        {isApp && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 px-4 rounded-full text-blue-500 hover:bg-blue-50"
            >
              <div className="w-8 h-8 rounded-full border border-blue-400 flex items-center justify-center text-xs font-semibold">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              <span className="font-medium">
                {user?.name || "User"}
              </span>

            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-xl border border-slate-200 rounded-xl py-2">
                <Link
                  to="/edit-profile"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50"
                  onClick={() => setOpen(false)}
                >
                  Edit Profile
                </Link>

                <button
                  onClick={async () => {
                    // panggil API logout Flask
                    await fetch("http://localhost:5000/logout", {
                      method: "POST",
                      credentials: "include",
                    });

                    // hapus user dari context
                    setUser(null);

                    setOpen(false);
                    window.location.href = "/"; 

                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}