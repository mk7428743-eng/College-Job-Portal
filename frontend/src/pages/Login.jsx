import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, Briefcase, ChevronRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, register, error: authError, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect them to dashboard
    if (user) {
      redirectUser(user.role);
    }
  }, [user]);

  useEffect(() => {
    // Check if query param demands register page
    if (searchParams.get('register') === 'true') {
      setIsRegister(true);
    } else {
      setIsRegister(false);
    }
  }, [searchParams]);

  const redirectUser = (userRole) => {
    if (userRole === 'student') navigate('/student-dashboard');
    else if (userRole === 'recruiter') navigate('/recruiter-dashboard');
    else if (userRole === 'admin') navigate('/admin-dashboard');
    else navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    if (isRegister) {
      if (!name || !email || !password) {
        setFormError('Please fill in all fields');
        setLoading(false);
        return;
      }
      const res = await register(name, email, password, role);
      if (res.success) {
        // Redirect handled by useEffect [user]
      } else {
        setLoading(false);
      }
    } else {
      if (!email || !password) {
        setFormError('Please fill in all fields');
        setLoading(false);
        return;
      }
      const res = await login(email, password);
      if (res.success) {
        // Redirect handled by useEffect [user]
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center py-12 px-6 lg:px-8">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-2xl border border-gray-800">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="font-['Outfit'] text-3xl font-extrabold text-white">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {isRegister
                ? 'Register now to start applying or recruiting'
                : 'Enter your credentials to access your profile'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error alerts */}
            {(formError || authError) && (
              <div className="flex items-center gap-2 rounded-lg bg-red-950/30 border border-red-800/40 p-3.5 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError || authError}</span>
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-3 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-3 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-3 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Role Selection (Register only) */}
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold border transition-all ${
                      role === 'student'
                        ? 'border-indigo-500 bg-indigo-950/40 text-indigo-400 shadow-md'
                        : 'border-gray-800 bg-transparent text-gray-400 hover:bg-gray-900/50 hover:text-white'
                    }`}
                  >
                    <UserIcon className="h-4 w-4" />
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('recruiter')}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold border transition-all ${
                      role === 'recruiter'
                        ? 'border-indigo-500 bg-indigo-950/40 text-indigo-400 shadow-md'
                        : 'border-gray-800 bg-transparent text-gray-400 hover:bg-gray-900/50 hover:text-white'
                    }`}
                  >
                    <Briefcase className="h-4 w-4" />
                    Recruiter
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold disabled:opacity-50"
            >
              {loading ? 'Processing...' : isRegister ? 'Sign Up' : 'Sign In'}
              {!loading && <ChevronRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-6 text-center text-xs">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setFormError('');
              }}
              className="font-medium text-indigo-400 hover:underline"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
