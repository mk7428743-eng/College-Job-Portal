import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/apiInstance';
import { Search, MapPin, DollarSign, Calendar, Briefcase, ChevronRight, X } from 'lucide-react';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salary, setSalary] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;
      if (salary) params.salary = salary;

      const response = await api.get('/jobs', { params });
      if (response.data.success) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setJobType('');
    setSalary('');
    // Trigger fetch with empty values
    setTimeout(() => {
      fetchJobs();
    }, 0);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-10 text-left">
        <h1 className="font-['Outfit'] text-3xl font-extrabold text-white">Discover Careers</h1>
        <p className="text-sm text-gray-400">Search and apply for jobs posted by premier companies.</p>
      </div>

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} className="glass rounded-2xl p-6 border border-gray-800 mb-8 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Keyword Search */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Job title or keywords..."
              className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MapPin className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State or Remote..."
              className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Job Type Dropdown */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Briefcase className="h-4 w-4 text-gray-500" />
            </div>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          {/* Salary Search */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <DollarSign className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 100k or $45..."
              className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex items-center gap-1 rounded-xl border border-gray-800 px-4 py-2 text-xs font-semibold text-gray-400 transition-all hover:bg-gray-800 hover:text-white"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
          <button
            type="submit"
            className="btn-gradient rounded-xl px-5 py-2 text-xs font-bold shadow-md shadow-indigo-500/20"
          >
            Find Jobs
          </button>
        </div>
      </form>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass rounded-2xl p-6 border border-gray-800 h-64 animate-pulse">
              <div className="h-4 w-1/3 bg-gray-800 rounded mb-4" />
              <div className="h-8 w-3/4 bg-gray-700 rounded mb-6" />
              <div className="h-4 w-1/2 bg-gray-800 rounded mb-3" />
              <div className="h-4 w-2/3 bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-gray-800">
          <Briefcase className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-white font-['Outfit']">No jobs found</h3>
          <p className="text-sm text-gray-400 mt-1">Try modifying your search queries or filtering options.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="glass glass-hover flex flex-col justify-between rounded-2xl p-6 border border-gray-800 text-left"
            >
              <div>
                {/* Company & Type */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    {job.company?.name || 'Unknown Company'}
                  </span>
                  <span className="rounded-full bg-indigo-950/40 border border-indigo-900 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                    {job.jobType}
                  </span>
                </div>

                {/* Job Title */}
                <h3 className="font-['Outfit'] text-xl font-bold text-white mb-2 line-clamp-1 hover:text-indigo-400 transition-colors">
                  <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                </h3>

                {/* Requirements / Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {job.requirements.slice(0, 3).map((req, i) => (
                    <span
                      key={i}
                      className="rounded bg-gray-900 px-1.5 py-0.5 text-[9px] font-medium text-gray-400 border border-gray-800/80"
                    >
                      {req}
                    </span>
                  ))}
                  {job.requirements.length > 3 && (
                    <span className="text-[9px] font-medium text-gray-500 self-center">
                      +{job.requirements.length - 3} more
                    </span>
                  )}
                </div>

                {/* Description snippet */}
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-6">
                  {job.description}
                </p>
              </div>

              {/* Bottom stats & details button */}
              <div className="border-t border-gray-800 pt-4 flex items-center justify-between mt-auto">
                <div className="flex items-center space-x-3 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-purple-400" />
                    <span className="max-w-[80px] truncate">{job.location}</span>
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-0.5">
                      <DollarSign className="h-3 w-3 text-emerald-400" />
                      <span className="max-w-[80px] truncate">{job.salary}</span>
                    </span>
                  )}
                </div>

                <Link
                  to={`/jobs/${job._id}`}
                  className="flex items-center gap-0.5 rounded-lg bg-indigo-950/20 border border-indigo-900/60 px-3 py-1.5 text-xs font-bold text-indigo-400 transition-all hover:bg-indigo-900/50 hover:text-white"
                >
                  Details <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsList;
