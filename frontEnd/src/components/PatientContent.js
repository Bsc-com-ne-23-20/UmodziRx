import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMapPin, FiNavigation, FiClock, FiPhone, FiInfo } from 'react-icons/fi';

const PatientContent = ({ activeView }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationType, setLocationType] = useState(''); // 'hospital' or 'pharmacy'

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const patientId = localStorage.getItem('patientId');
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/patient/prescriptions`, {
        params: { patientId },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPrescriptions(response.data.data.prescriptions || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'prescriptions') {
      fetchPrescriptions();
    }
  }, [activeView]);

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setError("Unable to get your location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const findNearbyLocations = (type) => {
    if (!userLocation) {
      getUserLocation();
    }
    setLocationType(type);
    setShowLocationModal(true);
    const mockLocations = [
      {
        id: 1,
        name: type === 'hospital' ? 'Central Hospital' : 'City Pharmacy',
        distance: '0.5 km',
        address: '123 Main St',
        isOpen: true
      },
      {
        id: 2,
        name: type === 'hospital' ? 'General Hospital' : 'Health Pharmacy',
        distance: '1.2 km',
        address: '456 Oak Ave',
        isOpen: true
      },
      {
        id: 3,
        name: type === 'hospital' ? 'Community Hospital' : 'Quick Pharmacy',
        distance: '2.3 km',
        address: '789 Pine St',
        isOpen: false
      }
    ];
    setNearbyLocations(mockLocations);
  };

  const openDirections = (location) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${encodeURIComponent(location.address)}`;
      window.open(url, '_blank');
    }
  };

  const renderLocationModal = () => {
    if (!showLocationModal) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full m-4 transform transition-all duration-300">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl">
            <h3 className="text-xl font-semibold text-white">
              Nearby {locationType === 'hospital' ? 'Hospitals' : 'Pharmacies'}
            </h3>
            <button 
              onClick={() => setShowLocationModal(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {nearbyLocations.map((location) => (
              <div key={location.id} 
                className="mb-4 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{location.name}</h4>
                    <div className="space-y-2">
                      <p className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FiMapPin className="w-4 h-4 mr-2" />
                        {location.address}
                      </p>
                      <p className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FiClock className="w-4 h-4 mr-2" />
                        Distance: {location.distance}
                      </p>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          location.isOpen 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          <span className={`w-2 h-2 mr-2 rounded-full ${
                            location.isOpen ? 'bg-green-600' : 'bg-red-600'
                          }`}></span>
                          {location.isOpen ? 'Open Now' : 'Closed'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => openDirections(location)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                    >
                      <FiNavigation className="mr-2" />
                      Get Directions
                    </button>
                    <button className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <FiPhone className="mr-2" />
                      Call
                    </button>
                    <button className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <FiInfo className="mr-2" />
                      More Info
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPrescriptions = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {prescriptions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Medication</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Dosage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {prescriptions.map((prescription, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{prescription.medicationName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{prescription.dosage}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(prescription.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {prescription.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No prescriptions found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderMedicalRecords = () => (
    <div className="text-center py-8">
      <p className="text-gray-500 dark:text-gray-400">Medical records feature coming soon</p>
    </div>
  );

  const renderHealthcareLocations = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">Find Healthcare Facilities</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <button
            onClick={() => findNearbyLocations('hospital')}
            className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90 transition-all duration-300 group-hover:opacity-100"></div>
            <div className="relative p-8 text-center">
              <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
                <FiMapPin className="w-12 h-12 mx-auto text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Find Hospitals</h3>
              <p className="text-blue-100 text-sm">Locate nearest hospitals and medical centers</p>
              <div className="mt-6 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm">
                  <FiNavigation className="mr-2" /> Get Directions
                </span>
              </div>
            </div>
          </button>

          <button
            onClick={() => findNearbyLocations('pharmacy')}
            className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-90 transition-all duration-300 group-hover:opacity-100"></div>
            <div className="relative p-8 text-center">
              <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
                <FiMapPin className="w-12 h-12 mx-auto text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Find Pharmacies</h3>
              <p className="text-green-100 text-sm">Locate nearest pharmacies and drugstores</p>
              <div className="mt-6 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm">
                  <FiNavigation className="mr-2" /> Get Directions
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}
      
      {activeView === 'prescriptions' && renderPrescriptions()}
      {activeView === 'records' && renderMedicalRecords()}
      {activeView === 'locations' && renderHealthcareLocations()}
      {renderLocationModal()}
    </div>
  );
};

export default PatientContent;
