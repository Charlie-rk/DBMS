/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
import { HiMenu } from "react-icons/hi";

// Define doctor sidebar items with associated paths
const doctorSidebarItems = [
  { text: "Dashboard", path: "/doctor", icon: <LayoutGrid /> },
  { text: "Appointment", path: "/doctor/appoint", icon: <CalendarDays /> },
  { text: "Patients", path: "/doctor/patients", icon: <Users /> },
  { text: "Messages", path: "/doctor/messages", icon: <MessageCircle /> },
  { text: "Medications", path: "/doctor/medications", icon: <Pill /> },
  { text: "Documents", path: "/doctor/documents", icon: <FileText /> },
  { text: "Finances", path: "/doctor/finances", icon: <DollarSign /> },
  { text: "Settings", path: "/doctor/settings", icon: <Settings /> },
  { text: "Logout", path: "/doctor/logout", icon: <LogOut /> },
];

const SideBar_Doctor = () => {
  const [isOpen, setIsOpen] = useState(true); // Desktop Sidebar open/collapsed state
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile Sidebar overlay state
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  return (
    <div>
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden p-4 flex">
        <button
          onClick={toggleMobileSidebar}
          className="text-blue-600 dark:text-blue-400 font-semibold"
        >
          <span className="flex">
            <HiMenu size={24} />
            {mobileOpen ? "Close Menu" : " Menu"}
          </span>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`flex flex-col h-screen text-blue-900 dark:text-blue-300 bg-sky-100 dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } hidden md:flex`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Link2 size={24} />
            {isOpen && (
              <span className="text-xl font-semibold">Quick Links</span>
            )}
          </div>
          <button onClick={toggleSidebar} className="p-1 focus:outline-none">
            {!isOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <div className="mt-2 space-y-2">
            {doctorSidebarItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`group relative flex items-center space-x-3 p-2 cursor-pointer ${
                    isActive
                      ? "bg-white dark:bg-sky-700 text-blue-900 dark:text-white font-semibold rounded-l-lg ml-2 shadow-2xl shadow-blue-600 dark:shadow-sky-600"
                      : "hover:bg-blue-300 dark:hover:bg-blue-600"
                  }`}
                >
                  {item.icon}
                  {isOpen && <span>{item.text}</span>}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={toggleMobileSidebar}
          ></div>
          <div className="relative bg-white dark:bg-gray-800 w-64 p-4">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Link2 size={24} />
                <span className="text-xl font-semibold">Quick Links</span>
              </div>
              <button
                onClick={toggleMobileSidebar}
                className="p-1 focus:outline-none"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
            <nav className="mt-4">
              <div className="space-y-2">
                {doctorSidebarItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={toggleMobileSidebar}
                      className={`group relative flex items-center space-x-3 p-2 cursor-pointer ${
                        isActive
                          ? "bg-white dark:bg-sky-700 text-blue-900 dark:text-white font-semibold rounded-l-lg ml-2 shadow-2xl shadow-blue-600 dark:shadow-sky-600"
                          : "hover:bg-blue-300 dark:hover:bg-blue-600 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar_Doctor;
