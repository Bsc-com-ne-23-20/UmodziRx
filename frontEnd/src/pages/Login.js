import React, { useState, useCallback, lazy } from "react";
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const credentials = {
        doctor: { username: "doctor", password: "doctor", role: "doctor", redirect: "/doctor-dashboard" },
        pharmacist: { username: "pharmacist", password: "pharmacist", role: "pharmacist", redirect: "/pharmacist-dashboard" },
        patient: { username: "patient", password: "patient", role: "patient", redirect: "/patient-prescriptions" }
      };

      const user = Object.values(credentials).find(
        cred => cred.username === username && cred.password === password
      );

      if (user) {
        localStorage.setItem("userRole", user.role);
        navigate(user.redirect);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [username, password, navigate]);

  const handleQRScan = useCallback(async (data) => {
    try {
      const qrData = JSON.parse(data);
      if (qrData.username && qrData.password) {
        setUsername(qrData.username);
        setPassword(qrData.password);
        await handleLoginSubmit(new Event("submit"));
      } else {
        throw new Error("Invalid QR code data");
      }
    } catch (error) {
      setError("Failed to process QR code. Please try again.");
      console.error(error);
    }
  }, [handleLoginSubmit]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 max-w-4xl w-full">
          {/* Left Section - Avatar and MOSIP Info */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div 
              className="w-50 h-50 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
              aria-label="User avatar"
            >
              <svg 
                className="w-40 h-40 text-blue-600 dark:text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">MOSIP Integration</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                MOSIP provides secure identity solutions for our digital prescription system.
              </p>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Login</h2>
            
            {error && (
              <div className="bg-red-100 dark:bg-red-200 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-7 00 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  aria-label="Username"
                  aria-required="true"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  aria-label="Password"
                  aria-required="true"
                  value="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter password"
                  required
                />
              </div>

              <button
                type="submit"
                aria-label="Submit login form"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 text-sm"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="my-4 flex items-center">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="mx-3 text-gray-500 dark:text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>

            <button
              onClick={() => alert("This feature is under development")}
              aria-label="Login with inji or esignet"
              className="w-full bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-white px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
            >
              Login with inji or esignet
            </button>


            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                New user? <span className="text-blue-600 dark:text-blue-400 cursor-not-allowed">Create credentials</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
