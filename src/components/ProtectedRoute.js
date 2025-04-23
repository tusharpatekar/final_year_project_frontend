import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true'; // Check login state
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
