import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../utils/apiInstance';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, DollarSign, ListPlus, AlertCircle, CheckCircle, ChevronLeft, PlusCircle } from 'lucide-react';

const PostJob = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isEdit = searchParams.get('edit') === 'true';
  const jobId = searchParams.get('jobId');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [position, setPosition] = useState(1);
  const [companyId, setCompanyId] = useState('');
  
  // Recruiter companies state
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch recruiter companies
  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies/recruiter/me');
      if (response.data.success) {
        setCompanies(response.data.companies);
        if (response.data.companies.length > 0 && !companyId) {
          setCompanyId(response.data.companies[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching recruiter companies:', error);
    } finally {
      setCompaniesLoading(false);
    }
  };

  // Fetch job details for editing
  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      if (response.data.success) {
        const job = response.data.job;
        setTitle(job.title);
        setDescription(job.description);
        setRequirements(job.requirements?.join(', ') || '');
        setSalary(job.salary || '');
        setLocation(job.location);
        setJobType(job.jobType);
        setPosition(job.position || 1);
        setCompanyId(job.company?._id || job.company || '');
      }
    } catch (error) {
      console.error('Error fetching job details for edit:', error);
      setErrorMsg('Failed to load job details');
    }
  };

  useEffect(() => {
    if (user && user.role === 'recruiter') {
      fetchCompanies();
    }
  }, [user]);

  useEffect(() => {
    if (isEdit && jobId) {
      fetchJobDetails();
    }
  }, [isEdit, jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!companyId) {
      setErrorMsg('Please select or create a company profile first');
      setFormLoading(false);
      return;
    }

    const payload = {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      position: Number(position),
      company: companyId,
    };

    try {
      let response;
      if (isEdit && jobId) {
        response = await api.put(`/jobs/${jobId}`, payload);
      } else {
        response = await api.post('/jobs', payload);
      }

      if (response.data.success) {
        setSuccessMsg(isEdit ? 'Job updated successfully!' : 'Job posted successfully!');
        setTimeout(() => {
          navigate('/recruiter-dashboard');
        }, 1500);
      }
    } catch (error) {
      const data = error.response?.data;
      const msg = data?.message || data?.errors?.[0]?.message || 'Failed to submit job posting';
      setErrorMsg(msg);
    } finally {
      setFormLoading(false);
    }
  };

  if (companiesLoading) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p className="mt-4 text-sm text-gray-400">Verifying company profiles...</p>
      </div>
    );
  }

  // If recruiter has no company profiles created yet
  if (companies.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <div className="glass rounded-3xl p-8 border border-gray-800 space-y-6">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="font-['Outfit'] text-2xl font-extrabold text-white">Company Profile Required</h2>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            You must register a Company Profile before posting job opportunities so students know who is hiring.
          </p>
          <div className="pt-2">
            <Link
              to="/companies"
              className="btn-gradient inline-flex items-center gap-1.5 rounded-xl px-5 py-3 text-xs font-bold"
            >
              <PlusCircle className="h-4 w-4" /> Create Company Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link to="/recruiter-dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-white transition-colors mb-6">
        <ChevronLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="glass rounded-3xl p-8 border border-gray-800 text-left">
        <div className="mb-6">
          <h2 className="font-['Outfit'] text-2xl font-extrabold text-white">
            {isEdit ? 'Edit Job Posting' : 'Post a Job Opening'}
          </h2>
          <p className="text-xs text-gray-400">Fill in the fields below to advertise your role to students.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {successMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 p-4 text-xs text-emerald-400">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-red-950/30 border border-red-800/40 p-4 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Job Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Job Title
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Briefcase className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Hiring Company
              </label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 px-3.5 text-xs text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 px-3.5 text-xs text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Location
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Salary Package
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. $80,000 - $100,000"
                  className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Position count */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Available Openings
              </label>
              <input
                type="number"
                required
                min={1}
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="1"
                className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 px-3.5 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Requirements list */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Key Requirements (Comma separated)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <ListPlus className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="React, CSS, Node.js, 2+ Years Experience"
                className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Job Description
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the responsibilities, daily tasks, and overall details of this opportunity..."
              className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 px-3.5 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="border-t border-gray-800 pt-5 flex justify-end">
            <button
              type="submit"
              disabled={formLoading}
              className="btn-gradient rounded-xl px-6 py-2.5 text-xs font-bold shadow-md shadow-indigo-500/20"
            >
              {formLoading ? 'Submitting...' : isEdit ? 'Update Posting' : 'Publish Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
