// src/components/EDOMainMenu.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import EDOHomePage from "../pages/EDOHomePage";
import TestDataEntryPage from "../pages/TestDataEntryPage";
import TreatmentDataEntryPage from "../pages/TreatmentDataEntryPage";
import UploadReportsPage from "../pages/UploadReportsPage";
import ViewReportsPage from "../pages/ViewReportsPage";
import Message from "../pages/Message"

const EDOMainMenu = () => {
  return (
    <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <Routes>
        <Route path="/" element={<EDOHomePage />} />
        <Route path="/test-entry" element={<TestDataEntryPage />} />
        <Route path="/treatment-entry" element={<TreatmentDataEntryPage />} />
        <Route path="/upload-report" element={<UploadReportsPage />} />
        <Route path="/view-reports" element={<ViewReportsPage />} />
        <Route path="/messages" element={<Message/>} />
      </Routes>
    </main>
  );
};

export default EDOMainMenu;
