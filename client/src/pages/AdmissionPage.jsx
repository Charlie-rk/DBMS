/* eslint-disable no-unused-vars */
import { Button } from 'flowbite-react';
import React, { useState } from 'react';

function AdmissionPage() {
  const [admissionData, setAdmissionData] = useState({
    patientId: '',
    roomNumber: '',
    admissionDate: '',
    notes: '',
  });

  const handleChange = (e) => {
    setAdmissionData({ ...admissionData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call API to update patient status and allocate room
    console.log('Admission update:', admissionData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Patient Admission
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Patient ID:
          </label>
          <input
            type="text"
            name="patientId"
            value={admissionData.patientId}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Room Number:
          </label>
          <input
            type="text"
            name="roomNumber"
            value={admissionData.roomNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Admission Date:
          </label>
          <input
            type="date"
            name="admissionDate"
            value={admissionData.admissionDate}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Notes/Updates:
          </label>
          <textarea
            name="notes"
            value={admissionData.notes}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            rows="3"
          ></textarea>
        </div>
       
        <Button  outline  className="bg-gradient-to-r  from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800">
        Admit Patient
                              </Button>
      </form>
    </div>
  );
}

export default AdmissionPage;
