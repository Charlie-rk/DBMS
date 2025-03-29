/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
// src/pages/DashProfile.jsx
import React from 'react';
import { Card } from 'flowbite-react';

export default function DashProfile() {
  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-full">
              {/* Example Icon */}
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 010 8m-8-8a4 4 0 010 8m4-8v8m-4 4h8"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold">1,245</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-full">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold">87</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-red-500 rounded-full">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7m-5 4v5m-4 4v-4m-4 0v-4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Occupied Rooms</p>
              <p className="text-2xl font-bold">53</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activities Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Recent Activities</h3>
        <div className="bg-white shadow rounded-lg p-4">
          <ul className="divide-y divide-gray-200">
            <li className="py-2">Patient <span className="font-bold">Amit Kumar</span> registered.</li>
            <li className="py-2">Appointment scheduled for <span className="font-bold">Sita Devi</span>.</li>
            <li className="py-2">Patient <span className="font-bold">Rajesh Singh</span> admitted in Room 102.</li>
            <li className="py-2">Patient <span className="font-bold">Neha Sharma</span> discharged.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
