import { getRoleSpecificItem, getCurrentUserRole } from '../utils/storageUtils';

/**
 * Get the authentication token for the current user
 * 
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
  const currentRole = getCurrentUserRole();
  return getRoleSpecificItem('token', currentRole);
};

/**
 * Get the user ID for the current user
 * 
 * @param {string} specificKey - Optional specific key to look for (e.g., 'pharmaId')
 * @returns {string|null} The user ID or null if not found
 */
export const getUserId = (specificKey = null) => {
  const currentRole = getCurrentUserRole();
  
  if (specificKey) {
    return getRoleSpecificItem(specificKey, currentRole) || 
           getRoleSpecificItem('userId', currentRole);
  }
  
  // Get the appropriate ID based on role
  if (currentRole === 'doctor') {
    return getRoleSpecificItem('doctorId', currentRole) || 
           getRoleSpecificItem('userId', currentRole);
  } else if (currentRole === 'pharmacist') {
    return getRoleSpecificItem('pharmaId', currentRole) || 
           getRoleSpecificItem('userId', currentRole);
  } else if (currentRole === 'patient') {
    return getRoleSpecificItem('patientId', currentRole) || 
           getRoleSpecificItem('userId', currentRole);
  } else if (currentRole === 'admin') {
    return getRoleSpecificItem('adminId', currentRole) || 
           getRoleSpecificItem('userId', currentRole);
  }
  
  return getRoleSpecificItem('userId', currentRole);
};
