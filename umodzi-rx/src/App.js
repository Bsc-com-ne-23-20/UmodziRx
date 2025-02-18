
//app.js
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import "tailwindcss/tailwind.css";
//import LandingPage from "./components/Home";

const Home = lazy(() => import("./pages/Home"))
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Prescriptions = lazy(() => import("./pages/Prescriptions"));
const Verify = lazy(() => import("./pages/Verify"));
const Auth = lazy(() => import("./pages/Auth"));
const Login = lazy(() => import("./pages/Login")); // Add this line
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard")); // Add this line
const PharmacistDashboard = lazy(() => import("./pages/PharmacistDashboard")); // Add this line

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
        <Navbar />
        <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} /> {/* Add this line */}
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} /> {/* Add this line */}
            <Route path="/pharmacist-dashboard" element={<PharmacistDashboard />} /> {/* Add this line */}
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;