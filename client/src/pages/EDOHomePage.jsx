// src/pages/EDOHomePage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaVial, FaStethoscope, FaFileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MdNotifications } from 'react-icons/md';

export default function EDOHomePage() {
  const { currentUser } = useSelector((state) => state.user);
  const username = currentUser.username;

  // recent‑activities state
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [updatesError, setUpdatesError] = useState(null);

  // entry‑counts state
  const [counts, setCounts] = useState({
    testsCount: 0,
    treatmentsCount: 0,
    reportsCount: 0,
  });
  const [countsLoading, setCountsLoading] = useState(false);
  const [countsError, setCountsError] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { delayChildren: 0.3, staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: 'spring', stiffness: 100 } 
    }
  };

  const cardVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
      transition: { type: "spring", stiffness: 300 }
    }
  };

  // Fetch recent activities
  useEffect(() => {
    async function fetchRecentUpdates() {
      setUpdatesLoading(true);
      try {
        const response = await fetch('/api/user/recent-activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, limit: 10 }),
        });
        const data = await response.json();
        if (response.ok) {
          const updatesWithTime = data.activities.map((update) => {
            const dateObj = new Date(update.created_at);
            const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return { ...update, formattedTime };
          });
          setRecentUpdates(updatesWithTime);
          setUpdatesError(null);
        } else {
          setUpdatesError(data.error || 'Failed to fetch recent updates.');
        }
      } catch (err) {
        setUpdatesError('Network error while fetching recent updates.');
      } finally {
        setUpdatesLoading(false);
      }
    }
    fetchRecentUpdates();
  }, [username]);

  // Fetch entry counts
  useEffect(() => {
    async function fetchCounts() {
      setCountsLoading(true);
      try {
        const res = await fetch('/api/deo/entry-count');
        const data = await res.json();
        if (res.ok) {
          setCounts({
            testsCount: data.testsCount,
            treatmentsCount: data.treatmentsCount,
            reportsCount: data.reportsCount,
          });
          setCountsError(null);
        } else {
          setCountsError(data.error || 'Failed to fetch entry counts.');
        }
      } catch (err) {
        setCountsError('Network error while fetching entry counts.');
      } finally {
        setCountsLoading(false);
      }
    }
    fetchCounts();
  }, []);

  return (
    <motion.div 
      className="bg-gradient-to-br hover:shadow-slate-700 from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg shadow-lg"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div className="mb-6" variants={itemVariants}>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          DEO Home
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome, {username}! Here’s an overview of your dashboard.
        </p>
      </motion.div>

      {/* Metrics Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        variants={itemVariants}
      >
        {/* Tests Updated */}
        <motion.div 
          className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white relative overflow-hidden"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-400 rounded-full opacity-20" />
          <div className="absolute -right-2 -bottom-8 w-32 h-32 bg-purple-400 rounded-full opacity-20" />
          <div className="relative z-10 text-center">
            <FaVial className="text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-1">Tests Updated</h3>
            <p className="text-3xl font-bold">
              {countsLoading ? '…' : counts.testsCount}
            </p>
            {countsError && (
              <p className="text-xs text-red-200 mt-1">Error</p>
            )}
          </div>
        </motion.div>

        {/* Treatments Logged */}
        <motion.div 
          className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white relative overflow-hidden"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-400 rounded-full opacity-20" />
          <div className="absolute -right-2 -bottom-8 w-32 h-32 bg-green-400 rounded-full opacity-20" />
          <div className="relative z-10 text-center">
            <FaStethoscope className="text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-1">Treatments Logged</h3>
            <p className="text-3xl font-bold">
              {countsLoading ? '…' : counts.treatmentsCount}
            </p>
            {countsError && (
              <p className="text-xs text-red-200 mt-1">Error</p>
            )}
          </div>
        </motion.div>

        {/* Reports Uploaded */}
        <motion.div 
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white relative overflow-hidden"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-400 rounded-full opacity-20" />
          <div className="absolute -right-2 -bottom-8 w-32 h-32 bg-blue-400 rounded-full opacity-20" />
          <div className="relative z-10 text-center">
            <FaFileAlt className="text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-1">Reports Uploaded</h3>
            <p className="text-3xl font-bold">
              {countsLoading ? '…' : counts.reportsCount}
            </p>
            {countsError && (
              <p className="text-xs text-red-200 mt-1">Error</p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Updates */}
      <motion.div 
        className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md"
        variants={itemVariants}
      >  
        <div className="flex items-center mb-4 hover:shadow-slate-600">
          <MdNotifications className="text-2xl text-indigo-600 dark:text-indigo-400 mr-2" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Recent Activities
          </h3>
        </div>

        {updatesLoading ? (
          <div className="flex justify-center py-8 hover:shadow-slate-600">
            <motion.div 
              className="w-16 h-16 border-4  border-blue-200 border-t-blue-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : updatesError ? (
          <p className="text-red-500">{updatesError}</p>
        ) : recentUpdates.length > 0 ? (
          <ul className="divide-y divide-gray-300 dark:divide-gray-600">
            {recentUpdates.map((update, index) => (
              <motion.li 
                key={update.id}
                className="py-2 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg px-2 transition-colors duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{update.type}:</span> {update.description}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {update.formattedTime}
                </span>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No recent updates found.</p>
        )}
      </motion.div>
    </motion.div>
  );
}
