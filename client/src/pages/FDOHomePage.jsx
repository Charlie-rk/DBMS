/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUsers, FaProcedures, FaCalendarAlt } from 'react-icons/fa';

export default function FDOHomePage() {
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeAdmissions: 0,
    totalAppointments: 0
  });
  const [error, setError] = useState(null);

  const { currentUser } = useSelector((state) => state.user);
  const username = currentUser.username;

  useEffect(() => {
    async function fetchRecentActivities() {
      setLoadingActivities(true);
      try {
        const response = await fetch('/api/user/recent-activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, limit: 10 })
        });
        const data = await response.json();
        if (response.ok) {
          // Format created_at as a localized time string.
          const activitiesWithTime = data.activities.map((activity) => {
            const dateObj = new Date(activity.created_at);
            const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return { ...activity, formattedTime };
          });
          setRecentActivities(activitiesWithTime);
        } else {
          setError(data.error || "Failed to fetch recent activities.");
        }
      } catch (err) {
        setError("Network error while fetching recent activities.");
      } finally {
        setLoadingActivities(false);
      }
    }
    fetchRecentActivities();
  }, [username]);

  // Fetch home stats data
  useEffect(() => {
    async function fetchHomeStats() {
      try {
        const response = await fetch('/api/fdo/home-stats');
        const data = await response.json();
        if (response.ok) {
          setStats({
            totalPatients: data.totalPatients,
            activeAdmissions: data.activeAdmissions,
            totalAppointments: data.totalAppointments
          });
        } else {
          console.error(data.error || "Failed to fetch home stats.");
        }
      } catch (err) {
        console.error("Network error while fetching home stats.");
      }
    }
    fetchHomeStats();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md shadow-slate-500">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 animate-fadeIn">
        FDO Home
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4 animate-slideIn">
        Welcome to the Front Desk Operator Dashboard. Here you can view quick stats and manage daily tasks.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Total Patients */}
        <div className="shadow-xl dark:shadow-slate-700 shadow-slate-600 bg-blue-100 dark:bg-blue-900 p-4 rounded text-center transform transition duration-300 hover:scale-105">
          <FaUsers className="text-4xl text-blue-600 dark:text-blue-300 mx-auto mb-2 animate-bounce" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Total Patients
          </h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{stats.totalPatients}</p>
        </div>
        {/* Active Admissions */}
        <div className="shadow-xl dark:shadow-slate-700 shadow-slate-600 bg-green-100 dark:bg-green-900 p-4 rounded text-center transform transition duration-300 hover:scale-105">
          <FaProcedures className="text-4xl text-green-600 dark:text-green-300 mx-auto mb-2 animate-pulse" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Active Admissions
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-300">{stats.activeAdmissions}</p>
        </div>
        {/* Today's Appointments */}
        <div className="shadow-xl dark:shadow-slate-700 shadow-slate-600 bg-yellow-100 dark:bg-yellow-900 p-4 rounded text-center transform transition duration-300 hover:scale-105">
          <FaCalendarAlt className="text-4xl text-yellow-600 dark:text-yellow-300 mx-auto mb-2 animate-bounce" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Today's Appointments
          </h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">{stats.totalAppointments}</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-slate-800 transition-all duration-300">
        <h3 className="text-xl w-fit border-b-2 border-sky-900 font-semibold text-white dark:bg-sky-700 dark:text-gray-200 mb-3 bg-sky-500 rounded-md px-1">
          Recent Activities
        </h3>
        {loadingActivities ? (
          <p className="text-gray-700 dark:text-gray-300">Loading activities...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="divide-y divide-gray-300 dark:divide-gray-600">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="py-2 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300">
                <span className="text-gray-700 dark:text-gray-300">{activity.description}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.formattedTime}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
