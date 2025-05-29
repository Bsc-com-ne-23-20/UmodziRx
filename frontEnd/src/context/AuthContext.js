import { createContext, useContext, useState, useEffect } from "react";
import { getRoleSpecificItem, setRoleSpecificItem, safeJsonParse, getCurrentUserRole, setCurrentUserRole, removeRoleSpecificItem } from "../utils/storageUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    // Get the userRole using our utility
    const userRole = getCurrentUserRole();
    
    // Use the role-specific authState if available
    const storedAuth = getRoleSpecificItem("authState", userRole);
    return storedAuth ? safeJsonParse(storedAuth) : { token: null, user: null };
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleOIDCCallback = (token, user) => {
    const newAuthState = { 
      token, 
      user,
      timestamp: Date.now() 
    };
    setAuthState(newAuthState);
    
    // Store with role-specific key
    const role = user?.role || '';
    setRoleSpecificItem("authState", JSON.stringify(newAuthState), role);
  };  const logout = () => {
    // Get the current role before clearing auth state
    const role = authState?.user?.role || '';
    
    setAuthState({ token: null, user: null });
    
    // Remove role-specific authState
    if (role) {
      removeRoleSpecificItem("authState", role);
      removeRoleSpecificItem("token", role);
      // Keep userRole for session continuity but clear other data
    }
  };
  const isTokenExpired = () => {
    if (!authState.token) return true;
    if (!authState.timestamp) return false; // No timestamp means it's valid
    const TOKEN_EXPIRY_TIME = 1800 * 1000; // 30 minutes in milliseconds (extended for development)
    return Date.now() - authState.timestamp > TOKEN_EXPIRY_TIME;
  };

  return (
    <AuthContext.Provider value={{ 
      authState, 
      handleOIDCCallback, 
      logout, 
      loading,
      isTokenExpired
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);