/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminMenu from "../components/AdminMenu";
import AdminMainMenu from "../components/AdminMainMenu";

export default function Dashboard() {
  const [currentTab, setCurrentTab] = useState("Home");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      <AdminSidebar  />
      <AdminMainMenu />
    </div>
  );
}
