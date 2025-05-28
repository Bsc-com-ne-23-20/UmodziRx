import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = ({ darkMode = false }) => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [patientInfo, setPatientInfo] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Dark mode classes
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50';
  const cardBgClass = darkMode ? 'bg-gray-800' : 'bg-white/90';
  const textClass = darkMode ? 'text-gray-200' : 'text-gray-800';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const infoCardBg = darkMode ? 'bg-gray-700' : 'bg-blue-50';
  const infoCardBorder = darkMode ? 'border-gray-600' : 'border-blue-100';
  const tableHeaderBg = darkMode ? 'bg-gray-700' : 'bg-gray-50';
  const tableRowBg = darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50';
  const buttonClass = darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  const modalBg = darkMode ? 'bg-gray-800' : 'bg-white';

  const fetchData = async () => {
    const patientId = localStorage.getItem('patientId') || localStorage.getItem('pharmaId');
    if (!patientId) {
      setError('No patient or pharmacist ID found. Please login again.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/patient/prescriptions`, {
        params: { patientId },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setPrescriptions(response.data.data.prescriptions || []);
      setPatientInfo({
        patientId: response.data.data.patientId || localStorage.getItem('pharmaId') || localStorage.getItem('patientId'),
        patientName: response.data.data.patientName || localStorage.getItem('pharmaName') || localStorage.getItem('patientName')
      });
      setSuccessMessage('Data loaded successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch prescriptions');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openPrescriptionModal = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionModal(true);
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
    </div>
  );

  const EmptyState = () => (
    <div className={`text-center py-12 ${textClass}`}>
      <svg className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 className="mt-2 text-lg font-medium">No prescriptions found</h3>
      <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>You don't have any prescriptions yet.</p>
    </div>
  );

  return (
    <div className={`min-h-screen p-4 ${bgClass}`}>
      <div className={`max-w-7xl mx-auto rounded-xl shadow-xl overflow-hidden backdrop-blur-sm ${cardBgClass}`}>
        {/* Patient Name - Top Right Corner */}
        <div className="absolute top-6 right-6">
          <div className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
            {patientInfo?.patientName || 'Patient'}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {successMessage && (
            <div className={`border-l-4 p-4 mb-6 rounded ${darkMode ? 'bg-green-900 border-green-600 text-green-200' : 'bg-green-100 border-green-500 text-green-700'}`}>
              <p>{successMessage}</p>
            </div>
          )}
          {error && (
            <div className={`border-l-4 p-4 mb-6 rounded ${darkMode ? 'bg-red-900 border-red-600 text-red-200' : 'bg-red-100 border-red-500 text-red-700'}`}>
              <p>{error}</p>
            </div>
          )}

          {/* Patient Info Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-lg border ${infoCardBg} ${infoCardBorder}`}>
                <p className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Patient ID</p>
                <p className={`text-xl font-semibold mt-2 ${textClass}`}>{patientInfo?.patientId || 'N/A'}</p>
              </div>
              <div className={`p-6 rounded-lg border ${infoCardBg} ${infoCardBorder}`}>
                <p className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Full Name</p>
                <p className={`text-xl font-semibold mt-2 ${textClass}`}>{patientInfo?.patientName || 'N/A'}</p>
              </div>
              <div className={`p-6 rounded-lg border ${infoCardBg} ${infoCardBorder}`}>
                <p className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Prescription Count</p>
                <p className={`text-xl font-semibold mt-2 ${textClass}`}>{prescriptions.length}</p>
              </div>
            </div>
          </div>

          {/* Prescriptions Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className={`text-lg font-semibold ${textClass}`}>Prescription History</h3>
              <button
                onClick={fetchData}
                disabled={loading}
                className={`px-4 py-2 rounded-lg transition-colors ${buttonClass}`}
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : prescriptions.length > 0 ? (
              <div className={`overflow-hidden border rounded-lg ${borderClass}`}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={tableHeaderBg}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Medication</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Dosage</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Prescribed On</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Doctor</th>
                      <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {prescriptions.map((prescription, index) => (
                      <tr key={index} className={tableRowBg}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {prescription.medicationName}
                          </div>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          {prescription.dosage}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          {new Date(prescription.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          Dr. {prescription.doctorId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openPrescriptionModal(prescription)}
                            className={`p-1 rounded ${darkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-700' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'}`}
                            title="View Details"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      {/* Prescription Detail Modal */}
      {showPrescriptionModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg shadow-xl max-w-md w-full ${modalBg}`}>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Prescription Details</h3>
                <button
                  onClick={() => setShowPrescriptionModal(false)}
                  className={darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { label: 'Medication', value: selectedPrescription.medicationName },
                  { label: 'Dosage', value: selectedPrescription.dosage },
                  { label: 'Instructions', value: selectedPrescription.instructions },
                  { 
                    label: 'Prescribed On', 
                    value: new Date(selectedPrescription.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  },
                  { label: 'Prescribed By', value: `Dr. ${selectedPrescription.doctorId}` },
                  { label: 'Additional Notes', value: selectedPrescription.notes || 'No additional notes' }
                ].map((item) => (
                  <div key={item.label}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</p>
                    <p className={`mt-1 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPrescriptionModal(false)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;