import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ViewPatientPrescriptions from "./pages/ViewPatientPrescriptions";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Unauthorized from "./pages/Unauthorized";
import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute"; 
import SessionExpired from './pages/SessionExpired';
import NewDoctorDashboard from './pages/NewDoctorDashboard';
import NewAdminDashboard from './pages/NewAdminDashboard';
import Learn from './pages/LearnMore';
import BaseDashboard from "./components/BaseDashboard";
import { FiHome } from "react-icons/fi"; // Import required icons
import "./App.css";

// Wrapper component for Patient Dashboard
const PatientDashboardWrapper = () => {
  const navigate = useNavigate();
  
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: FiHome,
      onClick: () => navigate('/patient')
    },
    // Add more navigation items as needed
  ];

  return (
    <BaseDashboard 
      title="Patient Dashboard"
      navItems={navItems}
      userInfo={{ name: localStorage.getItem('patientName') || 'Patient' }}
    >
      <PatientDashboard />
    </BaseDashboard>
  );
};

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

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<NewAdminDashboard />} />
            </Route>

            {/* Doctor Routes */}
            <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
              <Route path="/doctor" element={<NewDoctorDashboard />} />
              <Route path="/doctor/prescriptions" element={<NewDoctorDashboard />} />
              <Route path="/doctor/schedule" element={<NewDoctorDashboard />} />
              <Route path="/doctor/new-prescription" element={<ViewPatientPrescriptions />} />
              <Route path="/doctor/patient/:id" element={<ViewPatientPrescriptions />} />
              <Route path="/doctor/appointment/:id" element={<ViewPatientPrescriptions />} />
              <Route path="/view-patient-prescriptions" element={<ViewPatientPrescriptions />} />
            </Route>

            {/* Pharmacist Routes */}
            <Route element={<ProtectedRoute allowedRoles={["pharmacist"]} />}>
              <Route path="/pharmacist" element={<PharmacistDashboard />} />
            </Route>

            {/* Patient Routes with Wrapper */}
            <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
              <Route path="/patient" element={<PatientDashboardWrapper />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;