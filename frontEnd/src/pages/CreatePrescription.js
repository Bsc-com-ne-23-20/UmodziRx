import React, { useState } from 'react';

const CreatePrescription = () => {
    const [patientId, setPatientId] = useState('');
    const [medication, setMedication] = useState('');
    const [dosage, setDosage] = useState('');
    const [instructions, setInstructions] = useState('');

    const handleCreatePrescription = () => {
        // Simulate creating a prescription (replace with actual API call)
        console.log('Creating prescription with the following details:', {
            patientId,
            medication,
            dosage,
            instructions,
        });
        alert('Prescription created successfully!');
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create Prescription</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                        Patient ID
                    </label>
                    <input
                        type="text"
                        id="patientId"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter Patient ID"
                    />
                </div>
                <div>
                    <label htmlFor="medication" className="block text-sm font-medium text-gray-700">
                        Medication
                    </label>
                    <input
                        type="text"
                        id="medication"
                        value={medication}
                        onChange={(e) => setMedication(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter Medication"
                    />
                </div>
                <div>
                    <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
                        Dosage
                    </label>
                    <input
                        type="text"
                        id="dosage"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter Dosage"
                    />
                </div>
                <div>
                    <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                        Instructions
                    </label>
                    <textarea
                        id="instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter Instructions"
                        rows={3}
                    />
                </div>
                <button
                    onClick={handleCreatePrescription}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Create Prescription
                </button>
            </div>
        </div>
    );
};

export default CreatePrescription;
