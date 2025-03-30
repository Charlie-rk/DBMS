// src/pages/EDOHomePage.jsx
import React from 'react';

export default function EDOHomePage() {
  // Dummy recent updates data
  const recentUpdates = [
    { id: 1, type: 'Test', description: 'X-Ray result updated for Patient #P102', time: '10:15 AM' },
    { id: 2, type: 'Treatment', description: 'Prescribed Antibiotic for Patient #P087', time: '10:30 AM' },
    { id: 3, type: 'Report', description: 'Blood Test report uploaded for Patient #P134', time: '11:00 AM' },
    { id: 4, type: 'Test', description: 'MRI result updated for Patient #P121', time: '11:30 AM' },
    { id: 5, type: 'Treatment', description: 'Dosage updated for Patient #P098', time: '12:00 PM' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        EDO Home
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Welcome to the Data Entry Operator Dashboard. Here you can quickly access recent updates and key metrics.
      </p>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Tests Updated */}
        <div className="shadow-xl shadow-slate-400 bg-purple-100 dark:bg-purple-900 p-4 rounded text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Tests Updated
          </h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">48</p>
        </div>
        {/* Treatments Logged */}
        <div className="shadow-xl shadow-slate-400 bg-green-100 dark:bg-green-900 p-4 rounded text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Treatments Logged
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-300">37</p>
        </div>
        {/* Reports Uploaded */}
        <div className="shadow-xl shadow-slate-400 bg-blue-100 dark:bg-blue-900 p-4 rounded text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Reports Uploaded
          </h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">21</p>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
          Recent Updates
        </h3>
        <ul className="divide-y divide-gray-300 dark:divide-gray-600">
          {recentUpdates.map((update) => (
            <li key={update.id} className="py-2 flex justify-between items-center">
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{update.type}:</span> {update.description}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{update.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
