/* eslint-disable no-unused-vars */
import { Button } from 'flowbite-react';
import React, { useState } from 'react';

function DischargePage() {
  const [dischargeData, setDischargeData] = useState({
    patientId: '',
    dischargeDate: '',
    remarks: '',
  });

  const handleChange = (e) => {
    setDischargeData({ ...dischargeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call API to update patient status to discharged
    console.log('Discharge update:', dischargeData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Patient Discharge
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Patient ID:
          </label>
          <input
            type="text"
            name="patientId"
            value={dischargeData.patientId}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Discharge Date:
          </label>
          <input
            type="date"
            name="dischargeDate"
            value={dischargeData.dischargeDate}
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
            value={dischargeData.remarks}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
          ></textarea>
        </div>
        <Button  outline   className="  bg-gradient-to-r  from-green-500 to-green-600 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800">
        Discharge Patient
                                      </Button>
      </form>
    </div>
  );
}

export default DischargePage;
