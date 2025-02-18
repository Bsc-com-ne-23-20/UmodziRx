import React from 'react';

const Dashboard = ({ role }) => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Welcome, {role}</h1>
            {role === 'Doctor' && (
                <div>
                    <h2 className="text-xl">Prescription Management</h2>
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-lg mt-2">Create Prescription</button>
                </div>
            )}
            {role === 'Pharmacist' && (
                <div>
                    <h2 className="text-xl">Verify Prescriptions</h2>
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-lg mt-2">Verify Prescription</button>
                </div>
            )}
            {role === 'Patient' && (
                <div>
                    <h2 className="text-xl">Prescription History</h2>
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-lg mt-2">View History</button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;