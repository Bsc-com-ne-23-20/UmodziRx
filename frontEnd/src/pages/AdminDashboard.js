import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const admin_BASE_URL = process.env.REACT_APP_admin_BASE_URL || "http://localhost:5000";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("addUser");
  const [formData, setFormData] = useState({
    digitalID: "",
    role: "",
    userName: "",
    viewUserID: "",
  });
  const [users, setUsers] = useState([]);
  const [viewedUsers, setViewedUsers] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const adminName = "Patrick Chisale";

  const adminRequest = async (method, endpoint, data = null) => {
    try {
      const response = await axios({ 
        method, 
        url: `${admin_BASE_URL}${endpoint}`, 
        data,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Admin Error: ${error.response?.data?.message || error.message}`);
      throw error;
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminRequest('get', '/admin/users');
      setUsers(data);
    } catch (error) {
      setError('Failed to fetch users.');
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const { digitalID, role, userName } = formData;

    if (!digitalID || !role || !userName) {
      setError("All fields are required.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      await adminRequest('post', '/admin/users', { digitalID, role, userName });
      setSuccessMessage(`User ${userName} added successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
      setFormData({ digitalID: "", role: "", userName: "", viewUserID: "" });
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add user.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleViewUsers = async (e) => {
    e.preventDefault();
    const { viewUserID } = formData;

    try {
      const endpoint = viewUserID ? `/admin/users/${viewUserID}` : '/admin/users';
      const data = await adminRequest('get', endpoint);
      setViewedUsers(viewUserID ? [data] : data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch user data.');
      setTimeout(() => setError(""), 3000);
      setViewedUsers([]);
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    const { digitalID } = formData;

    if (!digitalID) {
      setError("Please provide a digital ID to delete.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      await adminRequest('delete', `/admin/users/${digitalID}`);
      setSuccessMessage("User deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setFormData({ digitalID: "", role: "", userName: "", viewUserID: "" });
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete user.');
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
        {/* Admin Name - Top Right Corner */}
        <div className="absolute top-6 right-6">
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-teal-800 font-medium hover:text-teal-900 focus:outline-none flex items-center group"
            >
              <span className="mr-2">{adminName}</span>
              <div className="w-8 h-8 rounded-full bg-teal-100 group-hover:bg-teal-200 transition-colors flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gray-200"></div>
              </div>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
              <p>{successMessage}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p>{error}</p>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            {["addUser", "viewUsers", "deleteUser"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 font-medium text-sm border-b-2 ${activeTab === tab 
                  ? "border-teal-500 text-teal-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "addUser" 
                  ? "Add User" 
                  : tab === "viewUsers" 
                  ? "View Users" 
                  : "Delete User"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === "addUser" && (
              <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                    User Name
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="digitalID" className="block text-sm font-medium text-gray-700 mb-1">
                    Digital ID
                  </label>
                  <input
                    type="text"
                    id="digitalID"
                    value={formData.digitalID}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="pharmacist">Pharmacist</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex justify-start">
                  <button 
                    type="submit" 
                    className="w-auto bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  >
                    Add User
                  </button>
                </div>
              </form>
            )}

            {activeTab === "viewUsers" && (
              <div className="space-y-6">
                <form onSubmit={handleViewUsers} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      id="viewUserID"
                      value={formData.viewUserID}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter Digital ID"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({...formData, viewUserID: ""});
                        handleViewUsers({preventDefault: () => {}});
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      View All
                    </button>
                  </div>
                </form>

                {viewedUsers.length > 0 && (
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Digital ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {viewedUsers.map((user) => (
                          <tr key={user.digitalID} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.digitalID}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "deleteUser" && (
              <form onSubmit={handleDeleteUser} className="max-w-md mx-auto space-y-6">
                <div>
                  <label htmlFor="digitalID" className="block text-sm font-medium text-gray-700 mb-1">
                    Digital ID
                  </label>
                  <input
                    type="text"
                    id="digitalID"
                    value={formData.digitalID}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete User
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;