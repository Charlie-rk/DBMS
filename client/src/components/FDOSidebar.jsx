/* eslint-disable no-unused-vars */
// src/components/FDOSidebar.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiHome,
  HiUserAdd,
  HiCalendar,
  HiPlusCircle,
  HiCheckCircle,
  HiCurrencyDollar,
  HiPuzzle,
  HiCog,
  HiShieldCheck,
  HiQuestionMarkCircle,
  HiLogout,
  HiMenu,
} from "react-icons/hi";
import { ChevronLeft, ChevronRight, Link2, MessageCircle } from "lucide-react";

// Define sidebar groups with their menu items
const sidebarGroups = [
  {
    title: null, // No title for first group
    items: [
      { text: "Home", path: "/fdo", icon: <HiHome /> },
      { text: "Registration", path: "/fdo/register", icon: <HiUserAdd /> },
      { text: "Appointment", path: "/fdo/appointment", icon: <HiCalendar /> },
      { text: "Admission", path: "/fdo/admission", icon: <HiPlusCircle /> },
      { text: "Discharge", path: "/fdo/discharge", icon: <HiCheckCircle /> },
      { text: "Appointment Status", path: "/fdo/status", icon: <HiPuzzle /> },
    ],
  },
  {
    title: "Others",
    items: [
      { text: "Messages", path: "/fdo/messages", icon: <MessageCircle /> },
     
    ],
  },
  {
    title: "Support",
    items: [
      { text: "Settings", path: "/fdo/settings", icon: <HiCog /> },
      { text: "Security", path: "/fdo/security", icon: <HiShieldCheck /> },
      { text: "Help", path: "/fdo/help", icon: <HiQuestionMarkCircle /> },
      { text: "Logout", path: "/fdo/logout", icon: <HiLogout /> },
    ],
  },
];

const FDOSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

   useEffect(() => {
      if (location.pathname === "/fdo/messages") {
        setIsOpen(false);
      }
    }, [location]);

  return (

    <div className="">
          {/* Mobile Sidebar Toggle Button */}
     <div className="md:hidden p-4 flex ">
        <button
          onClick={toggleMobileSidebar}
          className="text-blue-600 dark:text-blue-400 font-semibold"
        >
          <span className="flex ">
          <HiMenu size={24} />
          {mobileOpen ? "Close Menu" : " Menu"}
          </span>
        </button>
       
      </div>
    
     {/* Desktop Sidebar */}
     <div
  className={`flex flex-col h-full text-blue-900 dark:text-blue-300 bg-sky-100 dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
    isOpen ? "w-64" : "w-20"
  } hidden md:flex `}
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
        {sidebarGroups.map((group, index) => (
          <div key={index}>
            {isOpen && group.title && (
              <p className="px-4 pt-3 pb-1 text-sm font-semibold text-gray-400 uppercase">
                {group.title}
              </p>
            )}
            <div className="mt-2 space-y-2">
              {group.items.map((item, i) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={i}
                    to={item.path}
                    className={`group relative flex items-center space-x-3 p-2 cursor-pointer ${
                      isActive
                        ? "bg-white dark:bg-sky-700 text-blue-900 dark:text-white font-semibold rounded-l-lg ml-2 shadow-2xl shadow-blue-600 dark:shadow-sky-600 "
                        : "hover:bg-blue-300 dark:hover:bg-blue-600"
                    }`}
                  >
                    {item.icon}
                    {isOpen && item.text}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
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
              <button onClick={toggleMobileSidebar} className="p-1 focus:outline-none">
                <ChevronLeft size={24} />
              </button>
            </div>
            <nav className="mt-4">
              {sidebarGroups.map((group, index) => (
                <div key={index} className="mb-4">
                  {group.title && (
                    <p className="px-4 pt-3 pb-1 text-sm font-semibold text-gray-400 uppercase">
                      {group.title}
                    </p>
                  )}
                  <div className="mt-2 space-y-2">
                    {group.items.map((item, i) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={i}
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
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default FDOSidebar;
