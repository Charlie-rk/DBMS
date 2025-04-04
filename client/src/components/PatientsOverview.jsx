import React from 'react';
import { Card } from 'flowbite-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
// For illustration, let's use a simple icon from react-icons (replace with any icon you prefer)
import { FaUserInjured } from 'react-icons/fa';

// Example data
const data = [
  { date: '01-07', discharge: 35, new: 40 },
  { date: '08-12', discharge: 30, new: 35 },
  { date: '13-17', discharge: 25, new: 30 },
  { date: '18-21', discharge: 50, new: 45 },
];

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const [dischargeData, newData] = payload;
    return (
      <div className="bg-white dark:bg-gray-700 p-2 rounded shadow-md text-sm dark:text-gray-200">
        <p className="font-semibold mb-1">Date Range: {label}</p>
        <p className="text-blue-900 dark:text-blue-300">Discharged: {dischargeData.value}</p>
        <p className="text-blue-700 dark:text-blue-400">New: {newData.value}</p>
      </div>
    );
  }
  return null;
};

const PatientsOverview = () => {
  return (
    <Card className="w-full max-w-xl p-4 bg-white dark:bg-gray-800 shadow-xl hover:shadow-slate-500 dark:shadow-slate-700 rounded-lg text-gray-800 dark:text-gray-200">
      {/* Top Row: Title & Main Stat */}
      <div className="flex items-center justify-between mb-4">
        {/* Title + Icon */}
        <div className="flex items-center space-x-2">
          <FaUserInjured className="text-xl text-gray-700 dark:text-gray-300" />
          <h5 className="text-lg font-semibold">Patients</h5>
        </div>
        {/* Main Stat */}
        <div className="flex flex-col items-end">
          <span className="text-3xl font-bold">50</span>
          <span className="text-sm text-teal-600 dark:text-teal-400">Discharged</span>
        </div>
      </div>

      {/* Middle Row: Room and Appointment Stats */}
      <div className="flex items-center justify-between mb-2 text-sm">
        <div className="space-x-3">
          <span className="text-gray-800 dark:text-gray-200">Executive Room: 10</span>
          <span className="text-gray-800 dark:text-gray-200">Premium Room: 20</span>
          <span className="text-gray-800 dark:text-gray-200">Emergency Room: 4</span>
        </div>
        <div className="text-gray-600 dark:text-gray-400">Appointments: 16</div>
      </div>

      {/* Area Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
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
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PatientsOverview;
