import React from 'react';
import { FiHome, FiUsers } from 'react-icons/fi';
import BaseDashboard from '../components/BaseDashboard';
import UserManagement from '../components/UserManagement';

const NewAdminDashboard = () => {
  const navItems = [
    { icon: FiHome, label: 'Dashboard', id: 'dashboard' },
    { icon: FiUsers, label: 'User Management', id: 'users' }
  ];

  const adminInfo = {
    name: localStorage.getItem('adminName') || 'Admin User',
    id: localStorage.getItem('adminId'),
  };

  return (
    <BaseDashboard
      navItems={navItems}
      title="UmodziRx Admin"
      userInfo={adminInfo}
    >
      <UserManagement />
    </BaseDashboard>
  );
};

export default NewAdminDashboard;