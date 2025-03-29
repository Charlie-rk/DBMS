/* eslint-disable no-unused-vars */
import { Button } from 'flowbite-react';
import React, { useState } from 'react';

function AppointmentPage() {
  const [appointmentData, setAppointmentData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    condition: '',
  });

  const handleChange = (e) => {
    setAppointmentData({ ...appointmentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call API to schedule appointment based on patient condition and selected doctor
    console.log('Appointment scheduled:', appointmentData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Schedule Appointment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Patient ID:
          </label>
          <input
            type="text"
            name="patientId"
            value={appointmentData.patientId}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Select Doctor:
          </label>
          <select
            name="doctorId"
            value={appointmentData.doctorId}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          >
            <option value="">--Select Doctor--</option>
            <option value="D001">Dr. Sharma (General)</option>
            <option value="D002">Dr. Mehta (Cardiology)</option>
            <option value="D003">Dr. Verma (Neurology)</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Appointment Date:
          </label>
          <input
            type="date"
            name="appointmentDate"
            value={appointmentData.appointmentDate}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Appointment Time:
          </label>
          <input
            type="time"
            name="appointmentTime"
            value={appointmentData.appointmentTime}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Patient Condition/Issue:
          </label>
          <textarea
            name="condition"
            value={appointmentData.condition}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            rows="3"
          ></textarea>
        </div>
        
         <Button  outline  className="bg-gradient-to-r  from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800">
         Schedule Appointment
                      </Button>
      </form>
    </div>
  );
}

export default AppointmentPage;
