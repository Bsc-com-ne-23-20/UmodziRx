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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-gray-600 mt-1">Welcome to your health dashboard</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="font-medium text-gray-800">
                  {patientInfo?.patientName || 'Patient'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {/* Patient Info Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800">
              <h2 className="text-xl font-semibold text-white">Patient Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Patient ID</p>
                  <p className="text-lg font-semibold text-gray-800 mt-1">{patientInfo?.patientId || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold text-gray-800 mt-1">{patientInfo?.patientName || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Prescription Count</p>
                  <p className="text-lg font-semibold text-gray-800 mt-1">{prescriptions.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prescriptions Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800">
              <h2 className="text-xl font-semibold text-white">Prescription History</h2>
            </div>
            <div className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : prescriptions.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No prescriptions found</h3>
                  <p className="mt-1 text-gray-500">You don't have any prescriptions yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((prescription, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Medication</p>
                          <p className="mt-1 font-semibold text-blue-600">{prescription.medicationName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Dosage</p>
                          <p className="mt-1 font-semibold">{prescription.dosage}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Instructions</p>
                          <p className="mt-1 font-semibold">{prescription.instructions}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Prescribed On</p>
                          <p className="mt-1 font-semibold">
                            {new Date(prescription.timestamp).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Prescribed By</p>
                          <p className="mt-1 font-semibold">Dr. {prescription.doctorId}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-500">Additional Notes</p>
                        <p className="mt-1 text-gray-700">{prescription.notes || 'No additional notes'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
