import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DoctorDashboard from "./pages/DoctorDashboard";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import PatientPrescriptions from "./pages/PatientPrescriptions";
import LearnMore from "./pages/LearnMore";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-background dark:bg-background-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/pharmacist-dashboard" element={<PharmacistDashboard />} />
            <Route path="/patient-prescriptions" element={<PatientPrescriptions />} />
            <Route path="/learn-more" element={<LearnMore />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
