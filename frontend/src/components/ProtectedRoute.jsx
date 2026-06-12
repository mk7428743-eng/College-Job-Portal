import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    // Save the current path to redirect after login
    return <Navigate to="/login" replace />;
  }

  if (user.isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="glass rounded-3xl p-8 border border-gray-800 max-w-md">
          <h2 className="text-xl font-bold text-red-500 font-['Outfit'] mb-2">Account Blocked</h2>
          <p className="text-sm text-gray-400">Your account has been deactivated by the system administrator.</p>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
