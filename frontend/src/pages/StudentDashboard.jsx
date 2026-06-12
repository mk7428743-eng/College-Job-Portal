import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/apiInstance';
import { Briefcase, MapPin, DollarSign, Calendar, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react';

const StudentDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/applied');
      if (response.data.success) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'applied':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-950/40 border border-blue-900 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
            <Clock className="h-3.5 w-3.5" /> Applied
          </span>
        );
      case 'shortlisted':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-950/40 border border-yellow-900 px-2.5 py-0.5 text-xs font-semibold text-yellow-400">
            <AlertCircle className="h-3.5 w-3.5" /> Shortlisted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-950/40 border border-red-900 px-2.5 py-0.5 text-xs font-semibold text-red-400">
            <XCircle className="h-3.5 w-3.5" /> Rejected
          </span>
        );
      case 'selected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/40 border border-emerald-900 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            <CheckCircle className="h-3.5 w-3.5" /> Selected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 border border-gray-800 px-2.5 py-0.5 text-xs font-semibold text-gray-400">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p className="mt-4 text-sm text-gray-400">Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Header */}
      <div className="mb-10 text-left">
        <h1 className="font-['Outfit'] text-3xl font-extrabold text-white">My Applications</h1>
        <p className="text-sm text-gray-400">Track the status of all your submitted job applications.</p>
      </div>

      {applications.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center border border-gray-800">
          <Briefcase className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-white font-['Outfit']">No applications found</h3>
          <p className="text-sm text-gray-400 mt-1 mb-6">You haven't submitted any job applications yet.</p>
          <Link
            to="/jobs"
            className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold shadow-md"
          >
            Browse and Apply
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="glass rounded-2xl p-6 border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left"
            >
              {/* Job Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-['Outfit'] text-xl font-bold text-white hover:text-indigo-400 transition-colors">
                    {app.job ? (
                      <Link to={`/jobs/${app.job._id}`}>{app.job.title}</Link>
                    ) : (
                      <span className="text-gray-500 line-through">Deleted Job Posting</span>
                    )}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                  <span className="font-semibold text-gray-300">
                    {app.job?.company?.name || 'Company Profile Deleted'}
                  </span>
                  {app.job && (
                    <>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-purple-400" />
                        {app.job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-gray-800 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Status</p>
                  {getStatusBadge(app.status)}
                </div>

                {app.job && (
                  <Link
                    to={`/jobs/${app.job._id}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
