import React, { useState } from 'react';
import { TABS } from './Constants.ts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorDashboard = () => {
    const [activeTab, setActiveTab] = useState(TABS.CREATE);
    const [formData, setFormData] = useState({
        doctor_id: '',
        patient_name: '',
        patient_id: '',
        medications: [{ medication: '', dosage: '', instructions: '' }]
    });
    const [prescription, setPrescription] = useState(null);
    const [patientID, setPatientID] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchPrescription = async (patientID) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/prescriptions/${patientID}`);
            setPrescription(response.data);
            console.log(JSON.stringify(response.data, null, 2));
            console.log("Accessed backend: no error");
        } catch (err) {
            setError('Error fetching prescription: ' + err.message);
            setTimeout(() => setError(""), 3000);
            console.error('Error:', err);
        }
        setLoading(false);
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const medications = [...formData.medications];
        medications[index][name] = value;
        setFormData({ ...formData, medications });
    };

    const handlePatientIDChange = (e) => {
        setPatientID(e.target.value);
    };

    const handleAddMedication = () => {
        setFormData({
            ...formData,
            medications: [...formData.medications, { medication: '', dosage: '', instructions: '' }]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:5000/prescriptions', formData);
            alert('Prescription created successfully');
            setFormData({
                doctor_id: '',
                patient_name: '',
                patient_id: '',
                medications: [{ medication: '', dosage: '', instructions: '' }]
            });
        } catch (err) {
            setError('Error creating prescription: ' + err.message);
            setTimeout(() => setError(""), 4000);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('Login');
        navigate('/');
    };

    const renderContent = () => {
        switch (activeTab) {
            case TABS.CREATE:
                return (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Create Prescription</h2>
                        {error && <p className="text-red-600">{error}</p>}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-gray-700">Doctor DigitalID</label>
                                <input 
                                    type="text" 
                                    name="doctor_id" 
                                    value={formData.doctor_id} 
                                    onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })} 
                                    className="w-full p-2 border rounded-lg" 
                                    placeholder="Enter your ID" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Patient Name</label>
                                <input 
                                    type="text" 
                                    name="patient_name" 
                                    value={formData.patient_name} 
                                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })} 
                                    className="w-full p-2 border rounded-lg" 
                                    placeholder="Enter Patient Name" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Patient ID</label>
                                <input 
                                    type="text" 
                                    name="patient_id" 
                                    value={formData.patient_id} 
                                    onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })} 
                                    className="w-full p-2 border rounded-lg" 
                                    placeholder="Enter Patient ID" 
                                    required 
                                />
                            </div>
                            <div className="space-y-4">
                                {formData.medications.map((medication, index) => (
                                    <div key={index} className="flex space-x-4 animate-fadeIn">
                                        <div className="flex-1">
                                            <label className="block text-gray-700">Medication</label>
                                            <input 
                                                type="text" 
                                                name="medication" 
                                                value={medication.medication} 
                                                onChange={(e) => handleChange(e, index)} 
                                                className="w-full p-2 border rounded-lg" 
                                                placeholder="Enter Medication" 
                                                required 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-gray-700">Dosage</label>
                                            <input 
                                                type="text" 
                                                name="dosage" 
                                                value={medication.dosage} 
                                                onChange={(e) => handleChange(e, index)} 
                                                className="w-full p-2 border rounded-lg" 
                                                placeholder="Enter Dosage" 
                                                required 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-gray-700">Instructions</label>
                                            <textarea 
                                                name="instructions" 
                                                value={medication.instructions} 
                                                onChange={(e) => handleChange(e, index)} 
                                                className="w-full p-2 border rounded-lg" 
                                                placeholder="Enter Instructions" 
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                type="button" 
                                onClick={handleAddMedication} 
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                            >
                                Add More Medication
                            </button>
                            <button 
                                type="submit" 
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Create Prescription'}
                            </button>
                        </form>
                    </div>
                );
            case TABS.VIEW:
                return (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">View Prescription</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700">Enter Patient ID to Fetch Prescription</label>
                            <input 
                                type="text" 
                                value={patientID} 
                                onChange={handlePatientIDChange} 
                                className="w-full p-2 border rounded-lg" 
                                placeholder="Enter Patient ID" 
                            />
                            <button 
                                onClick={() => fetchPrescription(patientID)} 
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4"
                            >
                                Fetch Prescription
                            </button>
                        </div>
                        {loading ? (
                            <p>Loading prescription data...</p>
                        ) : error ? (
                            <p className="text-red-600">{error}</p>
                        ) : prescription ? (
                            <div>
                                <h3>Prescription ID: {prescription.id}</h3>
                                <p><strong>Doctor:</strong> {prescription.doctor_id}</p>
                                <p><strong>Patient Name:</strong> {prescription.patient_name}</p>
                                <p><strong>Patient ID:</strong> {prescription.patient_id}</p>
                                <p><strong>Medication:</strong> {prescription.medication}</p>
                                <p><strong>Dosage:</strong> {prescription.dosage}</p>
                                <p><strong>Instructions:</strong> {prescription.instructions}</p>
                            </div>
                        ) : (
                            <p>No prescription data available</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                >
                    Logout
                </button>
            </div>

            <div className="flex space-x-4 mb-8">
                {[TABS.CREATE, TABS.VIEW].map((tab) => (
                    <button
                        key={tab}
                        className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
                            activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setActiveTab(tab)}
                        aria-selected={activeTab === tab}
                        role="tab"
                    >
                        {tab === TABS.CREATE ? 'Create Prescription' : 'View Patient Prescriptions'}
                    </button>
                ))}
            </div>

            <div role="tabpanel">
                {renderContent()}
            </div>
        </div>
    );
};

export default DoctorDashboard;