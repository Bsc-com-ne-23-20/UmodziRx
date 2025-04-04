import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/home");
  };

  // Define all protected routes
  const protectedRoutes = ["/admin", "/doctor", "/pharmacist", "/patient", "/view-patient-prescriptions"];

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.includes(location.pathname);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-blue-800 dark:text-white font-bold text-xl">
              UmodziRx
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 ml-auto">
            <Link
              to="/"
              className="text-blue-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              Home
            </Link>
            {authState.token && isProtectedRoute ? (
              <button
                onClick={handleLogout}
                className="text-blue-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-blue-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
