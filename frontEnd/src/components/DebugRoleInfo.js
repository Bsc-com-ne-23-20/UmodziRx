import React, { useState } from 'react';
import { FiCode, FiX, FiInfo } from 'react-icons/fi';
import { getCurrentUserRole, getRoleSpecificItem, clearRoleSpecificStorage } from '../utils/storageUtils';

/**
 * Debug component to display current role information
 * Useful for development and troubleshooting
 */
const DebugRoleInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
    // Get all relevant information from localStorage
  const userRole = getCurrentUserRole() || 'Not set';
  
  // Get role-specific user data
  let userId = 'Not set';
  let userName = 'Not set';
  let userEmail = 'Not set';
  let userBirthday = 'Not set';
  let userGender = 'Not set';
  
  if (userRole === 'doctor') {
    userId = getRoleSpecificItem('doctorId', userRole) || getRoleSpecificItem('userId', userRole) || 'Not set';
    userName = getRoleSpecificItem('doctorName', userRole) || getRoleSpecificItem('userName', userRole) || 'Not set';
    userEmail = getRoleSpecificItem('doctorEmail', userRole) || getRoleSpecificItem('userEmail', userRole) || 'Not set';
    userBirthday = getRoleSpecificItem('doctorBirthday', userRole) || getRoleSpecificItem('userBirthday', userRole) || 'Not set';
    userGender = getRoleSpecificItem('doctorGender', userRole) || getRoleSpecificItem('userGender', userRole) || 'Not set';
  } else if (userRole === 'pharmacist') {
    userId = getRoleSpecificItem('pharmaId', userRole) || getRoleSpecificItem('userId', userRole) || 'Not set';
    userName = getRoleSpecificItem('pharmaName', userRole) || getRoleSpecificItem('userName', userRole) || 'Not set';
    userEmail = getRoleSpecificItem('pharmaEmail', userRole) || getRoleSpecificItem('userEmail', userRole) || 'Not set';
    userBirthday = getRoleSpecificItem('pharmaBirthday', userRole) || getRoleSpecificItem('userBirthday', userRole) || 'Not set';
    userGender = getRoleSpecificItem('pharmaGender', userRole) || getRoleSpecificItem('userGender', userRole) || 'Not set';
  } else if (userRole === 'patient') {
    userId = getRoleSpecificItem('patientId', userRole) || getRoleSpecificItem('userId', userRole) || 'Not set';
    userName = getRoleSpecificItem('patientName', userRole) || getRoleSpecificItem('userName', userRole) || 'Not set';
    userEmail = getRoleSpecificItem('patientEmail', userRole) || getRoleSpecificItem('userEmail', userRole) || 'Not set';
    userBirthday = getRoleSpecificItem('patientBirthday', userRole) || getRoleSpecificItem('userBirthday', userRole) || 'Not set';
    userGender = getRoleSpecificItem('patientGender', userRole) || getRoleSpecificItem('userGender', userRole) || 'Not set';
  } else if (userRole === 'admin') {
    userId = getRoleSpecificItem('adminId', userRole) || getRoleSpecificItem('userId', userRole) || 'Not set';
    userName = getRoleSpecificItem('adminName', userRole) || getRoleSpecificItem('userName', userRole) || 'Not set';
    userEmail = getRoleSpecificItem('adminEmail', userRole) || getRoleSpecificItem('userEmail', userRole) || 'Not set';
    userBirthday = getRoleSpecificItem('adminBirthday', userRole) || getRoleSpecificItem('userBirthday', userRole) || 'Not set';
    userGender = getRoleSpecificItem('adminGender', userRole) || getRoleSpecificItem('userGender', userRole) || 'Not set';
  } else {
    userId = getRoleSpecificItem('userId', userRole) || 'Not set';
    userName = getRoleSpecificItem('userName', userRole) || 'Not set';
    userEmail = getRoleSpecificItem('userEmail', userRole) || 'Not set';
    userBirthday = getRoleSpecificItem('userBirthday', userRole) || 'Not set';
    userGender = getRoleSpecificItem('userGender', userRole) || 'Not set';
  }
  const currentPath = window.location.pathname;
  
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        aria-label="Show debug info"
      >
        <FiCode size={20} />
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-80 z-50 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
          <FiInfo className="mr-2" /> Role Debug Info
        </h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close debug panel"
        >
          <FiX size={18} />
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
          <p className="text-gray-500 dark:text-gray-400">Current Path:</p>
          <p className="font-mono text-gray-800 dark:text-gray-200">{currentPath}</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
          <p className="text-gray-500 dark:text-gray-400">User Role:</p>
          <p className="font-mono text-gray-800 dark:text-gray-200">{userRole}</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
          <p className="text-gray-500 dark:text-gray-400">{userRole === 'doctor' ? 'Doctor ID' : 
                                                          userRole === 'patient' ? 'Patient ID' : 
                                                          userRole === 'pharmacist' ? 'Pharmacist ID' : 
                                                          userRole === 'admin' ? 'Admin ID' : 'User ID'}:</p>
          <p className="font-mono text-gray-800 dark:text-gray-200">{userId}</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
          <p className="text-gray-500 dark:text-gray-400">{userRole === 'doctor' ? 'Doctor Name' : 
                                                          userRole === 'patient' ? 'Patient Name' : 
                                                          userRole === 'pharmacist' ? 'Pharmacist Name' : 
                                                          userRole === 'admin' ? 'Admin Name' : 'User Name'}:</p>
          <p className="font-mono text-gray-800 dark:text-gray-200">{userName}</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
          <p className="text-gray-500 dark:text-gray-400">{userRole === 'doctor' ? 'Doctor Email' : 
                                                          userRole === 'patient' ? 'Patient Email' : 
                                                          userRole === 'pharmacist' ? 'Pharmacist Email' : 
                                                          userRole === 'admin' ? 'Admin Email' : 'User Email'}:</p>
          <p className="font-mono text-gray-800 dark:text-gray-200">{userEmail}</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
          <p className="text-gray-500 dark:text-gray-400">{userRole === 'doctor' ? 'Doctor Birthday' : 
                                                          userRole === 'patient' ? 'Patient Birthday' : 
                                                          userRole === 'pharmacist' ? 'Pharmacist Birthday' : 
                                                          userRole === 'admin' ? 'Admin Birthday' : 'User Birthday'}:</p>
          <p className="font-mono text-gray-800 dark:text-gray-200">{userBirthday}</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
          <p className="text-gray-500 dark:text-gray-400">{userRole === 'doctor' ? 'Doctor Gender' : 
                                                          userRole === 'patient' ? 'Patient Gender' : 
                                                          userRole === 'pharmacist' ? 'Pharmacist Gender' : 
                                                          userRole === 'admin' ? 'Admin Gender' : 'User Gender'}:</p>
          <p className="font-mono text-gray-800 dark:text-gray-200">{userGender}</p>
        </div>
      </div>
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            const currentRole = getCurrentUserRole();
            if (currentRole) {
              clearRoleSpecificStorage(currentRole);
            }
            window.location.reload();
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm transition-colors"
        >
          Clear Role Storage & Reload
        </button>
      </div>
    </div>
  );
};

export default DebugRoleInfo;