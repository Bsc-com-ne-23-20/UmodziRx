import React from "react";
import { useNavigate } from "react-router-dom";

function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate("/login", { state: { selectedRole: role } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-teal-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <h2 className="text-3xl font-bold text-teal-700">Select Your Role</h2>
        <p className="text-teal-600 mt-2">Choose your role to proceed with login</p>
        <div className="mt-6 space-y-4">
          <button onClick={() => handleRoleSelect("admin")} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all">
            Login as Admin
          </button>
          <button onClick={() => handleRoleSelect("doctor")} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all">
            Login as Doctor
          </button>
          <button onClick={() => handleRoleSelect("pharmacist")} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-all">
            Login as Pharmacist
          </button>
          <button onClick={() => handleRoleSelect("patient")} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-lg transition-all">
            Login as Patient
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
