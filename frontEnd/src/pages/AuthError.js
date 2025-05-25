import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthError = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const error = params.get('error');

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'missing_code':
        return 'Authorization code is missing. Please try verifying again.';
      case 'authentication_failed':
        return 'Authentication failed. Please try verifying again.';
      case 'invalid_redirect_uri':
        return 'Invalid redirect URI. Please contact system administrator.';
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-6">{getErrorMessage(error)}</p>
          <div className="space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthError;