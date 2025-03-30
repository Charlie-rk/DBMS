import React from 'react';
import { Link } from 'react-router-dom';

export default function FDOHomePage() {
  // Dummy data for recent activities
  const recentActivities = [
    { id: 1, message: 'John Doe registered.', time: '10:15 AM' },
    { id: 2, message: 'Jane Smith scheduled an appointment.', time: '10:30 AM' },
    { id: 3, message: 'Bob Johnson admitted.', time: '11:00 AM' },
    { id: 4, message: 'Alice Williams discharged.', time: '11:30 AM' },
    { id: 5, message: 'Mark Brown updated details.', time: '12:00 PM' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        FDO Home
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Welcome to the Front Desk Operator Dashboard. Here you can view quick stats and manage daily tasks.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Total Patients */}
        <div className="shadow-xl shadow-slate-400 bg-blue-100 dark:bg-blue-900 p-4 rounded text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Total Patients
          </h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">120</p>
        </div>
        {/* Active Admissions */}
        <div className="shadow-xl shadow-slate-400 bg-green-100 dark:bg-green-900 p-4 rounded text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Active Admissions
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-300">18</p>
        </div>
        {/* Today's Appointments */}
        <div className="shadow-xl shadow-slate-400 bg-yellow-100 dark:bg-yellow-900 p-4 rounded text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Today's Appointments
          </h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">35</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Recent Activities</h3>
        <ul className="divide-y divide-gray-300 dark:divide-gray-600">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="py-2 flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">{activity.message}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
