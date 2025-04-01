import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// generate random nonce and state
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
    const [showModal, setShowModal] = useState(false);
    const [patientID, setPatientID] = useState('');

    useEffect(() => {
        // Initialize eSignet button
        const nonce = generateRandomString(16);
        const state = generateRandomString(16);

        const renderButton = () => {
            window.SignInWithEsignetButton?.init({
                oidcConfig: {
                    acr_values: 'mosip:idp:acr:generated-code mosip:idp:acr:biometric:static-code',
                    claims_locales: 'en',
                    client_id: 'IIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiUIju', // Replace with your actual client ID
                    redirect_uri: 'http://localhost:5000/auth/pharmacist-verify', // Callback URL after verification
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
                    // Here you would typically handle the verified patient data
                    setShowModal(true); // Show modal to confirm dispensing
                },
                onFailure: (error) => {
                    console.error('Patient verification failed:', error);
                    alert('Patient verification failed. Please try again.');
                }
            });
        };

        // Load eSignet SDK if not already loaded
        if (!window.SignInWithEsignetButton) {
            const script = document.createElement('script');
            script.src = 'https://esignet.sdk.url'; // Replace with actual eSignet SDK URL
            script.onload = renderButton;
            document.body.appendChild(script);
        } else {
            renderButton();
        }
    }, []);

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
                {/* Logout Button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Logout
                    </button>
                </div>

                <h2 className="text-2xl font-bold mb-6">Pharmacist Dashboard</h2>
                <p className="text-gray-700 mb-8">Welcome, Pharmacist! Manage prescriptions here.</p>

                {/* Pharmacist Duties Section */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Patient Verification</h3>
                    <div className="space-y-4">
                        <div id="esignet-verify-button" className="flex justify-center"></div>
                        <p className="text-sm text-gray-500">
                            Verify patient identity using eSignet before dispensing medications
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal for Confirmation After Verification */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">Confirm Medication Dispensing</h3>
                        <p className="mb-4">Patient has been successfully verified. Proceed with dispensing?</p>
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
                                Confirm Dispensing
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}