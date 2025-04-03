// src/components/EDOSidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiHome,
  HiClipboardList,
  HiDocumentText,
  HiUpload,
  HiEye,
  HiChevronLeft,
  HiChevronRight,
  HiMenu,
} from "react-icons/hi";

import {ChevronLeft, Link2} from "lucide-react";

const sidebarGroups = [
  {
    title: null, // No title for the first group
    items: [
      { text: "Home", path: "/deo", icon: <HiHome size={20} /> },
    ],
  },
  {
    title: "Data Entry",
    items: [
      { text: "Test Entry", path: "/deo/test-entry", icon: <HiClipboardList size={20} /> },
      { text: "Treatment Entry", path: "/deo/treatment-entry", icon: <HiDocumentText size={20} /> },
    ],
  },
  {
    title: "Reports",
    items: [
      { text: "Upload Report", path: "/deo/upload-report", icon: <HiUpload size={20} /> },
      { text: "View Reports", path: "/deo/view-reports", icon: <HiEye size={20} /> },
    ],
  },
];

const EDOSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const toggleSidebar = () => setIsOpen(!isOpen);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  return (

    <>
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
   
    <aside
      className={`flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }text-blue-900 dark:text-blue-300 bg-sky-100 dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex`}
    >
      {/* Top Branding */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2">
          <Link2 size={24} />
          {isOpen && (
            <span className="text-xl font-semibold">Quick Links</span>
          )}
        </div>
        <button onClick={toggleSidebar} className="p-1 focus:outline-none">
          {isOpen ? <HiChevronLeft size={24} /> : <HiChevronRight size={24} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto">
        {sidebarGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mt-2">
            {isOpen && group.title && (
              <p className="px-4 pt-3 pb-1 text-sm font-semibold text-gray-400 uppercase">
                {group.title}
              </p>
            )}
            <div className="mt-2 space-y-2">
              {group.items.map((item, itemIndex) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={itemIndex}
                    to={item.path}
                    className={`group relative flex items-center gap-3 cursor-pointer p-2 ${
                      isActive
                        ? "bg-white dark:bg-sky-800 text-blue-900 dark:text-white font-semibold rounded-l-lg ml-2 shadow-2xl shadow-blue-600 dark:shadow-blue-800"
                        : "hover:bg-blue-300 dark:hover:bg-blue-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {item.icon}
                    {isOpen && <span>{item.text}</span>}
                    {!isOpen && (
                      <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 hidden group-hover:block bg-gray-800 dark:bg-gray-600 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                        {item.text}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
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
     </>
  );
};

export default EDOSidebar;
