import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/apiInstance';
import { Briefcase, MapPin, DollarSign, Calendar, Eye, Edit, Trash2, Users, FileText, CheckCircle, XCircle, AlertCircle, PlusCircle, Building } from 'lucide-react';

const RecruiterDashboard = () => {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs/recruiter');
      if (response.data.success) {
        setJobs(response.data.jobs);
        
        // If a jobId is specified in query parameters, auto-select it
        const qJobId = searchParams.get('jobId');
        if (qJobId) {
          const found = response.data.jobs.find(j => j._id === qJobId);
          if (found) {
            handleSelectJob(found);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching recruiter jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const handleSelectJob = async (job) => {
    setSelectedJob(job);
    setApplicantsLoading(true);
    setApplicants([]);
    try {
      const response = await api.get(`/applications/applicants/${job._id}`);
      if (response.data.success) {
        setApplicants(response.data.applications);
      }
    } catch (error) {
      console.error('Error fetching job applicants:', error);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    setActionLoading(true);
    try {
      const response = await api.put(`/applications/status/${applicationId}`, { status: newStatus });
      if (response.data.success) {
        // Update local state
        setApplicants(prev =>
          prev.map(app => (app._id === applicationId ? { ...app, status: newStatus } : app))
        );
        setMsg(`Applicant status updated to '${newStatus}'`);
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This action will also delete all associated applications.')) {
      return;
    }

    try {
      const response = await api.delete(`/jobs/${jobId}`);
      if (response.data.success) {
        setJobs(prev => prev.filter(j => j._id !== jobId));
        if (selectedJob && selectedJob._id === jobId) {
          setSelectedJob(null);
          setApplicants([]);
        }
        setMsg('Job posting deleted successfully');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'applied':
        return 'text-blue-400 bg-blue-950/40 border border-blue-900';
      case 'shortlisted':
        return 'text-yellow-400 bg-yellow-950/40 border border-yellow-900';
      case 'rejected':
        return 'text-red-400 bg-red-950/40 border border-red-900';
      case 'selected':
        return 'text-emerald-400 bg-emerald-950/40 border border-emerald-900';
      default:
        return 'text-gray-400 bg-gray-900 border border-gray-800';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 text-left">
        <div>
          <h1 className="font-['Outfit'] text-3xl font-extrabold text-white">Recruitment Board</h1>
          <p className="text-sm text-gray-400">Post job listings, manage applications, and shortlist candidates.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/companies"
            className="rounded-xl border border-gray-800 bg-[#111827]/50 px-4 py-2.5 text-xs font-bold text-gray-300 backdrop-blur-sm transition-all hover:bg-gray-850 hover:border-gray-750 flex items-center gap-1.5"
          >
            <Building className="h-4 w-4" /> Manage Company
          </Link>
          <Link
            to="/post-job"
            className="btn-gradient rounded-xl px-4 py-2.5 text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
          >
            <PlusCircle className="h-4 w-4" /> Post New Job
          </Link>
        </div>
      </div>

      {msg && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-indigo-950/30 border border-indigo-800/40 p-4 text-xs text-indigo-400 text-left">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="mt-4 text-sm text-gray-400">Loading your jobs dashboard...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Job Postings List */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-['Outfit'] text-lg font-bold text-white text-left flex items-center gap-1.5">
              <Briefcase className="h-5 w-5 text-indigo-400" /> Active Postings ({jobs.length})
            </h2>

            {jobs.length === 0 ? (
              <div className="glass rounded-2xl p-10 text-center border border-gray-800">
                <p className="text-sm text-gray-400 mb-4">You haven't posted any job openings yet.</p>
                <Link
                  to="/post-job"
                  className="btn-gradient inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold"
                >
                  Post First Job
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-2">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    onClick={() => handleSelectJob(job)}
                    className={`glass rounded-xl p-4 border transition-all cursor-pointer text-left ${
                      selectedJob?._id === job._id
                        ? 'border-indigo-500 bg-indigo-950/15 shadow-md shadow-indigo-500/5'
                        : 'border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-sm text-white line-clamp-1">{job.title}</h3>
                      <span className="rounded-full bg-gray-900 border border-gray-800 px-2 py-0.5 text-[9px] font-semibold text-gray-400 shrink-0">
                        {job.jobType}
                      </span>
                    </div>

                    <div className="text-[10px] text-gray-400 space-y-1">
                      <p className="font-medium text-gray-300">{job.company?.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {job.location}</span>
                        {job.salary && <span>• {job.salary}</span>}
                      </div>
                    </div>

                    {/* Actions bar */}
                    <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1 font-semibold text-[10px] text-indigo-400">
                        <Users className="h-3.5 w-3.5" /> {job.applicants?.length || 0} applicant(s)
                      </span>
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/post-job?edit=true&jobId=${job._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-white transition-colors"
                          title="Edit Job"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteJob(job._id);
                          }}
                          className="hover:text-red-400 transition-colors"
                          title="Delete Job"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Applicants List for Selected Job */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <h2 className="font-['Outfit'] text-lg font-bold text-white flex items-center gap-1.5">
              <Users className="h-5 w-5 text-purple-400" /> Candidate Management
            </h2>

            {!selectedJob ? (
              <div className="glass rounded-3xl p-12 border border-gray-800 text-center h-[350px] flex flex-col items-center justify-center">
                <Users className="h-12 w-12 text-gray-600 mb-3" />
                <h3 className="font-bold text-white font-['Outfit']">No job selected</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                  Select a job posting from the left pane to view and manage candidate applications.
                </p>
              </div>
            ) : applicantsLoading ? (
              <div className="glass rounded-3xl p-12 border border-gray-800 text-center h-[350px] flex flex-col items-center justify-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent mb-2" />
                <p className="text-xs text-gray-400">Loading applicants...</p>
              </div>
            ) : applicants.length === 0 ? (
              <div className="glass rounded-3xl p-12 border border-gray-800 text-center h-[350px] flex flex-col items-center justify-center">
                <Users className="h-10 w-10 text-gray-600 mb-3" />
                <h3 className="font-bold text-white font-['Outfit']">No Applicants Yet</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                  No students have applied for the "{selectedJob.title}" role yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                <div className="glass rounded-xl px-4 py-2 border border-gray-800 bg-gray-950/20 text-xs font-semibold text-gray-400">
                  Applicants for "{selectedJob.title}"
                </div>

                {applicants.map((app) => (
                  <div
                    key={app._id}
                    className="glass rounded-2xl p-5 border border-gray-800 space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap justify-between items-start gap-2 border-b border-gray-800 pb-3">
                      <div>
                        <h4 className="font-bold text-sm text-white">{app.student?.name}</h4>
                        <p className="text-[10px] text-gray-400">{app.student?.email}</p>
                      </div>

                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusStyle(app.status)}`}>
                        {app.status}
                      </span>
                    </div>

                    {/* Profile detail details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-gray-300">
                      {app.student?.profile?.department && (
                        <p><strong>Dept:</strong> {app.student.profile.department}</p>
                      )}
                      {app.student?.profile?.graduationYear && (
                        <p><strong>Graduation:</strong> {app.student.profile.graduationYear}</p>
                      )}
                      {app.student?.profile?.phone && (
                        <p><strong>Phone:</strong> {app.student.profile.phone}</p>
                      )}
                      {app.student?.profile?.resume && (
                        <div className="flex items-center gap-1">
                          <strong>Resume:</strong>
                          <a
                            href={`http://localhost:5000/uploads/resumes/${app.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:underline inline-flex items-center gap-0.5 font-bold"
                          >
                            <FileText className="h-3 w-3" /> View PDF
                          </a>
                        </div>
                      )}
                    </div>

                    {app.student?.profile?.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {app.student.profile.skills.map((skill, i) => (
                          <span key={i} className="rounded bg-gray-900 border border-gray-800 px-1.5 py-0.5 text-[9px] text-gray-400">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Status updater buttons */}
                    <div className="border-t border-gray-800/60 pt-3 flex flex-wrap justify-end gap-2">
                      <button
                        onClick={() => handleStatusChange(app._id, 'shortlisted')}
                        disabled={actionLoading || app.status === 'shortlisted'}
                        className="rounded-lg bg-yellow-950/20 border border-yellow-900/60 px-3 py-1.5 text-[10px] font-bold text-yellow-400 hover:bg-yellow-900 hover:text-white transition-all disabled:opacity-50 shrink-0"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleStatusChange(app._id, 'selected')}
                        disabled={actionLoading || app.status === 'selected'}
                        className="rounded-lg bg-emerald-950/20 border border-emerald-900/60 px-3 py-1.5 text-[10px] font-bold text-emerald-400 hover:bg-emerald-900 hover:text-white transition-all disabled:opacity-50 shrink-0"
                      >
                        Select
                      </button>
                      <button
                        onClick={() => handleStatusChange(app._id, 'rejected')}
                        disabled={actionLoading || app.status === 'rejected'}
                        className="rounded-lg bg-red-950/20 border border-red-900/60 px-3 py-1.5 text-[10px] font-bold text-red-400 hover:bg-red-900 hover:text-white transition-all disabled:opacity-50 shrink-0"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
