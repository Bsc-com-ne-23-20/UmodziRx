import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ViewPatientPrescriptions from "./pages/ViewPatientPrescriptions";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import PatientPrescriptions from "./pages/PatientDashboard";
import LearnMore from "./pages/LearnMore";
import UserProfile from "./pages/UserProfile";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import AuthCallback from "./pages/AuthCallback";
import "./App.css";

function App() {
  const [darkMode] = useState(false);

  useEffect(() => {

    console.log('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      API_URL: process.env.REACT_APP_API_BASE_URL
    });
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      console.log('Environment:', {
        NODE_ENV: process.env.NODE_ENV,
        API_URL: process.env.REACT_APP_API_BASE_URL
      });
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <AuthProvider>
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
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/callback" element={<AuthCallback />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
                <Route path="/doctor" element={<DoctorDashboard />} />
                <Route path="/view-patient-prescriptions" element={<ViewPatientPrescriptions />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["pharmacist"]} />}>
                <Route path="/pharmacist" element={<PharmacistDashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
                <Route path="/patient" element={<PatientPrescriptions />} />
              </Route>

              {/* Redirect all unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;