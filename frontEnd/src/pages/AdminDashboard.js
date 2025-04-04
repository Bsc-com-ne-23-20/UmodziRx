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

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Reusable admin request function
  const adminRequest = async (method, endpoint, data = null) => {
    try {
      const response = await axios({ method, url: `${admin_BASE_URL}${endpoint}`, data });
      return response.data;
    } catch (error) {
      console.error(`admin Error: ${error.response?.data?.message || error.message}`);
      throw error;
    }
  };

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminRequest('get', '/admin/users');
      setUsers(data);
    } catch (error) {
      setError('Failed to fetch users.');
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Add a new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    const { digitalID, role, userName } = formData;

    if (!digitalID || !role || !userName) {
      setError("All fields are required.");
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
      return;
    }

    try {
      await adminRequest('post', '/admin/users', { digitalID, role, userName });
      setSuccessMessage(`User ${userName} added successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
      setError("");
      setFormData({ digitalID: "", role: "", userName: "", viewUserID: "" });
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add user.");
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
    }
  };

  // View users (all or specific)
  const handleViewUsers = async (e) => {
    e.preventDefault();
    const { viewUserID } = formData;

    try {
      const endpoint = viewUserID ? `/admin/users/${viewUserID}` : '/admin/users';
      const data = await adminRequest('get', endpoint);
      setViewedUsers(viewUserID ? [data] : data);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch user data.');
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
      setViewedUsers([]);
    }
  };

  // Delete a user
  const handleDeleteUser = async (e) => {
    e.preventDefault();
    const { digitalID } = formData;

    if (!digitalID) {
      setError("Please provide a digital ID to delete.");
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
      return;
    }

    try {
      await adminRequest('delete', `/admin/users/${digitalID}`);
      setSuccessMessage("User deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
      setError("");
      setFormData({ digitalID: "", role: "", userName: "", viewUserID: "" });
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete user.');
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-4xl w-full">
        <div className="flex justify-end mb-6">
          {localStorage.getItem('adminName')}
        </div>

        <h2 className="text-3xl font-bold text-teal-700 text-center mb-6">
          Admin Dashboard
        </h2>

        {successMessage && (
          <p className="text-green-600 text-center mb-4">{successMessage}</p>
        )}
        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}

        <div className="flex justify-center space-x-8 mb-6">
          {["addUser", "viewUsers", "deleteUser"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 ${activeTab === tab ? "bg-teal-600 text-white" : "bg-teal-100"} rounded-lg`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "addUser" ? "Add User" : tab === "viewUsers" ? "View Users" : "Delete User"}
            </button>
          ))}
        </div>

        {activeTab === "addUser" && (
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">User Name</label>
              <input
                type="text"
                id="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="digitalID" className="block text-sm font-medium text-gray-700">Digital ID</label>
              <input
                type="text"
                id="digitalID"
                value={formData.digitalID}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="pharmacist">Pharmacist</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-teal-600 text-white px-3 py-2 rounded-lg hover:bg-teal-700">
              Add User
            </button>
          </form>
        )}

        {activeTab === "viewUsers" && (
          <div>
            <form onSubmit={handleViewUsers} className="space-y-4">
              <div>
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white px-3 py-2 rounded-lg hover:bg-teal-700"
                >
                  View All Registered Users
                </button>
              </div>
              <div className="flex items-center">
                <label htmlFor="viewUserID" className="block text-sm font-medium text-gray-700 mr-2">Or View Specific User</label>
                <input
                  type="text"
                  id="viewUserID"
                  value={formData.viewUserID}
                  onChange={handleInputChange}
                  className="w-1/2 px-3 py-2 border rounded-lg"
                  placeholder="Enter Digital ID"
                />
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-3 py-2 ml-4 rounded-lg hover:bg-teal-700"
                >
                  View
                </button>
              </div>
            </form>
            {viewedUsers.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Users:</h4>
                <table className="min-w-full border-collapse border border-gray-200">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">Digital ID</th>
                      <th className="border border-gray-300 px-4 py-2">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewedUsers.map((user) => (
                      <tr key={user.digitalID}>
                        <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.digitalID}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "deleteUser" && (
          <form onSubmit={handleDeleteUser} className="space-y-4">
            <div>
              <label htmlFor="deleteUserID" className="block text-sm font-medium text-gray-700">Digital ID</label>
              <input
                type="text"
                id="digitalID"
                value={formData.digitalID}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
            >
              Delete User
            </button>
          </form>
        )}
      </div>
    </div>
  );

};

export default AdminDashboard;

