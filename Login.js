import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

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

  const handleRegisterSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Registering user:", { newUsername, newPassword });
      setNewUsername("");
      setNewPassword("");
      setIsRegistering(false);
      alert("Registration successful! You can now log in.");
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [newUsername, newPassword]);

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
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{isRegistering ? "Register" : "Login"}</h2>
            
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">{isRegistering ? "New Username" : "Username"}</label>
                <input
                  type="text"
                  value={isRegistering ? newUsername : username}
                  onChange={(e) => isRegistering ? setNewUsername(e.target.value) : setUsername(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">{isRegistering ? "New Password" : "Password"}</label>
                <input
                  type="password"
                  value={isRegistering ? newPassword : password}
                  onChange={(e) => isRegistering ? setNewPassword(e.target.value) : setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? "Processing..." : isRegistering ? "Register" : "Login"}
              </button>
            </form>

            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full text-blue-500 mt-4"
            >
              {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

