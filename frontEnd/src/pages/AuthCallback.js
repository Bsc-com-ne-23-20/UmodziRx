import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { setRoleSpecificItem, setCurrentUserRole } from "../utils/storageUtils";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleOIDCCallback } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get("code");
        const role = queryParams.get("role");

        console.log("[AuthCallback] Received code:", code);
        console.log("[AuthCallback] Received role:", role);

        if (!code || !role) {
          console.error("[AuthCallback] Missing authorization code or role");
          setError("Missing authorization parameters");
          navigate("/login");
          return;
        }

        // Exchange the code for a token
        const response = await axios.post("http://localhost:5000/auth/exchange", { 
          code, 
          role 
        });

        console.log("[AuthCallback] Backend response:", response.data);
        const { token, user } = response.data;
        const userRole = response.data.role;        if (!token || !user) {
          console.error("[AuthCallback] Missing token or user in response");
          setError("Invalid authentication response");
          navigate("/login");
          return;
        }
        
        // Store user info in localStorage based on role
        setCurrentUserRole(userRole);
        
        // Store role-specific user data with role-specific key names
        if (userRole === 'doctor') {
          setRoleSpecificItem("doctorId", user.id, userRole);
          setRoleSpecificItem("doctorName", user.name, userRole);
          setRoleSpecificItem("doctorEmail", user.email, userRole);
          if (user.birthday) setRoleSpecificItem("doctorBirthday", user.birthday, userRole);
          if (user.gender) setRoleSpecificItem("doctorGender", user.gender, userRole);
        } else if (userRole === 'patient') {
          setRoleSpecificItem("patientId", user.id, userRole);
          setRoleSpecificItem("patientName", user.name, userRole);
          setRoleSpecificItem("patientEmail", user.email, userRole);
          if (user.birthday) setRoleSpecificItem("patientBirthday", user.birthday, userRole);
          if (user.gender) setRoleSpecificItem("patientGender", user.gender, userRole);
        } else if (userRole === 'pharmacist') {
          setRoleSpecificItem("pharmaId", user.id, userRole);
          setRoleSpecificItem("pharmaName", user.name, userRole);
          setRoleSpecificItem("pharmaEmail", user.email, userRole);
          if (user.birthday) setRoleSpecificItem("pharmaBirthday", user.birthday, userRole);
          if (user.gender) setRoleSpecificItem("pharmaGender", user.gender, userRole);
        } else if (userRole === 'admin') {
          setRoleSpecificItem("adminId", user.id, userRole);
          setRoleSpecificItem("adminName", user.name, userRole);
          setRoleSpecificItem("adminEmail", user.email, userRole);
          if (user.birthday) setRoleSpecificItem("adminBirthday", user.birthday, userRole);
          if (user.gender) setRoleSpecificItem("adminGender", user.gender, userRole);
        }
        
        // Also store with generic keys for backward compatibility
        setRoleSpecificItem("userId", user.id, userRole);
        setRoleSpecificItem("userName", user.name, userRole);
        setRoleSpecificItem("userEmail", user.email, userRole);
        if (user.birthday) setRoleSpecificItem("userBirthday", user.birthday, userRole);
        if (user.gender) setRoleSpecificItem("userGender", user.gender, userRole);
        
        // Set auth context
        handleOIDCCallback(token, { ...user, role: userRole });        // Role-specific storage and navigation
        console.log(`[AuthCallback] Navigating to role-specific dashboard for role: ${userRole}`);
        
        // Our enhanced setRoleSpecificItem will automatically handle role-specific keys
        // so we don't need separate calls for each role
        
        if (userRole === "admin") {
          console.log("[AuthCallback] Navigating to /admin");
          navigate("/admin", { state: { enableSearch: true }, replace: true });
        } else if (userRole === "doctor") { 
          console.log("[AuthCallback] Navigating to /doctor");
          navigate("/doctor", { replace: true });
        } else if (userRole === "pharmacist") {
          if (user.email) {
            setRoleSpecificItem("userEmail", user.email, userRole);
          }
          console.log("[AuthCallback] Navigating to /pharmacist");
          navigate("/pharmacist", { replace: true });
        } else {
          // Default to patient
          console.log("[AuthCallback] Navigating to /patient");
          navigate("/patient", { replace: true });
        }
      } catch (error) {
        console.error("[AuthCallback] Error processing callback:", error);
        setError(error.message || "Authentication failed");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    processCallback();
  }, [location, navigate, handleOIDCCallback]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
        <p className="mt-4 text-lg text-gray-700">Authenticating...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => navigate("/login")}
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;