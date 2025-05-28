import { useNavigate } from 'react-router-dom';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { 
  getRoleSpecificItem, 
  clearRoleSpecificStorage, 
  getCurrentUserRole, 
  removeRoleSpecificItem 
} from '../utils/storageUtils';


const useAuth = () => {
  const auth = useAuthContext();
  const navigate = useNavigate();
  const logout = () => {
    // Get current role before logging out
    const userRole = getCurrentUserRole();
    
    // Clear role-specific storage
    if (userRole) {
      clearRoleSpecificStorage(userRole);
    }
      // Also call the auth context logout to clear auth state
    auth.logout();
    
    // Instead of using localStorage.clear() which would affect all roles,
    // we'll remove only non-prefixed items for backward compatibility
    removeRoleSpecificItem("authState");
    removeRoleSpecificItem("token");
    removeRoleSpecificItem("userRole");
    removeRoleSpecificItem("userId");
    removeRoleSpecificItem("userName");
    
    navigate('/login');
  };    const getUserInfo = () => {
    const userRole = getCurrentUserRole();
    
    // Get the appropriate ID based on role, using role-specific storage if available
    let userId;
    if (userRole === 'doctor') {
      userId = getRoleSpecificItem('doctorId', userRole) || 
               getRoleSpecificItem('userId', userRole);
    } else if (userRole === 'pharmacist') {
      userId = getRoleSpecificItem('pharmaId', userRole) || 
               getRoleSpecificItem('userId', userRole);
    } else if (userRole === 'patient') {
      userId = getRoleSpecificItem('patientId', userRole) || 
               getRoleSpecificItem('userId', userRole);
    } else if (userRole === 'admin') {
      userId = getRoleSpecificItem('adminId', userRole) || 
               getRoleSpecificItem('userId', userRole);
    } else {
      userId = getRoleSpecificItem('userId', userRole);
    }
    
    // Get the appropriate name based on role, checking role-specific storage first
    let userName, userEmail, userBirthday, userGender;
    
    if (userRole === 'doctor') {
      userName = getRoleSpecificItem('doctorName', userRole) || getRoleSpecificItem('userName', userRole) || 'User';
      userEmail = getRoleSpecificItem('doctorEmail', userRole) || getRoleSpecificItem('userEmail', userRole);
      userBirthday = getRoleSpecificItem('doctorBirthday', userRole) || getRoleSpecificItem('userBirthday', userRole);
      userGender = getRoleSpecificItem('doctorGender', userRole) || getRoleSpecificItem('userGender', userRole);
    } else if (userRole === 'pharmacist') {
      userName = getRoleSpecificItem('pharmaName', userRole) || getRoleSpecificItem('userName', userRole) || 'User';
      userEmail = getRoleSpecificItem('pharmaEmail', userRole) || getRoleSpecificItem('userEmail', userRole);
      userBirthday = getRoleSpecificItem('pharmaBirthday', userRole) || getRoleSpecificItem('userBirthday', userRole);
      userGender = getRoleSpecificItem('pharmaGender', userRole) || getRoleSpecificItem('userGender', userRole);
    } else if (userRole === 'patient') {
      userName = getRoleSpecificItem('patientName', userRole) || getRoleSpecificItem('userName', userRole) || 'User';
      userEmail = getRoleSpecificItem('patientEmail', userRole) || getRoleSpecificItem('userEmail', userRole);
      userBirthday = getRoleSpecificItem('patientBirthday', userRole) || getRoleSpecificItem('userBirthday', userRole);
      userGender = getRoleSpecificItem('patientGender', userRole) || getRoleSpecificItem('userGender', userRole);
    } else if (userRole === 'admin') {
      userName = getRoleSpecificItem('adminName', userRole) || getRoleSpecificItem('userName', userRole) || 'User';
      userEmail = getRoleSpecificItem('adminEmail', userRole) || getRoleSpecificItem('userEmail', userRole);
      userBirthday = getRoleSpecificItem('adminBirthday', userRole) || getRoleSpecificItem('userBirthday', userRole);
      userGender = getRoleSpecificItem('adminGender', userRole) || getRoleSpecificItem('userGender', userRole);
    } else {
      userName = getRoleSpecificItem('userName', userRole) || 'User';
      userEmail = getRoleSpecificItem('userEmail', userRole);
      userBirthday = getRoleSpecificItem('userBirthday', userRole);
      userGender = getRoleSpecificItem('userGender', userRole);
    }
    
    console.log('Auth info from localStorage:', { 
      id: userId, 
      name: userName,
      email: userEmail,
      birthday: userBirthday,
      gender: userGender,
      role: userRole,
      allUserIds: {
        userId: getRoleSpecificItem('userId', userRole),
        doctorId: getRoleSpecificItem('doctorId', userRole),
        pharmaId: getRoleSpecificItem('pharmaId', userRole),
        patientId: getRoleSpecificItem('patientId', userRole),
        adminId: getRoleSpecificItem('adminId', userRole)
      }
    });
    
    return {
      id: userId,
      name: userName,
      email: userEmail,
      birthday: userBirthday,
      gender: userGender,
      role: userRole
    };
  };

  return {
    ...auth,
    logout,
    getUserInfo
  };
};

export default useAuth;