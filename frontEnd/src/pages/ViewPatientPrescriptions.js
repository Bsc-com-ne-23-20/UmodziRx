import React, { useState } from 'react';

const ViewPatientPrescriptions = () => {
    const [digitalId, setDigitalId] = useState('');
    const [prescriptions, setPrescriptions] = useState([]);

    const handleViewPrescriptions = () => {
        // Simulate fetching prescriptions (replace with actual API call)
        console.log(`Fetching prescriptions for patient with Digital ID: ${digitalId}`);
        // Mock data for demonstration
        setPrescriptions([
            { id: 1, medication: 'Paracetamol', dosage: '500mg', instructions: 'Take twice daily' },
            { id: 2, medication: 'Amoxicillin', dosage: '250mg', instructions: 'Take once daily' },
        ]);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">View Patient Prescriptions</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="digitalId" className="block text-sm font-medium text-gray-700">
                        Patient Digital ID
                    </label>
                    <input
                        type="text"
                        id="digitalId"
                        value={digitalId}
                        onChange={(e) => setDigitalId(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter Patient Digital ID"
                    />
                </div>
                <button
                    onClick={handleViewPrescriptions}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    View Prescriptions
                </button>
            </div>

            {prescriptions.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Prescriptions</h3>
                    <ul className="space-y-2">
                        {prescriptions.map((prescription) => (
                            <li key={prescription.id} className="p-4 bg-gray-50 rounded-md">
                                <p><strong>Medication:</strong> {prescription.medication}</p>
                                <p><strong>Dosage:</strong> {prescription.dosage}</p>
                                <p><strong>Instructions:</strong> {prescription.instructions}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ViewPatientPrescriptions;
