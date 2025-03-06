import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
<<<<<<< HEAD:src/App.js
import Register from "./pages/Register";
=======
import { TABS } from "./pages/Constants";
import ViewPatientPrescriptions from "./pages/ViewPatientPrescriptions";
import CreatePrescription from "./pages/CreatePrescription";
>>>>>>> 69fa803abfc50bdd4cfd42cd2639563d9b18d8c2:frontEnd/src/App.js
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
<<<<<<< HEAD:src/App.js
            <Route path="/register" element={<Register />} />
=======
            <Route path="/view-patient-prescriptions" element={<ViewPatientPrescriptions />} />
            <Route path="/create-prescription" element={<CreatePrescription />} />
>>>>>>> 69fa803abfc50bdd4cfd42cd2639563d9b18d8c2:frontEnd/src/App.js
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
