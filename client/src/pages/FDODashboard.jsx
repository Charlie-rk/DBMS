// src/pages/FDODashboard.jsx
import React from 'react';
import FDOSidebar from '../components/FDOSidebar';
import FDOMainMenu from '../components/FDOMainMenu';

export default function FDODashboard() {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <FDOSidebar />
      <FDOMainMenu />
    </div>
  );
}
