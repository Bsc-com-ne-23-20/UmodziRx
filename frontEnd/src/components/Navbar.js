import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
    localStorage.clear();
  };

  // Define all protected routes
  const protectedRoutes = ["/admin", "/doctor", "/pharmacist", "/patient", "/view-patient-prescriptions"];

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.includes(location.pathname);

  return (
    <nav className="bg-blue-400 shadow fixed top-0 w-full z-10">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white font-bold text-xl hover:text-blue-100">
              UmodziRx
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 ml-auto">
            <Link
              to="/"
              className="text-white hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link>
            {authState.token && isProtectedRoute ? (
              <button
                onClick={handleLogout}
                className="text-white hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-white hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
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
