import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';

const FindHealthcare = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Find Healthcare Near You</h2>
      <p className="mb-8 text-gray-600 dark:text-gray-300">Quickly locate the nearest hospital or pharmacy in your area.</p>
      <div className="flex gap-6">
        <button
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors text-lg font-medium"
          onClick={() => navigate('/find-healthcare/hospitals')}
        >
          <FiMapPin className="mr-2 h-5 w-5" />
          Nearest Hospital
        </button>
        <button
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors text-lg font-medium"
          onClick={() => navigate('/find-healthcare/pharmacies')}
        >
          <FiMapPin className="mr-2 h-5 w-5" />
          Nearest Pharmacy
        </button>
      </div>
    </div>
  );
};

export default FindHealthcare;
