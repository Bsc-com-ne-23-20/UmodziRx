/**
 * Utility functions for working with localStorage to avoid conflicts
 * between different user roles in separate browser tabs
 */

/**
 * Get role-prefixed key to prevent collisions between different roles
 * 
 * @param {string} key - The base key name
 * @param {string} role - The user role (admin, doctor, pharmacist, patient)
 * @returns {string} - The prefixed key
 */
export const getRolePrefixedKey = (key, role) => {
  if (!role) return key;
  return `${role}_${key}`;
};

/**
 * Get the appropriate key name based on the user's role
 * 
 * @param {string} genericKey - The generic key name (e.g., 'userId')
 * @param {string} role - The user role
 * @returns {string} - The role-specific key name (e.g., 'doctorId' for role='doctor')
 */
export const getRoleSpecificKeyName = (genericKey, role) => {
  if (!role) return genericKey;
  
  // Map generic keys to role-specific keys
  const keyMappings = {
    userId: {
      doctor: 'doctorId',
      patient: 'patientId',
      pharmacist: 'pharmaId',
      admin: 'adminId'
    },
    userName: {
      doctor: 'doctorName',
      patient: 'patientName',
      pharmacist: 'pharmaName',
      admin: 'adminName'
    }
  };
  
  // Return the role-specific key if it exists, otherwise return the generic key
  return keyMappings[genericKey]?.[role] || genericKey;
};

/**
 * Set an item in localStorage with role-specific prefix
 * 
 * @param {string} key - The key to set
 * @param {any} value - The value to store
 * @param {string} role - The user role
 */
export const setRoleSpecificItem = (key, value, role) => {
  if (!role) {
    console.warn('No role provided for setRoleSpecificItem. Using unprefixed key as fallback.');
    localStorage.setItem(key, typeof value === 'object' && value !== null ? JSON.stringify(value) : value);
    return;
  }
  
  // Store with role-prefixed key
  const prefixedKey = getRolePrefixedKey(key, role);
  localStorage.setItem(prefixedKey, typeof value === 'object' && value !== null ? JSON.stringify(value) : value);
  
  // For user-specific data, also store with role-specific key names
  // This ensures that doctorId, patientId, etc. are properly stored
  const roleSpecificKey = getRoleSpecificKeyName(key, role);
  if (roleSpecificKey !== key) {
    const prefixedRoleSpecificKey = getRolePrefixedKey(roleSpecificKey, role);
    localStorage.setItem(prefixedRoleSpecificKey, typeof value === 'object' && value !== null ? JSON.stringify(value) : value);
  }
  
  // No longer setting unprefixed keys to avoid conflicts between different roles
};

/**
 * Get an item from localStorage with role-specific prefix
 * 
 * @param {string} key - The key to get
 * @param {string} role - The user role
 * @returns {any} - The stored value
 */
export const getRoleSpecificItem = (key, role) => {
  if (!role) {
    console.warn(`No role provided for getRoleSpecificItem(${key}). Using unprefixed key.`);
    return localStorage.getItem(key);
  }
  
  // First, try with the role-prefixed key
  const prefixedKey = getRolePrefixedKey(key, role);
  let value = localStorage.getItem(prefixedKey);
  
  // If not found, try with the role-specific key name (e.g., doctorId instead of userId)
  if (value === null) {
    const roleSpecificKey = getRoleSpecificKeyName(key, role);
    if (roleSpecificKey !== key) {
      const prefixedRoleSpecificKey = getRolePrefixedKey(roleSpecificKey, role);
      value = localStorage.getItem(prefixedRoleSpecificKey);
    }
  }
  
  // If still not found, fall back to the unprefixed key
  // but log a warning for debugging purposes
  if (value === null) {
    const unprefixedValue = localStorage.getItem(key);
    if (unprefixedValue !== null) {
      console.warn(`Using unprefixed fallback for ${key} with role ${role}`);
    }
    return unprefixedValue;
  }
  
  return value;
};

/**
 * Remove an item from localStorage with role-specific prefix
 * 
 * @param {string} key - The key to remove
 * @param {string} role - The user role
 */
export const removeRoleSpecificItem = (key, role) => {
  if (!role) {
    console.warn(`No role provided for removeRoleSpecificItem(${key}). Removing unprefixed key only.`);
    localStorage.removeItem(key);
    return;
  }
  
  // Remove the role-prefixed key
  const prefixedKey = getRolePrefixedKey(key, role);
  localStorage.removeItem(prefixedKey);
  
  // Also remove the role-specific key name (e.g., doctorId instead of userId)
  const roleSpecificKey = getRoleSpecificKeyName(key, role);
  if (roleSpecificKey !== key) {
    const prefixedRoleSpecificKey = getRolePrefixedKey(roleSpecificKey, role);
    localStorage.removeItem(prefixedRoleSpecificKey);
  }
  
  // No longer removing unprefixed keys to avoid conflicts between different roles
};

/**
 * Clear all items for a specific role
 * 
 * @param {string} role - The user role to clear storage for
 */
export const clearRoleSpecificStorage = (role) => {
  if (!role) return;
  
  // Find all keys in localStorage that start with the role prefix
  const keysToRemove = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`${role}_`)) {
      keysToRemove.push(key);
    }
  }
  
  // Remove all keys for this role
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

/**
 * Parse JSON from localStorage safely
 * 
 * @param {string} value - The value to parse
 * @returns {any} - The parsed value or the original if not JSON
 */
export const safeJsonParse = (value) => {
  if (!value) return null;
  
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

/**
 * Set the current user role in localStorage with role-specific prefix
 * 
 * @param {string} role - The user role
 */
export const setCurrentUserRole = (role) => {
  if (!role) return;
  
  // Store role both as a prefixed value for this role
  // and as the current active role
  localStorage.setItem(`${role}_userRole`, role);
  localStorage.setItem("userRole", role);
};

/**
 * Get the current user role from localStorage
 * 
 * @returns {string} - The current user role
 */
export const getCurrentUserRole = () => {
  return localStorage.getItem("userRole");
};
