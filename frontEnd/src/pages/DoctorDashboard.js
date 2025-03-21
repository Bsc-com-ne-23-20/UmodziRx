import React, { useState } from 'react';
import { TABS } from './Constants.ts';
import CreatePrescription from './CreatePrescription';
import ViewPatientPrescriptions from './ViewPatientPrescriptions';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for logout functionality

const DoctorDashboard = () => {
    const [activeTab, setActiveTab] = useState(TABS.CREATE);
    const navigate = useNavigate(); // Initialize useNavigate

    const renderContent = () => {
        switch (activeTab) {
            case TABS.CREATE:
                return <CreatePrescription />;
            case TABS.VIEW:
                return <ViewPatientPrescriptions />;
            default:
                return null;
        }
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('Login'); // Remove userRole from localStorage
        navigate('/'); // Redirect to the login page
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            {/* Logout Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Logout
                </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-8">Doctor Dashboard</h1>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-8">
                <button
                    className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
                        activeTab === TABS.CREATE
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveTab(TABS.CREATE)}
                    aria-selected={activeTab === TABS.CREATE}
                    role="tab"
                >
                    Create Prescription
                </button>
                <button
                    className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
                        activeTab === TABS.VIEW
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveTab(TABS.VIEW)}
                    aria-selected={activeTab === TABS.VIEW}
                    role="tab"
                >
                    View Patient Prescriptions
                </button>
            </div>

            {/* Tab Content */}
            <div role="tabpanel">
                {renderContent()}
            </div>
        </div>
    );
};

export default DoctorDashboard;