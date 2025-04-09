// src/pages/FDODashboard.jsx
import React from 'react';
import SideBar_Doctor from '../components/SideBar_Doctor';
import DoctorMainMenu from '../components/DoctorMainMenu';

export default function DoctorDashboard() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      <SideBar_Doctor />
      <DoctorMainMenu />
    </div>
  );
}
// "min-h-screen flex flex-col md:flex-row"