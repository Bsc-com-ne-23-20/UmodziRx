import React, { useState } from 'react';
import { FiHome, FiUsers, FiFileText } from 'react-icons/fi';
import BaseDashboard from '../components/BaseDashboard';
import DoctorContent from '../components/DoctorContent';

const NewDoctorDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  
  const navItems = [
    { 
      icon: FiHome, 
      label: 'Dashboard', 
      id: 'dashboard',
      onClick: () => setActiveView('dashboard')
    },
    { 
      icon: FiUsers, 
      label: 'Patients', 
      id: 'patients',
      onClick: () => setActiveView('patients')
    },
    { 
      icon: FiFileText, 
      label: 'Prescriptions', 
      id: 'prescriptions',
      onClick: () => setActiveView('prescriptions')
    }
  ];

  const doctorInfo = {
    name: localStorage.getItem('doctorName') || 'Dr. Doe',
    id: localStorage.getItem('doctorId'),
  };

  const handleNavigation = (viewId) => {
    setActiveView(viewId);
  };

  return (
    <BaseDashboard
      navItems={navItems}
      title="Doctor"
      userInfo={doctorInfo}
    >
      <DoctorContent activeView={activeView} handleNavigation={handleNavigation} />
    </BaseDashboard>
  );
};

export default NewDoctorDashboard;