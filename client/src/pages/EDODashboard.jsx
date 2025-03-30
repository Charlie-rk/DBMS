// src/pages/EDODashboard.jsx
import React from "react";
import EDOSidebar from "../components/EDOSidebar";
import EDOMainMenu from "../components/EDOMainMenu";

export default function EDODashboard() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      <EDOSidebar />
      <EDOMainMenu />
    </div>
  );
}
