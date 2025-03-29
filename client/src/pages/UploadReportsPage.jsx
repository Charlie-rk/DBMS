// src/pages/UploadReportsPage.jsx
import { Button } from 'flowbite-react';
import React, { useState } from 'react';

export default function UploadReportsPage() {
  const [patientId, setPatientId] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement file upload logic (e.g., to cloud storage or your server)
    console.log('Uploading report for Patient:', patientId, file);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Upload Report
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Patient ID:
          </label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Select Report (PDF):
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-gray-900 dark:text-gray-100"
            required
          />
        </div>
       
         <Button  outline  className="bg-gradient-to-r  from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800">
         Upload Report
                      </Button>
      </form>
    </div>
  );
}
