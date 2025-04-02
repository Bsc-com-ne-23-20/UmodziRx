import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PharmacistDashboard() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showInventory, setShowInventory] = useState(false);
    const [patientID, setPatientID] = useState('');
    const [reviewPatientID, setReviewPatientID] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const pharmacistName = "Pharmacist Name";

    // Sample inventory data
    const inventory = [
        { id: 1, name: "Paracetamol 500mg", stock: 142, threshold: 50 },
        { id: 2, name: "Amoxicillin 250mg", stock: 87, threshold: 30 },
        { id: 3, name: "Ibuprofen 200mg", stock: 203, threshold: 75 },
        { id: 4, name: "Omeprazole 20mg", stock: 56, threshold: 25 },
        { id: 5, name: "Atorvastatin 40mg", stock: 34, threshold: 20 }
    ];

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        navigate('/');
    };

    const handleDispenseMedications = () => {
        setShowModal(true);
    };

    const handleReviewPrescriptions = () => {
        setShowReviewModal(true);
    };

    const handleShowInventory = () => {
        setShowInventory(true);
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

    const handleSubmitReviewPatientID = () => {
        if (reviewPatientID.trim()) {
            console.log(`Reviewing prescriptions for patient ID: ${reviewPatientID}`);
            setShowReviewModal(false);
            setReviewPatientID('');
        } else {
            alert('Please enter a valid patient ID.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-4">
            <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden p-8 relative">
                {/* Pharmacist Name - Top Right Corner */}
                <div className="absolute top-6 right-6">
                    <div className="relative">
                        <button 
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="text-teal-800 font-medium hover:text-teal-900 focus:outline-none flex items-center group"
                        >
                            <span className="mr-2">{pharmacistName}</span>
                            <div className="w-8 h-8 rounded-full bg-teal-100 group-hover:bg-teal-200 transition-colors flex items-center justify-center overflow-hidden">
                                {/* Profile image placeholder - blank for now */}
                                <div className="w-full h-full bg-gray-200"></div>
                            </div>
                        </button>
                        
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-gray-700 text-lg mb-8">Welcome, Pharmacist! Manage prescriptions here.</p>

                <div className="mt-8">
                    <h3 className="text-2xl font-semibold mb-6">Pharmacist Duties</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Dispense Medications */}
                        <button
                            onClick={handleDispenseMedications}
                            className="bg-green-100 text-green-700 p-6 rounded-lg hover:bg-green-200 transition duration-200 flex flex-col items-center justify-center"
                        >
                            <span className="text-4xl mb-2">💊</span>
                            <span className="text-lg font-medium">Dispense Medications</span>
                        </button>
                        
                        {/* Review Prescriptions */}
                        <button
                            onClick={handleReviewPrescriptions}
                            className="bg-blue-100 text-blue-700 p-6 rounded-lg hover:bg-blue-200 transition duration-200 flex flex-col items-center justify-center"
                        >
                            <span className="text-4xl mb-2">📋</span>
                            <span className="text-lg font-medium">Review Prescriptions</span>
                        </button>
                        
                        {/* Manage Inventory */}
                        <button
                            onClick={handleShowInventory}
                            className="bg-purple-100 text-purple-700 p-6 rounded-lg hover:bg-purple-200 transition duration-200 flex flex-col items-center justify-center"
                        >
                            <span className="text-4xl mb-2">🧪</span>
                            <span className="text-lg font-medium">Manage Inventory</span>
                        </button>
                    </div>
                </div>

                {/* Inventory Display */}
                {showInventory && (
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Current Inventory</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-2 text-left border-b">Medication</th>
                                        <th className="px-4 py-2 text-left border-b">Current Stock</th>
                                        <th className="px-4 py-2 text-left border-b">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border-b">{item.name}</td>
                                            <td className="px-4 py-2 border-b">{item.stock}</td>
                                            <td className="px-4 py-2 border-b">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    item.stock < item.threshold 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {item.stock < item.threshold ? 'Low Stock' : 'In Stock'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
    );
}