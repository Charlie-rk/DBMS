/* eslint-disable no-unused-vars */
// DoctorRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import DoctorAppDashboard from '../pages/DoctorAppDashboard';

export default function DoctorRoute() {
  const { currentUser } = useSelector((state) => state.user);
  
  // Check if the user is a Doctor
  if (!currentUser || currentUser.role !== "Doctor") {
    return <Navigate to="/sign-in" />;
  }
  
  return <DoctorAppDashboard />;
}
