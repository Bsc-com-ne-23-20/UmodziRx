import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("All fields are required!");
      return;
    }

    // Save user data (In real implementation, send this to the backend)
    const newUser = { username, password, role };
    localStorage.setItem("newUser", JSON.stringify(newUser));

    alert("User registered successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Create Account</h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-200 text-red-700 p-2 rounded text-sm mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="doctor">Doctor</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="patient">Patient</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-3 text-blue-600 dark:text-blue-400 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default Register;
