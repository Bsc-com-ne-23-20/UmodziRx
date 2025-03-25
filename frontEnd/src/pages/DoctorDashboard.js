import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TABS = {
  CREATE: 'CREATE',
  VIEW: 'VIEW'
};

const DoctorDashboard = () => {
<<<<<<< HEAD
=======

>>>>>>> 025e4b0dc9d1a498cd16da7c0c589938a649dbc2
  const [activeTab, setActiveTab] = useState(TABS.CREATE);
  const [formData, setFormData] = useState({
    doctorId: 'doctor1',
    patientId: 'patient1',
    patientName: 'John Doe',
    medications: [{ medicationName: 'Paracetamol', dosage: '500mg', instructions: 'Take twice daily' }]
  });
  const [patientIdSearch, setPatientIdSearch] = useState('patient1');
  const [prescriptionHistory, setPrescriptionHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === TABS.VIEW) {
      fetchPrescription();
    }
  }, [activeTab]);


  const fetchPrescription = async () => {
    if (!patientIdSearch) {
      setError('Please enter a Patient ID');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/prescriptions', {
        params: { patientId: patientIdSearch }
      });
      setPrescriptionHistory(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch prescription');
      setPrescriptionHistory(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const medications = [...formData.medications];
    medications[index][name] = value;
    setFormData({ ...formData, medications });
  };

  const handleAddMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { medicationName: '', dosage: '', instructions: '' }]
    });
  };

<<<<<<< HEAD
=======

>>>>>>> 025e4b0dc9d1a498cd16da7c0c589938a649dbc2
  const handleRemoveMedication = (index) => {
    const medications = [...formData.medications];
    medications.splice(index, 1);
    setFormData({ ...formData, medications });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        patientName: formData.patientName,
        prescriptions: formData.medications
      };

      const response = await axios.post('http://localhost:5000/prescriptions', payload);
      
      setSuccess('Prescription created successfully!');
      setFormData({
        ...formData,
        medications: [{ medicationName: '', dosage: '', instructions: '' }]
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('Login');
    navigate('/');
  };

<<<<<<< HEAD
=======

>>>>>>> 025e4b0dc9d1a498cd16da7c0c589938a649dbc2
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">modziRx</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Doctor Dashboard</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex space-x-2 mb-6">
          <button
            className={`px-4 py-2 rounded-t-lg ${activeTab === TABS.CREATE ? 'bg-white border-b-2 border-blue-500' : 'bg-gray-200'}`}
            onClick={() => setActiveTab(TABS.CREATE)}
          >
            Create Prescription
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg ${activeTab === TABS.VIEW ? 'bg-white border-b-2 border-blue-500' : 'bg-gray-200'}`}
            onClick={() => setActiveTab(TABS.VIEW)}
          >
            View Prescriptions
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {activeTab === TABS.CREATE ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">Create Prescription</h2>
              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
              {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Doctor ID</label>
                    <input
                      type="text"
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Patient ID</label>
                    <input
                      type="text"
                      name="patientId"
                      value={formData.patientId}
                      onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Patient Name</label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Medications</h3>
                  {formData.medications.map((med, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        <div>
                          <label className="block text-gray-700 mb-1">Medication Name</label>
                          <input
                            type="text"
                            name="medicationName"
                            value={med.medicationName}
                            onChange={(e) => handleChange(e, index)}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1">Dosage</label>
                          <input
                            type="text"
                            name="dosage"
                            value={med.dosage}
                            onChange={(e) => handleChange(e, index)}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1">Instructions</label>
                          <input
                            type="text"
                            name="instructions"
                            value={med.instructions}
                            onChange={(e) => handleChange(e, index)}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                      </div>
                      {formData.medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedication(index)}
                          className="text-red-600 text-sm"
                        >
                          Remove Medication
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Add Medication
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {loading ? 'Submitting...' : 'Create Prescription'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4">View Prescription History</h2>
              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
              
              <div className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={patientIdSearch}
                    onChange={(e) => setPatientIdSearch(e.target.value)}
                    placeholder="Enter Patient ID"
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    onClick={fetchPrescription}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    Search
                  </button>
                </div>
              </div>

              {loading && <p className="text-center">Loading...</p>}
              
              {prescriptionHistory ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">Patient Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-gray-600">Patient ID:</p>
                        <p className="font-medium">{prescriptionHistory.patientId}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Patient Name:</p>
                        <p className="font-medium">{prescriptionHistory.patientName}</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mt-6">Prescription Records</h3>
                  
                  {prescriptionHistory.prescriptions?.length > 0 ? (
                    prescriptionHistory.prescriptions.map((prescription, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-gray-600">Medication:</p>
                            <p className="font-medium">{prescription.medicationName}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Dosage:</p>
                            <p className="font-medium">{prescription.dosage}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Instructions:</p>
                            <p className="font-medium">{prescription.instructions}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Prescribed On:</p>
                            <p className="font-medium">
                              {new Date(prescription.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-gray-600">Prescribed By:</p>
                          <p className="font-medium">Doctor ID: {prescription.doctorId}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No prescription records found</p>
                  )}
                </div>
              ) : (
                !loading && <p className="text-gray-500">No prescription history found. Please search by Patient ID.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;