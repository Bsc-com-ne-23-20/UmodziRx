import React, { useState } from 'react';
import { TABS } from './Constants.ts';
import CreatePrescription from './CreatePrescription';
import ViewPatientPrescriptions from './ViewPatientPrescriptions';

const DoctorDashboard = () => {
    const [activeTab, setActiveTab] = useState(TABS.CREATE);

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

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
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
