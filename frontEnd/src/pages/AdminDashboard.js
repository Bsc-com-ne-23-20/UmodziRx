import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  // Function to handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Logout Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Logout
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      <p className="text-gray-700">Welcome, Admin! Manage the system here.</p>

      {/* Admin Features as Buttons */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Admin Features</h2>
        <div className="space-y-2">
          <button
            onClick={() => handleNavigation("/admin/manage-users")}
            className="w-full bg-white p-4 rounded-lg shadow hover:bg-gray-50 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Manage Users
          </button>
          <button
            onClick={() => handleNavigation("/admin/system-logs")}
            className="w-full bg-white p-4 rounded-lg shadow hover:bg-gray-50 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            View System Logs
          </button>
          <button
            onClick={() => handleNavigation("/admin/configure-settings")}
            className="w-full bg-white p-4 rounded-lg shadow hover:bg-gray-50 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Configure Settings
          </button>
        </div>
      </div>
    </div>
  );
}