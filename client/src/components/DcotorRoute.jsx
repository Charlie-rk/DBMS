/* eslint-disable no-unused-vars */
// DoctorRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
// import DoctorAppDashboard from '../pages/DoctorAppDashboard';
import DoctorDashboard from '../pages/DoctorDashboard';

export default function DoctorRoute() {
  const { currentUser } = useSelector((state) => state.user);
  
  // Check if the user is a Doctor
  if (!currentUser || currentUser.role !== "doctor") {
    return <Navigate to="/sign-in" />;
  }
  
  return <DoctorDashboard />;
}
