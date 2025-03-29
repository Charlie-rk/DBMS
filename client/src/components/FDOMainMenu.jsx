/* eslint-disable no-unused-vars */
// src/components/FDOMainMenu.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FDOHomePage from '../pages/FDOHomePage';
import RegistrationPage from '../pages/RegistrationPage';
import AppointmentPage from '../pages/AppointmentPage';
import AdmissionPage from '../pages/AdmissionPage';
import DischargePage from '../pages/DischargePage';

const FDOMainMenu = () => {
  return (
    <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <Routes>
        <Route path="/" element={<FDOHomePage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/admission" element={<AdmissionPage />} />
        <Route path="/discharge" element={<DischargePage />} />
        <Route path="/payment" element={<div>Payment Page ( i will not come Coming Soon)</div>} />
        <Route path="/widgets" element={<div>Widgets Page (Coming Soon)</div>} />
        <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
        <Route path="/security" element={<div>Security Page (Coming Soon)</div>} />
        <Route path="/help" element={<div>Help Page (Coming Soon)</div>} />
        <Route path="/logout" element={<div>Logging Out... (Implement Logout)</div>} />
      </Routes>
    </main>
  );
};

export default FDOMainMenu;
