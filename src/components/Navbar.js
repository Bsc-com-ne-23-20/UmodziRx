import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('userRole'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    navigate('/');
  };


  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

          <div className="flex">
            <div className="flex-shrink-0">
              <Link to="/" className="text-gray-800 dark:text-white font-bold text-xl">
                UmodziRx
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Login
                </Link>
              )}
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Logout
                </button>
              )}
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {userRole === 'doctor' && (
                <Link
                  to="/doctor-dashboard"
                  className="text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Doctor Dashboard
                </Link>
              )}
              {userRole === 'pharmacist' && (
                <Link
                  to="/pharmacist-dashboard"
                  className="text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Pharmacist Dashboard
                </Link>
              )}
              {userRole === 'patient' && (
                <Link
                  to="/patient-prescriptions"
                  className="text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  My Prescriptions
                </Link>
              )}
              <Link
                to="/learn-more"
                className="text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
