import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PharmacistDashboard() {
    const navigate = useNavigate(); // Initialize useNavigate
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [patientID, setPatientID] = useState(''); // State to store patient's digital ID

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('userRole'); // Remove userRole from localStorage
        navigate('/'); // Redirect to the login page
    };

    // Function to handle dispensing medications
    const handleDispenseMedications = () => {
        setShowModal(true); // Show the modal
    };

    // Function to handle submission of patient's digital ID
    const handleSubmitPatientID = () => {
        if (patientID.trim()) {
            console.log(`Dispensing medications for patient ID: ${patientID}`);
            // Here, you can add logic to dispense medications (e.g., call an API)
            setShowModal(false); // Close the modal
            setPatientID(''); // Clear the input
        } else {
            alert('Please enter a valid patient ID.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
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
                <p className="text-gray-700">Welcome, Pharmacist! Manage prescriptions here.</p>

                {/* Pharmacist Duties Section */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Pharmacist Duties</h3>
                    <div className="space-y-2">
                        <button
                            onClick={handleDispenseMedications}
                            className="w-full bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Dispense Medications
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for Patient ID Input */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
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
        </div>
    );
}