import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleDoctorLogin = () => {
    navigate("/doctor-dashboard"); // Redirect to doctor dashboard
  };

  const handlePharmacistLogin = () => {
    navigate("/pharmacist-dashboard"); // Redirect to pharmacist dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-6">Login </h2>
        <p className="text-gray-600 mb-6">Please select your role to continue.</p>
        <div className="space-y-4">
          <button
            onClick={handleDoctorLogin}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Doctor
          </button>
          <button
            onClick={handlePharmacistLogin}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Pharmacist
          </button>
        </div>
      </div>
    </div>
  );
}