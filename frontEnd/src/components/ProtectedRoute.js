import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { getRoleSpecificItem, getCurrentUserRole } from "../utils/storageUtils";

const ProtectedRoute = ({ allowedRoles }) => {
  const { authState, loading, isTokenExpired } = useAuth();
  const navigate = useNavigate();  
  // Get user data from auth state or localStorage
  const currentRole = getCurrentUserRole();
  const token = authState?.token || getRoleSpecificItem('token', currentRole);
  const user = authState?.user;
  const userRole = user?.role || currentRole;

  // Store current path for back button handling
  useEffect(() => {
    sessionStorage.setItem('lastProtectedPath', window.location.pathname);
    
    // Add navigation function to window for global access
    // This helps with handling navigation from components that don't have direct access
    window.handleNavigation = (path) => {
      console.log('Global navigation handler called with path:', path);
      navigate(path);
    };
    
    return () => {
      // Clean up when unmounted
      window.handleNavigation = undefined;
    };
  }, [navigate]);
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  }

  // Check if token exists
  if (!token || isTokenExpired()) {
    console.log("No token or token expired, redirecting to session expired");
    return <Navigate to="/session-expired" replace />;
  }

  // Check if user has the required role
  // const role = user?.role || userRole;
  
  // if (!role || !allowedRoles.includes(role)) {
  //   console.log(`Access denied. User role: ${role}, Required roles: ${allowedRoles}`);
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;
