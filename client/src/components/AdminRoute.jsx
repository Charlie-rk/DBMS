/* eslint-disable no-unused-vars */
// AdminRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

export default function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);
  
  // Check if the user is an Admin
  if (!currentUser || currentUser.role !== "Admin") {
    return <Navigate to="/sign-in" />;
  }
  
  return <Dashboard />;
}
