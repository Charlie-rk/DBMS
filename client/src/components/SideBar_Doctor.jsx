/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  LayoutGrid,
  CalendarDays,
  Users,
  MessageCircle,
  Pill,
  FileText,
  DollarSign,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Link2,
} from "lucide-react";

// Sidebar menu items
const menuItems = [
  { icon: <LayoutGrid />, text: "Dashboard" },
  { icon: <CalendarDays />, text: "Appointment" },
  { icon: <Users />, text: "Patients" },
  { icon: <MessageCircle />, text: "Messages" },
  { icon: <Pill />, text: "Medications" },
  { icon: <FileText />, text: "Documents" },
  { icon: <DollarSign />, text: "Finances" },
  { icon: <Settings />, text: "Settings" },
  { icon: <LogOut />, text: "Logout" },
];

const Sidebar = ({ currentTab, setCurrentTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      className={`flex flex-col bg-sky-100 dark:bg-slate-800 text-blue-900 dark:text-blue-300 ${
        isCollapsed ? "w-20" : "w-64"
      } transition-all duration-300`}
    >
      <div className="flex justify-between items-center pl-2 pr-2 pt-4 pb-4">
        <div className="flex items-center space-x-2">
          <Link2 size={24} />
          {!isCollapsed && (
            <span className="text-xl font-semibold">Quick Links</span>
          )}
        </div>
        <button onClick={toggleSidebar} className="p-1 focus:outline-none">
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>
      <nav className="space-y-2 flex-1">
        {menuItems.map((item, index) => {
          const isActive = currentTab === item.text;
          return (
            <div
              key={index}
              onClick={() => setCurrentTab(item.text)}
              className={`group relative flex items-center space-x-3 p-2 cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-sky-800 text-blue-900 dark:text-white font-semibold rounded-l-lg ml-2 shadow-2xl shadow-blue-600 dark:shadow-blue-900"
                  : "hover:bg-blue-300 dark:hover:bg-blue-600"
              }`}
            >
              <div>{item.icon}</div>
              {!isCollapsed && <span>{item.text}</span>}
              {isCollapsed && (
                <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 hidden group-hover:block bg-gray-800 dark:bg-gray-600 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                  {item.text}
                </span>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
