import React from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login"); // Replace "/login" with the actual path of your login page
  };

  return (
    <div className="container mx-auto p-8 text-center">
      <h2 className="text-2xl font-bold">User Authentication</h2>
      <p className="mt-4">Secure login and authentication using MOSIP digital IDs.</p>
      <button
        onClick={handleLoginRedirect}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Go to Login 
      </button>
    </div>
  );
}