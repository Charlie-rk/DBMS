import React from 'react';
import { Card } from 'flowbite-react';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Label,
} from 'recharts';

const data = [
  { name: 'Urgent', value: 35 },
  { name: 'Moderate', value: 25 },
  { name: 'Low', value: 15 },
];

const COLORS = ['#f87171', '#fbbf24', '#34d399']; // Red, Yellow, Green

export default function ReportCard() {
  return (
    <Card className="relative p-4 bg-white dark:bg-gray-800 shadow-xl shadow-slate-400 dark:shadow-slate-700 rounded-lg text-gray-800 dark:text-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Report</h3>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          + Add Report
        </button>
      </div>

      <div className="flex justify-center items-center">
        <ResponsiveContainer width={300} height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={75}
              outerRadius={100}
              fill="#8884d8"
              stroke="white"
              strokeWidth={4}
              strokeLinecap="round"
              label={({ name, value }) => `${value}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
              <Label
                value="75%"
                position="center"
                fill="currentColor"
                fontSize="24"
                fontWeight="bold"
              />
            </Pie>
            <Legend verticalAlign="bottom" height={36} iconType="circle" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex justify-around text-sm">
        <div className="flex flex-col items-center text-red-500">
          <span className="font-bold">{data[0].value}%</span>
          <span>Urgent</span>
        </div>
        <div className="flex flex-col items-center text-yellow-500">
          <span className="font-bold">{data[1].value}%</span>
          <span>Moderate</span>
        </div>
        <div className="flex flex-col items-center text-green-500">
          <span className="font-bold">{data[2].value}%</span>
          <span>Low</span>
        </div>
      </div>
    </Card>
  );
}
