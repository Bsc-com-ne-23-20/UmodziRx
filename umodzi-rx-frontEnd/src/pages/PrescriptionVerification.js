import React from 'react';

const PrescriptionVerification = () => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Verify Prescription</h2>
            <form>
                <input type="text" placeholder="Prescription ID" className="border p-2 mb-4 w-full" required />
                <button type="submit" className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition">
                    Verify
                </button>
            </form>
        </div>
    );
};

export default PrescriptionVerification;