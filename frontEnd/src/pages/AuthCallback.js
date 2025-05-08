import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

  const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleOIDCCallback } = useAuth();
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
          localStorage.setItem("adminName", user.name);
          localStorage.setItem("adminId", user.id);
          navigate("/admin", { state: { enableSearch: true } }); // Pass state to enable search
        } else if (role === "doctor") { 
          localStorage.setItem("doctorName",user.name);
          localStorage.setItem("doctorId",user.id);
          navigate("/doctor");
        } else if (role === "pharmacist") {
          localStorage.setItem("pharmaName",user.name);
          localStorage.setItem("pharmaId",user.id);
          localStorage.setItem("phamarEmail",user.email);
          localStorage.setItem("patientName",user.name);
          localStorage.setItem("patientId",user.id);
          navigate("/pharmacist");
        } else {
          console.log("[AuthCallback] Navigating to patient dashboard");
          handleOIDCCallback(token, user);
          localStorage.setItem("patientName", user.name);
          localStorage.setItem("patientId", user.id);
          console.log("[AuthCallback] Navigating to patient dashboard");
          handleOIDCCallback(token, { ...user, role: "patient" }); 
          navigate("/patient");
        }
      })
      .catch((error) => {
        console.error("[AuthCallback] Error exchanging code:", error);
        navigate("/login");
      });
  }, [location, navigate, handleOIDCCallback]);

  // const handleRoleSelection = (selectedRole) => {
  //   console.log("[AuthCallback] User selected role:", selectedRole);
  //   if (roles.includes(selectedRole)) {
  //     handleOIDCCallback(authToken, { ...userData, role: selectedRole });
  //     navigate(`/${selectedRole}`);
  //   } else {
  //     console.error("[AuthCallback] Invalid role selection");
  //     navigate("/login");
  //   }
  // };

  
};

export default AuthCallback;
