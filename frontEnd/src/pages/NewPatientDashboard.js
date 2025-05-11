import React, { useState } from 'react';
import { FiFileText, FiArchive } from 'react-icons/fi';
import BaseDashboard from '../components/BaseDashboard';
import PatientContent from '../components/PatientContent';

const NewPatientDashboard = () => {
  const [activeView, setActiveView] = useState('prescriptions');

  const navItems = [
    {
      icon: FiFileText,
      label: 'Prescriptions',
      id: 'prescriptions',
      onClick: () => setActiveView('prescriptions')
    },
    {
      icon: FiArchive,
      label: 'Medical Records',
      id: 'records',
      onClick: () => setActiveView('records')
    }
  ];

  const patientInfo = {
    name: localStorage.getItem('patientName') || 'Patient',
    id: localStorage.getItem('patientId'),
  };

  const handleNavigation = (viewId) => {
    setActiveView(viewId);
  };

  return (
    <BaseDashboard
      navItems={navItems}
      title="Patient Portal"
      userInfo={patientInfo}
    >
      <PatientContent activeView={activeView} handleNavigation={handleNavigation} />
    </BaseDashboard>
  );
};

export default NewPatientDashboard;
