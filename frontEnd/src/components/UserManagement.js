import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiUserPlus } from 'react-icons/fi';

const UserManagement = ({ searchTerm }) => {
  // Mock data - Replace with API call later
  const MOCK_USERS = [
    {
      id: 'DOC-001',
      name: 'Dr. John Doe',
      role: 'Doctor',
      department: 'General Practice',
      status: 'Active',
      lastActive: '2025-03-15'
    },
    {
      id: 'DOC-002',
      name: 'Dr. Sarah Smith',
      role: 'Doctor',
      department: 'Pediatrics',
      status: 'Active',
      lastActive: '2025-03-14'
    },
    {
      id: 'PHARM-001',
      name: 'Jane Wilson',
      role: 'Pharmacist',
      department: 'Main Pharmacy',
      status: 'Inactive',
      lastActive: '2025-03-10'
    }
  ];

  const [users, setUsers] = useState(MOCK_USERS);

  const fetchUsers = async () => {
    try {
      // const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/users`);
      // const data = await response.json();
      // setUsers(data);
      
      // For now, just use mock data
      setUsers(MOCK_USERS);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const [showUserModal, setShowUserModal] = useState(false);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    user.role.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );

  const getStatusBadgeClass = (status) => {
    const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white";
    return status === 'Active' 
      ? `${baseClasses} bg-green-500 dark:bg-green-600`
      : `${baseClasses} bg-red-500 dark:bg-red-600`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">User Management</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <FiUserPlus className="h-5 w-5" />
          <span>Add User</span>
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {/* Table headers */}
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{user.id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-gray-100">{user.role}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={getStatusBadgeClass(user.status)}>{user.status}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                  <FiEdit2 className="h-5 w-5" />
                </button>
                <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
