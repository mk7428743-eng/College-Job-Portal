import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, ShieldCheck, Users, ArrowRight, TrendingUp, Compass, Award } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden py-16 px-6 sm:px-12 lg:px-8">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute bottom-10 right-10 -z-10 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-indigo-950/50 px-3 py-1 text-xs font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/30">
            Connecting Students with Future Careers
          </span>
          <h1 className="mt-6 font-['Outfit'] text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            Your Gateway to <br />
            <span className="text-gradient">Dream Opportunities</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            A comprehensive, premium campus recruitment portal linking students directly to top tier recruiters and companies. Build your profile, upload your resume, and get hired.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/jobs"
              className="btn-gradient flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold shadow-lg shadow-indigo-500/20"
            >
              Explore Jobs <ArrowRight className="h-5 w-5" />
            </Link>
            {!user && (
              <Link
                to="/login?register=true"
                className="rounded-xl border border-gray-800 bg-[#111827]/50 px-6 py-3.5 text-base font-bold text-gray-300 backdrop-blur-sm transition-all hover:bg-gray-800 hover:border-gray-700"
              >
                Create an Account
              </Link>
            )}
            {user && (
              <Link
                to={
                  user.role === 'student'
                    ? '/student-dashboard'
                    : user.role === 'recruiter'
                    ? '/recruiter-dashboard'
                    : '/admin-dashboard'
                }
                className="rounded-xl border border-gray-800 bg-[#111827]/50 px-6 py-3.5 text-base font-bold text-gray-300 backdrop-blur-sm transition-all hover:bg-gray-800 hover:border-gray-700"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mx-auto mt-24 max-w-5xl sm:mt-32">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {/* Feature 1 */}
            <div className="glass glass-hover rounded-2xl p-8 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-950/50 border border-purple-800/40 text-purple-400">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white font-['Outfit']">Tailored Roles</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Separate hubs tailored specifically for students, recruiters, and administrative managers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass glass-hover rounded-2xl p-8 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-950/50 border border-indigo-800/40 text-indigo-400">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white font-['Outfit']">Job Lifecycle</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Post jobs, apply, upload resumes, and track status updates in real-time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass glass-hover rounded-2xl p-8 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950/50 border border-emerald-800/40 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white font-['Outfit']">Management Control</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Robust admin controls to review, block/unblock accounts, delete jobs, and view database analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Stat section */}
        <div className="mt-20 border-t border-gray-800 pt-16">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-sm leading-6 text-gray-400">Student Signups</dt>
              <dd className="order-first text-4xl font-extrabold tracking-tight text-white font-['Outfit']">500+</dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-sm leading-6 text-gray-400">Verified Recruiters</dt>
              <dd className="order-first text-4xl font-extrabold tracking-tight text-purple-400 font-['Outfit']">40+</dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-sm leading-6 text-gray-400">Active Job Postings</dt>
              <dd className="order-first text-4xl font-extrabold tracking-tight text-indigo-400 font-['Outfit']">120+</dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-sm leading-6 text-gray-400">Job Placements</dt>
              <dd className="order-first text-4xl font-extrabold tracking-tight text-emerald-400 font-['Outfit']">85%</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Home;
