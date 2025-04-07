// src/pages/EDOHomePage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaVial, FaStethoscope, FaFileAlt } from 'react-icons/fa';

export default function EDOHomePage() {
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const username = currentUser.username;

  useEffect(() => {
    async function fetchRecentUpdates() {
      setLoading(true);
      try {
        const response = await fetch('/api/user/recent-activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, limit: 10 }),
        });
        const data = await response.json();
        if (response.ok) {
          // Format each update's time using the created_at field.
          const updatesWithTime = data.activities.map((update) => {
            const dateObj = new Date(update.created_at);
            const formattedTime = dateObj.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            return { ...update, formattedTime };
          });
          setRecentUpdates(updatesWithTime);
        } else {
          setError(data.error || 'Failed to fetch recent updates.');
        }
      } catch (err) {
        setError('Network error while fetching recent updates.');
      } finally {
        setLoading(false);
      }
    }
    fetchRecentUpdates();
  }, [username]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 animate-fadeIn">
        DEO Home
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4 animate-slideIn">
        Welcome to the Data Entry Operator Dashboard. Here you can quickly access recent updates and key metrics.
      </p>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Tests Updated */}
        <div className="shadow-xl shadow-slate-400 dark:shadow-slate-700 bg-purple-100 dark:bg-purple-900 p-4 rounded text-center transform transition duration-300 hover:scale-105">
          <FaVial className="text-4xl text-purple-600 dark:text-purple-300 mx-auto mb-2 animate-bounce" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Tests Updated
          </h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">48</p>
        </div>
        {/* Treatments Logged */}
        <div className="shadow-xl shadow-slate-400 dark:shadow-slate-700 bg-green-100 dark:bg-green-900 p-4 rounded text-center transform transition duration-300 hover:scale-105">
          <FaStethoscope className="text-4xl text-green-600 dark:text-green-300 mx-auto mb-2 animate-pulse" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Treatments Logged
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-300">37</p>
        </div>
        {/* Reports Uploaded */}
        <div className="shadow-xl shadow-slate-400 dark:shadow-slate-700 bg-blue-100 dark:bg-blue-900 p-4 rounded text-center transform transition duration-300 hover:scale-105">
          <FaFileAlt className="text-4xl text-blue-600 dark:text-blue-300 mx-auto mb-2 animate-bounce" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Reports Uploaded
          </h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">21</p>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-slate-800 transition-all duration-300">
        <h3 className="text-xl w-fit border-b-2 border-sky-900 font-semibold text-white dark:bg-sky-700 dark:text-gray-200 mb-3 bg-sky-500 rounded-md px-1">
          Recent Updates
        </h3>
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading updates...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="divide-y divide-gray-300 dark:divide-gray-600">
            {recentUpdates.map((update) => (
              <li key={update.id} className="py-2 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300">
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">{update.type}:</span> {update.description}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {update.formattedTime}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
