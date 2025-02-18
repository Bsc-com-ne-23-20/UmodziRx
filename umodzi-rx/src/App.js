import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Footer from "./pages/Footer";
import "tailwindcss/tailwind.css";

const Home = lazy(() => import("./pages/Home"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Prescriptions = lazy(() => import("./pages/Prescriptions"));
const Verify = lazy(() => import("./pages/Verify"));
const Auth = lazy(() => import("./pages/Auth"));
const Login = lazy(() => import("./pages/Login"));
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard"));
const PharmacistDashboard = lazy(() => import("./pages/PharmacistDashboard"));

function App() {
  return (
    <Router>
      {/* Ensure flexbox fills full screen height */}
      <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
        <Navbar />
        
        {/*  Content should grow to push footer down */}
        <div className="flex-grow">
          <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/prescriptions" element={<Prescriptions />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/doctordashboard" element={<DoctorDashboard />} />
              <Route path="/pharmacistdashboard" element={<PharmacistDashboard />} />
            </Routes>
          </Suspense>
        </div>

        {/* ✅ Footer stays at the bottom */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
