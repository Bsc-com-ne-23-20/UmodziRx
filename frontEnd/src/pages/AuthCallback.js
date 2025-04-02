import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleOIDCCallback } = useAuth();
  const [roles, setRoles] = useState([]);
  const [userData, setUserData] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    const role = queryParams.get("role");

    console.log("[AuthCallback] Received code:", code);
    console.log("[AuthCallback] Received role:", role);

    if (!code || !role) {
      console.error("[AuthCallback] Missing authorization code or role");
      navigate("/login");
      return;
    }

    axios
      .post("http://localhost:5000/auth/exchange", { code, role })
      .then((response) => {
        console.log("[AuthCallback] Backend response:", response.data);
        const { token, user, role } = response.data;

        if (!token || !user) {
          console.error("[AuthCallback] Missing token or user in response");
          navigate("/login");
          return;
        }

        setUserData(user);
        setAuthToken(token);
        setLoading(false);

        if (role === "admin") {
          localStorage.setItem("adminName",user.name);
          localStorage.setItem("adminId",user.id);
          setRoles(["admin", "patient"]);
        } else if (role === "doctor") {
          localStorage.setItem("doctorName",user.name);
          localStorage.setItem("doctorId",user.id);
          setRoles(["doctor", "patient"]);
        } else if (role === "pharmacist") {
          localStorage.setItem("pharmaName",user.name);
          localStorage.setItem("pharmaId",user.id);
          setRoles(["pharmacist", "patient"]);
          localStorage.setItem("patientName",user.name);
          localStorage.setItem("patientId",user.id);
        } else {
          console.log("[AuthCallback] Navigating to patient dashboard");
          handleOIDCCallback(token, user);
          navigate("/patient");
        }
      })
      .catch((error) => {
        console.error("[AuthCallback] Error exchanging code:", error);
        navigate("/login");
      });
  }, [location, navigate, handleOIDCCallback]);

  const handleRoleSelection = (selectedRole) => {
    console.log("[AuthCallback] User selected role:", selectedRole);
    if (roles.includes(selectedRole)) {
      handleOIDCCallback(authToken, { ...userData, role: selectedRole });
      navigate(`/${selectedRole}`);
    } else {
      console.error("[AuthCallback] Invalid role selection");
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen text-lg">
      {loading ? (
        <LoadingSpinner size="large" />
      ) : (
        roles.length > 0 && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-md">
            <h2 className="text-center font-semibold mb-2">Select Your Role</h2>
            <div className="flex space-x-4">
              {roles.map((role) => (
                <button
                  key={role}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={() => handleRoleSelection(role)}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AuthCallback;
