
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust path if needed

const PrivateRoute = ({ requiredRole }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;

  return <Outlet />;
};

export default PrivateRoute;
