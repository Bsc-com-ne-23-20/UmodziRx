import React, { useState, useRef, useEffect } from 'react';
import { FiPlusCircle, FiUsers, FiX, FiPlus } from 'react-icons/fi';
import TableHeader from '../components/TableHeader';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Add this near other imports at the top

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

const MEDICATION_CATEGORIES = {
  'Pain Relief': ['Panado', 'Aspirin', 'Ibuprofen', 'Diclofenac'],
  'Antibiotics': ['Amoxicillin', 'Penicillin', 'Azithromycin'],
  'Cardiovascular': ['Metoprolol', 'Amlodipine', 'Lisinopril'],
  'Diabetes': ['Metformin', 'Insulin', 'Glibenclamide'],
  'Gastrointestinal': ['Omeprazole', 'Ranitidine', 'Buscopan'],
  'Supplements': ['Magnesium', 'Vitamin B', 'Calcium'],
};

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
  const location = useLocation(); // Add this near other imports at the top

  const MOCK_STATISTICS = {
    totalPrescriptions: 156,
    totalPatients: 89,
    pendingPrescriptions: 12,
    thisMonthPrescriptions: 23,
    averagePrescriptionsPerDay: 5,
    completedPrescriptions: 120
  };

  const MOCK_PATIENTS = [
    { 
      id: 'PID-001',
      name: 'John Banda',
      age: 45,
      lastVisit: '2025-03-15',
      status: 'Completed',
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

  const MOCK_RECENT_PRESCRIPTIONS = [
    {
      id: 'RX-2025-001',
      patientName: 'John Banda',
      patientId: 'PID-001',
      medications: 'Paracetamol, Amoxicillin',
      issuedDate: '2025-03-15',
      status: 'Completed'
    },
    {
      id: 'RX-2025-002',
      patientName: 'Mary Phiri',
      patientId: 'PID-005',
      medications: 'Ibuprofen',
      issuedDate: '2025-03-15',
      status: 'Pending'
    },
    {
      id: 'RX-2025-003',
      patientName: 'James Mbewe',
      patientId: 'PID-008',
      medications: 'Aspirin, Magnesium',
      issuedDate: '2025-03-14',
      status: 'Completed'
    },
    {
      id: 'RX-2025-004',
      patientName: 'Grace Chirwa',
      patientId: 'PID-012',
      medications: 'Metformin',
      issuedDate: '2025-03-14',
      status: 'Pending'
    }
  ];

  const [patients] = useState(MOCK_PATIENTS);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [verifiedPatient, setVerifiedPatient] = useState({
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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(MOCK_PATIENTS);
  const [recentPrescriptions, setRecentPrescriptions] = useState(MOCK_RECENT_PRESCRIPTIONS);
  const [prescriptionSearchTerm, setPrescriptionSearchTerm] = useState('');
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [medicationIndex, setMedicationIndex] = useState(null);
  const [searchMedication, setSearchMedication] = useState('');
  const [filteredRecentPrescriptions, setFilteredRecentPrescriptions] = useState(MOCK_RECENT_PRESCRIPTIONS);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [retrievedPatient, setRetrievedPatient] = useState(null);
  const [error, setError] = useState(null);
  const [isPatientVerified, setIsPatientVerified] = useState(false);

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

  useEffect(() => {
    if (showVerificationModal) {
      const nonce = generateRandomString(16);
      const state = generateRandomString(16);

      const renderButton = () => {
        window.SignInWithEsignetButton?.init({
          oidcConfig: {
            acr_values: 'mosip:idp:acr:generated-code mosip:idp:acr:biometricr:static-code',
            claims_locales: 'en',
            client_id: process.env.REACT_APP_ESIGNET_CLIENT_ID,
            redirect_uri: process.env.REACT_APP_ESIGNET_REDIRECT_URI_DOCTOR,
            display: 'popup',
            nonce: nonce,
            prompt: 'consent',
            scope: 'openid profile',
            state: state,
            ui_locales: 'en',
            authorizeUri: process.env.REACT_APP_ESIGNET_AUTHORIZE_URI,
          },
          buttonConfig: {
            labelText: 'Verify Patient with eSignet',
            shape: 'rounded',
            theme: 'filled_blue',
            type: 'standard'
          },
          signInElement: document.getElementById('esignet-modal-button'),
          onSuccess: (response) => {
            console.log('Patient verification successful:', response);
            const verifiedPatientData = {
              id: response.sub || response.patientId,
              name: response.name || 'Verified Patient',
              birthday: response.birthdate || 'N/A'
            };
            setRetrievedPatient(verifiedPatientData);
            setVerifiedPatient(verifiedPatientData); // Update verifiedPatient state
            localStorage.setItem('patientName', verifiedPatientData.name);
            localStorage.setItem('patientId', verifiedPatientData.id);
            setIsPatientVerified(true); // Set verification flag
            setShowVerificationModal(false);
          },
          onFailure: (error) => {
            console.error('Patient verification failed:', error);
            setError('Patient verification failed. Please try again.');
          }
        });
      };

      if (!window.SignInWithEsignetButton) {
        const script = document.createElement('script');
        script.src = process.env.REACT_APP_ESIGNET_SDK_URL;
        script.onload = renderButton;
        document.body.appendChild(script);
      } else {
        renderButton();
      }
    }
  }, [showVerificationModal]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedPatient = urlParams.get('patient');

    if (encodedPatient) {
      try {
        const decodedString = atob(encodedPatient.replace(/-/g, '+').replace(/_/g, '/'));
        const patient = JSON.parse(decodedString);
        
        setVerifiedPatient(patient);
        setRetrievedPatient(patient);
        localStorage.setItem('patientName', patient.name);
        localStorage.setItem('patientId', patient.id);
        setIsPatientVerified(true);
      } catch (e) {
        console.error('Error parsing patient data:', e);
        setError('Failed to load patient data after verification');
      }
    }
  }, [location.search]);

  const generateRandomString = (length) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return randomString;
  };

  const handleVerifyClick = () => {
    setShowVerificationModal(true);
    setRetrievedPatient(null);
    setError(null);
    setIsPatientVerified(false);
  };

  const filterOptions = [
    { label: 'All Patients', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Issued', value: 'issued' },
    { label: 'Revoked', value: 'revoked' }
  ];

  const recentPrescriptionsFilterOptions = [
    { label: 'All Prescriptions', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' }
  ];

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

  const handleSubmitPrescription = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!retrievedPatient) {
      setError('Please verify a patient before creating a prescription.');
      return;
    }

    if (!prescriptionForm.diagnosis.trim()) {
      setError('Diagnosis is required.');
      return;
    }

    if (prescriptionForm.medications.some(med => !med.name || !med.dosage || !med.frequency)) {
      setError('All medication fields (name, dosage, frequency) are required.');
      return;
    }

    try {
      setError(null); // Clear any previous errors
      console.log('Submitting prescription:', {
        patient: retrievedPatient,
        ...prescriptionForm,
      });

      // Example API call (replace with your actual endpoint)
      const response = await axios.post('/api/prescriptions', {
        patient: retrievedPatient,
        ...prescriptionForm,
      });

      if (response.status === 200) {
        alert('Prescription created successfully!');
        setShowPrescriptionModal(false);
        handleClearForm();
      } else {
        throw new Error('Failed to create prescription.');
      }
    } catch (err) {
      console.error('Error submitting prescription:', err);
      setError('Failed to create prescription. Please try again.');
    }
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
    
    switch (status.toLowerCase()) {
      case 'completed':
        return "flex items-center gap-2 text-sm text-green-600 dark:text-green-400";
      case 'pending':
        return "flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400";
      case 'issued':
        return "flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400";
      case 'revoked':
        return "flex items-center gap-2 text-sm text-red-600 dark:text-red-400";
      default:
        return "flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100";
    }
  };

  const getStatusDotColor = (status) => {
    if (!status) return "bg-gray-400";
    
    switch (status.toLowerCase()) {
      case 'completed':
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

  const handleSearch = () => {
    setSearchTerm(searchInput);
    const filtered = MOCK_PATIENTS.filter(patient => {
      const search = searchInput.toLowerCase();
      const prescriptionMatch = MOCK_RECENT_PRESCRIPTIONS.find(prescription => 
        prescription.patientId === patient.id && 
        prescription.medications.toLowerCase().includes(search)
      );
      
      return (
        patient.name.toLowerCase().includes(search) ||
        patient.id.toLowerCase().includes(search) ||
        patient.prescriptionId.toLowerCase().includes(search) ||
        (prescriptionMatch !== undefined)
      );
    });
    setFilteredPatients(filtered);
  };

  const handleSearchReset = () => {
    setSearchTerm('');
    setSearchInput('');
    setFilteredPatients(MOCK_PATIENTS);
  };

  const handleFilter = (filterValue) => {
    if (filterValue === 'all') {
      setFilteredPatients(MOCK_PATIENTS);
      return;
    }
    const filtered = MOCK_PATIENTS.filter(patient => 
      patient.status.toLowerCase() === filterValue
    );
    setFilteredPatients(filtered);
  };

  const handlePrescriptionSearch = (searchTerm) => {
    setPrescriptionSearchTerm(searchTerm);
    if (!searchTerm) {
      setFilteredRecentPrescriptions(MOCK_RECENT_PRESCRIPTIONS);
      return;
    }
    const searchLower = searchTerm.toLowerCase();
    const filtered = MOCK_RECENT_PRESCRIPTIONS.filter(prescription => 
      prescription.patientName.toLowerCase().includes(searchLower) ||
      prescription.id.toLowerCase().includes(searchLower) ||
      prescription.patientId.toLowerCase().includes(searchLower) ||
      prescription.medications.toLowerCase().includes(searchLower)
    );
    setFilteredRecentPrescriptions(filtered);
  };

  const handleMedicationSelect = (medication) => {
    if (medicationIndex !== null) {
      handleMedicationChange(medicationIndex, 'name', medication);
      setShowMedicationModal(false);
      setShowPrescriptionModal(true);
    }
  };

  const handleRecentPrescriptionsFilter = (filterValue) => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    let filtered;
    switch (filterValue) {
      case 'today':
        filtered = MOCK_RECENT_PRESCRIPTIONS.filter(prescription => 
          new Date(prescription.issuedDate).toDateString() === today.toDateString()
        );
        break;
      case 'week':
        filtered = MOCK_RECENT_PRESCRIPTIONS.filter(prescription => 
          new Date(prescription.issuedDate) >= oneWeekAgo
        );
        break;
      case 'pending':
      case 'completed':
        filtered = MOCK_RECENT_PRESCRIPTIONS.filter(prescription => 
          prescription.status.toLowerCase() === filterValue
        );
        break;
      default:
        filtered = MOCK_RECENT_PRESCRIPTIONS;
    }
    setFilteredRecentPrescriptions(filtered);
  };

  const renderDashboard = () => (
    <div className="flex flex-col h-full gap-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Prescriptions</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{MOCK_STATISTICS.totalPrescriptions}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Patients</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{MOCK_STATISTICS.totalPatients}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{MOCK_STATISTICS.thisMonthPrescriptions}</span>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-gray-800 rounded-lg border border-yellow-200 dark:border-gray-700 p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending</span>
            <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{MOCK_STATISTICS.pendingPrescriptions}</span>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-gray-800 rounded-lg border border-green-200 dark:border-gray-700 p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Completed</span>
            <span className="text-2xl font-bold text-green-700 dark:text-green-300">{MOCK_STATISTICS.completedPrescriptions}</span>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-gray-700 p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Daily Prescription Count</span>
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{MOCK_STATISTICS.averagePrescriptionsPerDay}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex-1">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recent Prescriptions</h3>
        </div>
        <div className="overflow-x-auto max-h-[calc(100vh-400px)]">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Prescription ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Medications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Issued Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {Array.isArray(MOCK_RECENT_PRESCRIPTIONS) && MOCK_RECENT_PRESCRIPTIONS.map((prescription) => (
                <tr key={prescription.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {prescription.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{prescription.patientName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{prescription.patientId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {prescription.medications}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(prescription.issuedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadgeClass(prescription.status)}>
                      <span className={`w-2 h-2 rounded-full ${getStatusDotColor(prescription.status)}`}></span>
                      {prescription.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <TableHeader
        title="Patient Management"
        searchPlaceholder="Search patients..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchReset={handleSearchReset}
        filterOptions={filterOptions}
      />
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
          {filteredPatients.length > 0 ? (
            filteredPatients.map(patient => (
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
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  No patients found
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderPrescriptions = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <TableHeader
        title="Prescription History"
        searchPlaceholder="Search prescriptions..."
        onSearch={handlePrescriptionSearch}
        onFilter={handleRecentPrescriptionsFilter}
        searchValue={prescriptionSearchTerm}
        onSearchChange={setPrescriptionSearchTerm}
        filterOptions={recentPrescriptionsFilterOptions}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Prescription ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Medications
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRecentPrescriptions.length > 0 ? (
              filteredRecentPrescriptions.map((prescription) => (
                <tr key={prescription.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(prescription.issuedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {prescription.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{prescription.patientName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{prescription.patientId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {prescription.medications}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadgeClass(prescription.status)}>
                      <span className={`w-2 h-2 rounded-full ${getStatusDotColor(prescription.status)}`}></span>
                      {prescription.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No prescriptions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMedicationModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[600px] max-h-[80vh] overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Select Medication</h3>
          <button onClick={() => setShowMedicationModal(false)} className="text-gray-500 hover:text-gray-700">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <input
            type="text"
            placeholder="Search medications..."
            value={searchMedication}
            onChange={(e) => setSearchMedication(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4"
          />

          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.keys(MEDICATION_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-3 text-left rounded-lg border ${
                  selectedCategory === category
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
              >
                <span className="text-sm font-medium">{category}</span>
              </button>
            ))}
          </div>

          {selectedCategory && (
            <div className="border rounded-lg divide-y">
              {MEDICATION_CATEGORIES[selectedCategory]
                .filter(med => med.toLowerCase().includes(searchMedication.toLowerCase()))
                .map((medication) => (
                  <button
                    key={medication}
                    onClick={() => handleMedicationSelect(medication)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center"
                  >
                    <span>{medication}</span>
                    <FiPlus className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderVerificationModal = () => {
    if (!showVerificationModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full m-4">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Verify Patient</h3>
            <button
              onClick={() => setShowVerificationModal(false)}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <div className="px-6 py-8">
            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Please verify the patient's identity using eSignet to proceed
              </p>
              <div id="esignet-modal-button" className="flex justify-center"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPatientModal = () => {
    if (!showPatientModal || !selectedPatient) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full m-4">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Patient Details</h3>
            <button 
              onClick={() => setShowPatientModal(false)}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient Name</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedPatient.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient ID</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedPatient.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Visit</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {new Date(selectedPatient.lastVisit).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prescription ID</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedPatient.prescriptionId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                <p className="mt-1">
                  <span className={getStatusBadgeClass(selectedPatient.status)}>
                    <span className={`w-2 h-2 rounded-full ${getStatusDotColor(selectedPatient.status)}`}></span>
                    {selectedPatient.status}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPatientModal(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleAddPrescriptionClick = () => {
    if (!retrievedPatient) {
      setShowVerificationModal(true);
      setRetrievedPatient(null);
      setError(null);
      setIsPatientVerified(false);
    } else {
      setShowPrescriptionModal(true);
    }
    
    // Navigate to add-prescription view if not already there
    if (activeView !== 'add-prescription') {
      handleNavigation('add-prescription');
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard();
      case 'patients':
        return renderPatients();
      case 'add-prescription':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Create New Prescription</h2>
            {!retrievedPatient && (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Please verify a patient first</p>
                <button
                  onClick={handleVerifyClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Verify Patient with eSignet
                </button>
              </div>
            )}
            {retrievedPatient && renderPrescriptionForm()}
          </div>
        );
      case 'prescription-history':
        return renderPrescriptions();
      default:
        return renderDashboard();
    }
  };

  const renderPrescriptionForm = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">Name</label>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{retrievedPatient.name}</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">ID</label>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{retrievedPatient.id}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitPrescription} className="space-y-6">
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
                  <button
                    type="button"
                    onClick={() => {
                      setMedicationIndex(index);
                      setShowMedicationModal(true);
                    }}
                    className="w-full px-3 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-300"
                  >
                    {med.name || 'Select medication'}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-300"
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
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-300"
                    required
                  >
                    <option value="">Select frequency</option>
                    {FREQUENCY_OPTIONS.map((freq) => (
                      <option key={freq} value={freq}>{freq}</option>
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
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-300"
                    placeholder="Additional notes"
                  />
                </div>
              </div>
              {prescriptionForm.medications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center border border-red-200"
                >
                  <span className="text-sm font-medium">−</span>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addMedication}
            className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            <FiPlus className="w-4 h-4 mr-1" /> Add Another Medication
          </button>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClearForm}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Clear
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Create Prescription
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="relative min-h-full">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded mb-4">
          {error}
        </div>
      )}
      {renderContent()}
      {showMedicationModal && renderMedicationModal()}
      {showVerificationModal && renderVerificationModal()}
      {showPatientModal && selectedPatient && renderPatientModal()}

      {/* Floating Action Button */}
      <button
        onClick={handleAddPrescriptionClick}
        className="fixed bottom-8 right-8 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-50"
        title="Create New Prescription"
      >
        <FiPlus className="h-6 w-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-in-out">
          New Prescription
        </span>
      </button>
    </div>
  );
};

export default DoctorContent;
