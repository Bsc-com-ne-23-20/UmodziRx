import React, { useState } from 'react';
import { FiHome, FiCheckSquare, FiPackage, FiList, FiShoppingBag } from 'react-icons/fi';
import BaseDashboard from '../components/BaseDashboard';
import PharmacistContent from '../components/PharmacistContent';

const NewPharmacistDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  
  const navItems = [
    { 
      icon: FiHome, 
      label: 'Dashboard', 
      id: 'dashboard',
      onClick: () => setActiveView('dashboard')
    },
    { 
      icon: FiCheckSquare, 
      label: 'Verify Patient', 
      id: 'verify',
      onClick: () => setActiveView('verify')
    },
    { 
      icon: FiPackage, 
      label: 'Inventory', 
      id: 'inventory',
      onClick: () => setActiveView('inventory')
    },
    { 
      icon: FiList, 
      label: 'Prescriptions', 
      id: 'prescriptions',
      onClick: () => setActiveView('prescriptions')
    },
    { 
      icon: FiShoppingBag, 
      label: 'Dispense Medicine', 
      id: 'dispense',
      onClick: () => setActiveView('dispense')
    }
  ];

  const pharmacistInfo = {
    name: localStorage.getItem('pharmaName') || 'Pharmacist',
    id: localStorage.getItem('pharmaId'),
  };

  return (
    <BaseDashboard
      navItems={navItems}
      title="Pharmacist"
      userInfo={pharmacistInfo}
    >
      <PharmacistContent activeView={activeView} handleNavigation={setActiveView} />
    </BaseDashboard>
  );
};

export default NewPharmacistDashboard;
