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
      console.error("Error fetching patients:", error);
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
      console.error("Error fetching patient history:", error);
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
        <span className="bg-sky-200 rounded-lg px-1 border-b-2 hover:border-sky-700 dark:bg-sky-600 text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          All Patients 
        </span>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl hover:shadow-slate-700 hover:bg-slate-200">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-blue-500" />
            <div>
              <p className="bg-sky-200 dark:bg-sky-500 rounded-md px-1 text-lg font-semibold text-gray-800 dark:text-gray-200">
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
              <p className="bg-sky-200 dark:bg-sky-500 rounded-md px-1 text-lg font-semibold text-gray-800 dark:text-gray-200">
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
              <p className="bg-sky-200 dark:bg-sky-500 rounded-md px-1 text-lg font-semibold text-gray-800 dark:text-gray-200">
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
              <p className="bg-sky-200 dark:bg-sky-500 rounded-md px-1 text-lg font-semibold text-gray-800 dark:text-gray-200">
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
          <span className="inline-block bg-sky-200 dark:bg-sky-600 rounded px-1 border-b-2">
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
      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-all duration-500 ease-out ${
          showDetailPanel ? "translate-x-0" : "translate-x-full"
        } overflow-hidden`}
      >
        {/* Header of Slide-over */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Patient Details
          </h2>
          <button
            onClick={() => setShowDetailPanel(false)}
            className="rounded-full p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
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
                    <span className="font-semibold">Gender:</span> {patientDetail.patient.gender}{" "}
                    | <span className="font-semibold">Age:</span> {patientDetail.patient.age}
                  </p>
                  <p>
                    <span className="font-semibold">DOB:</span> {formatDate(patientDetail.patient.dob)}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span> {patientDetail.patient.status}
                  </p>
                </div>
              </div>

              {/* Appointments */}
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
                          <span className="font-semibold">Date:</span> {formatDate(appt.appointment_date)} | <span className="font-semibold">Slot:</span> {appt.slot}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Reason:</span> {appt.reason}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Status:</span> {appt.status}
                        </p>
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

              {/* Admissions */}
              {patientDetail.admissions && patientDetail.admissions.length > 0 && (
                <div>
                  <h3 className="inline-block bg-yellow-200 dark:bg-yellow-700 rounded px-2 py-1 border-b-2 border-yellow-500 text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Admissions
                  </h3>
                  <div className="space-y-3">
                    {patientDetail.admissions.map((adm) => (
                      <div
                        key={adm.id}
                        className="p-3 border rounded-md dark:border-gray-600 bg-yellow-50 dark:bg-yellow-900 shadow-sm"
                      >
                        <p className="text-gray-800 dark:text-gray-200">
                          <span className="font-semibold">Admission Date:</span> {formatDate(adm.admission_date)} | <span className="font-semibold">Discharge:</span> {formatDate(adm.discharge_date)}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Notes:</span> {adm.notes}
                        </p>
                        {adm.room && (
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">Room Type:</span> {adm.room.room_type} (Total: {adm.room.total_count}, Occupied: {adm.room.occupied_count})
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tests */}
              {patientDetail.tests && patientDetail.tests.length > 0 && (
                <div>
                  <h3 className="inline-block bg-red-200 dark:bg-red-700 rounded px-2 py-1 border-b-2 border-red-500 text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Tests
                  </h3>
                  <div className="space-y-3">
                    {patientDetail.tests.map((test) => (
                      <div
                        key={test.id}
                        className="p-3 border rounded-md dark:border-gray-600 bg-red-50 dark:bg-red-900 shadow-sm"
                      >
                        <p className="text-gray-800 dark:text-gray-200">
                          <span className="font-semibold">Type:</span> {test.test_type} | <span className="font-semibold">Date:</span> {formatDate(test.test_date)}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Result:</span> {test.test_result}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Treatments */}
              {patientDetail.treatments && patientDetail.treatments.length > 0 && (
                <div>
                  <h3 className="inline-block bg-indigo-200 dark:bg-indigo-700 rounded px-2 py-1 border-b-2 border-indigo-500 text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Treatments
                  </h3>
                  <div className="space-y-3">
                    {patientDetail.treatments.map((treat) => (
                      <div
                        key={treat.id}
                        className="p-3 border rounded-md dark:border-gray-600 bg-indigo-50 dark:bg-indigo-900 shadow-sm"
                      >
                        <p className="text-gray-800 dark:text-gray-200">
                          <span className="font-semibold">Drug:</span> {treat.drug} | <span className="font-semibold">Dosage:</span> {treat.dosage}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Date:</span> {formatDate(treat.treatment_date)} | <span className="font-semibold">Prescribed by:</span> {treat.prescribed_by}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Remarks:</span> {treat.remarks}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reports */}
              {patientDetail.reports && patientDetail.reports.length > 0 && (
                <div>
                  <h3 className="inline-block bg-blue-200 dark:bg-blue-700 rounded px-2 py-1 border-b-2 border-blue-500 text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Reports
                  </h3>
                  <div className="space-y-3">
                    {patientDetail.reports.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-3 border rounded-md dark:border-gray-600 bg-blue-50 dark:bg-blue-900 shadow-sm"
                      >
                        <p className="text-gray-800 dark:text-gray-200">
                          <span className="font-semibold">Title:</span> {rep.title}
                        </p>
                        <a
                          href={rep.report_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                        >
                          View Report
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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