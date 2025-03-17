import { useNavigate } from 'react-router-dom'; // Correct placement for import

const mockPrescriptions = [
  {
    id: 1, // Example prescription ID
    medication: 'Paracetamol',
    dosage: '500mg',
    instructions: 'Take once daily',
  },
  {
    id: 2,
    medication: 'Ibuprofen',
    dosage: '400mg',
    instructions: 'Take twice daily',
  },
];

export default function Dashboard() {
  const navigate = useNavigate(); // Initialize useNavigate

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('userRole'); // Remove userRole from localStorage
    navigate('/'); // Redirect to the login page
  };

  return (
    <div className="container mx-auto p-8">
      {/* Logout Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Logout
        </button>
      </div>

      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="mt-4">Manage your prescriptions and verify issued ones.</p>

      {/* Example: Display mock prescriptions */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Prescriptions</h3>
        <ul>
          {mockPrescriptions.map((prescription) => (
            <li key={prescription.id} className="mb-2 p-4 bg-gray-50 rounded-lg">
              <p><strong>Medication:</strong> {prescription.medication}</p>
              <p><strong>Dosage:</strong> {prescription.dosage}</p>
              <p><strong>Instructions:</strong> {prescription.instructions}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}