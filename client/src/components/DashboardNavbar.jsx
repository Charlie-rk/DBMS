/* eslint-disable no-unused-vars */
// src/components/DashboardNavbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function DashboardNavbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-blue-600">Hospital Dashboard</span>
        <div className="space-x-4">
          <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
          <Link to="/appointment" className="text-gray-700 hover:text-blue-600">Appointment</Link>
          <Link to="/admission" className="text-gray-700 hover:text-blue-600">Admission</Link>
          <Link to="/discharge" className="text-gray-700 hover:text-blue-600">Discharge</Link>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;
