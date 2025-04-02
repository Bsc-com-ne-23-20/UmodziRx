import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [doctorData, setDoctorData] = useState({
    name: "Dr. Sarah Johnson",
    specialty: "",
    todayAppointments: 8
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Sample dashboard metrics data
  const [metrics, setMetrics] = useState({
    prescriptionsToday: 12,
    patientCompliance: 82,
    interactionsFlagged: 2
  });

  // Sample messages data
  const [messages, setMessages] = useState([
    { id: 1, sender: "Nurse Williams", content: "Patient in room 3 needs pain medication", time: "10:30 AM", read: false },
    { id: 2, sender: "Admin Team", content: "Your schedule for next week has been updated", time: "Yesterday", read: true },
    { id: 3, sender: "Dr. Rodriguez", content: "Let's discuss the Smith case at lunch", time: "Monday", read: true }
  ]);

  // Sample reports data
  const [reports, setReports] = useState([
    { id: 1, title: "Monthly Patient Statistics", date: "May 2023", type: "Statistics" },
    { id: 2, title: "Prescription Compliance Report", date: "April 2023", type: "Compliance" },
    { id: 3, title: "Clinic Performance Metrics", date: "Q1 2023", type: "Performance" }
  ]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
        {/* Doctor Profile - Top Right Corner */}
        <div className="absolute top-6 right-6">
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-teal-800 font-medium hover:text-teal-900 focus:outline-none flex items-center group"
            >
              <span className="mr-2">{doctorData.name}</span>
              <div className="w-8 h-8 rounded-full bg-teal-100 group-hover:bg-teal-200 transition-colors flex items-center justify-center overflow-hidden">
                {/* Profile image placeholder - blank for now */}
                <div className="w-full h-full bg-gray-200"></div>
              </div>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-blue-800"> </h1>
              {/* Removed the welcome message */}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Today's Appointments</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">{doctorData.todayAppointments}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Prescriptions Today</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">{metrics.prescriptionsToday}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Patient Compliance</h3>
              <p className="mt-2 text-3xl font-bold text-yellow-600">{metrics.patientCompliance}%</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'prescriptions' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Prescriptions
              </button>
              <button
                onClick={() => setActiveTab('patients')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'patients' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Patients
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messages' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reports' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reports
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {activeTab === 'prescriptions' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Prescription Management</h2>
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-3">Create New Prescription</h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      New Prescription
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-3">Recent Prescriptions</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">John Doe</p>
                          <p className="text-sm text-gray-500">Paracetamol 500mg</p>
                        </div>
                        <span className="text-sm text-gray-500">Today, 10:30 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'patients' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Patient Management</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      placeholder="Search patients..."
                      className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Add New Patient
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Messages</h2>
                <div className="space-y-4">
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`p-4 border rounded-lg ${message.read ? 'bg-white' : 'bg-blue-50'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{message.sender}</h3>
                          <p className="text-gray-600 mt-1">{message.content}</p>
                        </div>
                        <span className="text-sm text-gray-500">{message.time}</span>
                      </div>
                      {!message.read && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Reports & Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reports.map(report => (
                    <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{report.title}</h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {report.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Generated: {report.date}</p>
                      <button className="mt-4 text-sm text-blue-600 hover:text-blue-800">
                        View Report →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
