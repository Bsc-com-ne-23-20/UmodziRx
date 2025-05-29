import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ViewPatientPrescriptions from "./pages/ViewPatientPrescriptions";
import Unauthorized from "./pages/Unauthorized";
import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute"; 
import SessionExpired from './pages/SessionExpired';
import Learn from './pages/LearnMore';
import Contact from './pages/Contact';
import VerifyPrescriptionPage from './pages/VerifyPrescriptionPage';
import Dashboard from './pages/Dashboard';
import FindHealthcare from './components/dashboard/patient/FindHealthcare';
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background dark:bg-background-dark">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/session-expired" element={<SessionExpired />} />            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/callback" element={<AuthCallback />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/verify-prescription/:id?" element={<VerifyPrescriptionPage />} />

            {/* Protected Routes with Role-Based Access Control */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/*" element={<Dashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
              <Route path="/doctor/*" element={<Dashboard />} />
              <Route path="/doctor/patient/:id" element={<ViewPatientPrescriptions />} />
              <Route path="/doctor/appointment/:id" element={<ViewPatientPrescriptions />} />
              <Route path="/view-patient-prescriptions" element={<ViewPatientPrescriptions />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["pharmacist"]} />}>
              <Route path="/pharmacist/*" element={<Dashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
              <Route path="/patient/*" element={<Dashboard />} />
            </Route>

            {/* Fallback routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;