/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import SideBar_Doctor from "../components/SideBar_Doctor";
import Profile_Doctor from "../components/Profile_Doctor";
// Recharts imports for area chart
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Backdrop from "@mui/material/Backdrop";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CustomSpinner from "../components/CustomSpinner";

// Dummy chart data remains unchanged
const lineData = [
  { month: "Jan", patients: 50, consultations: 40 },
  { month: "Feb", patients: 40, consultations: 50 },
  { month: "Mar", patients: 65, consultations: 35 },
  { month: "Apr", patients: 80, consultations: 60 },
  { month: "May", patients: 60, consultations: 75 },
  { month: "Jun", patients: 90, consultations: 60 },
  { month: "Jul", patients: 80, consultations: 90 },
  { month: "Aug", patients: 70, consultations: 60 },
  { month: "Sep", patients: 90, consultations: 80 },
  { month: "Oct", patients: 100, consultations: 70 },
];

const patientData = [
  { month: "Jan", lastYear: 50, presentYear: 60 },
  { month: "Feb", lastYear: 60, presentYear: 45 },
  { month: "Mar", lastYear: 50, presentYear: 80 },
  { month: "Apr", lastYear: 80, presentYear: 100 },
  { month: "May", lastYear: 60, presentYear: 70 },
  { month: "Jun", lastYear: 90, presentYear: 100 },
  { month: "Jul", lastYear: 80, presentYear: 95 },
  { month: "Aug", lastYear: 100, presentYear: 85 },
  { month: "Sep", lastYear: 90, presentYear: 105 },
  { month: "Oct", lastYear: 100, presentYear: 120 },
  { month: "Nov", lastYear: 80, presentYear: 90 },
  { month: "Dec", lastYear: 110, presentYear: 130 },
];

// Calculate total patients and percent increase for chart info
const totalLastYear = patientData.reduce((sum, cur) => sum + cur.lastYear, 0);
const totalPresentYear = patientData.reduce((sum, cur) => sum + cur.presentYear, 0);
const percentIncrease = Math.round(
  ((totalPresentYear - totalLastYear) / totalLastYear) * 100
);

const MySwal = withReactContent(Swal);

