import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientContent = ({ activeView }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const patientId = localStorage.getItem('patientId');
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/patient/prescriptions`, {
        params: { patientId },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPrescriptions(response.data.data.prescriptions || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'prescriptions') {
      fetchPrescriptions();
    }
  }, [activeView]);

  const renderPrescriptions = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {prescriptions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Medication</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Dosage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {prescriptions.map((prescription, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{prescription.medicationName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{prescription.dosage}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(prescription.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {prescription.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No prescriptions found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderMedicalRecords = () => (
    <div className="text-center py-8">
      <p className="text-gray-500 dark:text-gray-400">Medical records feature coming soon</p>
    </div>
  );

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}
      
      {activeView === 'prescriptions' && renderPrescriptions()}
      {activeView === 'records' && renderMedicalRecords()}
    </div>
  );
};

export default PatientContent;
