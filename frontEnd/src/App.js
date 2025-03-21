import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ViewPatientPrescriptions from "./pages/ViewPatientPrescriptions";
import CreatePrescription from "./pages/CreatePrescription";
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
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/learn-more" element={<LearnMore />} />

            {/* Protected Routes (Require Authentication) */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/create-prescription" element={<CreatePrescription />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["pharmacist"]} />}>
              <Route path="/pharmacist-dashboard" element={<PharmacistDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
              <Route path="/patient-prescriptions" element={<PatientPrescriptions />} />
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
