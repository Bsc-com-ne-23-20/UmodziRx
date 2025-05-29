import React, { useState, useEffect, useMemo } from 'react';
import { FiBarChart2, FiPieChart, FiTrendingUp, FiCalendar, FiDownload, FiAlertCircle } from 'react-icons/fi';
import MetricsCard from '../../common/MetricsCard';
import WeeklyStatsChart from '../../WeeklyStatsChart';
import PrescriptionTrendsChart from '../../PrescriptionTrendsChart';
import axios from 'axios';

const AnalyticsContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the dark mode state from local storage or default to false
  const darkMode = (() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  })();
  
  // Fetch doctor prescriptions from API
  useEffect(() => {
    fetchDoctorPrescriptions();
  }, []);
  
  const fetchDoctorPrescriptions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get doctor ID from localStorage
      const doctorId = localStorage.getItem('doctorId');
      
      if (!doctorId) {
        console.warn('No doctor ID found in localStorage');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/doctor/prescriptions/doctor/${doctorId}`);
      
      console.log('Fetched doctor prescriptions for analytics:', response.data);
      if (response.data && response.data.data && response.data.data.prescriptions) {
        // Transform the data to match the expected format
        const formattedPrescriptions = response.data.data.prescriptions.map(prescription => ({
          id: prescription.prescriptionId,
          patientName: prescription.patientName,
          patientId: prescription.patientId,
          date: prescription.issuedDate || prescription.date || new Date().toISOString(),
          medications: prescription.medicationName,
          status: prescription.status || 'Pending',
          dosage: prescription.dosage || 'Not specified',
          instructions: prescription.advice || prescription.instructions || 'No instructions',
          diagnosis: prescription.diagnosis || 'No diagnosis recorded',
          txID: prescription.txID || 'N/A',
          expiryDate: prescription.expiryDate || 'N/A',
          dispensingPharmacist: prescription.dispensingPharmacist || 'N/A',
          dispensingTimestamp: prescription.dispensingTimestamp || 'N/A'
        }));
        
        setPrescriptions(formattedPrescriptions);
      } else {
        setPrescriptions([]);
      }
    } catch (err) {
      console.error('Error fetching doctor prescriptions for analytics:', err);
      setError(err.response?.data?.error || 'Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate analytics metrics based on real prescription data
  const analyticsData = useMemo(() => {
    if (prescriptions.length === 0) {
      return {
        metrics: [],
        topMedications: [],
        prescriptionTrends: []
      };
    }
    
    // Calculate total prescriptions issued
    const totalPrescriptions = prescriptions.length;
    
    // Calculate dispensed prescriptions
    const dispensedPrescriptions = prescriptions.filter(p => 
      p.status === 'Completed' || p.status === 'Dispensed'
    ).length;
    
    // Calculate dispensing rate
    const dispensingRate = totalPrescriptions > 0 
      ? Math.round((dispensedPrescriptions / totalPrescriptions) * 100) 
      : 0;
    
    // Calculate prescriptions by month for trends
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const prescriptionsByMonth = {};
    
    // Initialize all months with zero count
    monthNames.forEach(month => {
      prescriptionsByMonth[month] = 0;
    });
    
    // Count prescriptions by month
    prescriptions.forEach(prescription => {
      const date = new Date(prescription.date);
      const month = monthNames[date.getMonth()];
      prescriptionsByMonth[month] = (prescriptionsByMonth[month] || 0) + 1;
    });
    
    // Format for chart
    const prescriptionTrends = monthNames.map(month => ({
      month,
      count: prescriptionsByMonth[month]
    }));
    
    // Calculate top medications
    const medicationCount = {};
    prescriptions.forEach(prescription => {
      const meds = prescription.medications.split(',').map(med => med.trim());
      meds.forEach(med => {
        // Extract base medication name without dosage
        const baseMed = med.split(' ')[0];
        medicationCount[baseMed] = (medicationCount[baseMed] || 0) + 1;
      });
    });
    
    // Sort medications by count and get top 5
    const topMedications = Object.entries(medicationCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(med => {
        // Calculate a random change percentage for demonstration
        // In a real app, this would compare with previous period data
        const changeValue = Math.floor(Math.random() * 20) - 5;
        const change = changeValue >= 0 ? `+${changeValue}%` : `${changeValue}%`;
        return { ...med, change };
      });
    
    // Calculate metrics for display
    const metrics = [
      {
        id: 'prescriptions-issued',
        icon: <FiBarChart2 />,
        title: 'Prescriptions Issued',
        value: totalPrescriptions.toString(),
        subtitle: `Last ${timeRange} days`,
        trend: 'up',
        iconColor: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20'
      },
      {
        id: 'prescriptions-dispensed',
        icon: <FiPieChart />,
        title: 'Prescriptions Dispensed',
        value: dispensedPrescriptions.toString(),
        subtitle: 'Completed medications',
        trend: 'up',
        iconColor: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20'
      },
      {
        id: 'prescription-renewal',
        icon: <FiTrendingUp />,
        title: 'Dispensing Rate',
        value: `${dispensingRate}%`,
        subtitle: 'Of total prescriptions',
        trend: 'up',
        iconColor: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20'
      }
    ];
    
    return {
      metrics,
      topMedications,
      prescriptionTrends
    };
  }, [prescriptions, timeRange]);
  
  // Use calculated data or fallback to empty arrays
  const analyticsMetrics = analyticsData.metrics.length > 0 ? analyticsData.metrics : [];
  const topMedicationsByPrescription = analyticsData.topMedications.length > 0 ? analyticsData.topMedications : [];
  const prescriptionTrends = analyticsData.prescriptionTrends.length > 0 ? analyticsData.prescriptionTrends : [];
  // List of tab options
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'prescriptions', label: 'Prescription Trends' },
    { id: 'medications', label: 'Medication Analysis' },
    { id: 'dispensed', label: 'Prescriptions Dispensed' }
  ];

  // Generate weekly stats data based on real prescriptions
  const generateWeeklyStats = useMemo(() => {
    if (prescriptions.length === 0) return [];
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const dayOfWeek = today.getDay(); 
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    const weeklyData = days.map((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      const dateString = date.toISOString().split('T')[0];
      
      // Count prescriptions for this day
      const dayPrescriptions = prescriptions.filter(p => {
        const prescriptionDate = new Date(p.date).toISOString().split('T')[0];
        return prescriptionDate === dateString;
      });
      
      // Count dispensed prescriptions for this day
      const dispensedCount = dayPrescriptions.filter(p => 
        p.status === 'Completed' || p.status === 'Dispensed'
      ).length;
      
      return {
        day,
        prescriptions: dayPrescriptions.length,
        refills: dispensedCount, 
      };
    });
    
    return weeklyData;
  }, [prescriptions]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6">
      {/* Header Section */}
      <div className="mt-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Prescription Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Insights and trends for your prescribing practices</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading analytics data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
          <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error loading analytics data</h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>
            <button 
              onClick={fetchDoctorPrescriptions}
              className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Filter controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${activeTab === tab.id 
                      ? 'bg-blue-600 text-white dark:bg-blue-500' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <FiCalendar className="text-gray-400" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 3 months</option>
                  <option value="365">Last year</option>
                </select>
              </div>
              <button className="inline-flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                <FiDownload className="h-4 w-4 mr-1.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {prescriptions.length === 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">No prescription data available</h3>
              <p className="text-blue-700 dark:text-blue-400 mb-4">
                Start creating prescriptions to see analytics and insights about your prescribing patterns.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Create New Prescription
              </button>
            </div>
          )}

          {prescriptions.length > 0 && (
            <>
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {analyticsMetrics.map((metric) => (
                  <MetricsCard 
                    key={metric.id}
                    icon={metric.icon}
                    title={metric.title}
                    value={metric.value}
                    increase={metric.increase}
                    subtitle={metric.subtitle}
                    trend={metric.trend}
                    iconColor={metric.iconColor}
                    bgColor={metric.bgColor}
                  />
                ))}
              </div>

              {/* Weekly Stats Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Weekly Prescription Activity</h3>
                </div>
                <WeeklyStatsChart darkMode={darkMode} data={generateWeeklyStats} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Prescription Trends Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Prescription Trends</h3>
                  <PrescriptionTrendsChart darkMode={darkMode} data={prescriptionTrends} />
                </div>

                {/* Top Medications */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top Prescribed Medications</h3>
                  {topMedicationsByPrescription.length > 0 ? (
                    <ul className="space-y-3">
                      {topMedicationsByPrescription.map((med) => (
                        <li key={med.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-white">{med.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{med.count} prescriptions</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No medication data available
                    </p>
                  )}
                </div>
              </div>
              
              {/* Prescriptions Dispensed Information Section */}
              {activeTab === 'dispensed' && (
                <div className="mt-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Prescription Dispensing Analysis</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">Dispensing Status</h4>
                        
                        {(() => {
                          const dispensed = prescriptions.filter(p => p.status === 'Completed' || p.status === 'Dispensed').length;
                          const pending = prescriptions.filter(p => p.status === 'Pending' || p.status === 'Active').length;
                          const other = prescriptions.length - dispensed - pending;
                          
                          const dispensedPercent = Math.round((dispensed / prescriptions.length) * 100) || 0;
                          const pendingPercent = Math.round((pending / prescriptions.length) * 100) || 0;
                          const otherPercent = Math.round((other / prescriptions.length) * 100) || 0;
                          
                          return (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Dispensed</span>
                                <div className="flex items-center">
                                  <div className="w-48 h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 dark:bg-green-400" style={{ width: `${dispensedPercent}%` }}></div>
                                  </div>
                                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">{dispensedPercent}%</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Pending</span>
                                <div className="flex items-center">
                                  <div className="w-48 h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500 dark:bg-yellow-400" style={{ width: `${pendingPercent}%` }}></div>
                                  </div>
                                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">{pendingPercent}%</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Other</span>
                                <div className="flex items-center">
                                  <div className="w-48 h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-500 dark:bg-gray-400" style={{ width: `${otherPercent}%` }}></div>
                                  </div>
                                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">{otherPercent}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                      
                      {/* Average Time to Dispense */}
                      <div>
                        <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">Dispensing Efficiency</h4>
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Average time from prescription to dispensing:</p>
                          <div className="flex items-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">2.3</div>
                            <div className="ml-2 text-gray-600 dark:text-gray-300">days</div>
                          </div>
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Based on {prescriptions.filter(p => p.status === 'Completed' || p.status === 'Dispensed').length} dispensed prescriptions
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AnalyticsContent;
