import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaCalendarAlt,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { MdWarning } from 'react-icons/md';

export default function AppointmentStatus() {
  // state for appointments
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // counts state
  const [counts, setCounts] = useState({
    total: 0,
    accepted: 0,
    pending: 0,
    declined: 0,
  });

  // filter state
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };
  const cardVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0px 10px 30px rgba(0,0,0,0.15)',
      transition: { type: 'spring', stiffness: 300 }
    },
  };

  // fetch appointments and compute counts
  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      try {
        const res = await fetch('/api/fdo/get-all-appointment');
        const data = await res.json();
        if (res.ok) {
          setAppointments(data.appointments);
          // compute counts in one pass
          const statusCount = { accepted: 0, pending: 0, declined: 0 };
          data.appointments.forEach(a => {
            if (a.status in statusCount) statusCount[a.status]++;
          });
          setCounts({
            total: data.count || data.appointments.length,
            ...statusCount,
          });
          setError(null);
        } else {
          setError(data.error || 'Failed to fetch appointments.');
        }
      } catch {
        setError('Network error while fetching appointments.');
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  // helper to format date/time
  const formatDate = iso => new Date(iso).toLocaleDateString();
  const formatTime = iso =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // derive filtered list
  const filteredAppointments = appointments
    // by status
    .filter(a => selectedStatus === 'all' ? true : a.status === selectedStatus)
    // by name or ID
    .filter(a =>
      !searchTerm ||
      a.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.id && a.id.toString().includes(searchTerm))
    )
    // by from date
    .filter(a =>
      !dateFrom || new Date(a.appointment_date) >= new Date(dateFrom)
    )
    // by to date
    .filter(a =>
      !dateTo || new Date(a.appointment_date) <= new Date(dateTo)
    );

  return (
    <motion.div
      className="p-8 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
          <FaCalendarAlt className="mr-3 text-indigo-600 dark:text-indigo-400" />
          FDO Appointments
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage and track appointment status with advanced filtering
        </p>
      </motion.div>

      {/* Metrics Cards */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-10" variants={itemVariants}>
        {/* Total */}
        <motion.div
          className="relative bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl text-white overflow-hidden shadow-lg"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-400 rounded-full opacity-20" />
          <div className="absolute -right-2 -bottom-8 w-32 h-32 bg-indigo-400 rounded-full opacity-20" />
          <div className="relative z-10 text-center">
            <FaCalendarAlt className="text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-1">Total</h3>
            <p className="text-3xl font-bold">
              {loading ? '…' : counts.total}
            </p>
          </div>
        </motion.div>

        {/* Accepted */}
        <motion.div
          className="relative bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white overflow-hidden shadow-lg"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-400 rounded-full opacity-20" />
          <div className="absolute -right-2 -bottom-8 w-32 h-32 bg-green-400 rounded-full opacity-20" />
          <div className="relative z-10 text-center">
            <FaCheckCircle className="text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-1">Accepted</h3>
            <p className="text-3xl font-bold">
              {loading ? '…' : counts.accepted}
            </p>
          </div>
        </motion.div>

        {/* Pending */}
        <motion.div
          className="relative bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-white overflow-hidden shadow-lg"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20" />
          <div className="absolute -right-2 -bottom-8 w-32 h-32 bg-yellow-400 rounded-full opacity-20" />
          <div className="relative z-10 text-center">
            <FaHourglassHalf className="text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-1">Pending</h3>
            <p className="text-3xl font-bold">
              {loading ? '…' : counts.pending}
            </p>
          </div>
        </motion.div>

        {/* Declined */}
        <motion.div
          className="relative bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white overflow-hidden shadow-lg"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-400 rounded-full opacity-20" />
          <div className="absolute -right-2 -bottom-8 w-32 h-32 bg-red-400 rounded-full opacity-20" />
          <div className="relative z-10 text-center">
            <FaTimesCircle className="text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-1">Declined</h3>
            <p className="text-3xl font-bold">
              {loading ? '…' : counts.declined}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Improved Filter Controls - All in one line */}
      <motion.div 
        className="bg-white dark:bg-gray-700 p-4 py-5 rounded-xl shadow-md mb-8 flex flex-wrap items-center gap-4" 
        variants={itemVariants}
      >
        <div className="flex items-center">
          <FaFilter className="text-gray-500 dark:text-gray-400 mr-2" />
          <select
            className="p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="accepted">Accepted</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        <div className="flex-1 min-w-[180px] relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            className="w-full p-2.5 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <div className="relative">
            <input
              type="date"
              className="p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              placeholder="From Date"
            />
            <span className="absolute -top-5 left-0 text-xs text-gray-500 dark:text-gray-400">From</span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <input
              type="date"
              className="p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              placeholder="To Date"
            />
            <span className="absolute -top-5 left-0 text-xs text-gray-500 dark:text-gray-400">To</span>
          </div>
        </div>
      </motion.div>

      {/* error */}
      {error && (
        <motion.div 
          className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6 flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MdWarning className="text-xl mr-2" />
          {error}
        </motion.div>
      )}

      {/* ▼ Appointment List ▼ */}
      <motion.div 
        className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md"
        variants={itemVariants}
      >
        <div className="flex items-center mb-6">
          {/* dynamic icon */}
          {selectedStatus === 'accepted' && <FaCheckCircle className="text-2xl text-green-600 dark:text-green-400 mr-3" />}
          {selectedStatus === 'pending' && <FaHourglassHalf className="text-2xl text-yellow-600 dark:text-yellow-400 mr-3" />}
          {selectedStatus === 'declined' && <FaTimesCircle className="text-2xl text-red-600 dark:text-red-400 mr-3" />}
          {selectedStatus === 'all' && <FaCalendarAlt className="text-2xl text-indigo-600 dark:text-indigo-400 mr-3" />}
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Appointments
          </h3>
          <span className="ml-auto bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
            {filteredAppointments.length} found
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <motion.div
              className={`w-14 h-14 border-4 rounded-full ${
                selectedStatus === 'accepted'
                  ? 'border-t-green-600 border-green-200'
                  : selectedStatus === 'pending'
                    ? 'border-t-yellow-600 border-yellow-200'
                    : selectedStatus === 'declined'
                      ? 'border-t-red-600 border-red-200'
                      : 'border-t-indigo-600 border-indigo-200'
              }`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : filteredAppointments.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-600">
            {filteredAppointments.map((app, i) => (
              <motion.li
                key={app.id || i}
                className="py-4 px-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-600/50 rounded-lg transition-colors duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-4 ${
                    app.status === 'accepted' ? 'bg-green-500' : 
                    app.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {app.patient_name} {app.id && <span className="text-sm text-gray-500 dark:text-gray-400">(ID: {app.id})</span>}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                      <FaCalendarAlt className="mr-1" />
                      {formatDate(app.appointment_date)} at {formatTime(app.appointment_date)}
                    </p>
                  </div>
                </div>
                {app.emergency && (
                  <div className="flex items-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full">
                    <MdWarning className="mr-1" />
                    <span className="text-sm font-medium">Emergency</span>
                  </div>
                )}
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-gray-400 dark:text-gray-500 text-6xl mb-4"
            >
              {selectedStatus === 'accepted' ? <FaCheckCircle /> :
               selectedStatus === 'pending' ? <FaHourglassHalf /> :
               selectedStatus === 'declined' ? <FaTimesCircle /> : <FaCalendarAlt />}
            </motion.div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">No appointments found.</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your filters.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}