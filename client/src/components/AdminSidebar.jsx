/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  X,
  Menu,
  Home,
  Inbox,
  Users,
  User,
  List,
  Calendar,
  ClipboardCheck,
  Building,
  FileText,
  DollarSign,
  Puzzle,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Link2,
  UserPlus,
} from "lucide-react";

// Define sidebar groups with items
const sidebarGroups = [
  {
    title: null, // no group title for the first group
    items: [
      { text: "Home", icon: <Home size={20} />, value: "Home" },
      { text: "Add User", icon: <UserPlus size={20} />, value: "Add User" },
    ],
  },
  {
    title: "Applications",
    items: [
      { text: "Doctors", icon: <Users size={20} />, value: "Doctors" },
      { text: "Patients", icon: <User size={20} />, value: "Patients" },
      { text: "Departments", icon: <List size={20} />, value: "Departments" },
      { text: "Schedule", icon: <Calendar size={20} />, value: "Schedule" },
      { text: "Appointment", icon: <ClipboardCheck size={20} />, value: "Appointment" },
      { text: "Report", icon: <FileText size={20} />, value: "Report" },
      { text: "Human Resources", icon: <Building size={20} />, value: "Human Resources" },
    ],
  },
  {
    title: "Others",
    items: [
      { text: "Payment", icon: <DollarSign size={20} />, value: "Payment" },
      { text: "Widgets", icon: <Puzzle size={20} />, value: "Widgets" },
    ],
  },
  {
    title: "Support",
    items: [
      { text: "Settings", icon: <Settings size={20} />, value: "Settings" },
      { text: "Security", icon: <Shield size={20} />, value: "Security" },
      { text: "Help", icon: <HelpCircle size={20} />, value: "Help" },
      { text: "Logout", icon: <LogOut size={20} />, value: "Logout" },
    ],
  },
];

const AdminSidebar = ({ currentTab, setCurrentTab }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div
      className={`flex flex-col text-blue-900 dark:text-blue-300 bg-sky-100 dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } hidden md:flex`}
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
          {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
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
            <div className="">
              {group.items.map((item, itemIndex) => {
                const isActive = currentTab === item.value;
                return (
                  <div
                    key={itemIndex}
                    onClick={() => setCurrentTab(item.value)}
                    className={`group relative flex items-center space-x-3 cursor-pointer p-2  ${
                      isActive
                        ? "bg-white dark:bg-sky-800  text-blue-900 dark:text-white font-semibold rounded-l-lg ml-2 shadow-2xl shadow-blue-600 dark:shadow-blue-800"
                        : "hover:bg-blue-300 dark:hover:bg-blue-800"
                    }`}
                  >
                    {item.icon}
                    {isOpen && <span>{item.text}</span>}
                    {!isOpen && (
                      <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 hidden group-hover:block bg-gray-800 dark:bg-gray-600 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                        {item.text}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
