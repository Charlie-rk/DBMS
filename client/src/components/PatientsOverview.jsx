import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { FaUserInjured } from "react-icons/fa";

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Adjust the data order as needed
    const [dischargeData, newData, appointmentData] = payload;
    return (
      <div className="bg-white dark:bg-gray-700 p-2 rounded shadow-md text-sm dark:text-gray-200">
        <p className="font-semibold mb-1">Date Range: {label}</p>
        <p className="text-blue-900 dark:text-blue-300">
          Discharged: {dischargeData.value}
        </p>
        <p className="text-blue-700 dark:text-blue-400">
          New: {newData.value}
        </p>
        <p className="text-blue-500 dark:text-blue-300">
          Appointments: {appointmentData.value}
        </p>
      </div>
    );
  }
  return null;
};

const PatientsOverview = () => {
  // State to hold fetched data
  const [chartData, setChartData] = useState([]);
  const [rooms, setRooms] = useState({});
  const [appointmentsTotal, setAppointmentsTotal] = useState(0);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const response = await fetch("/api/admin/patient-overview", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        setChartData(data.chartData);
        setRooms(data.rooms);
        setAppointmentsTotal(data.appointmentsTotal);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      }
    }
    fetchOverview();
  }, []);

  return (
    <Card className="w-full max-w-xl p-4 bg-white dark:bg-gray-800 shadow-xl hover:shadow-slate-500 dark:shadow-slate-700 rounded-lg text-gray-800 dark:text-gray-200">
      {/* Top Row: Title & Main Stat */}
      <div className="flex items-center justify-between mb-4">
        {/* Title + Icon */}
        <div className="flex items-center space-x-2">
          <FaUserInjured className="text-xl text-gray-700 dark:text-gray-300" />
          <h5 className="text-lg font-semibold">Patients</h5>
        </div>
        {/* Main Stat (discharged count computed from chartData) */}
        <div className="flex flex-col items-end">
          <span className="text-3xl font-bold">
            {chartData.reduce((acc, curr) => acc + curr.discharge, 0) || 0}
          </span>
          <span className="text-sm text-teal-600 dark:text-teal-400">Discharged</span>
        </div>
      </div>

      {/* Middle Row: Room and Appointment Stats */}
      <div className="flex items-center justify-between mb-2 text-sm">
        <div className="space-x-3">
          <span className="text-gray-800 dark:text-gray-200">
            Executive Room: {rooms.Executive || 0}
          </span>
          <span className="text-gray-800 dark:text-gray-200">
            Premium Room: {rooms.Premium || 0}
          </span>
          <span className="text-gray-800 dark:text-gray-200">
            Emergency Room: {rooms.Emergency || 0}
          </span>
        </div>
      
      </div>
        <div className="text-gray-600 dark:text-gray-400">
          Appointments: {appointmentsTotal}
        </div>

      {/* Area Chart with three areas: discharge, new, and appointments */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          {/* Gradients for the filled areas */}
          <defs>
            <linearGradient id="dischargeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E40AF" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="newFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#93C5FD" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="appointmentFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#047857" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#34D399" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
          <XAxis dataKey="date" stroke="gray" />
          <YAxis stroke="gray" />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="discharge"
            stroke="#1E40AF"
            fill="url(#dischargeFill)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="new"
            stroke="#2563EB"
            fill="url(#newFill)"
            strokeDasharray="5 5"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="appointments"
            stroke="#047857"
            fill="url(#appointmentFill)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PatientsOverview;
