import React, { useRef } from 'react';
import { FiHome, FiUserPlus } from 'react-icons/fi';
import BaseDashboard from '../components/BaseDashboard';
import UserManagement from '../components/UserManagement';

const NewAdminDashboard = () => {
  const userManagementRef = useRef(null);

  const handleAddUser = () => {
    if (userManagementRef.current) {
      userManagementRef.current.showAddUserModal();
    }
  };

  const navItems = [
    { icon: FiHome, label: 'Dashboard', id: 'dashboard' },
    { 
      icon: FiUserPlus, 
      label: 'Add User', 
      id: 'add-user',
      onClick: handleAddUser 
    }
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
      <UserManagement ref={userManagementRef} />
    </BaseDashboard>
  );
};

export default NewAdminDashboard;
