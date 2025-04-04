import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function generateRandomString(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return randomString;
}

export default function PharmacistDashboard() {

    const navigate = useNavigate();

    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [patientID, setPatientID] = useState('');
    const [verifiedPatient, setVerifiedPatient] = useState(null);
    const [pharmacistInfo, setPharmacistInfo] = useState({
        id: '123456',
        email: 'pharmacy@gmail.com',
        name: 'Tadala Cleoz',
        birthday: '1987/11/25',
        role: 'pharmacist'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSelfDispensingAlert, setShowSelfDispensingAlert] = useState(false);

    useEffect(() => {
        // Parse patient data from URL when component mounts
        const urlParams = new URLSearchParams(location.search);
        const encodedPatient = urlParams.get('patient');

        if (encodedPatient) {
            try {
                const decodedString = atob(encodedPatient.replace(/-/g, '+').replace(/_/g, '/'));
                const patient = JSON.parse(decodedString);

                console.log('received verified patient:', patient)
                
                // Check if patient ID matches pharmacist ID
                if (patient.id === localStorage.getItem('pharmaId')) {
                    setShowSelfDispensingAlert(true);
                    setVerifiedPatient(null);
                } else {
                    setVerifiedPatient(patient);
                    setShowModal(true);
                }
                console.log('Patient from URL:', patient);
            } catch (e) {
                console.error('Error parsing patient data:', e);
            }
        }

        // Initialize eSignet button
        const nonce = generateRandomString(16);
        const state = generateRandomString(16);

        const renderButton = () => {
            window.SignInWithEsignetButton?.init({
                oidcConfig: {
                    acr_values: 'mosip:idp:acr:generated-code mosip:idp:acr:biometric:static-code',
                    claims_locales: 'en',
                    client_id: 'IIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAh6je3',
                    redirect_uri: 'http://localhost:5000/pharmacist/veripatient',
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
          setVerifiedPatient(patient);
          setShowModal(true);
        }
      } catch (e) {
        console.error('Error parsing patient data:', e);
      }
    }

    const nonce = generateRandomString(16);
    const state = generateRandomString(16);

    const renderButton = () => {
      window.SignInWithEsignetButton?.init({
        oidcConfig: {
          acr_values: 'mosip:idp:acr:generated-code mosip:idp:acr:biometric:static-code',
          claims_locales: 'en',
          client_id: process.env.REACT_APP_ESIGNET_CLIENT_ID,
          redirect_uri: process.env.REACT_APP_ESIGNET_REDIRECT_URI_PHARMACIST,
          display: 'page',
          nonce: nonce,
          prompt: 'consent',
          scope: 'openid profile',
          state: state,
          ui_locales: 'en',
          authorizeUri: process.env.REACT_APP_ESIGNET_AUTHORIZE_URI,
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
        },
        onFailure: (error) => {
          console.error('Patient verification failed:', error);
          setError('Patient verification failed. Please try again.');

    }, [location.search, pharmacistInfo.id]);

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('token');
        navigate('/');

    };

    const handleSubmitPatientID = () => {
        if (patientID.trim()) {
            console.log(`Dispensing medications for patient ID: ${patientID}`);
            setShowModal(false);
            setPatientID('');


        } else {
            alert('Please enter a valid patient ID.');
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
  }, [location.search, pharmacistInfo.id]);

  const fetchPrescriptions = async () => {
    if (!verifiedPatient?.id) {
      setError('No verified patient found');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pharmacist/prescriptions`, {
        params: { patientId: verifiedPatient.id }
      });
      console.log('Prescriptions:', response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleSubmitPatientID = () => {
    if (patientID.trim()) {
      console.log(`Dispensing medications for patient ID: ${patientID}`);
      setShowModal(false);
      setPatientID('');
    } else {
      alert('Please enter a valid patient ID.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800"></h1>
          <div className="flex items-center space-x-4">
            
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Pharmacist portal</h2>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-2">Pharmacist Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">ID:</p>
                <p className="font-medium">{localStorage.getItem('pharmaId')}</p>
              </div>
              <div>
                <p className="text-gray-600">Name:</p>
                <p className="font-medium">{localStorage.getItem('pharmaName')}</p>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-medium">{localStorage.getItem('phamarEmail')}</p>
              </div>
            </div>
          </div>

          <div className="mb-6 flex items-start">
            <div id="esignet-verify-button" className="mr-4"></div>
            <p className="text-sm text-gray-500 mt-2">
              Verify patient identity using eSignet before dispensing medications
            </p>
          </div>

          {verifiedPatient && (
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-lg mb-2">Verified Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600">Patient ID:</p>
                  <p className="font-medium">{verifiedPatient.id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Patient Name:</p>
                  <p className="font-medium">{verifiedPatient.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Birthday:</p>
                  <p className="font-medium">{verifiedPatient.birthday}</p>


    const fetchPrescriptions = async () => {
        if (!verifiedPatient?.id) {
            setError('No verified patient found');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/pharmacist/prescriptions', {
                params: { patientId: verifiedPatient.id }
            });
            console.log('Prescriptions:', response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch prescriptions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">modziRx - Pharmacist Portal</h1>
                    <div className="flex items-center space-x-4">

                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            Logout

                        </button>
                    </div>
                </div>


                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Pharmacist Dashboard</h2>
                    
                    {/* Pharmacist Information */}
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold text-lg mb-2">Pharmacist Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-gray-600">ID:</p>
                                <p className="font-medium">{localStorage.getItem('pharmaId')}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Name:</p>
                                <p className="font-medium">{localStorage.getItem('pharmaName')}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Email:</p>
                                <p className="font-medium">{localStorage.getItem('phamarEmail')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Patient Verification Section */}
                    <div className="mb-6 flex items-start">
                        <div id="esignet-verify-button" className="mr-4"></div>
                        <p className="text-sm text-gray-500 mt-2">
                            Verify patient identity using eSignet before dispensing medications
                        </p>
                    </div>

                    {/* Verified Patient Information - Only shown if not pharmacist themselves */}
                    {verifiedPatient && (
                        <div className="bg-green-50 p-4 rounded-lg mb-6">
                            <h3 className="font-semibold text-lg mb-2">Verified Patient Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-gray-600">Patient ID:</p>
                                    <p className="font-medium">{verifiedPatient.id}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Patient Name:</p>
                                    <p className="font-medium">{verifiedPatient.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Birthday:</p>
                                    <p className="font-medium">{verifiedPatient.birthday}</p>
                                </div>
                            </div>
                            <button
                                onClick={fetchPrescriptions}
                                disabled={loading}
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                            >
                                {loading ? 'Loading...' : 'Fetch Prescriptions'}
                            </button>
                        </div>
                    )}

                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

                </div>
              </div>
              <button
                onClick={fetchPrescriptions}
                disabled={loading}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? 'Loading...' : 'Fetch Prescriptions'}
              </button>
            </div>
          )}

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        </div>
      </div>

      {showSelfDispensingAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-red-600">Invalid Action</h3>
            <p className="mb-4">You cannot dispense medication for yourself. Please verify a different patient.</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSelfDispensingAlert(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                OK
              </button>
            </div>
          </div>

            {/* Alert for self-dispensing attempt */}
            {showSelfDispensingAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4 text-red-600">Invalid Action</h3>
                        <p className="mb-4">You cannot dispense medication for yourself. Please verify a different patient.</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowSelfDispensingAlert(false)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                OK
                            </button>

                        </div>
                        <button
                            onClick={() => setShowInventory(false)}
                            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                        >
                            Close Inventory
                        </button>
                    </div>
                )}

                {/* Modal for Dispense Medications */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h3 className="text-xl font-semibold mb-4">Enter Patient's Digital ID</h3>
                            <input
                                type="text"
                                value={patientID}
                                onChange={(e) => setPatientID(e.target.value)}
                                className="w-full p-2 border rounded-lg mb-4"
                                placeholder="Patient's Digital ID"
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitPatientID}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal for Review Prescriptions */}
                {showReviewModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h3 className="text-xl font-semibold mb-4">Review Prescriptions</h3>
                            <p className="text-gray-600 mb-4">Enter patient ID to view their prescriptions</p>
                            <input
                                type="text"
                                value={reviewPatientID}
                                onChange={(e) => setReviewPatientID(e.target.value)}
                                className="w-full p-2 border rounded-lg mb-4"
                                placeholder="Patient's Digital ID"
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitReviewPatientID}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                                >
                                    View Prescriptions
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}