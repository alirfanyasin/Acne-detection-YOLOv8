// src/components/GuestRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function GuestRoute({ children }) {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return null; // atau spinner
  }

  // Kalau SUDAH login, jangan boleh ke login/register lagi
  if (user) {
    return <Navigate to="/detection" replace />;
  }

  // Kalau belum login, boleh akses halaman guest
  return children;
}
