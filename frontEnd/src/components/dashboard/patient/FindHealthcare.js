import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';

const FindHealthcare = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNearby = async (type) => {
    setLoading(true);
    setError('');
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      // Use OpenStreetMap Overpass API
      const query = `
        [out:json];
        node["amenity"="${type}"](around:3000,${latitude},${longitude});
        out body;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setPlaces(data.elements || []);
      } catch (e) {
        setError('Failed to fetch nearby locations.');
      }
      setLoading(false);
    }, () => {
      setError('Unable to retrieve your location');
      setLoading(false);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Find Healthcare Near You</h2>
      <p className="mb-8 text-gray-600 dark:text-gray-300">Quickly locate the nearest hospital or pharmacy in your area.</p>
      <div className="flex gap-6 mb-6">
        <button
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors text-lg font-medium"
          onClick={() => fetchNearby('hospital')}
        >
          <FiMapPin className="mr-2 h-5 w-5" />
          Nearest Hospital
        </button>
        <button
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors text-lg font-medium"
          onClick={() => fetchNearby('pharmacy')}
        >
          <FiMapPin className="mr-2 h-5 w-5" />
          Nearest Pharmacy
        </button>
      </div>
      {loading && <div className="text-blue-600">Loading nearby locations...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {places.length > 0 && (
        <div className="w-full max-w-xl mt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Nearby Results:</h3>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {places.map((place, idx) => (
              <li key={place.id || idx} className="py-2 flex flex-col">
                <span className="font-medium text-gray-800 dark:text-gray-100">{place.tags?.name || 'Unnamed'}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{place.tags?.amenity}</span>
                <span className="text-xs text-gray-400">Lat: {place.lat}, Lon: {place.lon}</span>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=18/${place.lat}/${place.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline text-xs mt-1"
                >
                  View on Map
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FindHealthcare;
