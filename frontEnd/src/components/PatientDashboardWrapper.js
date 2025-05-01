import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaseDashboard from "../components/BaseDashboard";
import PatientDashboardContent from "./PatientDashboardContent";
import { FiHome, FiCalendar, FiFileText, FiUser } from 'react-icons/fi';

const PatientDashboardWrapper = () => {
  const navigate = useNavigate();
  
  // Navigation items for the sidebar
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: FiHome, 
      onClick: () => navigate('/patient') 
    },
    { 
      id: 'prescriptions', 
      label: 'Prescriptions', 
      icon: FiFileText, 
      onClick: () => navigate('/patient/prescriptions') 
    },
    { 
      id: 'appointments', 
      label: 'Appointments', 
      icon: FiCalendar, 
      onClick: () => navigate('/patient/appointments') 
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: FiUser, 
      onClick: () => navigate('/patient/profile') 
    }
  ];

  // Get user info from localStorage
  const userInfo = {
    name: localStorage.getItem('patientName') || 'Patient',
    role: 'patient',
    // Add any additional user info you need to display
    avatarInitials: (localStorage.getItem('patientName') || 'P').charAt(0)
  };

  return (
    <BaseDashboard 
      title="Patient Portal"
      navItems={navItems}
      userInfo={userInfo}
    >
      {/* The actual dashboard content */}
      <PatientDashboardContent />
    </BaseDashboard>
  );
};

export default PatientDashboardWrapper;