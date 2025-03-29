import React from 'react';

export default function FDOHomePage() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        FDO Home
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Welcome to the Front Desk Operator Dashboard. Here you can see a quick overview:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Patients */}
        <div className="shadow-xl shadow-slate-400 bg-blue-100 dark:bg-blue-900 p-4 rounded  text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Total Patients
          </h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">120</p>
        </div>
        {/* Active Admissions */}
        <div className="shadow-xl shadow-slate-400 bg-green-100 dark:bg-green-900 p-4 rounded  text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Active Admissions
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-300">18</p>
        </div>
        {/* Today's Appointments */}
        <div className="shadow-xl shadow-slate-400 bg-yellow-100 dark:bg-yellow-900 p-4 rounded  text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Today's Appointments
          </h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">35</p>
        </div>
      </div>
    </div>
  );
}
