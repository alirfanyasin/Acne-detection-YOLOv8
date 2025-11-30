// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useContext(AuthContext);

  // Selama masih cek session, jangan apa-apain dulu
  if (authLoading) {
    return null; // atau bisa ganti dengan loading spinner
    // return <div className="text-center mt-10">Checking session...</div>;
  }

  // Kalau sudah selesai cek & user tetap null -> belum login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kalau sudah login
  return children;
}
