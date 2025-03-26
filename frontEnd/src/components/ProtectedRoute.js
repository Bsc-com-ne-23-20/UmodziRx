import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  console.log("Token in ProtectedRoute:", token);
  console.log("User Role in ProtectedRoute:", userRole);
  console.log("Allowed Roles:", allowedRoles);

  // No token found, redirect to login
  if (!token) {
    console.log("No token found, redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  try {
    // Decode the JWT to check its expiry
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    const currentTime = Math.floor(Date.now() / 1000);

    console.log("Decoded Token Expiry:", decodedToken.exp);
    console.log("Current Time:", currentTime);

    // Check if token has expired
    if (decodedToken.exp < currentTime) {
      console.log("Token expired, redirecting to login.");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Invalid token format", error);
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    return <Navigate to="/login" replace />;
  }

  // Ensure the user role exists and is allowed
  if (!userRole || !allowedRoles.includes(userRole.trim())) {
    console.log(`Unauthorized Role: ${userRole}, Redirecting to /unauthorized`);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("Navigating to protected resource...");

  // All checks passed, render the protected route
  return <Outlet />;
};

export default ProtectedRoute;
