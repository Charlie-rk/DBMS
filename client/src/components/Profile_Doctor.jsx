/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { useSelector } from "react-redux";

const Profile_Doctor = ({
  bookedAppointments,
  maxAppointments,
  maleCount,      // new
  femaleCount,    // new
}) => {
  const { currentUser } = useSelector((state) => state.user);

  // Compute gender percentages
  const totalGender = maleCount + femaleCount;
  const malePercent = totalGender
    ? Math.round((maleCount / totalGender) * 100)
    : 0;
  const femalePercent = totalGender
    ? 100 - malePercent
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center h-full">
      <img
        src={currentUser?.profile_picture || "https://via.placeholder.com/150"}
        alt={`Dr. ${currentUser?.name || "Doctor"}`}
        className="rounded-full mx-auto mb-4 h-24 w-24 shadow-2xl shadow-blue-400 dark:shadow-blue-900"
      />
      <h3 className="font-bold text-gray-800 dark:text-gray-200">
        Dr. {currentUser?.name || "Doctor"}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 p-1 bg-blue-200 dark:bg-blue-900 rounded-lg">
        {currentUser?.specialisation || "Specialisation"} - {currentUser?.department || "Department"}
      </p>

      {/* Appointment limit section */}
      <div className="mt-4 bg-slate-200 dark:bg-slate-700 p-2 rounded">
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-700 dark:text-gray-300">Appointments</span>
          <span className="text-gray-800 dark:text-gray-200 font-bold">
            {bookedAppointments} / {maxAppointments}
          </span>
        </div>
        <div className="w-full bg-gray-300 dark:bg-gray-600 h-2 rounded-full">
          <div
            className="bg-blue-400 dark:bg-blue-500 h-2 rounded-full"
            style={{
              width: `${(bookedAppointments / maxAppointments) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Patients by Gender */}
      <div className="mt-4">
        <h4 className="text-sm text-gray-800 dark:text-gray-200 mb-2">
          Patients by Gender
        </h4>
        <div className="flex justify-around">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 2h3m0 0v3m0-3l-4 4m-4 2a5 5 0 11-4 8.06m8-8.06a5 5 0 018 4"
                />
              </svg>
              <span className="font-bold text-gray-700 dark:text-gray-300">
                {malePercent}%
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Male Patients
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-pink-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14l9-9m-9 9L3 5m9 9v5m0 0h3m-3 0H9"
                />
              </svg>
              <span className="font-bold text-gray-700 dark:text-gray-300">
                {femalePercent}%
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Female Patients
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile_Doctor;
