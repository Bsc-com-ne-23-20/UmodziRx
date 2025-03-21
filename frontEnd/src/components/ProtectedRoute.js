import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedRoute component to restrict access based on authentication and role.
 * @param {Array} allowedRoles - List of roles allowed to access the route.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  // Retrieve authentication token and user role from localStorage
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // If no token exists, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not in the allowedRoles list, redirect to unauthorized page
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authentication and role check pass, allow access to the route
  return <Outlet />;
};

export default ProtectedRoute;
