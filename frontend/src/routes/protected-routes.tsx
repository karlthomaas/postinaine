import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const cookies = new Cookies();
  const isAuthenticated = cookies.get('is_authenticated');

  if (!isAuthenticated) {
    return <Navigate to='/login' replace={true} />;
  }

  return <>{children}</>;
};
