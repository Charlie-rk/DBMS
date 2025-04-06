/* eslint-disable no-unused-vars */
// FDORoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import FDODashboard from '../pages/FDODashboard';

export default function FDORoute() {
  const { currentUser } = useSelector((state) => state.user);

  // Check if the user is a Front Desk Operator
  if (!currentUser || currentUser.role !== "Front Desk Operator") {
    return <Navigate to="/sign-in" />;
  }
  
  return <FDODashboard />;
}
