/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
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

const DoctorHome = () => {
  const { currentUser } = useSelector((state) => state.user);

  // Live status state; backend returns a Boolean (true => Live, false => Offline)
  const [sessionStatus, setSessionStatus] = useState(false);

  // Appointment requests state – fetched from backend
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  // Initialize selectedDate with the system current date formatted as YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  // Add state variable to control showing limited or all appointments
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
   // Get current month and year
   const currentDate = new Date();
   const currentMonth = currentDate.getMonth() + 1; // January is 0; we need 1 based
   const currentYear = currentDate.getFullYear();
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
 

  // Fetch live status, appointments and recent patients when currentUser is available
  useEffect(() => {
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
        .catch((err) => console.error("Error fetching live status:", err));

      // Fetch all appointments
      fetch("/api/doctor/get-all-appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: currentUser.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Optionally filter or sort appointments here
          setAppointmentRequests(data.appointments || []);
        })
        .catch((err) => console.error("Error fetching appointments:", err));

      // Fetch recent patients (updated endpoint returns appointments with patient_name and reason)
      fetch("/api/doctor/recent-patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: currentUser.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Check whether the response includes an "appointments" or "patients" key
          if (data.appointments) {
            setRecentPatients(data.appointments);
          } else if (data.patients) {
            setRecentPatients(data.patients);
          }
        })
        .catch((err) => console.error("Error fetching recent patients:", err));
    }
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
        .catch((err) =>
          console.error("Error fetching monthly appointments:", err)
        );

      // Fetch monthly accepted appointments with new patients
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
        .catch((err) =>
          console.error("Error fetching monthly new appointments:", err)
        );
    
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
      } else {
        console.error("Failed to update live status");
      }
    } catch (error) {
      console.error("Error updating live status", error);
    }
  };

  // Update appointment status for an appointment request
  const updateAppointment = async (index, newStatus) => {
    const appointmentId = appointmentRequests[index].id;
    try {
      const response = await fetch("/api/doctor/change-appointment-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, status: newStatus }),
      });
      if (response.ok) {
        const result = await response.json();
        // Update local state for the appointment request
        setAppointmentRequests((prev) => {
          const newReqs = [...prev];
          newReqs[index].status = newStatus;
          return newReqs;
        });
      } else {
        console.error("Failed to update appointment status");
      }
    } catch (error) {
      console.error("Error updating appointment status", error);
    }
  };

  const handleAccept = (index) => {
    updateAppointment(index, "accepted");
  };

  const handleDecline = (index) => {
    updateAppointment(index, "declined");
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

    // Calculate monthly consultations based on appointmentRequests within the current month/year.
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
  
    // For average consultation time, use a fixed value (or compute if data is available)
    const avgConsultationTime = "15 mins";
    

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar (if used) */}
      {/* <SideBar_Doctor currentTab={currentTab} setCurrentTab={setCurrentTab} /> */}

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Top Header */}
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg mb-6 shadow-xl flex justify-between items-center hover:shadow-slate-500">
          <div>
            <h2 className="text-xl text-gray-800 dark:text-gray-200">
              Hello Dr. {currentUser?.name || "Doctor"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Have a nice working day!
            </p>
          </div>
          <button
            onClick={handleStatusToggle}
            className={`px-4 py-2 text-white rounded-lg shadow-2xl ${
              sessionStatus
                ? "bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700"
                : "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700"
            }`}
          >
            {sessionStatus ? "Go Offline" : "Go Live"}
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Patient Trend (Area Chart) */}
          <div className="col-span-9 bg-white dark:bg-gray-800 rounded-lg p-8 shadow-2xl dark:shadow-slate-700 hover:shadow-slate-600">
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
          </div>

          {/* Profile Card */}
          <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-2xl dark:shadow-slate-700 hover:shadow-slate-600">
            <Profile_Doctor 
              bookedAppointments={bookedAppointments}
              maxAppointments={maxAppointments}
            />
          </div>

          {/* Appointment Requests Section */}
          <div className="col-span-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl dark:shadow-slate-700 hover:shadow-slate-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold rounded-lg px-1 py-[2px] bg-sky-400 text-white dark:bg-sky-800">
                Appointment Requests
              </h3>
              <span
                onClick={() => setShowAllAppointments((prev) => !prev)}
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 cursor-pointer rounded-2xl px-1"
              >
                {showAllAppointments ? "Show Less" : "See All"}
              </span>
            </div>
            <div className="space-y-2">
              {appointmentsToDisplay.map((req, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b py-2 border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <div className="font-bold text-gray-800 dark:text-gray-200">
                      {req.patient_name || "Patient Name"}
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
                        req.status === "accepted"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Appointments with Date Filter */}
          <div className="col-span-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl dark:shadow-slate-700 hover:shadow-slate-600">
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
                    {apt.patient_name || "Patient Name"}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {new Date(apt.appointment_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recent Patients Section */}
          <div className="col-span-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg dark:shadow-slate-700 hover:shadow-slate-600">
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
                    <td colSpan="4" className="p-2 text-gray-500 dark:text-gray-400">
                      No recent patients available.
                    </td>
                  </tr>
                ) : (
                  recentPatients.map((patient, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="p-2 text-gray-800 dark:text-gray-200">
                        {patient.patientInfo?.name || patient.name || "N/A"}
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
          </div>

          {/* Daily Performance and Metrics */}
          <div className="col-span-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg dark:shadow-slate-700 hover:shadow-slate-600">
            <div className="mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">
                Monthly Performance
              </h3>
              <span className="text-gray-500 dark:text-gray-400">
                {monthNames[currentMonth - 1]} {currentYear}
              </span>
            </div>
            {/* Total consultations for the month */}
            <div className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              {monthlyConsultations} Consultations
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* New Patients (from accepted appointments with new patients endpoint) */}
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded text-center">
                <div className="text-xl text-gray-800 dark:text-gray-200">
                  {monthlyNew}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  New Patients
                </div>
              </div>
              {/* Treated & Discharged (from count-monthly-appointments endpoint) */}
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
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorHome;
