// src/pages/PatientRecordsPage.jsx
import React from 'react';

export default function PatientRecordsPage() {
  // Dummy data for demonstration
  const records = [
    { id: 'P001', name: 'Alice Johnson', lastTest: 'X-ray - Normal', lastTreatment: 'Aspirin', admissionDate: '2025-04-21' },
    { id: 'P002', name: 'Bob Smith', lastTest: 'MRI - Pending', lastTreatment: 'Paracetamol', admissionDate: '2025-04-22' },
    { id: 'P003', name: 'Charlie Brown', lastTest: 'CT Scan - Abnormal', lastTreatment: 'Ibuprofen', admissionDate: '2025-04-20' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Patient Records</h2>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border">Patient ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Last Test</th>
            <th className="py-2 px-4 border">Last Treatment</th>
            <th className="py-2 px-4 border">Admission Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec.id} className="text-center">
              <td className="py-2 px-4 border">{rec.id}</td>
              <td className="py-2 px-4 border">{rec.name}</td>
              <td className="py-2 px-4 border">{rec.lastTest}</td>
              <td className="py-2 px-4 border">{rec.lastTreatment}</td>
              <td className="py-2 px-4 border">{rec.admissionDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
