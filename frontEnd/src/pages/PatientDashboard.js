import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockPrescriptions = [
  {
    id: 1, // Example prescription ID
    medication: 'Paracetamol',
    dosage: '500mg',
    instructions: 'Take once daily',
  },
  {
    id: 2,
    medication: 'Ibuprofen',
    dosage: '400mg',
    instructions: 'Take twice daily',
  },
];

export default function Dashboard() {
  const navigate = useNavigate(); // Initialize useNavigate
  const patientName = localStorage.getItem('patientName') || 'Dashboard'; // Get patient's name
  const [showPrescriptions, setShowPrescriptions] = useState(false); // State to toggle prescriptions visibility

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('userRole'); // Remove userRole from localStorage
    localStorage.removeItem('patientName'); // Remove patient's name from localStorage
    navigate('/'); // Redirect to the login page
  };

  // Toggle prescriptions visibility
  const togglePrescriptions = () => {
    setShowPrescriptions(!showPrescriptions);
  };

  return (
    <div className="container mx-auto p-8">
      {/* Logout Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Logout
        </button>
      </div>

      <h2 className="text-2xl font-bold">{patientName} Dashboard</h2>

      {/* Prescription Button */}
      <div className="mt-6">
        <button
          onClick={togglePrescriptions}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {showPrescriptions ? 'Hide Prescriptions' : 'View Prescriptions'}
        </button>
      </div>

      {/* Display mock prescriptions */}
      {showPrescriptions && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Prescriptions</h3>
          <ul>
            {mockPrescriptions.map((prescription) => (
              <li key={prescription.id} className="mb-2 p-4 bg-gray-50 rounded-lg">
                <p><strong>Medication:</strong> {prescription.medication}</p>
                <p><strong>Dosage:</strong> {prescription.dosage}</p>
                <p><strong>Instructions:</strong> {prescription.instructions}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}