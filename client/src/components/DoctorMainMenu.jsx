/* eslint-disable no-unused-vars */
// src/components/DoctorMainMenu.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import DoctorAppDashboard from '../pages/DoctorHome';
import DoctorHome from '../pages/DoctorHome';
import Messages from '../pages/Message';
import AllPatient_Doctor from '../pages/AllPatient_Doctor';
import DoctorAppointments from '../pages/DoctorAppointments';

// Import other doctor pages or use placeholders
// import DoctorAppointmentPage from '../pages/DoctorAppointmentPage';
// import DoctorPatientsPage from '../pages/DoctorPatientsPage';
// import DoctorMessagesPage from '../pages/DoctorMessagesPage';
// import DoctorMedicationsPage from '../pages/DoctorMedicationsPage';
// import DoctorDocumentsPage from '../pages/DoctorDocumentsPage';
// import DoctorFinancesPage from '../pages/DoctorFinancesPage';
// import DoctorSettingsPage from '../pages/DoctorSettingsPage';
// import DoctorLogoutPage from '../pages/DoctorLogoutPage';

const DoctorMainMenu = () => {
  return (
    <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <Routes>
        {/* Home route renders the Doctor Desktop Dashboard */}
        <Route path="/" element={<DoctorHome />} />
        <Route path="/messages" element={<Messages/>} />
        <Route path="/patients" element={<AllPatient_Doctor/>} />
        <Route path="/appoint" element={<DoctorAppointments/>} />

        {/* <Route path="/appointment" element={<DoctorAppointmentPage />} />
        <Route path="/patients" element={<DoctorPatientsPage />} />
        <Route path="/messages" element={<DoctorMessagesPage />} />
        <Route path="/medications" element={<DoctorMedicationsPage />} />
        <Route path="/documents" element={<DoctorDocumentsPage />} />
        <Route path="/finances" element={<DoctorFinancesPage />} />
        <Route path="/settings" element={<DoctorSettingsPage />} />
        <Route path="/logout" element={<DoctorLogoutPage />} /> */}
        {/* Fallback */}
        {/* <Route path="*" element={<DoctorAppDashboard />} /> */}
      </Routes>
    </main>
  );
};

export default DoctorMainMenu;
