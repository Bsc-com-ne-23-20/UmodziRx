import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSettings,
  FiMoreVertical,
  FiMoon,
  FiSun,
  FiSearch,
  FiMenu,
  FiLogOut,
  FiEye
} from 'react-icons/fi';

const BaseDashboard = ({ children, navItems, title, userInfo }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-16' : 'min-w-[16rem]'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col h-full transition-all duration-300`}>
        <div className="mb-8 flex justify-between items-center">
          {!isSidebarCollapsed && <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">{title}</h1>}
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
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} px-4 py-2.5 rounded-lg transition-colors
                ${activeView === item.id 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400'}`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          <button 
            onClick={toggleDarkMode}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} px-4 py-2.5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400`}
          >
            {darkMode ? (
              <FiSun className="h-5 w-5 flex-shrink-0" />
            ) : (
              <FiMoon className="h-5 w-5 flex-shrink-0" />
            )}
            {!isSidebarCollapsed && (
              <span className="ml-3">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </button>
          <button className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} px-4 py-2.5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400`}>
            <FiSettings className="h-5 w-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span className="ml-3">Settings</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full">

        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center flex-1">
            <div className="relative w-[400px]">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

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
                    onClick={() => {/* Handle profile settings */}}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiSettings className="mr-3 h-4 w-4" />
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {/* Handle patient view switch */}}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiEye className="mr-3 h-4 w-4" />
                    Patient View
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

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {React.Children.map(children, child =>
            React.cloneElement(child, {
              searchTerm,
              activeView,
              darkMode,
              handleNavigation
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BaseDashboard;
