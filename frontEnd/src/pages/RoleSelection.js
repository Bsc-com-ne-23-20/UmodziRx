import React from "react";
import { useNavigate } from "react-router-dom";

function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    // Redirect to the login page with the selected role
    navigate("/login", { state: { selectedRole: role } });
  };

  return (
    <div className="container mx-auto p-8 text-center">
      <h2 className="text-2xl font-bold">Select Your Role</h2>
      <div className="mt-6">
        <button onClick={() => handleRoleSelect("admin")} className="bg-blue-600 text-white px-4 py-2 rounded-lg m-2">
          Login as Admin
        </button>
        <button onClick={() => handleRoleSelect("doctor")} className="bg-blue-600 text-white px-4 py-2 rounded-lg m-2">
          Login as Doctor
        </button>
        <button onClick={() => handleRoleSelect("pharmacist")} className="bg-blue-600 text-white px-4 py-2 rounded-lg m-2">
          Login as Pharmacist
        </button>
        <button onClick={() => handleRoleSelect("patient")} className="bg-blue-600 text-white px-4 py-2 rounded-lg m-2">
          Login as Patient
        </button>
      </div>
    </div>
  );
}

export default RoleSelection;
