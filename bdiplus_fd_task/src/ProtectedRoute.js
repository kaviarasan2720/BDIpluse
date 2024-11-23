import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children; // Render the protected component
};

export default ProtectedRoute;
