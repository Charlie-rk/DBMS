/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import SideBar_Doctor from "./../components/SideBar_Doctor";
import Profile_Doctor from "./../components/Profile_Doctor";
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

// Dummy data and other sections (appointment requests, patients, etc.)
const initialAppointmentRequests = [
  { name: "Daniel Smith", time: "2025-08-06 - 10 AM", status: "Accepted" },
  { name: "Dora Herrera", time: "2025-08-10 - 8 AM", status: "Pending" },
  { name: "Albert Diaz", time: "2025-08-15 - 3 PM", status: "Declined" },
  { name: "Edith Lynch", time: "2025-08-24 - 7 AM", status: "Pending" },
];

const allAppointments = [
  { name: "Mobile Clinic", date: "2025-08-06", time: "12:00" },
  { name: "Ray Clayton", date: "2025-08-06", time: "12:00" },
  { name: "Cornelio Rolland", date: "2025-08-07", time: "14:00" },
  { name: "Brett Shaw", date: "2025-08-06", time: "16:00" },
];

const recentPatients = [
  {
    name: "Daniel Smith",
    gender: "Male",
    weight: "73 kg",
    condition: "Cancer",
    age: "35 Yr",
    status: "AB",
  },
  {
    name: "Dora Herrera",
    gender: "Female",
    weight: "64 kg",
    condition: "Diabetes",
    age: "42 Yr",
    status: "A",
  },
  {
    name: "Albert Diaz",
    gender: "Male",
    weight: "79 kg",
    condition: "Liver",
    age: "51 Yr",
    status: "AB",
  },
  {
    name: "Edith Lynch",
    gender: "Female",
    weight: "58 kg",
    condition: "Stroke",
    age: "38 Yr",
    status: "O",
  },
];

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

// Dummy patient data for last year and present year
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

// Calculate total patients for each year
const totalLastYear = patientData.reduce((sum, cur) => sum + cur.lastYear, 0);
const totalPresentYear = patientData.reduce(
  (sum, cur) => sum + cur.presentYear,
  0
);

// Calculate percent increase
const percentIncrease = Math.round(
  ((totalPresentYear - totalLastYear) / totalLastYear) * 100
);

