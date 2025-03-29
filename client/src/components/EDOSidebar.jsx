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
} from "react-icons/hi";

import {Link2} from "lucide-react";

const sidebarGroups = [
  {
    title: null, // No title for the first group
    items: [
      { text: "Home", path: "/edo", icon: <HiHome size={20} /> },
    ],
  },
  {
    title: "Data Entry",
    items: [
      { text: "Test Entry", path: "/edo/test-entry", icon: <HiClipboardList size={20} /> },
      { text: "Treatment Entry", path: "/edo/treatment-entry", icon: <HiDocumentText size={20} /> },
    ],
  },
  {
    title: "Reports",
    items: [
      { text: "Upload Report", path: "/edo/upload-report", icon: <HiUpload size={20} /> },
      { text: "View Reports", path: "/edo/view-reports", icon: <HiEye size={20} /> },
    ],
  },
];

const EDOSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
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
  );
};

export default EDOSidebar;
