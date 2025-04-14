/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "flowbite-react";
import { 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  CheckCircle 
} from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";

// Global Loader imports from MUI and custom spinner
import Backdrop from "@mui/material/Backdrop";
import CustomSpinner from "../components/CustomSpinner";

// Chart imports for Graph Analytics
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const MySwal = withReactContent(Swal);

export default function AllPatient() {
  const [patients, setPatients] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false); // New state for slide-over panel
  const [patientDetail, setPatientDetail] = useState(null);

  // Compute overall loading state
  const globalLoading = loadingPatients || detailLoading;

  // Compute statistics
  const totalPatients = patients.length;
  const dischargedPatients = patients.filter((p) => p.status === "discharged").length;
  const avgAge =
    patients.length > 0
      ? Math.round(
          patients.reduce((acc, p) => acc + Number(p.age || 0), 0) / patients.length
        )
      : 0;
  const totalVisits =
    patients.length > 0
      ? patients.reduce((acc, p) => acc + (Number(p.visit_no) || 0), 0)
      : 0;

  // Escape key handler for slideover
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && showDetailPanel) {
        setShowDetailPanel(false);
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showDetailPanel]);

  // Prevent body scrolling when slideover is open
  useEffect(() => {
    if (showDetailPanel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showDetailPanel]);

  // Prepare chart data for "Patients Age Distribution"
  const prepareChartData = (patients) => {
    const bins = { "0-10": 0, "11-20": 0, "21-30": 0, "31-40": 0, "41-50": 0, "51+": 0 };
    patients.forEach((p) => {
      const age = Number(p.age) || 0;
      if (age <= 10) bins["0-10"] += 1;
      else if (age <= 20) bins["11-20"] += 1;
      else if (age <= 30) bins["21-30"] += 1;
      else if (age <= 40) bins["31-40"] += 1;
      else if (age <= 50) bins["41-50"] += 1;
      else bins["51+"] += 1;
    });
  
    // Convert bins object to an array of objects for Recharts
    const areaChartData = Object.keys(bins).map((range) => ({
      ageRange: range,
      count: bins[range],
    }));
  
    setChartData(areaChartData);
  };

  // Fetch all patients
  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      const res = await fetch("/api/fdo/all-patients");
      const data = await res.json();
      if (data?.patients) {
        setPatients(data.patients);
        prepareChartData(data.patients);
      }
    } catch (error) {
      // console.error("Error fetching patients:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch patients. Please try again.",
      });
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Format date to locale-specific string
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString();
  };

  // Fetch and show patient details in slide-over panel
  const fetchPatientDetail = async (patientId) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/fdo/patient-history/${patientId}`);
      const data = await res.json();
      setPatientDetail(data.history);
      setShowDetailPanel(true); // Show the slide-over panel
    } catch (error) {
      // console.error("Error fetching patient history:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch patient details. Please try again.",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen relative">
      {/* Global Loading Backdrop */}
      {globalLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CustomSpinner />
        </Backdrop>
      )}

      {/* Header */}
      <div className="mb-4"> 
        <span className="bg-sky-200 rounded-lg px-1 border-b-1 dark:bg-sky-700 hover:border-sky-700  text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          All Patients 
        </span>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl hover:shadow-slate-700 hover:bg-slate-200">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-blue-500" />
            <div>
              <p className="bg-sky-200 dark:bg-sky-700 rounded-md px-1 text-lg font-semibold text-gray-800 dark:text-gray-200">
                Total Patients
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalPatients}
              </p>
            </div>
          </div>
        </Card>
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl hover:shadow-slate-700 hover:bg-slate-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="bg-sky-200 dark:bg-sky-700 rounded-md px-1 text-lg font-semibold text-gray-800 dark:text-gray-200">
                Discharged
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dischargedPatients}
              </p>
            </div>
          </div>
        </Card>
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl hover:shadow-slate-700 hover:bg-slate-200">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-purple-500" />
            <div>
              <p className="bg-sky-200 dark:bg-sky-700 rounded-md px-1 text-lg font-semibold text-gray-800 dark:text-gray-200">
                Average Age
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {avgAge}
              </p>
            </div>
          </div>
        </Card>
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl hover:shadow-slate-700 hover:bg-slate-200">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-orange-500" />
            <div>
              <p className="bg-sky-200 dark:bg-sky-700 rounded-md px-1 text-lg font-semibold text-gray-800 dark:text-gray-200">
                Total Visits
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalVisits}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Graph Analytics: Patients Age Distribution */}
      <div className="mb-8 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          <span className="inline-block bg-sky-200 dark:bg-sky-700 rounded px-1 border-b-1">
            Patients Age Distribution
          </span>
        </h2>
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="ageRange" stroke="gray" />
              <YAxis stroke="gray" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderColor: "#ccc",
                  borderRadius: "4px",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                fill="url(#colorCount)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No chart data available</p>
        )}
      </div>

      {/* Patients Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-blue-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-blue-900 dark:text-blue-100 uppercase">
                Visit No.
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blue-900 dark:text-blue-100 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blue-900 dark:text-blue-100 uppercase">
                Mobile
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blue-900 dark:text-blue-100 uppercase">
                Address
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blue-900 dark:text-blue-100 uppercase">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blue-900 dark:text-blue-100 uppercase">
                Age
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blue-900 dark:text-blue-100 uppercase">
                DOB
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blue-900 dark:text-blue-100 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-blue-900 dark:text-blue-100 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {patients.map((p) => (
              <tr key={p.id} className="hover:bg-blue-100 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {p.visit_no}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {p.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {p.mobile}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {p.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {p.gender}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {p.age}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(p.dob)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                  {p.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Button
                    gradientDuoTone="purpleToBlue"
                    size="sm"
                    onClick={() => fetchPatientDetail(p.id)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Backdrop Overlay */}
      {showDetailPanel && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
          onClick={() => setShowDetailPanel(false)}
        />
      )}

      {/* Slide-over Panel for Patient Details */}
  {/* Slide-over Panel for Patient Details */}
<div
  className={`fixed top-0 right-0 h-full w-1/2 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-all duration-500 ease-in-out ${
    showDetailPanel ? "translate-x-0" : "translate-x-full"
  } overflow-hidden`}
>
  {/* Header of Slide-over with gradient */}
  <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 p-4 flex justify-between items-center shadow-md">
    <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
      <User className="w-6 h-6 animate-pulse" />
      <span>Patient Details</span>
    </h2>
    <button
      onClick={() => setShowDetailPanel(false)}
      className="rounded-full p-2 bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-300 hover:rotate-90 transform"
      aria-label="Close panel"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>

  {/* Patient Detail Content */}
  <div className="p-4 overflow-y-auto h-[calc(100%-4rem)] bg-gray-50 dark:bg-gray-900">
    {patientDetail ? (
      <div className="space-y-6">
        {/* Patient Basic Info Card with upgraded design */}
        <div className="rounded-lg p-5 shadow-lg bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-800 dark:to-blue-900 border-l-4 border-blue-500 dark:border-blue-400 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-blue-500 dark:bg-blue-600 rounded-full mr-3">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {patientDetail.patient.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-gray-700 dark:text-gray-300">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="font-medium">Mobile:</span>&nbsp;
              <span>{patientDetail.patient.mobile}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="font-medium">Address:</span>&nbsp;
              <span>{patientDetail.patient.address}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">Gender:</span>&nbsp;
              <span>{patientDetail.patient.gender}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Age:</span>&nbsp;
              <span>{patientDetail.patient.age} years</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="font-medium">DOB:</span>&nbsp;
              <span>{formatDate(patientDetail.patient.dob)}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="font-medium">Status:</span>&nbsp;
              <span className={`${
                patientDetail.patient.status === "discharged" 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-yellow-600 dark:text-yellow-400"
              } font-semibold`}>
                {patientDetail.patient.status}
              </span>
            </div>
          </div>
        </div>

        {/* Appointments with enhanced styling */}
        {patientDetail.appointments && patientDetail.appointments.length > 0 && (
          <div className="transform transition-all duration-300 hover:translate-y-1">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <div className="p-2 bg-gradient-to-r from-green-400 to-green-600 dark:from-green-600 dark:to-green-800 rounded-lg text-white mr-2">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 px-3 py-1 rounded-lg">
                Appointments
              </span>
            </h3>
            <div className="space-y-3">
              {patientDetail.appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-4 border-l-4 border-green-500 dark:border-green-400 rounded-lg bg-gradient-to-r from-green-50 to-white dark:from-green-900 dark:to-gray-800 shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                      <span className="font-semibold">Date:</span>&nbsp;
                      <span>{formatDate(appt.appointment_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">Slot:</span>&nbsp;
                      <span>{appt.slot}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="font-semibold">Reason:</span>&nbsp;
                      <span>{appt.reason}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">Status:</span>&nbsp;
                    <span className={`${
                      appt.status === "completed" 
                        ? "text-green-600 dark:text-green-400" 
                        : appt.status === "cancelled"
                        ? "text-red-600 dark:text-red-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    } font-medium`}>
                      {appt.status}
                    </span>
                  </div>
                  {appt.doctor && (
                    <div className="mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-semibold">Doctor:</span>&nbsp;
                      <span>{appt.doctor.name} <span className="text-gray-500 dark:text-gray-400">(Dept: {appt.doctor.specialisation})</span></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admissions with enhanced styling */}
        {patientDetail.admissions && patientDetail.admissions.length > 0 && (
          <div className="transform transition-all duration-300 hover:translate-y-1">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-amber-500 dark:from-yellow-600 dark:to-amber-700 rounded-lg text-white mr-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-yellow-100 to-amber-200 dark:from-yellow-800 dark:to-amber-900 px-3 py-1 rounded-lg">
                Admissions
              </span>
            </h3>
            <div className="space-y-3">
              {patientDetail.admissions.map((adm) => (
                <div
                  key={adm.id}
                  className="p-4 border-l-4 border-yellow-500 dark:border-yellow-400 rounded-lg bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900 dark:to-gray-800 shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10" />
                      </svg>
                      <span className="font-semibold">Admission:</span>&nbsp;
                      <span>{formatDate(adm.admission_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      <span className="font-semibold">Discharge:</span>&nbsp;
                      <span>{formatDate(adm.discharge_date) || "Not discharged"}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-1 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <span className="font-semibold">Notes:</span>&nbsp;
                        <span className="text-gray-700 dark:text-gray-300">{adm.notes}</span>
                      </div>
                    </div>
                  </div>
                  {adm.room && (
                    <div className="mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="font-semibold">Room:</span>&nbsp;
                      <span>{adm.room.room_type} <span className="text-gray-500 dark:text-gray-400">(Total: {adm.room.total_count}, Occupied: {adm.room.occupied_count})</span></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tests with enhanced styling */}
        {patientDetail.tests && patientDetail.tests.length > 0 && (
          <div className="transform transition-all duration-300 hover:translate-y-1">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <div className="p-2 bg-gradient-to-r from-red-400 to-red-600 dark:from-red-600 dark:to-red-800 rounded-lg text-white mr-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-red-100 to-red-200 dark:from-red-800 dark:to-red-900 px-3 py-1 rounded-lg">
                Tests
              </span>
            </h3>
            <div className="space-y-3">
              {patientDetail.tests.map((test) => (
                <div
                  key={test.id}
                  className="p-4 border-l-4 border-red-500 dark:border-red-400 rounded-lg bg-gradient-to-r from-red-50 to-white dark:from-red-900 dark:to-gray-800 shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="font-semibold">Type:</span>&nbsp;
                      <span>{test.test_type}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" />
                      <span className="font-semibold">Date:</span>&nbsp;
                      <span>{formatDate(test.test_date)}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">Result:</span>&nbsp;
                      <span className="text-gray-700 dark:text-gray-300">{test.test_result}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Treatments with enhanced styling */}
        {patientDetail.treatments && patientDetail.treatments.length > 0 && (
          <div className="transform transition-all duration-300 hover:translate-y-1">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <div className="p-2 bg-gradient-to-r from-indigo-400 to-indigo-600 dark:from-indigo-600 dark:to-indigo-800 rounded-lg text-white mr-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-900 px-3 py-1 rounded-lg">
                Treatments
              </span>
            </h3>
            <div className="space-y-3">
              {patientDetail.treatments.map((treat) => (
                <div
                  key={treat.id}
                  className="p-4 border-l-4 border-indigo-500 dark:border-indigo-400 rounded-lg bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900 dark:to-gray-800 shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="font-semibold">Drug:</span>&nbsp;
                      <span>{treat.drug}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">Dosage:</span>&nbsp;
                      <span>{treat.dosage}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-semibold">Date:</span>&nbsp;
                      <span>{formatDate(treat.treatment_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-semibold">Prescribed by:</span>&nbsp;
                      <span>{treat.prescribed_by}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-1 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <span className="font-semibold">Remarks:</span>&nbsp;
                        <span className="text-gray-700 dark:text-gray-300">{treat.remarks}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports with enhanced styling */}
        {patientDetail.reports && patientDetail.reports.length > 0 && (
          <div className="transform transition-all duration-300 hover:translate-y-1">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <div className="p-2 bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-lg text-white mr-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 px-3 py-1 rounded-lg">
                Reports
              </span>
            </h3>
            <div className="space-y-3">
              {patientDetail.reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 border-l-4 border-blue-500 dark:border-blue-400 rounded-lg bg-gradient-to-r from-blue-50 to-white dark:from-blue-900 dark:to-gray-800 shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-semibold">Title:</span>&nbsp;
                      <span>{rep.title}</span>
                    </div>
                    <a
                      href={rep.report_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                    >
                      View Report
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ) : (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500 dark:text-gray-400">No patient details available.</p>
      </div>
    )}
  </div>
</div>

    </div>
  );
}