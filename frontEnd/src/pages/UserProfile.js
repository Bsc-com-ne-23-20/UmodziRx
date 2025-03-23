import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          setLoading(true);
          setError(null);

          console.log(`🚀 Exchanging code: ${code} for user info...`);

          // Exchange code for access token and user info
          const response = await axios.post('http://localhost:5000/token', { code });
          
          console.log("✅ User info fetched:", response.data);

          setUserInfo(response.data);
          localStorage.setItem('userInfo', JSON.stringify(response.data)); // Optional: Save to localStorage
        } catch (error) {
          console.error('❌ Error fetching user info:', error);
          setError('Failed to fetch user info. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        console.warn("⚠️ No code found in URL");
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading user info...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No user info available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-teal-700">User Profile</h2>
        <div className="space-y-2">
          <p><strong>Name:</strong> {userInfo.name || 'N/A'}</p>
          <p><strong>Email:</strong> {userInfo.email || 'N/A'}</p>
          {userInfo.phone && <p><strong>Phone:</strong> {userInfo.phone}</p>}
          {/* Add more user info fields as needed */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
