import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User as UserIcon, LogOut, LayoutDashboard, Search, PlusCircle, Building, Users } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0b0f19]/80 px-6 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-white">
          <Briefcase className="h-6 w-6 text-indigo-500" />
          <span className="text-gradient font-extrabold font-['Outfit']">EduCareer</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/jobs" className="flex items-center space-x-1 text-sm font-medium text-gray-300 transition-colors hover:text-white">
            <Search className="h-4 w-4" />
            <span>Browse Jobs</span>
          </Link>

          {user ? (
            <>
              {/* Role-specific Links */}
              {user.role === 'student' && (
                <Link to="/student-dashboard" className="flex items-center space-x-1 text-sm font-medium text-gray-300 transition-colors hover:text-white">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>My Applications</span>
                </Link>
              )}

              {user.role === 'recruiter' && (
                <>
                  <Link to="/recruiter-dashboard" className="flex items-center space-x-1 text-sm font-medium text-gray-300 transition-colors hover:text-white">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Recruiter Board</span>
                  </Link>
                  <Link to="/post-job" className="flex items-center space-x-1 text-sm font-medium text-gray-300 transition-colors hover:text-white">
                    <PlusCircle className="h-4 w-4" />
                    <span>Post Job</span>
                  </Link>
                  <Link to="/companies" className="flex items-center space-x-1 text-sm font-medium text-gray-300 transition-colors hover:text-white">
                    <Building className="h-4 w-4" />
                    <span>Companies</span>
                  </Link>
                </>
              )}

              {user.role === 'admin' && (
                <Link to="/admin-dashboard" className="flex items-center space-x-1 text-sm font-medium text-gray-300 transition-colors hover:text-white">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* Profile & Logout */}
              <div className="flex items-center space-x-4 border-l border-gray-800 pl-6">
                <Link to="/profile" className="flex items-center space-x-2 rounded-full bg-gray-900 px-3 py-1.5 text-sm font-medium border border-gray-800 text-gray-200 transition-all hover:bg-gray-800 hover:border-gray-700">
                  <UserIcon className="h-4 w-4 text-purple-400" />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  <span className="rounded-full bg-indigo-950 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 uppercase border border-indigo-900">
                    {user.role}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 rounded-md bg-transparent p-1.5 text-sm font-medium text-gray-400 transition-colors hover:bg-red-950/30 hover:text-red-400"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3 border-l border-gray-800 pl-6">
              <Link to="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/login?register=true" className="btn-gradient rounded-lg px-4 py-2 text-sm font-bold shadow-lg">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
