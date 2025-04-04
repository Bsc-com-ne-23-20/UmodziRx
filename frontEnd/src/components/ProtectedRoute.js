import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const ProtectedRoute = ({ allowedRoles }) => {
  const { authState, loading, isTokenExpired } = useAuth();
  const { token, user } = authState;

  // Store current path for back button handling
  useEffect(() => {
    sessionStorage.setItem('lastProtectedPath', window.location.pathname);
  }, [window.location.pathname]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  }

  if (!token || isTokenExpired()) {
    return <Navigate to="/session-expired" replace />;
  }

  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
