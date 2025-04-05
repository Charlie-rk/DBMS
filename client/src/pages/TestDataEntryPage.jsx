// src/pages/TestDataEntryPage.jsx
import { Button } from 'flowbite-react';
import React, { useState } from 'react';

export default function TestDataEntryPage() {
  const [formData, setFormData] = useState({
    patientId: '',
    doctor:'',
    testType: '',
    testResult: '',
    testDate: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call API to update test data
    console.log('Test Data Submitted:', formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Test Data Entry
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
            Doctor (username):
          </label>
          <input
            type="text"
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Test Type (e.g., X-ray, MRI):
          </label>
          <input
            type="text"
            name="testType"
            value={formData.testType}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Test Result/Report:
          </label>
          <textarea
            name="testResult"
            value={formData.testResult}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Test Date:
          </label>
          <input
            type="date"
            name="testDate"
            value={formData.testDate}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
       
         <Button  outline  className="bg-gradient-to-r  from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800">
         Submit Test Data
                                      </Button>
      </form>
    </div>
  );
}
