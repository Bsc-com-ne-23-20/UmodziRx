import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSettings,
  FiMoreVertical,
  FiMoon,
  FiSun,
  FiMenu,
  FiLogOut,
  FiHome,
  FiFileText,
  FiUsers,
  FiX
} from 'react-icons/fi';

const BaseDashboard = ({ children, navItems, title, userInfo }) => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNavigation = (view) => {
    setActiveView(view);
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'prescriptions', label: 'Prescriptions', icon: FiFileText },
    { id: 'patients', label: 'Patient View', icon: FiUsers }, // Add this line
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  const renderSettingsModal = () => {
    if (!showSettingsModal) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full m-4">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Settings</h3>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <div className="px-6 py-4 space-y-6">
            {/* Dark/Light Mode Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Dark Mode</span>
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              </button>
            </div>

            {/* Help Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Help</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                For assistance, please contact the system administrator at <a href="mailto:admin@umodzi.com" className="text-blue-600 dark:text-blue-400 hover:underline">admin@umodzi.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 z-20">
        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">UmodziRx</div>
        <div className="flex items-center space-x-4">
          <div className="relative profile-menu-container">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {userInfo.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{userInfo.name}</span>
              <FiMoreVertical className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {/* Profile Settings Logic */}}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiSettings className="mr-3 h-4 w-4" />
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiLogOut className="mr-3 h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar + Main */}
      <div className="flex pt-16 h-full">
        {/* Left Sidebar */}
        <div className={`${isSidebarCollapsed ? 'w-16' : 'min-w-[10rem]'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col h-full transition-all duration-300`}>
          <div className="mb-8 flex justify-between items-center">
            <h1 className={`font-bold text-blue-600 dark:text-blue-400 transition-all duration-300 ${isSidebarCollapsed ? 'text-xs truncate' : 'text-xl p-2'}`}>
              {title}
            </h1>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FiMenu className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={item.onClick || (() => {})}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} px-4 py-2.5 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span className="ml-3">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-2">
            <button
              onClick={() => setShowSettingsModal(true)}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} px-4 py-2.5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400`}
            >
              <FiSettings className="h-5 w-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span className="ml-3">Settings</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>

      {renderSettingsModal()}
    </div>
  );
};

export default BaseDashboard;