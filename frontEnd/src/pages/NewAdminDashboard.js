import React from 'react';
import { FiHome } from 'react-icons/fi';
import BaseDashboard from '../components/BaseDashboard';
import UserManagement from '../components/UserManagement';

const NewAdminDashboard = () => {
  const navItems = [
    { icon: FiHome, label: 'Dashboard', id: 'dashboard' }
  ];

  const adminInfo = {
    name: localStorage.getItem('adminName') || 'Admin User',
    id: localStorage.getItem('adminId'),
  };

  return (
    <BaseDashboard
      navItems={navItems}
      title="Admin"
      userInfo={adminInfo}
    >
      <UserManagement />
    </BaseDashboard>
  );
};

export default NewAdminDashboard;
