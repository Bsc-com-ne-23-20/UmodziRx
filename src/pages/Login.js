import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initiateAuth, verifyDigitalID, getAuthToken } from "../services/mosipAuth";
import QRCodeScanner from "../components/QRCodeScanner";


export default function Login() {
  const navigate = useNavigate();
  const [digitalId, setDigitalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDigitalIDSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Initiate MOSIP authentication
      await initiateAuth();
      
      // Verify Digital ID
      const verificationResponse = await verifyDigitalID(digitalId);
      
      // Get authentication token
      const tokenResponse = await getAuthToken(verificationResponse.authCode);
      
      // Store token and redirect
      localStorage.setItem("mosipToken", tokenResponse.access_token);
      navigate("/dashboard");
    } catch (error) {
      setError("Digital ID verification failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = async (data) => {
    setDigitalId(data);
    await handleDigitalIDSubmit(new Event("submit"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login with Digital ID</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleDigitalIDSubmit}>
          <div className="mb-4">
            <label htmlFor="digitalId" className="block text-gray-700 font-medium mb-2">
              Digital ID
            </label>
            <input
              type="text"
              id="digitalId"
              value={digitalId}
              onChange={(e) => setDigitalId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Digital ID"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">Or scan QR code</p>
          <QRCodeScanner onScan={handleQRScan} />
        </div>
      </div>
    </div>
  );
}
