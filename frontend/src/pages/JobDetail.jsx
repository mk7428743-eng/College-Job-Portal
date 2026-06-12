import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/apiInstance';
import { Briefcase, MapPin, DollarSign, Calendar, FileText, CheckCircle, AlertCircle, X, ChevronLeft, Upload } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  
  // Application modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      if (response.data.success) {
        const jobData = response.data.job;
        setJob(jobData);
        
        // Check if current user has already applied
        if (user && user.role === 'student' && jobData.applicants) {
          const applied = jobData.applicants.includes(user._id);
          setHasApplied(applied);
        }
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id, user]);

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      setModalError('Only PDF files are allowed');
      setSelectedFile(null);
    } else {
      setModalError('');
      setSelectedFile(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setModalError('');

    const formData = new FormData();

    // If uploading a new resume
    if (!useProfileResume) {
      if (!selectedFile) {
        setModalError('Please choose a PDF resume file to upload');
        setSubmitLoading(false);
        return;
      }
      formData.append('resume', selectedFile);
    } else {
      // Use profile resume
      if (!user?.profile?.resume) {
        setModalError('No resume exists on your profile. Please upload a file instead.');
        setSubmitLoading(false);
        return;
      }
    }

    try {
      const response = await api.post(`/applications/apply/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccessMsg('Your application has been submitted successfully!');
        setHasApplied(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg('');
          fetchJobDetails(); // Reload job applicants count
        }, 2000);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit application';
      setModalError(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p className="mt-4 text-sm text-gray-400">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center glass rounded-2xl border border-gray-800">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white font-['Outfit']">Job Not Found</h2>
        <p className="text-sm text-gray-400 mt-2">The job posting you are looking for does not exist or has been deleted.</p>
        <Link to="/jobs" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-indigo-400 hover:underline">
          <ChevronLeft className="h-4 w-4" /> Back to listings
        </Link>
      </div>
    );
  }

  const isOwner = user && user.role === 'recruiter' && job.recruiter?._id === user._id;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Back Link */}
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-white transition-colors mb-6">
        <ChevronLeft className="h-4 w-4" /> Back to Browse
      </Link>

      {/* Main card */}
      <div className="glass rounded-3xl p-8 border border-gray-800 text-left">
        {/* Company Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
              {job.company?.name || 'Unknown Company'}
            </span>
            <h1 className="font-['Outfit'] text-3xl font-extrabold text-white sm:text-4xl">{job.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5 rounded-full bg-gray-900 border border-gray-800 px-3 py-1 font-medium">
                <MapPin className="h-3.5 w-3.5 text-purple-400" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-gray-900 border border-gray-800 px-3 py-1 font-medium">
                <Briefcase className="h-3.5 w-3.5 text-indigo-400" />
                {job.jobType}
              </span>
              {job.salary && (
                <span className="flex items-center gap-1.5 rounded-full bg-gray-900 border border-gray-800 px-3 py-1 font-medium text-emerald-400">
                  <DollarSign className="h-3.5 w-3.5" />
                  {job.salary}
                </span>
              )}
            </div>
          </div>

          <div>
            {hasApplied ? (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-950/40 border border-emerald-900 px-5 py-3 text-sm font-bold text-emerald-400">
                <CheckCircle className="h-5 w-5" /> Applied
              </span>
            ) : user && user.role === 'recruiter' ? (
              isOwner ? (
                <Link
                  to={`/recruiter-dashboard?jobId=${job._id}`}
                  className="btn-gradient inline-flex rounded-xl px-5 py-3 text-sm font-bold shadow-lg"
                >
                  View Applicants ({job.applicants?.length || 0})
                </Link>
              ) : (
                <span className="text-xs font-semibold text-gray-500 italic">Recruiter view</span>
              )
            ) : user && user.role === 'admin' ? (
              <span className="text-xs font-semibold text-gray-500 italic">Admin view</span>
            ) : (
              <button
                onClick={handleApplyClick}
                className="btn-gradient rounded-xl px-6 py-3 text-sm font-bold shadow-lg shadow-indigo-500/20"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-b border-gray-800">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="font-['Outfit'] text-lg font-bold text-white mb-3">Job Description</h3>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            <div>
              <h3 className="font-['Outfit'] text-lg font-bold text-white mb-3">Requirements</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                {job.requirements.map((req, i) => (
                  <li key={i} className="leading-relaxed pl-1">
                    <span className="text-gray-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-gray-950/30 border border-gray-800 p-5 space-y-4">
              <h4 className="font-['Outfit'] text-sm font-bold text-white border-b border-gray-800 pb-2">Overview</h4>
              <div className="text-xs space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Date Posted</span>
                  <span className="text-gray-200">{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Open Positions</span>
                  <span className="text-gray-200">{job.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Applicants</span>
                  <span className="text-gray-200">{job.applicants?.length || 0}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-950/30 border border-gray-800 p-5 space-y-4">
              <h4 className="font-['Outfit'] text-sm font-bold text-white border-b border-gray-800 pb-2">Recruiter Info</h4>
              <div className="text-xs space-y-1 text-gray-300">
                <p className="font-bold text-white">{job.recruiter?.name}</p>
                <p className="text-gray-400">{job.recruiter?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Company profile block */}
        {job.company && (
          <div className="pt-8">
            <h3 className="font-['Outfit'] text-lg font-bold text-white mb-4">About {job.company.name}</h3>
            <div className="rounded-2xl border border-gray-800/60 bg-gray-950/20 p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3 text-left">
                <p className="text-xs text-gray-300 leading-relaxed">
                  {job.company.description || 'No description provided by the company.'}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs pt-2">
                  {job.company.location && (
                    <span className="text-gray-400">
                      <strong>Location:</strong> {job.company.location}
                    </span>
                  )}
                  {job.company.website && (
                    <span className="text-indigo-400 hover:underline">
                      <a href={job.company.website} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </a>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-lg rounded-3xl border border-gray-800 p-6 text-left shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-5">
              <h2 className="font-['Outfit'] text-xl font-bold text-white">Apply for {job.title}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {successMsg ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle className="mx-auto h-12 w-12 text-emerald-400 animate-bounce" />
                <p className="text-sm font-semibold text-emerald-400">{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                {modalError && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-950/30 border border-red-800/40 p-3 text-xs text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                {/* Option to use Profile Resume vs Upload New */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Resume Selection
                  </label>
                  <div className="space-y-2.5">
                    {/* Option 1: Profile Resume */}
                    <label className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                      useProfileResume
                        ? 'border-indigo-500 bg-indigo-950/20 text-white'
                        : 'border-gray-800 bg-transparent text-gray-400 hover:bg-gray-900/40'
                    }`}>
                      <input
                        type="radio"
                        name="resumeChoice"
                        checked={useProfileResume}
                        onChange={() => {
                          setUseProfileResume(true);
                          setModalError('');
                        }}
                        className="mt-0.5 accent-indigo-500"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-gray-200">Use Profile Resume</p>
                        {user?.profile?.resume ? (
                          <span className="text-[10px] text-indigo-400 block mt-0.5 font-medium truncate max-w-[280px]">
                            {user.profile.resumeOriginalName || user.profile.resume}
                          </span>
                        ) : (
                          <span className="text-[10px] text-yellow-500 block mt-0.5 font-medium">
                            No resume uploaded to your profile yet
                          </span>
                        )}
                      </div>
                    </label>

                    {/* Option 2: Upload New Resume */}
                    <label className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                      !useProfileResume
                        ? 'border-indigo-500 bg-indigo-950/20 text-white'
                        : 'border-gray-800 bg-transparent text-gray-400 hover:bg-gray-900/40'
                    }`}>
                      <input
                        type="radio"
                        name="resumeChoice"
                        checked={!useProfileResume}
                        onChange={() => {
                          setUseProfileResume(false);
                          setModalError('');
                        }}
                        className="mt-0.5 accent-indigo-500"
                      />
                      <div className="text-xs w-full">
                        <p className="font-bold text-gray-200">Upload a New PDF Resume</p>
                        <p className="text-[10px] text-gray-500 block mt-0.5">Will also set this as your default profile resume.</p>

                        {!useProfileResume && (
                          <div className="mt-3 relative flex items-center justify-center border border-dashed border-gray-800 rounded-lg p-4 bg-gray-950/20 hover:border-gray-700 transition-colors">
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={handleFileChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="text-center">
                              <Upload className="mx-auto h-5 w-5 text-gray-500 mb-1" />
                              <span className="text-[11px] text-gray-400">
                                {selectedFile ? selectedFile.name : 'Click to browse PDF (max 5MB)'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-gray-800 px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="btn-gradient rounded-xl px-5 py-2.5 text-xs font-bold shadow-md disabled:opacity-50"
                  >
                    {submitLoading ? 'Applying...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
