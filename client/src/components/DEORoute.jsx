/* eslint-disable no-unused-vars */
// DataEntryOperatorRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
// Assuming you have a corresponding dashboard component for Data Entry Operators
// import DataEntryOperatorDashboard from './DataEntryOperatorDashboard';
import EDODashboard from '../pages/EDODashboard';
export default function DEORoute() {
  const { currentUser } = useSelector((state) => state.user);
  
  // Check if the user is a Data Entry Operator
  if (!currentUser || currentUser.role !== "Data Entry Operator") {
    return <Navigate to="/sign-in" />;
  }
  
  return <EDODashboard />;
}
