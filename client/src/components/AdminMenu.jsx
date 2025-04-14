/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Card, Badge, Dropdown, Table } from "flowbite-react";
import { Bed, Users, UserPlus, UserCheck, TrendingUp, RefreshCw, BarChart3, PieChart } from "lucide-react";
import ReportCard from "../components/ReportCard";
import PatientsOverview from "../components/PatientsOverview";
import CustomSpinner from "../components/CustomSpinner";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MySwal = withReactContent(Swal);

const AdminMenu = () => {
  const [dashSummary, setDashSummary] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [recentPatients, setRecentPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    setGlobalLoading(true);
    fetch("/api/admin/dash-summary", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error while fetching dashboard summary");
        }
        return response.json();
      })
      .then((data) => {
        setDashSummary(data);
        setGlobalLoading(false);
      })
      .catch((error) => {
        // console.error("Error fetching patients:", error);
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch dashboard data. Please try again.",
          customClass: {
            popup: 'animate__animated animate__fadeInDown'
          }
        });
        setGlobalLoading(false);
      });
  }, []);

  useEffect(() => {
    setPatientsLoading(true);
    fetch("/api/fdo/recent-patients", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching recent patients");
        }
        return response.json();
      })
      .then((data) => {
        setRecentPatients(data.patients);
        setPatientsLoading(false);
      })
      .catch((error) => {
        // console.error("Error fetching recent patients:", error);
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch recent patients. Please try again.",
          customClass: {
            popup: 'animate__animated animate__fadeInDown'
          }
        });
        setPatientsLoading(false);
      });
  }, []);

  const handleExportCSV = () => {
    if (recentPatients && recentPatients.length > 0) {
      const header = ["Name", "Visit No", "Mobile", "Admission Date", "Status"];
      const rows = recentPatients.map((patient) => [
        patient.name,
        patient.visit_no,
        patient.mobile,
        new Date(patient.created_at).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        patient.status,
      ]);
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [header.join(","), ...rows.map((e) => e.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "recent_patients.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Success notification
      MySwal.fire({
        icon: "success",
        title: "Exported!",
        text: "Patient data has been exported successfully",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'animate__animated animate__fadeInDown'
        }
      });
    }
  };

  const handleViewAll = () => {
    navigate("/admin/all-patient");
    
    // Add transition effect before navigation
    document.body.classList.add('page-transition');
    setTimeout(() => {
      document.body.classList.remove('page-transition');
    }, 500);
  };

  const handleImportData = () => {
    MySwal.fire({
      title: 'Import Patient Data',
      html: `
        <div class="mb-3">
          <label class="block mb-2 text-left">Select CSV file:</label>
          <input type="file" class="w-full px-3 py-2 border rounded">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Import',
      showLoaderOnConfirm: true,
      customClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      preConfirm: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1500);
        });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          icon: 'success',
          title: 'Imported!',
          text: 'Patient data has been imported successfully',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  if (globalLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <div className="flex flex-col items-center">
          <CustomSpinner />
          <p className="mt-4 text-white font-medium animate-pulse">Loading dashboard data...</p>
        </div>
      </Backdrop>
    );
  }

  if (!dashSummary) {
    return null;
  }

  const { dateRange, beds, doctors, patients, dailyFlow } = dashSummary;
  const breakdown = beds.breakdown;
  const breakdownText = `Executive: ${breakdown.Executive.total}, Premium: ${breakdown.Premium.total}, General: ${breakdown.General.total}, Basic: ${breakdown.Basic.total}.`;

  const startYear = new Date(dateRange.startDate).getFullYear();
  const endYear = new Date(dateRange.endDate).getFullYear();

  const trendIncrease =
    patients.oldPatients > 0
      ? Math.round(((patients.newPatients - patients.oldPatients) / patients.oldPatients) * 100)
      : (patients.newPatients > 0 ? 100 : 0);

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

  return (
    <motion.div
      className="flex-1 p-4 md:p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-sky-50 dark:from-gray-900 dark:to-gray-800"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Admin Dashboard Header */}
      <motion.div 
        className="mb-6 flex items-center justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back! Here's your hospital overview for today.
          </p>
        </div>
        <motion.button
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </motion.button>
      </motion.div>
      
      {/* TOP CARDS */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
        variants={itemVariants}
      >
        {/* Card 1: Total Beds */}
        <motion.div
          className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-xl p-6 border-l-4 border-blue-500"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                <Bed size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                Total Beds
              </h3>
            </div>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full">Current</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white dark:bg-gray-700/50 p-3 rounded-lg text-center">
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {beds.availableBeds}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
            </div>
            <div className="bg-white dark:bg-gray-700/50 p-3 rounded-lg text-center">
              <span className="text-2xl font-bold text-green-600">
                {beds.occupiedBeds}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">Occupied</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {breakdownText}
            </p>
          </div>
        </motion.div>

        {/* Card 2: Doctors */}
        <motion.div
          className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-xl p-6 border-l-4 border-purple-500"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-lg">
                <Users size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                Doctors
              </h3>
            </div>
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full">Current</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white dark:bg-gray-700/50 p-3 rounded-lg text-center">
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {doctors.available}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
            </div>
            <div className="bg-white dark:bg-gray-700/50 p-3 rounded-lg text-center">
              <span className="text-2xl font-bold text-red-600">
                {doctors.onLeave}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">On Leave</p>
            </div>
          </div>
          
          <div className="relative mt-4">
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${(doctors.available / (doctors.available + doctors.onLeave)) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {Math.round((doctors.available / (doctors.available + doctors.onLeave)) * 100)}% of doctors available
            </p>
          </div>
        </motion.div>

        {/* Card 3: Patients */}
        <motion.div
          className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-xl p-6 border-l-4 border-green-500"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-lg">
                <UserPlus size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                Patients
              </h3>
            </div>
            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full">
              {startYear}-{endYear}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {patients.newPatients}
                </span>
                <Badge color="success" className="flex items-center gap-1">
                  <TrendingUp size={12} />
                  +{trendIncrease}%
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">New Patients</p>
            </div>
            <div className="bg-white dark:bg-gray-700/50 p-3 rounded-lg">
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {patients.oldPatients}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">Old Patients</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Gender Distribution</h4>
              <PieChart size={16} className="text-green-600 dark:text-green-400" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-full">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Male ({patients.gender.malePercentage}%)</span>
                  <span>Female ({patients.gender.femalePercentage}%)</span>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${patients.gender.malePercentage}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Daily Patient Flow */}
        <motion.div
          className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-xl p-6 border-l-4 border-amber-500"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-lg">
                <BarChart3 size={24} className="text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                Daily Flow
              </h3>
            </div>
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs px-2 py-1 rounded-full">Today</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white dark:bg-gray-700/50 p-3 rounded-lg text-center">
              <span className="text-2xl font-bold text-green-600">
                {dailyFlow.admissions}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">Admissions</p>
            </div>
            <div className="bg-white dark:bg-gray-700/50 p-3 rounded-lg text-center">
              <span className="text-2xl font-bold text-red-600">
                {dailyFlow.discharges}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">Discharges</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Flow Balance</span>
              <span className={`text-sm font-medium ${dailyFlow.admissions >= dailyFlow.discharges ? 'text-green-600' : 'text-red-600'}`}>
                {dailyFlow.admissions >= dailyFlow.discharges ? '+' : '-'}
                {Math.abs(dailyFlow.admissions - dailyFlow.discharges)}
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
              <motion.div
                className={`h-full ${dailyFlow.admissions >= dailyFlow.discharges ? 'bg-green-500' : 'bg-red-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (Math.abs(dailyFlow.admissions - dailyFlow.discharges) / Math.max(dailyFlow.admissions, dailyFlow.discharges)) * 100)}%` }}
                transition={{ duration: 1, delay: 0.9 }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* REPORT & PATIENTS OVERVIEW */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        variants={itemVariants}
      >
        <motion.div 
          className="transition-all duration-300 transform hover:scale-[1.01]"
          // whileHover={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" }}
        >
          <ReportCard />
        </motion.div>
        <motion.div 
          className="transition-all duration-300 transform hover:scale-[1.01]"
          // whileHover={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" }}
        >
          <PatientsOverview />
        </motion.div>
      </motion.div>

      {/* RECENT PATIENTS TABLE */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        variants={itemVariants}
        whileHover={{ boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.15)" }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
              <Users size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Recent Patients
            </h3>
          </div>
          <div className="relative">
            <Dropdown
              label="Actions"
              color="light"
              outline
              className="shadow-md"
            >
              <Dropdown.Item onClick={handleViewAll} className="flex items-center gap-2">
                <Users size={16} />
                View All
              </Dropdown.Item>
              <Dropdown.Item onClick={handleExportCSV} className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export CSV
              </Dropdown.Item>
              <Dropdown.Item onClick={handleImportData} className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Import Data
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
        
        {patientsLoading ? (
          <div className="p-12 flex justify-center">
            <div className="flex flex-col items-center">
              <CustomSpinner />
              <p className="mt-4 text-gray-500 dark:text-gray-400 animate-pulse">Loading patient data...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head className="bg-gray-50 dark:bg-gray-700">
                <Table.HeadCell className="py-4">Name</Table.HeadCell>
                <Table.HeadCell className="py-4">Visit No</Table.HeadCell>
                <Table.HeadCell className="py-4">Mobile</Table.HeadCell>
                <Table.HeadCell className="py-4">Admission Date</Table.HeadCell>
                <Table.HeadCell className="py-4">Status</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {recentPatients.map((patient, index) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-800 dark:text-white py-4">
                      {patient.name}
                    </Table.Cell>
                    <Table.Cell>{patient.visit_no}</Table.Cell>
                    <Table.Cell>{patient.mobile}</Table.Cell>
                    <Table.Cell>
                      {new Date(patient.created_at).toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge 
                        color={patient.status === "discharged" ? "success" : "warning"}
                        className="font-medium"
                      >
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </Badge>
                    </Table.Cell>
                  </motion.tr>
                ))}
                {recentPatients.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No patient records found
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        )}
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 text-center">
          Showing most recent {recentPatients.length} patients
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminMenu;