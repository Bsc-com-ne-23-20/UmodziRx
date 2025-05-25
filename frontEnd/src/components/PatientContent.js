import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX, FiInfo } from 'react-icons/fi';

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
      if (!patientId) {
        setError('No patient ID found. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Fetch prescription history using the patient ID from localStorage
      const response = await axios.get(`http://localhost:5000/patient/prescriptions/history/${patientId}`);
      
      if (response.data.success) {
        // Check if we have prescriptions in the response data
        const prescriptionsData = response.data.data.history ? 
          // If history array exists, collect all prescriptions from all history entries
          response.data.data.history.flatMap(record => 
            Array.isArray(record.prescriptions) ? record.prescriptions : []
          ) :
          // Otherwise, check if prescriptions are directly in the data object 
          response.data.data.prescriptions || [];
        
        setPrescriptions(prescriptionsData);
        
        if (prescriptionsData.length === 0) {
          console.log('No prescriptions found in response:', response.data);
        }
      } else {
        throw new Error(response.data.error || 'Failed to fetch prescriptions');
      }
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'prescriptions') {
      fetchPrescriptions();
    }
  }, [activeView]);

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionModal(true);
  };

  const renderPrescriptions = () => (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <button 
          onClick={fetchPrescriptions}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Refresh Prescriptions
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
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
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            prescription.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            prescription.status === 'Dispensed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            prescription.status === 'Revoked' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {prescription.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <button
                            onClick={() => handleViewPrescription(prescription)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-500"
                          >
                            <FiInfo className="h-5 w-5" />
                          </button>
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
          
          {prescriptions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Prescription Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Prescriptions Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Prescriptions</h4>
                      <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">{prescriptions.length}</p>
                    </div>
                  </div>
                </div>
                
                {/* Active Prescriptions Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Prescriptions</h4>
                      <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {prescriptions.filter(p => p.status === 'Active').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Refill History Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Refill History</h4>
                      <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {prescriptions.filter(p => p.status === 'Dispensed').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Refill History Timeline */}
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-3">Recent Prescription Activity</h4>
                {prescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {prescriptions
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .slice(0, 3)
                      .map((prescription, index) => (
                        <div key={index} className="flex items-start">
                          <div className={`mt-1 mr-3 flex-shrink-0 w-3 h-3 rounded-full ${
                            prescription.status === 'Active' ? 'bg-green-500' :
                            prescription.status === 'Dispensed' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {prescription.medicationName} ({prescription.dosage})
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {prescription.status} • {new Date(prescription.timestamp).toLocaleDateString()} 
                              {prescription.expiryDate && ` • Expires: ${new Date(prescription.expiryDate).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderPrescriptionModal = () => {
    if (!selectedPrescription || !showPrescriptionModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Prescription Details</h3>
            <button 
              onClick={() => setShowPrescriptionModal(false)}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Medication</dt>
                <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">{selectedPrescription.medicationName}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Dosage</dt>
                <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">{selectedPrescription.dosage}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Instructions</dt>
                <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">{selectedPrescription.instructions || 'No specific instructions'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Prescribed</dt>
                <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">
                  {new Date(selectedPrescription.timestamp).toLocaleDateString()}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    selectedPrescription.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    selectedPrescription.status === 'Dispensed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    selectedPrescription.status === 'Revoked' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {selectedPrescription.status}
                  </span>
                </dd>
              </div>
              
              {selectedPrescription.dispensingNotes && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Pharmacist Notes</dt>
                  <dd className="mt-1 text-base text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                    {selectedPrescription.dispensingNotes}
                  </dd>
                </div>
              )}
              
              {selectedPrescription.expiryDate && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Expires On</dt>
                  <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">
                    {new Date(selectedPrescription.expiryDate).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={() => setShowPrescriptionModal(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

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
      {renderPrescriptionModal()}
    </div>
  );
};

export default PatientContent;
