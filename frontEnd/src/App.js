import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import ViewPatientPrescriptions from "./pages/ViewPatientPrescriptions";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import PatientPrescriptions from "./pages/PatientDashboard";
import Unauthorized from "./pages/Unauthorized";
import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute"; 
import ModernDoctorDashboard from "./pages/ModernDoctorDashboard";
import ModernAdminDashboard from './pages/ModernAdminDashboard';
import SessionExpired from './pages/SessionExpired';
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
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background dark:bg-background-dark">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/session-expired" element={<SessionExpired />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/callback" element={<AuthCallback />} />

            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<ModernAdminDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
              <Route path="/doctor" element={<ModernDoctorDashboard />} />
              <Route path="/doctor/prescriptions" element={<ModernDoctorDashboard />} />
              <Route path="/doctor/schedule" element={<ModernDoctorDashboard />} />
              <Route path="/doctor/new-prescription" element={<ViewPatientPrescriptions />} />
              <Route path="/doctor/patient/:id" element={<ViewPatientPrescriptions />} />
              <Route path="/doctor/appointment/:id" element={<ViewPatientPrescriptions />} />
              <Route path="/view-patient-prescriptions" element={<ViewPatientPrescriptions />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["pharmacist"]} />}>
              <Route path="/pharmacist" element={<PharmacistDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
              <Route path="/patient" element={<PatientPrescriptions />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;