const DoctorAppDashboard = () => {
  // State management
  const [currentTab, setCurrentTab] = useState("Dashboard");
  const maxAppointments = 150;
  const [bookedAppointments, setBookedAppointments] = useState(60);
  const [appointmentRequests, setAppointmentRequests] = useState(
    initialAppointmentRequests
  );
  const [selectedDate, setSelectedDate] = useState("2025-08-06");

  const handleAccept = (index) => {
    setAppointmentRequests((prev) => {
      const newReqs = [...prev];
      newReqs[index].status = "Accepted";
      return newReqs;
    });
  };

  const handleDecline = (index) => {
    setAppointmentRequests((prev) => {
      const newReqs = [...prev];
      newReqs[index].status = "Declined";
      return newReqs;
    });
  };

  const filteredAppointments = allAppointments.filter(
    (apt) => apt.date === selectedDate
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <SideBar_Doctor currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Top Header */}
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg mb-6 shadow-xl">
          <h2 className="text-xl text-gray-800 dark:text-gray-200">
            Hello Dr. Sumana Maiti
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Have a nice working day!
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Patient Trend (Area Chart) */}
          <div className="col-span-9 bg-white dark:bg-gray-800 rounded-lg p-8 shadow-2xl dark:shadow-slate-700">
            <div className="flex items-center mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">
                Patient Trend
              </h3>
              <div className="py-[2px] bg-green-100 dark:bg-green-700  border-blue-300 dark:border-blue-700 shadow-2xl dark:shadow-slate-700 rounded-lg px-2 flex items-center space-x-1 ml-2 text-green-500 dark:text-green-400">
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
                    <linearGradient
                      id="presentFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#6366F1"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="lastFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#f87171"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    className="text-gray-800 dark:text-gray-200"
                  />
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
                  {/* Area for Present Year */}
                  <Area
                    type="monotone"
                    dataKey="presentYear"
                    name="Present Year"
                    stroke="#6366F1"
                    strokeWidth={3}
                    fill="url(#presentFill)"
                    activeDot={{ r: 8 }}
                  />
                  {/* Area for Last Year */}
                  <Area
                    type="monotone"
                    dataKey="lastYear"
                    name="Last Year"
                    stroke="#f87171"
                    strokeDasharray="5 5"
                    strokeWidth={3}
                    fill="url(#lastFill)"
                    activeDot={{ r: 8 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profile Card */}
          <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-2xl dark:shadow-slate-700">
            <Profile_Doctor
              bookedAppointments={bookedAppointments}
              maxAppointments={maxAppointments}
            />
          </div>

          {/* Appointment Requests */}
          <div className="col-span-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl dark:shadow-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold rounded-lg px-1 py-[2px] bg-sky-400 text-white dark:bg-sky-800">
                Appointment Requests
              </h3>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 cursor-pointer rounded-2xl px-1">
                See All
              </span>
            </div>
            <div className="space-y-2">
              {appointmentRequests.map((req, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b py-2 border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <div className="font-bold text-gray-800 dark:text-gray-200">
                      {req.name}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {req.time}
                    </div>
                  </div>
                  {req.status === "Pending" ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAccept(index)}
                        className="bg-sky-300 dark:bg-sky-600 text-black dark:text-white px-3 py-1 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(index)}
                        className="bg-red-400 dark:bg-red-600 text-black dark:text-white px-3 py-1 rounded"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`px-2 py-1 rounded ${
                        req.status === "Accepted"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {req.status}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Appointments with Date Filter */}
          <div className="col-span-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl dark:shadow-slate-700">
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
            {filteredAppointments.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400">
                No appointments for this date.
              </div>
            ) : (
              filteredAppointments.map((apt, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b py-2 border-gray-200 dark:border-gray-700"
                >
                  <div className="font-bold text-gray-800 dark:text-gray-200">
                    {apt.name}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {apt.time}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recent Patients */}
          <div className="col-span-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg dark:shadow-slate-700">
            <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-200">
              Recent Patients
            </h3>
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  {[
                    "Name",
                    "Gender",
                    "Weight",
                    "Condition",
                    "Age",
                    "Status",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="p-2 text-left text-gray-800 dark:text-gray-200"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((patient, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="p-2 text-gray-800 dark:text-gray-200">
                      {patient.name}
                    </td>
                    <td className="p-2 text-gray-800 dark:text-gray-200">
                      {patient.gender}
                    </td>
                    <td className="p-2 text-gray-800 dark:text-gray-200">
                      {patient.weight}
                    </td>
                    <td className="p-2 text-gray-800 dark:text-gray-200">
                      {patient.condition}
                    </td>
                    <td className="p-2 text-gray-800 dark:text-gray-200">
                      {patient.age}
                    </td>
                    <td className="p-2 text-gray-800 dark:text-gray-200">
                      {patient.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Income and Misc Stats */}
          {/* Daily Performance and Metrics */}
          {/* Daily Performance and Metrics */}
          <div className="col-span-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg dark:shadow-slate-700">
            <div className="mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">
                Daily Performance
              </h3>
              <span className="text-gray-500 dark:text-gray-400">
                August 2025
              </span>
            </div>
            <div className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              42 Consultations
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded text-center">
                <div className="text-xl text-gray-800 dark:text-gray-200">
                  12
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  New Patients
                </div>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded text-center">
                <div className="text-xl text-gray-800 dark:text-gray-200">
                  7
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Treated & Discharged
                </div>
              </div>
            </div>
            {/* Additional Info Section */}
            <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
              <p>
                Avg Consultation Time:{" "}
                <span className="font-bold">15 mins</span>
              </p>
              <p>
                Doctor Efficiency: <span className="font-bold">85%</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppDashboard;
