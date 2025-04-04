import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// Generate random nonce and state
function generateRandomString(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return randomString;
}

const TABS = {
  CREATE: 'CREATE',
  VIEW: 'VIEW'
};

const DoctorDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [patientFromUrl, setPatientFromUrl] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.CREATE);
  const [formData, setFormData] = useState({
    medications: [{ medicationName: '', dosage: '', instructions: '' }]
  });
  const [patientIdSearch, setPatientIdSearch] = useState(localStorage.getItem('patientId') || '');
  const [prescriptionHistory, setPrescriptionHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [verifiedPatient, setVerifiedPatient] = useState(null);
  const [selfPrescriptionWarning, setSelfPrescriptionWarning] = useState(false);

  useEffect(() => {
    // Parse patient data from URL when component mounts
    const urlParams = new URLSearchParams(window.location.search);
    const encodedPatient = urlParams.get('patient');

    if (encodedPatient) {
      try {
        // Decode the base64 URL-safe string
        const decodedString = atob(encodedPatient.replace(/-/g, '+').replace(/_/g, '/'));
        const patient = JSON.parse(decodedString);
        
        // Check if patient ID matches doctor ID
        const doctorId = localStorage.getItem('doctorId');
        if (patient.id === doctorId) {
          setSelfPrescriptionWarning(true);
          setTimeout(() => setSelfPrescriptionWarning(false), 2000);
          setPatientFromUrl(null);
        } else {
          setPatientFromUrl(patient);
        }
      } catch (e) {
        console.error('Error parsing patient data:', e);
      }
    }

    // Initialize eSignet button when component mounts
    const nonce = generateRandomString(16);
    const state = generateRandomString(16);

    const renderButton = () => {
      window.SignInWithEsignetButton?.init({
        oidcConfig: {
          acr_values: 'mosip:idp:acr:generated-code mosip:idp:acr:biometric:static-code',
          claims_locales: 'en',
          client_id: 'IIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1Ueed',
          redirect_uri: 'http://localhost:5000/doctor/verifypatient',
          display: 'page',
          nonce: nonce,
          prompt: 'consent',
          scope: 'openid profile',
          state: state,
          ui_locales: 'en',
          authorizeUri: 'http://localhost:3000/authorize',
        },
        buttonConfig: {
          labelText: 'Verify Patient with eSignet',
          shape: 'soft_edges',
          theme: 'filled_blue',
          type: 'standard'
        },
        signInElement: document.getElementById('esignet-verify-button'),
        onSuccess: (response) => {
          console.log('Patient verification successful:', response);
          const verifiedPatientData = {
            patientId: response.sub || response.patientId,
            patientName: response.name || 'Verified Patient',
            birthday: response.birthdate || 'N/A'
          };

          // Check if verified patient is the doctor
          const doctorId = localStorage.getItem('doctorId');
          if (verifiedPatientData.patientId === doctorId) {
            setSelfPrescriptionWarning(true);
            setTimeout(() => setSelfPrescriptionWarning(false), 2000);
            setVerifiedPatient(null);
          } else {
            setVerifiedPatient(verifiedPatientData);
            localStorage.setItem('patientId', verifiedPatientData.patientId);
            setPatientIdSearch(verifiedPatientData.patientId);
          }
        },
        onFailure: (error) => {
          console.error('Patient verification failed:', error);
          setError('Patient verification failed. Please try again.');
        }
      });
    };

    if (!window.SignInWithEsignetButton) {
      const script = document.createElement('script');
      script.src = 'https://esignet.sdk.url';
      script.onload = renderButton;
      document.body.appendChild(script);
    } else {
      renderButton();
    }
  }, [activeTab]);

  const fetchPrescription = async () => {
    if (!patientIdSearch) {
      setError('No patient ID found');
      setTimeout(() => setError(null), 2000);
      return;
    }

    // Check if trying to view own prescriptions
    const doctorId = localStorage.getItem('doctorId');
    if (patientIdSearch === doctorId) {
      setSelfPrescriptionWarning(true);
      setTimeout(() => setSelfPrescriptionWarning(false), 2000);
      setPrescriptionHistory(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/prescriptions', {
        params: { patientId: patientIdSearch }
      });
      setPrescriptionHistory(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch prescription');
      setTimeout(() => setError(null), 3000);
      setPrescriptionHistory(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const medications = [...formData.medications];
    medications[index][name] = value;
    setFormData({ ...formData, medications });
  };

  const handleAddMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { medicationName: '', dosage: '', instructions: '' }]
    });
  };

  const handleRemoveMedication = (index) => {
    const medications = [...formData.medications];
    medications.splice(index, 1);
    setFormData({ ...formData, medications });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check for self-prescription
    const doctorId = localStorage.getItem('doctorId');
    const patientData = verifiedPatient || patientFromUrl;
    
    if (!patientData) {
      setError('Please verify patient first');
      return;
    }

    if (patientData.id === doctorId || patientData.patientId === doctorId) {
      setSelfPrescriptionWarning(true);
      setTimeout(() => setSelfPrescriptionWarning(false), 2000);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        patientId: patientData.id || patientData.patientId,
        patientName: patientData.name || patientData.patientName,
        doctorId: doctorId,
        prescriptions: formData.medications
      };

      const response = await axios.post('http://localhost:5000/prescriptions', payload);
      
      setSuccess('Prescription created successfully!');
      setFormData({
        medications: [{ medicationName: '', dosage: '', instructions: '' }]
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('Login');
    localStorage.removeItem('patientId');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">modziRx</h1>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-gray-800">Dr {localStorage.getItem("doctorName")}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex space-x-2 mb-6">
          <button
            className={`px-4 py-2 rounded-t-lg ${activeTab === TABS.CREATE ? 'bg-white border-b-2 border-blue-500' : 'bg-gray-200'}`}
            onClick={() => setActiveTab(TABS.CREATE)}
          >
            Create Prescription
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg ${activeTab === TABS.VIEW ? 'bg-white border-b-2 border-blue-500' : 'bg-gray-200'}`}
            onClick={() => setActiveTab(TABS.VIEW)}
          >
            View Prescriptions
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {selfPrescriptionWarning && (
            <div className="mb-4 p-3 bg-red-400 text-white rounded transition-opacity duration-300">
              You cannot create or view prescriptions for yourself.
            </div>
          )}

          {activeTab === TABS.CREATE ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">Create Prescription</h2>
              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
              {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}
              
              <div className="mb-6 flex items-center">
                <div id="esignet-verify-button" className="mr-4"></div>
              </div>

              {!selfPrescriptionWarning && (verifiedPatient || patientFromUrl) && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-lg mb-2">Patient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-600">Patient ID:</p>
                      <p className="font-medium">
                        {verifiedPatient?.patientId || patientFromUrl?.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Patient Name:</p>
                      <p className="font-medium">
                        {verifiedPatient?.patientName || patientFromUrl?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Birthday:</p>
                      <p className="font-medium">
                        {verifiedPatient?.birthday || patientFromUrl?.birthday || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Medications</h3>
                  {formData.medications.map((med, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        <div>
                          <label className="block text-gray-700 mb-1">Medication Name</label>
                          <input
                            type="text"
                            name="medicationName"
                            value={med.medicationName}
                            onChange={(e) => handleChange(e, index)}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1">Dosage</label>
                          <input
                            type="text"
                            name="dosage"
                            value={med.dosage}
                            onChange={(e) => handleChange(e, index)}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1">Instructions</label>
                          <input
                            type="text"
                            name="instructions"
                            value={med.instructions}
                            onChange={(e) => handleChange(e, index)}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                      </div>
                      {formData.medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedication(index)}
                          className="text-red-600 text-sm"
                        >
                          Remove Medication
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Add Medication
                  </button>
                  <button
                    type="submit"
                    disabled={loading || (!verifiedPatient && !patientFromUrl) || selfPrescriptionWarning}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {loading ? 'Submitting...' : 'Create Prescription'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4">View Patient Prescription History</h2>
              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
              
              <div className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={verifiedPatient?.patientId || patientFromUrl?.id || patientIdSearch}
                    readOnly
                    className="flex-1 p-2 border rounded bg-gray-100"
                    placeholder={!verifiedPatient && !patientFromUrl ? "Please verify patient first" : ""}
                  />
                  <button
                    onClick={fetchPrescription}
                    disabled={loading || !(verifiedPatient?.patientId || patientFromUrl?.id || patientIdSearch)}
                    className={`px-4 py-2 rounded text-white ${
                      loading 
                        ? 'bg-blue-300' 
                        : (verifiedPatient?.patientId || patientFromUrl?.id || patientIdSearch) 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>

              {loading && <p className="text-center">Loading...</p>}
              
              {prescriptionHistory ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">Patient Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-gray-600">Patient ID:</p>
                        <p className="font-medium">{prescriptionHistory.patientId}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Patient Name:</p>
                        <p className="font-medium">{prescriptionHistory.patientName}</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mt-6">Prescription Records</h3>
                  
                  {prescriptionHistory.prescriptions?.length > 0 ? (
                    prescriptionHistory.prescriptions.map((prescription, index) => (
                      <div key={index} className="border rounded-lg p-4">
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
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No prescription records found</p>
                  )}
                </div>
              ) : (
                !loading && <p className="text-gray-500">No prescription history found. Please search by Patient ID.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;