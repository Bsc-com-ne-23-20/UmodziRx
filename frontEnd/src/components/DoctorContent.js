import React, { useState, useRef, useEffect } from 'react';
import { FiPlusCircle, FiUsers, FiX, FiPlus} from 'react-icons/fi';

// sample meds
const MEDICATION_LIST = [
  'Panado',
  'Bufen',
  'Aspirin',
  'Magnesium',
  'Ibuprofen',
  'Paracetamol',
  'Amoxicillin',
  'Diclofenac',
  'Metformin',
  'Omeprazole'
].sort();

// sample frequencies
const FREQUENCY_OPTIONS = [
  'Once a day',
  'Twice a day',
  'Three times a day',
  'Four times a day',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'Before meals',
  'After meals',
  'At bedtime'
];

const DoctorContent = ({ activeView, handleNavigation }) => {
  const MOCK_PATIENTS = [
    { 
      id: 'PID-001',
      name: 'John Banda',
      age: 45,
      lastVisit: '2025-03-15',
      status: 'Dispensed',
      prescriptionId: 'RX-2025-001'
    },
    { 
      id: 'PID-002',
      name: 'Kennedy Katayamoyo',
      lastVisit: '2025-03-14',
      status: 'Pending',
      prescriptionId: 'RX-2025-002'
    },
    { 
      id: 'PID-003',
      name: 'Stacey Daza',
      lastVisit: '2025-03-13',
      status: 'Issued',
      prescriptionId: 'RX-2025-003'
    },
    {
      id: 'PID-004',
      name: 'Alice Banda',
      lastVisit: '2025-03-12',  
      status: 'Revoked',
      prescriptionId: 'RX-2025-004'
    }
  ];

  const [patients] = useState(MOCK_PATIENTS);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [verifiedPatient] = useState({
    name: localStorage.getItem('patientName') || 'Patient Name',
    id: localStorage.getItem('patientId') || 'PAT-ID'
  });
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', notes: '' }]
  });
  const [selectedMeds, setSelectedMeds] = useState(new Set());
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowPrescriptionModal(false);
      }
    };

    if (showPrescriptionModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPrescriptionModal]);

  const addMedication = () => {
    setPrescriptionForm(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', notes: '' }]
    }));
  };

  const removeMedication = (index) => {
    setPrescriptionForm(prev => {
      const medName = prev.medications[index].name;
      if (medName) {
        setSelectedMeds(prev => {
          const newSet = new Set(prev);
          newSet.delete(medName);
          return newSet;
        });
      }
      return {
        ...prev,
        medications: prev.medications.filter((_, i) => i !== index)
      };
    });
  };

  const handleMedicationChange = (index, field, value) => {
    setPrescriptionForm(prev => {
      const oldValue = prev.medications[index].name;
      const newMeds = prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      );
      
      if (field === 'name') {
        const newSelected = new Set(selectedMeds);
        if (oldValue) newSelected.delete(oldValue);
        if (value) newSelected.add(value);
        setSelectedMeds(newSelected);
      }
      
      return { ...prev, medications: newMeds };
    });
  };

  const handleSubmitPrescription = (e) => {
    e.preventDefault();
    console.log('Form data:', {
      patient: verifiedPatient,
      ...prescriptionForm
    });
    setShowPrescriptionModal(false);
  };

  const handleClearForm = () => {
    setPrescriptionForm({
      diagnosis: '',
      medications: [{ name: '', dosage: '', frequency: '', notes: '' }]
    });
    setSelectedMeds(new Set());
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return "flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100";
    
    return "flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100";
  };

  const getStatusDotColor = (status) => {
    if (!status) return "bg-gray-400";
    
    switch (status.toLowerCase()) {
      case 'dispensed':
        return "bg-green-500";
      case 'pending':
        return "bg-yellow-500";
      case 'issued':
        return "bg-blue-500";
      case 'revoked':
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const handlePatientRecords = () => {
    handleNavigation('patients');
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  const renderPatientsTable = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Patient Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Patient ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Prescription ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Last Visit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {patients.map(patient => (
            <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => handlePatientClick(patient)}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-300">{patient.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {patient.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {patient.prescriptionId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(patient.lastVisit).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={getStatusBadgeClass(patient.status)}>
                  <span className={`w-2 h-2 rounded-full ${getStatusDotColor(patient.status)}`}></span>
                  {patient.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto p-6">
      {activeView === 'dashboard' ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="grid grid-cols-2 gap-4 flex-1">
              <button 
                onClick={() => setShowPrescriptionModal(true)} 
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-3">
                  <FiPlusCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">New Prescription</span>
                </div>
              </button>
              <button onClick={handlePatientRecords} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all">
                <div className="flex items-center space-x-3">
                  <FiUsers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Patient Records</span>
                </div>
              </button>
            </div>
          </div>
          {renderPatientsTable()}
        </>
      ) : activeView === 'patients' ? (
        <>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Patient Management</h2>
          {renderPatientsTable()}
        </>
      ) : null}

      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[800px] max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700 px-8 py-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Create New Prescription</h3>
                <button 
                  onClick={() => setShowPrescriptionModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8">
              
              {/* Patient Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">Name</label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{verifiedPatient.name}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">ID</label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{verifiedPatient.id}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-gray-500 dark:text-gray-400">Allergies</label>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    {verifiedPatient.allergies || 'No known allergies'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitPrescription} className="space-y-6">
                {/* Medications Section */}
                <div className="space-y-4">
                  {prescriptionForm.medications.map((med, index) => (
                    <div 
                      key={index} 
                      className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm hover:border-gray-300 dark:hover:border-gray-500 transition-colors relative"
                    >
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Medication
                          </label>
                          <select
                            value={med.name}
                            onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-300 transition-shadow"
                            required
                          >
                            <option value="">Select medication</option>
                            {MEDICATION_LIST.map((medication) => (
                              <option 
                                key={medication} 
                                value={medication}
                                disabled={selectedMeds.has(medication) && medication !== med.name}
                              >
                                {medication}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Dosage
                          </label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-300 transition-shadow"
                            placeholder="Enter dosage"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Frequency
                          </label>
                          <select
                            value={med.frequency}
                            onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-300 transition-shadow"
                            required
                          >
                            <option value="">Select frequency</option>
                            {FREQUENCY_OPTIONS.map((freq) => (
                              <option key={freq} value={freq}>
                                {freq}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Notes
                          </label>
                          <input
                            type="text"
                            value={med.notes}
                            onChange={(e) => handleMedicationChange(index, 'notes', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-300 transition-shadow"
                            placeholder="Additional notes"
                          />
                        </div>
                      </div>
                      {prescriptionForm.medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center border border-red-200 transition-colors"
                          title="Remove medication"
                        >
                          <span className="text-sm font-medium">−</span>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMedication}
                    className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    <FiPlus className="w-4 h-4 mr-1" /> Add Another Medication
                  </button>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-8 py-6 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Create Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[800px] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Patient Details</h3>
              <button
                onClick={() => setShowPatientModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8">
              {/* Patient Data Section */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Patient Data</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600"><strong>Name:</strong> {selectedPatient.name}</p>
                    <p className="text-sm text-gray-600"><strong>ID:</strong> {selectedPatient.id}</p>
                    <p className="text-sm text-gray-600"><strong>Age:</strong> {selectedPatient.age}</p>
                    <p className="text-sm text-gray-600"><strong>Last Visit:</strong> {selectedPatient.lastVisit}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Allergies</h4>
                  <textarea
                    defaultValue={selectedPatient.allergies || 'No known allergies'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  />
                </div>
              </div>

              {/* Prescriptions Section */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Active Prescriptions</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Prescription ID: {selectedPatient.prescriptionId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {selectedPatient.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorContent;
