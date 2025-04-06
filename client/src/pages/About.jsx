/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */

import React from "react";
import { Card } from "flowbite-react";
import { HeartPulse } from "lucide-react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function About() {
  const { theme } = useSelector((state) => state.theme);
  const notify = () => toast.success("Project Loaded Successfully!");

  return (
    <div className="overflow-x-hidden min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-6">
      <Card className="max-w-3xl w-full p-8 shadow-2xl shadow-slate-700 dark:shadow-slate-700">
        <div className="flex flex-col items-center justify-center">
          {/* Decorative Icon */}
          <HeartPulse size={48} className="text-blue-500 mb-4" />
          {/* Project Name and Tagline */}
          <h1 className="text-3xl font-semibold text-center my-4 font-serif">
            We ~ Go <hr className="my-2 border-t-2 border-blue-500" />
          </h1>
          <p className="text-2xl font-semibold font-serif text-center mb-6">
            "Where Compassion Meets Innovation"
          </p>
          {/* Main Description */}
          <div className="text-md text-gray-500 dark:text-gray-300 font-serif text-center space-y-6">
            <p>
              Welcome to the WE ~ Go Hospital Management System! This innovative healthcare solution was developed by Rustam Kumar, Sangam Kumar Mishra, Parth Dodiya, Utkarsh Singh, and Devanshu Dangi. Our system streamlines patient registration, appointment scheduling, admissions, discharges, and comprehensive data management.
            </p>
            <p className={`text-xl ${theme === "light" ? "text-black" : "text-white"} font-semibold`}>
              Our mission is to empower healthcare professionals with advanced technology, ensuring efficient and compassionate patient care for all. We are committed to transforming hospital operations and making quality healthcare accessible.
            </p>
          </div>
          {/* Footer Quote */}
          <Card className="mt-4 bg-slate-200 shadow-xl shadow-slate-600 dark:shadow-slate-700">
          <p className="mt- text-xl text-slate-800 dark:text-slate-300 font-serif text-center ">
            We urge all users to utilize this system responsibly, ensuring that every action contributes to improved healthcare for our community. Together, let's build a future where efficient and compassionate care is accessible to all.
          </p>
          </Card>
        </div>
      </Card>
      <ToastContainer />
    </div>
  );
}
