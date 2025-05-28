import { useState, useEffect } from 'react';
import { getRoleSpecificItem, setRoleSpecificItem, getCurrentUserRole } from '../utils/storageUtils';

const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const currentRole = getCurrentUserRole();
    const saved = getRoleSpecificItem('darkMode', currentRole);
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const currentRole = getCurrentUserRole();
    setRoleSpecificItem('darkMode', JSON.stringify(darkMode), currentRole);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return [darkMode, toggleDarkMode];
};

export default useDarkMode;