import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ViewPatientPrescriptions from "./pages/ViewPatientPrescriptions";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import PatientPrescriptions from "./pages/PatientPrescriptions";
import LearnMore from "./pages/LearnMore";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import "./App.css";

function App() {
  const [darkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-background dark:bg-background-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/register" element={<Register />} />


            {/* Protected Routes (Require Authentication) */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
              <Route path="/doctor" element={<DoctorDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["pharmacist"]} />}>
              <Route path="/pharmacist" element={<PharmacistDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
              <Route path="/patient" element={<PatientPrescriptions />} />
              <Route path="/view-patient-prescriptions" element={<ViewPatientPrescriptions />} />
            </Route>

            {/* Redirect all unknown routes to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
