import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaUsers, FaProcedures, FaCalendarAlt, FaBell, FaClipboardList } from 'react-icons/fa';
import { MdDashboard, MdTrendingUp, MdNotifications } from 'react-icons/md';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function FDOHomePage() {
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeAdmissions: 0,
    totalAppointments: 0
  });
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const username = currentUser.username;

  useEffect(() => {
    setIsVisible(true);
    
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
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

  // Determine which activities to show; if showAllActivities is false, display only first 5.
  const activitiesToShow = showAllActivities ? recentActivities : recentActivities.slice(0, 5);

  return (
    <motion.div 
      className="hover:shadow-slate-500 dark:shadow-slate-700 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg shadow-lg"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.div 
        className="flex items-center mb-6"
        variants={itemVariants}
      >
        <MdDashboard className="text-3xl text-blue-600 dark:text-blue-400 mr-3" />
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            FDO Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {currentUser.username}! Here's your daily overview.
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        variants={itemVariants}
      >
        {/* Total Patients */}
        <motion.div 
          className="bg-gradient-to-br  from-blue-500 to-blue-600 p-6 rounded-xl text-white relative overflow-hidden"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-400 rounded-full opacity-20" />
          <div className="absolute -right-2 -bottom-8 w-32 h-32 bg-blue-400 rounded-full opacity-20" />
          <div className="relative z-10">
            <FaUsers className="text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-1">
              Total Patients
            </h3>
            <div className="flex items-center">
              <span className="text-3xl font-bold">{stats.totalPatients}</span>
              {/* <motion.span 
                className="ml-2 text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
              >
                <MdTrendingUp className="inline mr-1" />+5%
              </motion.span> */}
            </div>
          </div>
        </motion.div>
        
        {/* Active Admissions */}
        <motion.div 
          className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white relative overflow-hidden"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-400 rounded-full opacity-20" />
          <div className="absolute -right-2 -bottom-8 w-32 h-32 bg-green-400 rounded-full opacity-20" />
          <div className="relative z-10">
            <FaProcedures className="text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-1">
              Active Admissions
            </h3>
            <p className="text-3xl font-bold">{stats.activeAdmissions}</p>
          </div>
        </motion.div>
        
        {/* Today's Appointments */}
        <motion.div 
          className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl text-white relative overflow-hidden"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-400 rounded-full opacity-20" />
          <div className="absolute -right-2 -bottom-8 w-32 h-32 bg-amber-400 rounded-full opacity-20" />
          <div className="relative z-10">
            <FaCalendarAlt className="text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-1">
              Today's Appointments
            </h3>
            <p className="text-3xl font-bold">{stats.totalAppointments}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Access Buttons */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        variants={itemVariants}
      >
        <motion.button 
          className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-300"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/fdo/register')}
        >
          <FaUsers className="text-2xl text-blue-600 dark:text-blue-400 mb-2" />
          <span className="text-gray-800 dark:text-gray-200 font-medium">Patient Registration</span>
        </motion.button>
        <motion.button 
          className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-300"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/fdo/appointment')}
        >
          <FaCalendarAlt className="text-2xl text-green-600 dark:text-green-400 mb-2" />
          <span className="text-gray-800 dark:text-gray-200 font-medium">Schedule Appointment</span>
        </motion.button>
        <motion.button 
          className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-300"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/fdo/admission')}
        >
          <FaClipboardList className="text-2xl text-amber-600 dark:text-amber-400 mb-2" />
          <span className="text-gray-800 dark:text-gray-200 font-medium">Admission Forms</span>
        </motion.button>
        <motion.button 
          className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-300"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/fdo/messages')}
        >
          <FaBell className="text-2xl text-purple-600 dark:text-purple-400 mb-2" />
          <span className="text-gray-800 dark:text-gray-200 font-medium">Notifications</span>
        </motion.button>
      </motion.div>

      {/* Recent Activities */}
      <motion.div 
        className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-slate-800"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MdNotifications className="text-2xl text-indigo-600 dark:text-indigo-400 mr-2" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Recent Activities
            </h3>
          </div>
          {recentActivities.length > 5 && (
            <button 
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => setShowAllActivities(prev => !prev)}
            >
              {showAllActivities ? "Show Less" : "Show All"}
            </button>
          )}
        </div>
        
        {loadingActivities ? (
          <div className="flex justify-center py-8">
            <motion.div 
              className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-600">
            {activitiesToShow.map((activity, index) => (
              <motion.li 
                key={activity.id} 
                className="py-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg px-2 transition-colors duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">{activity.description}</span>
                </div>
                <span className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 py-1 px-2 rounded-full">
                  {activity.formattedTime}
                </span>
              </motion.li>
            ))}
            {recentActivities.length === 0 && !loadingActivities && !error && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent activities found</p>
            )}
          </ul>
        )}
      </motion.div>
    </motion.div>
  );
}
