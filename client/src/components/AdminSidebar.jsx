/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
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
  MessageCircle,
} from "lucide-react";
import { HiMenu } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

// Define sidebar groups with items
const sidebarGroups = [
  {
    title: null, // no group title for the first group
    items: [
      { text: "Home",path:"/admin", icon: <Home size={20} />, value: "Home" },
      { text: "Add User",path:"/admin/add-user", icon: <UserPlus size={20} />, value: "Add User" },
    ],
  },
  {
    title: "Applications",
    items: [
      { text: "Doctors",path:"/admin/all-doctor", icon: <Users size={20} />, value: "Doctors" },
      { text: "Patients",path:"/admin/all-patient", icon: <User size={20} />, value: "Patients" },
      { text: "Departments",path:"/admin/all-department", icon: <List size={20} />, value: "Departments" },
      { text: "Messages",path:"/admin/message", icon: <MessageCircle  size={20} />, value: "Messages" },
      { text: "Front Desk Operators",path:"/admin/all-fdo", icon: <ClipboardCheck size={20} />, value: "Front Desk Operators" },
      { text: "Data Entry Operators",path:"/admin/all-edo", icon: <FileText size={20} />, value: "Entry Data Operators" },
      // { text: "Human Resources",path:"admin/all-patinet", icon: <Building size={20} />, value: "Human Resources" },
    ],
  },
  {
    title: "Others",
    items: [
      { text: "Payment",path:"admin/all-patinet" ,icon: <DollarSign size={20} />, value: "Payment" },
      { text: "Widgets",path:"admin/all-patinet" ,icon: <Puzzle size={20} />, value: "Widgets" },
    ],
  },
  {
    title: "Support",
    items: [
      { text: "Settings",path:"admin/all-patinet" ,icon: <Settings size={20} />, value: "Settings" },
      { text: "Security",path:"admin/all-patinet" ,icon: <Shield size={20} />, value: "Security" },
      { text: "Help",path:"admin/all-patinet" ,icon: <HelpCircle size={20} />, value: "Help" },
      { text: "Logout",path:"admin/all-patinet" ,icon: <LogOut size={20} />, value: "Logout" },
    ],
  },
];

const AdminSidebar = ({ }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const [mobileOpen, setMobileOpen] = useState(false); // For mobile overlay
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);
  // Effect to collapse the sidebar when the Messages tab is active
  useEffect(() => {
    if (location.pathname === "/admin/message") {
      setIsOpen(false);
    }
  }, [location]);

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
              {sidebarGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-4">
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

export default AdminSidebar;
