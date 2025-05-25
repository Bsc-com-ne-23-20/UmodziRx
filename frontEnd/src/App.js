import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ViewPatientPrescriptions from "./pages/ViewPatientPrescriptions";
import PatientPrescriptions from "./pages/PatientDashboard";
import Unauthorized from "./pages/Unauthorized";
import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute"; 
import SessionExpired from './pages/SessionExpired';
import NewDoctorDashboard from './pages/NewDoctorDashboard';
import NewAdminDashboard from './pages/NewAdminDashboard';
import Learn from './pages/LearnMore';
import NewPharmacistDashboard from "./pages/NewPharmacistDashboard";
import NewPatientDashboard from './pages/NewPatientDashboard';
import Contact from './pages/Contact';
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
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/session-expired" element={<SessionExpired />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/callback" element={<AuthCallback />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/contact" element={<Contact />} />

            <Route element={<ProtectedRoute allowedRoles={["admin", "doctor", "pharmacist", "patient"]} />}>
              <Route path="/admin" element={<NewAdminDashboard />} />
              {/* <Route path="/admin/dashboard" element={<NewAdminDashboard />} /> */}
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
              <Route path="/doctor" element={<NewDoctorDashboard />} />
              <Route path="/doctor/prescriptions" element={<NewDoctorDashboard />} />
              <Route path="/doctor/schedule" element={<NewDoctorDashboard />} />
              <Route path="/doctor/new-prescription" element={<ViewPatientPrescriptions />} />
              <Route path="/doctor/patient/:id" element={<ViewPatientPrescriptions />} />
              <Route path="/doctor/appointment/:id" element={<ViewPatientPrescriptions />} />
              <Route path="/view-patient-prescriptions" element={<ViewPatientPrescriptions />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["pharmacist"]} />}>
              <Route path="/pharmacist" element={<NewPharmacistDashboard />} />
              <Route path="/pharmacist/dashboard" element={<NewPharmacistDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
              <Route path="/patient" element={<NewPatientDashboard />} />
            </Route>

            {/* <Route path="*" element={<Navigate to="/login" replace />} />
            <Route path="/" element={<Navigate to="/login" replace />} /> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;