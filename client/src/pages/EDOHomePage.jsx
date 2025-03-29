// src/pages/EDOHomePage.jsx
import React from 'react';

export default function EDOHomePage() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        EDO Home
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Welcome to the Data Entry Operator Dashboard. Here you can quickly access recent updates and key metrics.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tests Updated */}
        <div className="shadow-xl shadow-slate-400 bg-purple-100 dark:bg-purple-900 p-4 rounded  text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Tests Updated
          </h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
            48
          </p>
        </div>
        {/* Treatments Logged */}
        <div className="shadow-xl shadow-slate-400 bg-green-100 dark:bg-green-900 p-4 rounded  text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Treatments Logged
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-300">
            37
          </p>
        </div>
        {/* Reports Uploaded */}
        <div className="shadow-xl shadow-slate-400 bg-blue-100 dark:bg-blue-900 p-4 rounded  text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Reports Uploaded
          </h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
            21
          </p>
        </div>
      </div>
    </div>
  );
}
