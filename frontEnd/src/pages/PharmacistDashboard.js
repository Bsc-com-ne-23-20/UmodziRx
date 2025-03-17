import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

export default function PharmacistDashboard() {
    const navigate = useNavigate(); // Initialize useNavigate

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('userRole'); // Remove userRole from localStorage
        navigate('/'); // Redirect to the login page
    };

    // Function to handle navigation to specific routes
    const handleNavigation = (path) => {
        navigate(path); // Navigate to the specified path
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                {/* Logout Button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Logout
                    </button>
                </div>

                <h2 className="text-2xl font-bold mb-6">Pharmacist Dashboard</h2>
                <p className="text-gray-700">Welcome, Pharmacist! Verify and manage prescriptions here.</p>

                {/* Pharmacist Duties Section */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Pharmacist Duties</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => handleNavigation('/pharmacist/verify-prescriptions')}
                            className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Verify Prescriptions
                        </button>
                        <button
                            onClick={() => handleNavigation('/pharmacist/dispense-medications')}
                            className="w-full bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Dispense Medications
                        </button>
                        <button
                            onClick={() => handleNavigation('/pharmacist/patient-counseling')}
                            className="w-full bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200 transition duration-200 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                        >
                            Patient Counseling
                        </button>
                        <button
                            onClick={() => handleNavigation('/pharmacist/record-keeping')}
                            className="w-full bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Record Keeping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}