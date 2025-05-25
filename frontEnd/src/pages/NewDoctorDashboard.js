import React, { useState } from 'react';
import { FiHome, FiUsers, FiFileText, FiPlus, FiList } from 'react-icons/fi';
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
      subItems: [
        {
          icon: FiPlus,
          label: 'Add Prescription',
          id: 'add-prescription',
          onClick: () => setActiveView('add-prescription')
        },
        {
          icon: FiList,
          label: 'View History',
          id: 'prescription-history',
          onClick: () => setActiveView('prescription-history')
        }
      ]
    }
  ];

  const doctorInfo = {
    name: localStorage.getItem('doctorName') || 'Dr. Doe',
    id: localStorage.getItem('doctorId'),
  };

  return (
    <BaseDashboard
      navItems={navItems}
      title="Doctor Portal"
      userInfo={doctorInfo}
    >
      <DoctorContent activeView={activeView} handleNavigation={setActiveView} />
    </BaseDashboard>
  );
};

export default NewDoctorDashboard;