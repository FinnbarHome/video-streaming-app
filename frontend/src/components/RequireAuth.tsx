import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isSignedIn } from '../lib/auth';

const RequireAuth: React.FC = () => {
  const location = useLocation();

  if (!isSignedIn()) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
