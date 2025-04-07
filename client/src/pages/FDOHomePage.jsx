/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function FDOHomePage() {
  // Dummy data for recent activities
  // const recentActivities = [
  //   { id: 1, message: 'John Doe registered.', time: '10:15 AM' },
  //   { id: 2, message: 'Jane Smith scheduled an appointment.', time: '10:30 AM' },
  //   { id: 3, message: 'Bob Johnson admitted.', time: '11:00 AM' },
  //   { id: 4, message: 'Alice Williams discharged.', time: '11:30 AM' },
  //   { id: 5, message: 'Mark Brown updated details.', time: '12:00 PM' },
  // ];
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { currentUser } = useSelector((state) => state.user);
  const username=currentUser.username;
  useEffect(() => {
    async function fetchRecentActivities() {
      setLoading(true);
      try {
        const response = await fetch('/api/user/recent-activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, limit: 10 })
        });
        const data = await response.json();
        if (response.ok) {
          // Map activities to include a formatted time based on created_at.
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
        setLoading(false);
      }
    }
    fetchRecentActivities();
  }, [username]);


  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md shadow-slate-500">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        FDO Home
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Welcome to the Front Desk Operator Dashboard. Here you can view quick stats and manage daily tasks.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Total Patients */}
        <div className="shadow-xl dark:shadow-slate-700 shadow-slate-600 bg-blue-100 dark:bg-blue-900 p-4 rounded text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Total Patients
          </h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">120</p>
        </div>
        {/* Active Admissions */}
        <div className="shadow-xl dark:shadow-slate-700 shadow-slate-600 bg-green-100 dark:bg-green-900 p-4 rounded text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Active Admissions
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-300">18</p>
        </div>
        {/* Today's Appointments */}
        <div className="shadow-xl dark:shadow-slate-700 shadow-slate-600 bg-yellow-100 dark:bg-yellow-900 p-4 rounded text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Today's Appointments
          </h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">35</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-slate-800">
        <h3 className="text-xl w-fit border-b-2 border-sky-900 font-semibold text-white dark:bg-sky-700 dark:text-gray-200 mb-3 bg-sky-500 rounded-md px-1">
          Recent Activities
        </h3>
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading activities...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="divide-y divide-gray-300 dark:divide-gray-600">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="py-2 flex justify-between items-center">
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