const DoctorHome = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // State variables
  const [isVisible, setIsVisible] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(true);
  // Live status state; backend returns a Boolean (true => Live, false => Offline)
  const [sessionStatus, setSessionStatus] = useState(false);
  // Appointment requests state – fetched from backend
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  // Initialize selectedDate with the system current date formatted as YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  // Toggle showing limited or all appointments
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  // Monthly performance metrics
  const [monthlyAccepted, setMonthlyAccepted] = useState(0);
  const [monthlyNew, setMonthlyNew] = useState(0);
  // Recent Patients state; expects updated response from /api/doctor/recent-patients
  const [recentPatients, setRecentPatients] = useState([]);
  // Other state variables
  const maxAppointments = 150;
  const [bookedAppointments, setBookedAppointments] = useState(60);
  const [currentTab, setCurrentTab] = useState("Dashboard");
  // New state to track per-appointment update loading
  const [updatingStatus, setUpdatingStatus] = useState({});
  
  // Get current month and year
  const currentDateObj = new Date();
  const currentMonth = currentDateObj.getMonth() + 1; // January is 0; we need 1-based
  const currentYear = currentDateObj.getFullYear();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    setIsVisible(true);
    setGlobalLoading(true);
    
    if (currentUser && currentUser.id) {
      // Fetch live status
      fetch("/api/doctor/get-live-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: currentUser.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          setSessionStatus(data.live_status);
        })
        .catch((err) => {
          console.error("Error fetching live status:", err);
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch live status. Please try again.",
            customClass: {
              popup: 'animate__animated animate__fadeInDown'
            }
          });
        });

      // Fetch all appointments
      fetch("/api/doctor/get-all-appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: currentUser.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAppointmentRequests(data.appointments || []);
          setGlobalLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching appointments:", err);
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch appointments. Please try again.",
            customClass: {
              popup: 'animate__animated animate__fadeInDown'
            }
          });
          setGlobalLoading(false);
        });

      // Fetch recent patients
      fetch("/api/doctor/recent-patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: currentUser.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.appointments) {
            setRecentPatients(data.appointments);
          } else if (data.patients) {
            setRecentPatients(data.patients);
          }
        })
        .catch((err) => {
          console.error("Error fetching recent patients:", err);
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch recent patients. Please try again.",
            customClass: {
              popup: 'animate__animated animate__fadeInDown'
            }
          });
        });

      // Fetch monthly accepted appointments
      fetch("/api/doctor/count-monthly-appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: currentUser.id,
          month: currentMonth,
          year: currentYear,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setMonthlyAccepted(data.acceptedAppointments);
        })
        .catch((err) => {
          console.error("Error fetching monthly appointments:", err);
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch monthly accepted appointments. Please try again.",
            customClass: {
              popup: 'animate__animated animate__fadeInDown'
            }
          });
        });

      // Fetch monthly new appointments
      fetch("/api/doctor/count-monthly-appointments/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: currentUser.id,
          month: currentMonth,
          year: currentYear,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setMonthlyNew(data.acceptedAppointmentsWithNewPatients);
        })
        .catch((err) => {
          console.error("Error fetching monthly new appointments:", err);
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch monthly new appointments. Please try again.",
            customClass: {
              popup: 'animate__animated animate__fadeInDown'
            }
          });
        });
    }
  }, [currentUser, currentMonth, currentYear]);

  // Toggle live status by calling backend endpoint
  const handleStatusToggle = async () => {
    if (!currentUser || !currentUser.id) return;
    try {
      const response = await fetch("/api/doctor/change-live-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: currentUser.id }),
      });
      if (response.ok) {
        const result = await response.json();
        setSessionStatus(result.live_status);
        // Show success notification
        MySwal.fire({
          icon: "success",
          title: result.live_status ? "You are now LIVE" : "You are now OFFLINE",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'animate__animated animate__fadeInDown'
          }
        });
      } else {
        console.error("Failed to update live status");
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update status. Please try again.",
          customClass: {
            popup: 'animate__animated animate__fadeInDown'
          }
        });
      }
    } catch (error) {
      console.error("Error updating live status", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Network error while updating status. Please try again.",
        customClass: {
          popup: 'animate__animated animate__fadeInDown'
        }
      });
    }
  };

  // Utility: Format date to locale-specific string.
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString();
  };

  // Update appointment status using appointment ID (with loader)
  const updateAppointment = async (appointmentId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [appointmentId]: true }));
    try {
      const res = await fetch("/api/doctor/change-appointment-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, status: newStatus }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error updating status");
      }
      const result = await res.json();
      setAppointmentRequests(prev =>
        prev.map(app =>
          app.id === appointmentId ? { ...app, status: newStatus } : app
        )
      );
      // Show success notification
      MySwal.fire({
        icon: "success",
        title: `Appointment ${newStatus}!`,
        text: `The appointment has been ${newStatus} successfully.`,
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'animate__animated animate__fadeInDown'
        }
      });
    } catch (error) {
      console.error("Error updating appointment status:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update appointment status.",
        customClass: {
          popup: 'animate__animated animate__fadeInDown'
        }
      });
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [appointmentId]: false }));
    }
  };

  const handleAccept = (appointmentId) => {
    updateAppointment(appointmentId, "accepted");
  };

  const handleDecline = (appointmentId) => {
    updateAppointment(appointmentId, "declined");
  };

  const handleRefresh = () => {
    // Add transition effect before reload
    document.body.classList.add('page-transition');
    setTimeout(() => {
      document.body.classList.remove('page-transition');
      window.location.reload();
    }, 500);
  };

  // Filter appointments by selected date (comparing ISO date strings)
  const filteredAppointments = appointmentRequests.filter((apt) => {
    const aptDate = new Date(apt.appointment_date).toISOString().split("T")[0];
    return aptDate === selectedDate;
  });

  // Sort appointment requests by priority: pending > accepted > declined
  const sortedAppointments = appointmentRequests.slice().sort((a, b) => {
    const priority = { pending: 1, accepted: 2, declined: 3 };
    return (priority[a.status] || 4) - (priority[b.status] || 4);
  });

  // Decide how many appointments to show based on toggle state
  const appointmentsToDisplay = showAllAppointments
    ? sortedAppointments
    : sortedAppointments.slice(0, 5);

  // Calculate monthly consultations based on appointmentRequests within current month/year.
  const monthlyConsultations = appointmentRequests.filter((apt) => {
    const aptDate = new Date(apt.appointment_date);
    return (
      aptDate.getMonth() + 1 === currentMonth &&
      aptDate.getFullYear() === currentYear
    );
  }).length;

  // Calculate doctor efficiency as the percentage of accepted appointments among monthly consultations.
  const doctorEfficiency =
    monthlyConsultations > 0
      ? Math.round((monthlyAccepted / monthlyConsultations) * 100)
      : 0;

  // Fixed average consultation time.
  const avgConsultationTime = "15 mins";
  
  // Container animations
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
      scale: 1.02,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
      transition: { type: "spring", stiffness: 300 }
    }
  };

  if (globalLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <div className="flex flex-col items-center">
          <CustomSpinner />
          <p className="mt-4 text-white font-medium animate-pulse">
            Loading dashboard data...
          </p>
        </div>
      </Backdrop>
    );
  }

  return (
    <motion.div 
      className="flex min-h-screen bg-gradient-to-br from-gray-50 to-sky-50 dark:from-gray-900 dark:to-gray-800"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Sidebar can be enabled if needed */}
      {/* <SideBar_Doctor currentTab={currentTab} setCurrentTab={setCurrentTab} /> */}

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Top Header */}
        <motion.div 
          className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg mb-6 shadow-xl flex justify-between items-center hover:shadow-slate-500"
          variants={itemVariants}
        >
          <div>
            <h2 className="text-xl text-gray-800 dark:text-gray-200">
              Hello Dr. {currentUser?.name || "Doctor"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Have a nice working day!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </motion.button>
            <motion.button
              onClick={handleStatusToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 text-white rounded-lg shadow-2xl ${
                sessionStatus
                  ? "bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700"
                  : "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700"
              }`}
            >
              {sessionStatus ? "Go Offline" : "Go Live"}
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          {/* Patient Trend (Area Chart) */}
          <motion.div 
            className="col-span-9 bg-white dark:bg-gray-800 rounded-lg p-8 shadow-2xl dark:shadow-slate-700 hover:shadow-slate-600"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">
                Patient Trend
              </h3>
              <div className="py-[2px] bg-green-100 dark:bg-green-700 border-blue-300 dark:border-blue-700 shadow-2xl dark:shadow-slate-700 rounded-lg px-2 flex items-center space-x-1 ml-2 text-green-500 dark:text-green-400">
                <TrendingUp size={20} />
                <span className="font-bold">{percentIncrease}%</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={patientData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="presentFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="lastFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#f87171" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" className="text-gray-800 dark:text-gray-200" />
                  <YAxis className="text-gray-800 dark:text-gray-200" />
                  <Tooltip
                    cursor={{ stroke: "#888", strokeWidth: 1 }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderColor: "#ccc",
                    }}
                    itemStyle={{ color: "#000" }}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="presentYear"
                    name="Present Year"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fill="url(#presentFill)"
                    activeDot={{ r: 8 }}
                    strokeLinecap="round"
                  />
                  <Area
                    type="monotone"
                    dataKey="lastYear"
                    name="Last Year"
                    stroke="#f87171"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    fill="url(#lastFill)"
                    activeDot={{ r: 8 }}
                    strokeLinecap="round"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Profile Card */}
          <motion.div 
            className="col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-2xl dark:shadow-slate-700 hover:shadow-slate-600"
            variants={itemVariants}
            whileHover="hover"
          >
            <Profile_Doctor 
              bookedAppointments={bookedAppointments}
              maxAppointments={maxAppointments}
            />
          </motion.div>

          {/* Appointment Requests Section */}
          <motion.div 
            className="col-span-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl dark:shadow-slate-700 hover:shadow-slate-600"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold rounded-lg px-1 py-[2px] bg-sky-400 text-white dark:bg-sky-800">
                Appointment Requests
              </h3>
              <span
                onClick={() => setShowAllAppointments((prev) => !prev)}
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 cursor-pointer rounded-2xl px-2 py-1 transition-all duration-300 hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                {showAllAppointments ? "Show Less" : "See All"}
              </span>
            </div>
            <div className="space-y-2">
              {appointmentsToDisplay.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No appointment requests available.
                </div>
              ) : (
                appointmentsToDisplay.map((req, idx) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex justify-between items-center border-b py-2 border-gray-200 dark:border-gray-700"
                  >
                    <div>
                      <div className="font-bold text-gray-800 dark:text-gray-200 flex items-center">
                        {req.patient_name || "Patient Name"}
                        {req.emergency && (
                          <span className="ml-2 text-red-500 flex items-center">
                            <AlertCircle size={16} className="mr-1" />
                            Emergency
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {new Date(req.appointment_date).toLocaleString()}
                      </div>
                      {req.reason && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Reason: {req.reason}
                        </div>
                      )}
                    </div>
                    {req.status === "pending" ? (
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => handleAccept(req.id)}
                          className="bg-sky-300 dark:bg-sky-600 text-black dark:text-white px-3 py-1 rounded"
                          disabled={updatingStatus[req.id]}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {updatingStatus[req.id] ? 
                            <span className="animate-spin">
                              <svg className="h-5 w-5 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                              </svg>
                            </span> : 
                            "Accept"
                          }
                        </motion.button>
                        <motion.button
                          onClick={() => handleDecline(req.id)}
                          className="bg-red-400 dark:bg-red-600 text-black dark:text-white px-3 py-1 rounded"
                          disabled={updatingStatus[req.id]}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {updatingStatus[req.id] ? 
                            <span className="animate-spin">
                              <svg className="h-5 w-5 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                              </svg>
                            </span> : 
                            "Decline"
                          }
                        </motion.button>
                      </div>
                    ) : (
                      <div
                        className={`px-2 py-1 rounded ${
                          req.status === "accepted"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Appointments with Date Filter */}
          <motion.div 
            className="col-span-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl dark:shadow-slate-700 hover:shadow-slate-600"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold bg-sky-400 rounded-lg px-1 py-[2px] text-white dark:bg-sky-800">
                Appointments
              </h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 p-1 rounded text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800"
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No appointments for this date.
                </div>
              ) : (
                filteredAppointments.map((apt, idx) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex justify-between items-center border-b py-2 border-gray-200 dark:border-gray-700"
                  >
                    <div className="font-bold text-gray-800 dark:text-gray-200 flex items-center">
                      {apt.patient_name || "Patient Name"}
                      {apt.emergency && (
                        <span className="ml-2 text-red-500 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          Emergency
                        </span>
                      )}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {new Date(apt.appointment_date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Recent Patients Section */}
          <motion.div 
            className="col-span-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg dark:shadow-slate-700 hover:shadow-slate-600"
            variants={itemVariants}
            whileHover="hover"
          >
            <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-200">
              Recent Patients
            </h3>
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  {["Patient Name", "Appointment Date", "Reason", "Status"].map(
                    (header, index) => (
                      <th key={index} className="p-2 text-left text-gray-800 dark:text-gray-200">
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {recentPatients.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-2 text-center text-gray-500 dark:text-gray-400">
                      No recent patients available.
                    </td>
                  </tr>
                ) : (
                  recentPatients.map((patient, idx) => (
                    <tr
                      key={patient.id || idx}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="p-2 flex items-center text-gray-800 dark:text-gray-200">
                        {patient.patientInfo?.name || patient.name || "N/A"}
                        {patient.emergency && (
                          <span className="ml-2 text-red-500 flex items-center">
                            <AlertCircle size={16} className="mr-1" />
                            Emergency
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-gray-800 dark:text-gray-200">
                        {patient.appointment_date
                          ? new Date(patient.appointment_date).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="p-2 text-gray-800 dark:text-gray-200">
                        {patient.reason || "N/A"}
                      </td>
                      <td className="p-2 text-gray-800 dark:text-gray-200">
                        {patient.status
                          ? patient.status.charAt(0).toUpperCase() + patient.status.slice(1)
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>

          {/* Daily Performance and Metrics */}
          <motion.div 
            className="col-span-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg dark:shadow-slate-700 hover:shadow-slate-600"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">
                Monthly Performance
              </h3>
              <span className="text-gray-500 dark:text-gray-400">
                {monthNames[currentMonth - 1]} {currentYear}
              </span>
            </div>
            <div className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              {monthlyConsultations} Consultations
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded text-center">
                <div className="text-xl text-gray-800 dark:text-gray-200">
                  {monthlyNew}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  New Patients
                </div>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded text-center">
                <div className="text-xl text-gray-800 dark:text-gray-200">
                  {monthlyAccepted}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Treated & Discharged
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
              <p>
                Avg Consultation Time:{" "}
                <span className="font-bold">{avgConsultationTime}</span>
              </p>
              <p>
                Doctor Efficiency:{" "}
                <span className="font-bold">{doctorEfficiency}%</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorHome;
