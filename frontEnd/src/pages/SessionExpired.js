import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SessionExpired = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogin = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Session Expired</h1>
        <p className="mb-6">Your session has expired. Please log in again to continue.</p>
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};

export default SessionExpired;