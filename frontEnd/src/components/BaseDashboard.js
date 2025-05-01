import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSettings,
  FiMoreVertical,
  FiMoon,
  FiSun,
  FiMenu,
  FiLogOut,
  FiEye,
  FiPhone,
  FiHelpCircle
} from 'react-icons/fi';

const BaseDashboard = ({ children, navItems = [], title = '', userInfo = {} }) => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Emergency contacts data
  const emergencyContacts = [
    { name: "Emergency Services", number: "911" },
    { name: "Poison Control", number: "1-800-222-1222" },
    { name: "Mental Health Crisis", number: "988" },
    { name: "Hospital Main Line", number: "555-123-4567" },
    { name: "Your Primary Doctor", number: "555-987-6543" }
  ];

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
      if (showSupportModal && !event.target.closest('.support-modal-container')) {
        setShowSupportModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu, showSupportModal]);

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

  const handlePatientView = () => {
    navigate('/patient');
  };

  const toggleSupportModal = () => {
    setShowSupportModal(!showSupportModal);
  };

  return (
    <div className={`h-screen overflow-hidden ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Header */}
      <header className={`fixed top-0 left-0 right-0 h-16 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b flex items-center justify-between px-6 z-20`}>
        <div className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>UmodziRx</div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>

          <div className="relative profile-menu-container">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center space-x-2 p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {userInfo?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
              </div>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {userInfo?.name || 'User'}
              </span>
              <FiMoreVertical className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>

            {showProfileMenu && (
              <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg py-1 z-10 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <button
                  onClick={() => {}}
                  className={`flex items-center w-full px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiSettings className="mr-3 h-4 w-4" />
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className={`flex items-center w-full px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
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
        <div className={`${isSidebarCollapsed ? 'w-16' : 'min-w-[10rem]'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r p-4 flex flex-col h-full transition-all duration-300`}>
          <div className="mb-8 flex justify-between items-center">
            <h1 className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-all duration-300 ${isSidebarCollapsed ? 'text-xs truncate' : 'text-xl p-2'}`}>
              {title}
            </h1>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <FiMenu className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={item.onClick || (() => {})}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} px-4 py-2.5 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-blue-900 hover:text-blue-400' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span className="ml-3">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-2">
            <button
              onClick={handlePatientView}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} px-4 py-2.5 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-blue-900 hover:text-blue-400' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              <FiEye className="h-5 w-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span className="ml-3">Patient View</span>}
            </button>

            <button
              onClick={toggleSupportModal}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} px-4 py-2.5 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-blue-900 hover:text-blue-400' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              <FiHelpCircle className="h-5 w-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span className="ml-3">Support</span>}
            </button>

            <button className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} px-4 py-2.5 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-blue-900 hover:text-blue-400' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>
              <FiSettings className="h-5 w-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span className="ml-3">Settings</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {React.Children.map(children, child => {
            return React.cloneElement(child, { darkMode });
          })}
        </div>
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-xl w-full max-w-md mx-4 support-modal-container ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Emergency Contacts
                </h3>
                <button
                  onClick={toggleSupportModal}
                  className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {contact.name}
                    </p>
                    <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {contact.number}
                    </p>
                    <div className="mt-2">
                      <a 
                        href={`tel:${contact.number.replace(/[^\d]/g, '')}`}
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                      >
                        <FiPhone className="mr-2 h-4 w-4" />
                        Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={toggleSupportModal}
                  className={`w-full px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseDashboard;