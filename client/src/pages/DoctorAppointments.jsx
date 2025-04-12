/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "flowbite-react";
import { 
  FaUserMd, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf 
} from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import CustomSpinner from "../components/CustomSpinner";

// Recharts imports for area charts
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { AlertCircle } from "lucide-react";

// Updated Custom Tooltip component to display emergency count as well.
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Destructure payload. The order of the items should match the order of the <Area> components.
    const [acceptedData, declinedData, pendingData, emergencyData] = payload;
    return (
      <div className="bg-white dark:bg-gray-700 p-2 rounded shadow-md text-sm dark:text-gray-200">
        <p className="font-semibold mb-1">Date: {label}</p>
        <p className="text-green-700 dark:text-green-300">
          Accepted: {acceptedData.value}
        </p>
        <p className="text-red-700 dark:text-red-300">
          Declined: {declinedData.value}
        </p>
        <p className="text-purple-700 dark:text-purple-300">
          Pending: {pendingData.value}
        </p>
        <p className="text-orange-700 dark:text-orange-300">
          Emergency: {emergencyData.value}
        </p>
      </div>
    );
  }
  return null;
};

export default function DoctorAppointments() {
  const { currentUser } = useSelector((state) => state.user);
  const [appointments, setAppointments] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [patientDetail, setPatientDetail] = useState(null);

  const globalLoading = loadingAppointments || detailLoading;

  // Overall appointment counts
  const acceptedCount = appointments.filter((a) => a.status === "accepted").length;
  const declinedCount = appointments.filter((a) => a.status === "declined").length;
  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const totalAppointments = appointments.length;
  const totalAvailable = 100; // static for demonstration

  // New metric: emergency count (for card display)
  const emergencyCount = appointments.filter((a) => a.emergency).length;

  // Escape key and body scroll handling for slide-over.
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && showDetailPanel) {
        setShowDetailPanel(false);
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [showDetailPanel]);

  useEffect(() => {
    document.body.style.overflow = showDetailPanel ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showDetailPanel]);

  // Utility function to format dates.
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString();
  };

  // Fetch appointments for the current doctor.
  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const res = await fetch("/api/doctor/get-all-appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: currentUser.id }),
      });
      const data = await res.json();
      if (data?.appointments) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch appointments. Please try again.",
      });
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentUser]);

  // Compute chart data by grouping appointments by formatted date and include a timestamp for sorting.
  useEffect(() => {
    if (appointments.length === 0) {
      setChartData([]);
      return;
    }
    const groups = appointments.reduce((acc, appt) => {
      // Create a Date object and generate a local date string.
      const dateObj = new Date(appt.appointment_date);
      const dateKey = dateObj.toLocaleDateString();
      // Use timestamp from the dateObj for sorting.
      if (!acc[dateKey]) {
        acc[dateKey] = { 
          accepted: 0, 
          declined: 0, 
          pending: 0, 
          emergency: 0,
          timestamp: dateObj.getTime(),
        };
      }
      if (appt.status === "accepted") {
        acc[dateKey].accepted += 1;
      } else if (appt.status === "declined") {
        acc[dateKey].declined += 1;
      } else if (appt.status === "pending") {
        acc[dateKey].pending += 1;
      }
      // Increase the emergency count if the appointment is marked emergency.
      if (appt.emergency) {
        acc[dateKey].emergency += 1;
      }
      return acc;
    }, {});

    // Transform the groups into an array and sort by the timestamp.
    const chartArray = Object.keys(groups)
      .map((date) => ({
        date,
        accepted: groups[date].accepted,
        declined: groups[date].declined,
        pending: groups[date].pending,
        emergency: groups[date].emergency,
        timestamp: groups[date].timestamp,
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
      // Optionally, remove the timestamp property if not needed by the chart.
      .map(({ timestamp, ...rest }) => rest);
      
    setChartData(chartArray);
  }, [appointments]);

  // Fetch and show full patient details in slide-over panel.
  const fetchPatientDetail = async (patientId) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/fdo/patient-history/${patientId}`);
      const data = await res.json();
      setPatientDetail(data.history);
      setShowDetailPanel(true);
    } catch (error) {
      console.error("Error fetching patient history:", error);
      const MySwal = withReactContent(Swal);
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
        <span className="bg-sky-200 dark:bg-sky-600 rounded-lg px-1 border-b-2 hover:border-sky-700 text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Doctor Appointments Overview
        </span>
      </div>

      {/* Metric Cards: using a 5-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {/* Total Appointments Card */}
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl hover:shadow-slate-700 hover:bg-slate-200">
          <div className="flex items-center space-x-3">
            <FaUserMd className="w-8 h-8 text-blue-500" />
            <div>
              <p className="bg-sky-200 dark:bg-sky-500 rounded-md px-1 text-lg font-semibold text-gray-800 dark:text-gray-200">
                Total Appointments
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalAppointments}
              </p>
            </div>
          </div>
        </Card>
        {/* Accepted Card */}
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl hover:shadow-slate-700 hover:bg-slate-200">
          <div className="flex items-center space-x-3">
            <FaCheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="bg-sky-200 dark:bg-sky-500 rounded-md px-1 text-lg font-semibold text-gray-800 dark:text-gray-200">
                Accepted
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {acceptedCount}
              </p>
            </div>
          </div>
        </Card>
        {/* Declined Card */}
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl hover:shadow-slate-700 hover:bg-slate-200">
          <div className="flex items-center space-x-3">
            <FaTimesCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="bg-sky-200 dark:bg-sky-500 rounded-md px-1 text-lg font-semibold text-gray-800 dark:text-gray-200">
                Declined
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {declinedCount}
              </p>
            </div>
          </div>
        </Card>
        {/* Pending Card */}
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl hover:shadow-slate-700 hover:bg-slate-200">
          <div className="flex items-center space-x-3">
            <FaHourglassHalf className="w-8 h-8 text-purple-500" />
            <div>
              <p className="bg-sky-200 dark:bg-sky-500 rounded-md px-1 text-lg font-semibold text-gray-800 dark:text-gray-200">
                Pending
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pendingCount}
              </p>
            </div>
          </div>
        </Card>
        {/* Emergency Card */}
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl hover:shadow-slate-700 hover:bg-slate-200">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="bg-sky-200 dark:bg-sky-500 rounded-md px-1 text-lg font-semibold text-gray-800 dark:text-gray-200">
                Emergency
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {emergencyCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Overview Card with AreaChart for Appointments by Date */}
      <Card className="w-full p-4 bg-white dark:bg-gray-800 shadow-xl hover:shadow-slate-500 rounded-lg text-gray-800 dark:text-gray-200 mb-6">
        {/* Top Row: Title & Main Stat */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FaUserMd className="text-xl text-gray-700 dark:text-gray-300" />
            <h5 className="text-lg font-semibold">Appointments</h5>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-3xl font-bold">{totalAppointments}</span>
            <span className="text-sm text-teal-600 dark:text-teal-400">
              Total / {totalAvailable}
            </span>
          </div>
        </div>
        {/* Middle Row: Status Stats */}
        <div className="flex items-center justify-between mb-2 text-sm">
          <div className="space-x-3">
            <span className="text-green-700 dark:text-green-300">
              Accepted: {acceptedCount}
            </span>
            <span className="text-red-700 dark:text-red-300">
              Declined: {declinedCount}
            </span>
            <span className="text-purple-700 dark:text-purple-300">
              Pending: {pendingCount}
            </span>
            <span className="text-orange-700 dark:text-orange-300">
              Emergency: {emergencyCount}
            </span>
          </div>
        </div>
       {/* Area Chart */}
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={chartData}>
    <defs>
      <linearGradient id="acceptedFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#87CEEB" stopOpacity={0.7} />
        <stop offset="100%" stopColor="#87CEFA" stopOpacity={0.2} />
      </linearGradient>
      <linearGradient id="declinedFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#808080" stopOpacity={0.7} />
        <stop offset="100%" stopColor="#A9A9A9" stopOpacity={0.2} />
      </linearGradient>
      <linearGradient id="pendingFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8A2BE2" stopOpacity={0.7} />
        <stop offset="100%" stopColor="#9370DB" stopOpacity={0.2} />
      </linearGradient>
      <linearGradient id="emergencyFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FF4500" stopOpacity={0.7} />
        <stop offset="100%" stopColor="#FF6347" stopOpacity={0.2} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
    <XAxis dataKey="date" stroke="gray" />
    <YAxis stroke="gray" />
    <RechartsTooltip content={<CustomTooltip />} />
    <Area 
      type="monotone" 
      dataKey="accepted" 
      stroke="#87CEEB" 
      fill="url(#acceptedFill)" 
      strokeWidth={2} 
    />
    <Area 
      type="monotone" 
      dataKey="declined" 
      stroke="#808080" 
      fill="url(#declinedFill)" 
      strokeDasharray="5 5" 
      strokeWidth={2} 
    />
    <Area 
      type="monotone" 
      dataKey="pending" 
      stroke="#8A2BE2" 
      fill="url(#pendingFill)" 
      strokeWidth={2} 
    />
    <Area 
      type="monotone" 
      dataKey="emergency" 
      stroke="#FF4500" 
      fill="url(#emergencyFill)" 
      strokeWidth={2} 
    />
  </AreaChart>
</ResponsiveContainer>

      </Card>

      {/* Appointments Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-blue-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-blue-900 dark:text-blue-100 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blue-900 dark:text-blue-100 uppercase">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blue-900 dark:text-blue-100 uppercase">
                Slot
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blue-900 dark:text-blue-100 uppercase">
                Reason
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-blue-900 dark:text-blue-100 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-blue-900 dark:text-blue-100 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {appointments.map((appt) => (
              <tr key={appt.id} className="hover:bg-blue-100 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(appt.appointment_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 flex items-center">
                  {appt.patient_name}
                  {appt.emergency && (
                    <span className="ml-2 text-red-500 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      Emergency
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {appt.slot || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {appt.reason}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-green-600 dark:text-green-400">
                  {appt.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Button
                    gradientDuoTone="purpleToBlue"
                    size="sm"
                    onClick={() => fetchPatientDetail(appt.patient_id)}
                  >
                    View Patient
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Backdrop Overlay for Slide-over Panel */}
      {showDetailPanel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
          onClick={() => setShowDetailPanel(false)}
        />
      )}

      {/* Slide-over Panel for Complete Patient Details */}
      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-all duration-500 ease-out ${
          showDetailPanel ? "translate-x-0" : "translate-x-full"
        } overflow-hidden`}
      >
        {/* Panel Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Patient Details
          </h2>
          <button
            onClick={() => setShowDetailPanel(false)}
            className="rounded-full p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" 
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {/* Patient Detail Content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
          {patientDetail ? (
            <div className="space-y-6">
              {/* Patient Basic Info */}
              <div className="border border-gray-300 rounded-md p-4 shadow-md bg-sky-50 dark:bg-sky-900">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 pb-2 border-b border-sky-400">
                  {patientDetail.patient.name}
                </h2>
                <div className="mt-2 space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  <p>
                    <span className="font-semibold">Mobile:</span> {patientDetail.patient.mobile}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span> {patientDetail.patient.address}
                  </p>
                  <p>
                    <span className="font-semibold">Gender:</span> {patientDetail.patient.gender} |{" "}
                    <span className="font-semibold">Age:</span> {patientDetail.patient.age}
                  </p>
                  <p>
                    <span className="font-semibold">DOB:</span> {formatDate(patientDetail.patient.dob)}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span> {patientDetail.patient.status}
                  </p>
                </div>
              </div>

              {/* Additional Sections (Appointments, Admissions, etc.) */}
              {patientDetail.appointments && patientDetail.appointments.length > 0 && (
                <div>
                  <h3 className="inline-block bg-green-200 dark:bg-green-700 rounded px-2 py-1 border-b-2 border-green-600 text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Appointments
                  </h3>
                  <div className="space-y-3">
                    {patientDetail.appointments.map((appt) => (
                      <div
                        key={appt.id}
                        className="p-3 border rounded-md dark:border-gray-600 bg-green-50 dark:bg-green-900 shadow-sm"
                      >
                        <p className="text-gray-800 dark:text-gray-200">
                          <span className="font-semibold">Date:</span> {formatDate(appt.appointment_date)} |{" "}
                          <span className="font-semibold">Slot:</span> {appt.slot ?? "-"}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Reason:</span> {appt.reason}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Status:</span> {appt.status}
                        </p>
                        {appt.emergency && (
                          <p className="text-red-500 dark:text-red-400 font-bold">
                            <AlertCircle size={16} className="inline mr-1" />
                            Emergency Appointment
                          </p>
                        )}
                        {appt.doctor && (
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">Doctor:</span> {appt.doctor.name} (Dept: {appt.doctor.specialisation})
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Additional sections (Admissions, Tests, Treatments, Reports) can be added similarly */}
            </div>
          ) : (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
