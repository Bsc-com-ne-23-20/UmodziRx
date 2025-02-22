import React from 'react';

const PrescriptionManagement = () => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Manage Prescriptions</h2>
            <form>
                <input type="text" placeholder="Patient ID" className="border p-2 mb-4 w-full" required />
                <input type="text" placeholder="Medications" className="border p-2 mb-4 w-full" required />
                <input type="text" placeholder="Dosage" className="border p-2 mb-4 w-full" required />
                <button type="submit" className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition">
                    Create Prescription
                </button>
            </form>
        </div>
    );
};

export default PrescriptionManagement;