// src/pages/TreatmentDataEntryPage.jsx
import { Button } from 'flowbite-react';
import React, { useState } from 'react';

export default function TreatmentDataEntryPage() {
  const [formData, setFormData] = useState({
    patientId: '',
    drugName: '',
    dosage: '',
    treatmentDate: '',
    remarks: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call API to update treatment data
    console.log('Treatment Data Submitted:', formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Treatment Data Entry
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Patient ID:
          </label>
          <input
            type="text"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Drug Name:
          </label>
          <input
            type="text"
            name="drugName"
            value={formData.drugName}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Dosage:
          </label>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Treatment Date:
          </label>
          <input
            type="date"
            name="treatmentDate"
            value={formData.treatmentDate}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Remarks:
          </label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
          ></textarea>
        </div>
       
         <Button  outline  className="bg-gradient-to-r  from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800">
         Submit Treatment Data
                              </Button>
      </form>
    </div>
  );
}
