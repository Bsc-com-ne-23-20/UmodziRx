import React, { useState, useEffect } from "react";

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock prescription data
    const mockPrescriptions = [
      {
        id: 1,
        date: "2023-10-01",
        doctor: "Dr. Smith",
        medications: [
          { name: "Paracetamol", dosage: "500mg", frequency: "3 times daily" },
          { name: "Amoxicillin", dosage: "500mg", frequency: "Every 8 hours" }
        ]
      },
      {
        id: 2,
        date: "2023-09-25",
        doctor: "Dr. Johnson",
        medications: [
          { name: "Ibuprofen", dosage: "400mg", frequency: "As needed" }
        ]
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setPrescriptions(mockPrescriptions);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">My Prescriptions</h1>
      
      {loading ? (
        <div className="text-center">Loading prescriptions...</div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  Prescription from {prescription.doctor}
                </h2>
                <span className="text-gray-500">{prescription.date}</span>
              </div>
              <div className="space-y-2">
                {prescription.medications.map((med, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-3">
                    <h3 className="font-medium">{med.name}</h3>
                    <p className="text-sm text-gray-600">
                      {med.dosage} - {med.frequency}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
