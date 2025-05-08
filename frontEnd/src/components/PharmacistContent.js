import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiX, 
  FiChevronDown, 
  FiChevronUp, 
  FiTrash2, 
  FiCheckSquare,
  FiHome,
  FiPackage,
  FiList
} from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PharmacistContent = ({ activeView, handleNavigation }) => {
  const [verifiedPatient, setVerifiedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [retrievedPatient, setRetrievedPatient] = useState(null);
  const [patientPrescriptions, setPatientPrescriptions] = useState(null);
  const [expandedPrescriptionId, setExpandedPrescriptionId] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showPrescriptionDropdown, setShowPrescriptionDropdown] = useState(false);
  const [showAddPrescriptionModal, setShowAddPrescriptionModal] = useState(false);
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [newPrescriptions, setNewPrescriptions] = useState([{ drugName: '', dosage: '', advice: '' }]);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState([]);
  const [dispenseStatus, setDispenseStatus] = useState({});
  const location = useLocation();

  const fetchPatientPrescriptions = async (patientId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/pharmacist/prescriptions`, {
        params: { patientId }
      });
      setPatientPrescriptions(response.data.data);
    } catch (err) {
      setError('Failed to fetch prescriptions: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const encodedPatient = urlParams.get('patient');

    if (encodedPatient) {
      try {
        const decodedString = atob(encodedPatient.replace(/-/g, '+').replace(/_/g, '/'));
        const patient = JSON.parse(decodedString);
        setVerifiedPatient(patient);
        setRetrievedPatient(patient);
        fetchPatientPrescriptions(patient.id);
      } catch (e) {
        console.error('Error parsing patient data:', e);
        setError('Invalid patient data received');
      }
    }

    if (showVerificationModal) {
      const nonce = generateRandomString(16);
      const state = generateRandomString(16);

      const renderButton = () => {
        window.SignInWithEsignetButton?.init({
          oidcConfig: {
            acr_values: 'mosip:idp:acr:generated-code mosip:idp:acr:biometricr:static-code',
            claims_locales: 'en',
            client_id: process.env.REACT_APP_ESIGNET_CLIENT_ID,
            redirect_uri: process.env.REACT_APP_ESIGNET_REDIRECT_URI_PHARMACIST,
            display: 'popup',
            nonce: nonce,
            prompt: 'consent',
            scope: 'openid profile',
            state: state,
            ui_locales: 'en',
            authorizeUri: process.env.REACT_APP_ESIGNET_AUTHORIZE_URI,
          },
          buttonConfig: {
            labelText: 'Verify Patient with eSignet',
            shape: 'rounded',
            theme: 'filled_blue',
            type: 'standard'
          },
          signInElement: document.getElementById('esignet-modal-button'),
          onSuccess: (response) => {
            console.log('Patient verification successful:', response);
            const verifiedPatientData = {
              id: response.sub || response.patientId,
              name: response.name || 'Verified Patient',
              birthday: response.birthdate || 'N/A'
            };
            setVerifiedPatient(verifiedPatientData);
            setRetrievedPatient(verifiedPatientData);
            fetchPatientPrescriptions(verifiedPatientData.id);
            setShowVerificationModal(false);
          },
          onFailure: (error) => {
            console.error('Patient verification failed:', error);
            setError('Patient verification failed. Please try again.');
          }
        });
      };

      if (!window.SignInWithEsignetButton) {
        const script = document.createElement('script');
        script.src = process.env.REACT_APP_ESIGNET_SDK_URL;
        script.onload = renderButton;
        document.body.appendChild(script);
      } else {
        renderButton();
      }
    }
  }, [activeView, location.search, showVerificationModal]);

  const generateRandomString = (length) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return randomString;
  };

  const calculateAge = (birthday) => {
    if (!birthday) return 'N/A';
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handlePrescriptionClick = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionModal(true);
  };

  const handleVerifyClick = () => {
    setShowVerificationModal(true);
    setRetrievedPatient(null);
    setPatientPrescriptions(null);
    setError(null);
    handleNavigation('verify');
  };

  const handleAddPrescriptionRow = () => {
    setNewPrescriptions([...newPrescriptions, { drugName: '', dosage: '', advice: '' }]);
  };

  const handleRemovePrescriptionRow = (index) => {
    const updated = newPrescriptions.filter((_, i) => i !== index);
    setNewPrescriptions(updated);
  };

  const handleNewPrescriptionChange = (index, field, value) => {
    const updated = [...newPrescriptions];
    updated[index][field] = value;
    setNewPrescriptions(updated);
  };

  const handleSubmitNewPrescriptions = async () => {
    try {
      setLoading(true);
      await axios.post(`http://localhost:5000/pharmacist/prescriptions`, {
        patientId: retrievedPatient.id,
        prescriptions: newPrescriptions
      });
      fetchPatientPrescriptions(retrievedPatient.id);
      setShowAddPrescriptionModal(false);
      setNewPrescriptions([{ drugName: '', dosage: '', advice: '' }]);
    } catch (err) {
      setError("Failed to add prescriptions: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const togglePrescriptionSelection = (prescription) => {
    setSelectedPrescriptions(prev => {
      const isSelected = prev.some(p => p.prescriptionId === prescription.prescriptionId);
      return isSelected
        ? prev.filter(p => p.prescriptionId !== prescription.prescriptionId)
        : [...prev, prescription];
    });
  };

  const handleDispensePrescription = async (prescriptionId) => {
    try {
      setLoading(true);
      setDispenseStatus(prev => ({ ...prev, [prescriptionId]: 'processing' }));
      
      await axios.post(`http://localhost:5000/pharmacist/prescriptions/${prescriptionId}/dispense`);
      
      const updatedPrescriptions = patientPrescriptions.prescriptions.map(p => 
        p.prescriptionId === prescriptionId ? { ...p, status: 'Dispensed' } : p
      );
      setPatientPrescriptions({ ...patientPrescriptions, prescriptions: updatedPrescriptions });
      
      setDispenseStatus(prev => ({ ...prev, [prescriptionId]: 'success' }));
    } catch (err) {
      setDispenseStatus(prev => ({ ...prev, [prescriptionId]: 'error' }));
      setError('Failed to dispense prescription: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDispensePrescriptions = async () => {
    try {
      setLoading(true);
      await axios.post(`http://localhost:5000/pharmacist/prescriptions/dispense`, {
        prescriptionIds: selectedPrescriptions.map(p => p.prescriptionId)
      });
      fetchPatientPrescriptions(retrievedPatient.id);
      setSelectedPrescriptions([]);
      setShowDispenseModal(false);
    } catch (err) {
      setError('Failed to dispense prescriptions: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const renderPrescriptionDropdown = () => (
    <div className="relative inline-block text-left mb-4">
      <button
        onClick={() => setShowPrescriptionDropdown(!showPrescriptionDropdown)}
        className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Prescriptions Actions
        {showPrescriptionDropdown ? (
          <FiChevronUp className="ml-2 h-4 w-4" />
        ) : (
          <FiChevronDown className="ml-2 h-4 w-4" />
        )}
      </button>

      {showPrescriptionDropdown && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={() => {
                setShowAddPrescriptionModal(true);
                setShowPrescriptionDropdown(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Add Prescriptions
            </button>
            <button
              onClick={() => {
                setShowDispenseModal(true);
                setShowPrescriptionDropdown(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={!patientPrescriptions?.prescriptions?.length}
            >
              <FiCheckSquare className="mr-2 h-4 w-4" />
              Dispense Prescriptions
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderAddPrescriptionModal = () => {
    if (!showAddPrescriptionModal) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Add New Prescriptions</h3>
            <button 
              onClick={() => {
                setShowAddPrescriptionModal(false);
                setNewPrescriptions([{ drugName: '', dosage: '', advice: '' }]);
              }} 
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <div className="px-6 py-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Drug Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dosage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Advice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {newPrescriptions.map((prescription, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={prescription.drugName}
                          onChange={(e) => handleNewPrescriptionChange(index, 'drugName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="e.g., Paracetamol"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={prescription.dosage}
                          onChange={(e) => handleNewPrescriptionChange(index, 'dosage', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="e.g., 500mg twice daily"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={prescription.advice}
                          onChange={(e) => handleNewPrescriptionChange(index, 'advice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="e.g., Take after meals"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {index > 0 && (
                          <button
                            onClick={() => handleRemovePrescriptionRow(index)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleAddPrescriptionRow}
                className="flex items-center px-4 py-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/75"
              >
                <FiPlus className="mr-1 h-4 w-4" />
                Add Another
              </button>
              <div className="space-x-3">
                <button
                  onClick={() => {
                    setShowAddPrescriptionModal(false);
                    setNewPrescriptions([{ drugName: '', dosage: '', advice: '' }]);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitNewPrescriptions}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={newPrescriptions.some(p => !p.drugName || !p.dosage)}
                >
                  Save Prescriptions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDispenseModal = () => {
    if (!showDispenseModal) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Dispense Prescriptions</h3>
            <button 
              onClick={() => {
                setShowDispenseModal(false);
                setSelectedPrescriptions([]);
              }} 
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <div className="px-6 py-4">
            {patientPrescriptions?.prescriptions?.length ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Select</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Medication</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dosage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {patientPrescriptions.prescriptions.map((prescription) => (
                        <tr key={prescription.prescriptionId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedPrescriptions.some(p => p.prescriptionId === prescription.prescriptionId)}
                              onChange={() => togglePrescriptionSelection(prescription)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              disabled={prescription.status !== 'Active'}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {prescription.medicationName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {prescription.dosage}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              prescription.status === 'Active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' 
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {prescription.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      setShowDispenseModal(false);
                      setSelectedPrescriptions([]);
                    }}
                    className="mr-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDispensePrescriptions}
                    className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
                    disabled={!selectedPrescriptions.length}
                  >
                    Dispense Selected ({selectedPrescriptions.length})
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No prescriptions available to dispense</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPrescriptionModal = () => {
    if (!selectedPrescription || !showPrescriptionModal) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full m-4">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Prescription Details</h3>
            <button onClick={() => setShowPrescriptionModal(false)} 
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prescription ID</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedPrescription.prescriptionId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                <p className="mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedPrescription.status === 'Active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {selectedPrescription.status}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedPrescription.createdBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created On</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {new Date(selectedPrescription.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expiry Date</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {selectedPrescription.expiryDate ? 
                    new Date(selectedPrescription.expiryDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Medication Details</h4>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Medication</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedPrescription.medicationName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Dosage</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedPrescription.dosage}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Instructions</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedPrescription.instructions}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</p>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 break-all">{selectedPrescription.txId}</p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
              {selectedPrescription.status === 'Active' && (
                <button
                  onClick={() => handleDispensePrescription(selectedPrescription.prescriptionId)}
                  disabled={dispenseStatus[selectedPrescription.prescriptionId] === 'processing'}
                  className={`px-4 py-2 text-sm text-white rounded-md ${
                    dispenseStatus[selectedPrescription.prescriptionId] === 'processing'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {dispenseStatus[selectedPrescription.prescriptionId] === 'processing' ? 'Dispensing...' : 'Dispense'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVerificationModal = () => {
    if (!showVerificationModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full m-4">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Verify Patient</h3>
            <button
              onClick={() => setShowVerificationModal(false)}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <div className="px-6 py-8">
            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Please verify the patient's identity using eSignet to proceed
              </p>
              <div id="esignet-modal-button" className="flex justify-center"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Pharmacist Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={handleVerifyClick}
              className="w-full px-4 py-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/75"
            >
              Verify New Patient
            </button>
            <button
              onClick={() => retrievedPatient ? setShowAddPrescriptionModal(true) : alert("Please verify a patient first")}
              disabled={!retrievedPatient}
              className={`w-full px-4 py-2 text-sm rounded-md ${
                retrievedPatient
                  ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/50 hover:bg-green-100 dark:hover:bg-green-900/75"
                  : "text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              }`}
            >
              + Add Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Inventory Management</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {/* Inventory management content */}
      </div>
    </div>
  );

  const renderPrescriptions = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">All Prescriptions</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {/* All prescriptions content */}
      </div>
    </div>
  );

  const renderVerifySection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Verify Patient</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {retrievedPatient ? (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400">Verified Patient Information</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Field</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Information</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">Patient ID</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{retrievedPatient.id}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">Name</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{retrievedPatient.name}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">Age</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{calculateAge(retrievedPatient.birthday)} years</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {renderPrescriptionDropdown()}

            {patientPrescriptions && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-4">Patient Prescriptions</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Medication</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Dosage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Instructions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {patientPrescriptions.prescriptions.map((prescription) => (
                        <tr 
                          key={prescription.prescriptionId}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{prescription.medicationName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{prescription.dosage}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{prescription.instructions}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              prescription.status === 'Active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' 
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {prescription.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDispensePrescription(prescription.prescriptionId)}
                              disabled={prescription.status !== 'Active' || dispenseStatus[prescription.prescriptionId] === 'processing'}
                              className={`px-3 py-1 text-xs rounded ${
                                dispenseStatus[prescription.prescriptionId] === 'processing'
                                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                  : prescription.status === 'Active'
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {dispenseStatus[prescription.prescriptionId] === 'processing' 
                                ? 'Dispensing...' 
                                : prescription.status === 'Active' 
                                  ? 'Dispense' 
                                  : 'Dispensed'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Patient Verified</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Click "Verify New Patient" in the dashboard to verify a patient
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      ) : (
        <>
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'verify' && renderVerifySection()}
          {activeView === 'inventory' && renderInventory()}
          {activeView === 'prescriptions' && renderPrescriptions()}
        </>
      )}

      {renderPrescriptionModal()}
      {renderVerificationModal()}
      {renderAddPrescriptionModal()}
      {renderDispenseModal()}
    </div>
  );
};

export default PharmacistContent;