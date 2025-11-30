import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import History from "./pages/History";
import AcneDetection from "./pages/AcneDetection";
import EditProfile from "./pages/EditProfile";

import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* homepage default */}
        <Route path="/" element={<Home />} />

        {/* ==== HANYA UNTUK YANG BELUM LOGIN ==== */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        {/* ==== HANYA UNTUK YANG SUDAH LOGIN ==== */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route
          path="/detection"
          element={
            <ProtectedRoute>
              <AcneDetection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        {/* kalau path nggak dikenal, tetap arahkan ke Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
