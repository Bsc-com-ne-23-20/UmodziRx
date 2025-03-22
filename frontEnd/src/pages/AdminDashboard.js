import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("addUser");
  const [digitalID, setDigitalID] = useState("");
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");  // New state for user name
  const [viewUserID, setViewUserID] = useState("");
  const [users, setUsers] = useState([]); // Simulate list of users
  const [error, setError] = useState("");

  // Handle form submission for adding a user
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!digitalID || !role || !userName) {
      setError("Please provide all fields: digital ID, role, and user name.");
      return;
    }
    // Add user logic here (e.g., API call to add user)
    setUsers([...users, { digitalID, role, userName }]); // Example of adding a new user to the list
    setError("");
    setDigitalID("");
    setRole("");
    setUserName("");  // Clear userName input after submission
  };

  // Handle viewing all users or a specific user
  const handleViewUsers = (e) => {
    e.preventDefault();
    if (viewUserID) {
      const user = users.find((user) => user.digitalID === viewUserID);
      if (user) {
        alert(`User found: ${JSON.stringify(user)}`);
      } else {
        alert("User not found");
      }
    } else {
      alert("Viewing all users:\n" + JSON.stringify(users));
    }
  };

  // Handle deleting a user
  const handleDeleteUser = (e) => {
    e.preventDefault();
    if (!digitalID) {
      setError("Please provide a digital ID to delete.");
      return;
    }
    setUsers(users.filter((user) => user.digitalID !== digitalID));
    setDigitalID("");
    setError("");
  };

  // Handle logout and redirect to home page
  const handleLogout = () => {
    // Clear any relevant local storage items (like token)
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    
    // Redirect to the home page
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-4xl w-full">
        <div className="flex justify-end mb-6">
          {/* Logout Button with Red Background */}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <h2 className="text-3xl font-bold text-teal-700 text-center mb-6">
          Admin Dashboard
        </h2>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-8 mb-6">
          <button
            className={`px-4 py-2 ${activeTab === "addUser" ? "bg-teal-600 text-white" : "bg-teal-100"} rounded-lg`}
            onClick={() => setActiveTab("addUser")}
          >
            Add User
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "viewUsers" ? "bg-teal-600 text-white" : "bg-teal-100"} rounded-lg`}
            onClick={() => setActiveTab("viewUsers")}
          >
            View Users
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "deleteUser" ? "bg-teal-600 text-white" : "bg-teal-100"} rounded-lg`}
            onClick={() => setActiveTab("deleteUser")}
          >
            Delete User
          </button>
        </div>

        {/* Add User Section */}
        {activeTab === "addUser" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Add User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700">User Name</label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label htmlFor="digitalID" className="block text-sm font-medium text-gray-700">Digital ID</label>
                <input
                  type="text"
                  id="digitalID"
                  value={digitalID}
                  onChange={(e) => setDigitalID(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="pharmacist">Pharmacist</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-teal-600 text-white px-3 py-2 rounded-lg hover:bg-teal-700">Add User</button>
            </form>
          </div>
        )}

        {/* View Users Section */}
        {activeTab === "viewUsers" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">View Users</h3>
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
                  value={viewUserID}
                  onChange={(e) => setViewUserID(e.target.value)}
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
          </div>
        )}

        {/* Delete User Section */}
        {activeTab === "deleteUser" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Delete User</h3>
            <form onSubmit={handleDeleteUser} className="space-y-4">
              <div>
                <label htmlFor="deleteUserID" className="block text-sm font-medium text-gray-700">Digital ID</label>
                <input
                  type="text"
                  id="deleteUserID"
                  value={digitalID}
                  onChange={(e) => setDigitalID(e.target.value)}
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
          </div>
        )}

        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;
