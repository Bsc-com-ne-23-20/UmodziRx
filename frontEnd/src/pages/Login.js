import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import eSignetIcon from "./esignet.png";
import prescriptionImage from "./Prescription_medication.jpeg";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleLoginSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }
  
      const data = await response.json();
      const { token, redirect,role} = data; // Get `redirect` from backend response
  
      //Store authentication details
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role); // Store user role

      console.log("Stored Token:", localStorage.getItem("token"));
      console.log("Stored Role:", localStorage.getItem("userRole"));


  
      // Redirect user to the correct dashboard

      navigate(redirect);
      

    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [username, password, navigate]);
  







  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center px-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 max-w-4xl w-full">
        {/* Left Section - Prescription Image and MOSIP Info */}
        <div className="flex flex-col items-center justify-center space-y-8 bg-white shadow-md rounded-2xl p-8">
          <img 
            src={prescriptionImage} 
            alt="Prescription and Medication" 
            className="w-64 h-64 object-cover rounded-full" // Enlarged avatar
          />
          <div className="text-center"> 
            <h2 className="block text-teal-600 dark:text-teal-400 text-3xl font-bold mt-4">UmodziRx</h2>
            <p className=" block text-lg text-teal-600 max-w-xs font-bold mt-2">
              Secure Prescription Management.
            </p>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-teal-700 text-center">Login</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                aria-label="Username"
                aria-required="true"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 bg-gray-50"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                aria-label="Password"
                aria-required="true"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 bg-gray-50"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              aria-label="Submit login form"
              disabled={loading}
              className="w-full bg-teal-600 text-white px-3 py-2 rounded-lg hover:bg-teal-700 transition duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider with "or" */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-sm text-gray-500">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* Login with eSignet Button */}
          <div className="text-center">
            <button
              className="w-full bg-gray-200 text-teal-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center justify-center"
              onClick={() => alert("Login with eSignet is under development")}
            >
              <img src={eSignetIcon} alt="eSignet" className="w-6 h-6 mr-2" />
              Login with eSignet
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              New user? {" "}
              <button
                onClick={() => navigate("/register")}
                className="text-teal-600 hover:underline"
              >
                Create credentials
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;