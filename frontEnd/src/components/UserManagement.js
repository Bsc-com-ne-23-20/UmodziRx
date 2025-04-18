<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiUserPlus } from 'react-icons/fi';
=======
import React, { useState, useRef, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiUserPlus, FiChevronLeft, FiChevronRight, FiX, FiSearch } from 'react-icons/fi';
import axios from 'axios';
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
=======
  // Initial data fetch
  useEffect(() => {
    fetchUsers(1);
  }, []);

  // handle clicking outside the add user modal
  const modalRef = useRef();
  
  useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          setShowEditModal(false);
        }
      };
  
      if (showEditModal) {
        document.addEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showEditModal]);

  // Search filtering
  const filteredUsers = users.filter(user => {
    if (!user) return false;
    const search = searchTerm.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(search)) ||
      (user.role && user.role.toLowerCase().includes(search)) ||
      (user.digitalID && user.digitalID.toLowerCase().includes(search))
    );
  });

  // UI helpers
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <FiUserPlus className="h-5 w-5" />
          <span>Add User</span>
        </button>
=======
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Digital ID"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={findUserById}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Search
          </button>
          {searchTerm && (
            <button
              onClick={resetSearch}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
            >
              Reset
            </button>
          )}
        </div>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
              </td>
            </tr>
          ))}
        </tbody>
      </table>
=======
              </div>
            </div>
          )}
        </>
      )}

      {/* Floating Add User Button */}
      <button 
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-10"
        onClick={() => {
          setSelectedUser(null);
          setEditFormData({
            name: '',
            role: '',
            status: 'Active',
            digitalID: ''
          });
          setShowEditModal(true);
        }}
      >
        <FiUserPlus className="h-6 w-6" />
      </button>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Confirm Deletion
                </h3>
                <button
                  onClick={handleDeleteCancel}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Are you sure you want to delete user <span className="font-semibold">{userToDelete?.name}</span>?
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  This action cannot be undone. All user data will be permanently removed.
                </p>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {selectedUser ? 'Edit User' : 'Add New User'}
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
              <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    User Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    required
                  />
                </div>
                
                {!selectedUser && (
                  <div>
                    <label htmlFor="digitalID" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Digital ID
                    </label>
                    <input
                      type="text"
                      id="digitalID"
                      name="digitalID"
                      value={editFormData.digitalID}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="pharmacist">Pharmacist</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {selectedUser ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        </div>
      )}
>>>>>>> Stashed changes
    </div>
  );
};

export default UserManagement;
