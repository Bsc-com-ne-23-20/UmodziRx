import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);

  useEffect(() => {
    
    const fetchPrescriptions = async () => {
      // Try to get patientId, fallback to pharmacistId
      const patientId = localStorage.getItem('patientId') || localStorage.getItem('pharmaId');
      if (!patientId) {
        setError('No patient or pharmacist ID found. Please login again.');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/patient/prescriptions`, {
          params: { patientId }
        });

        setPrescriptions(response.data.data.prescriptions || []);

        // Use patient or pharmacist name & ID
        setPatientInfo({
          patientId: response.data.data.patientId || localStorage.getItem('pharmaId') || localStorage.getItem('patientId'),
          patientName: response.data.data.patientName || localStorage.getItem('pharmaName') || localStorage.getItem('patientName')
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch prescriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('Login');
    localStorage.removeItem('patientId');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Patient Portal</h1>
          <div className="flex items-center space-x-4">
            <span className="text-1xl font-bold text-gray-800">
              {patientInfo?.patientName || 'Patient'}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">My Prescriptions</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-center">Loading prescriptions...</p>
          ) : prescriptions.length === 0 ? (
            <p className="text-gray-500">No prescriptions found</p>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-gray-600">Patient ID:</p>
                    <p className="font-medium">{patientInfo?.patientId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Patient Name:</p>
                    <p className="font-medium">{patientInfo?.patientName || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Prescription History</h3>
                {prescriptions.map((prescription, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-gray-600">Medication:</p>
                        <p className="font-medium">{prescription.medicationName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Dosage:</p>
                        <p className="font-medium">{prescription.dosage}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Instructions:</p>
                        <p className="font-medium">{prescription.instructions}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Prescribed On:</p>
                        <p className="font-medium">
                          {new Date(prescription.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-600">Prescribed By:</p>
                      <p className="font-medium">Dr. {prescription.doctorId}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
