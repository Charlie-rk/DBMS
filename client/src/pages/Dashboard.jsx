import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminMenu from "../components/AdminMenu";

export default function Dashboard() {
  const [currentTab, setCurrentTab] = useState("Home");

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <AdminSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <AdminMenu currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
}
