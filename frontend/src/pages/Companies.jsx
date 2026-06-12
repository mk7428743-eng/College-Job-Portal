import React, { useState, useEffect } from 'react';
import api from '../utils/apiInstance';
import { useAuth } from '../context/AuthContext';
import { Building, Globe, MapPin, AlignLeft, CheckCircle, AlertCircle, PlusCircle, LayoutGrid } from 'lucide-react';

const Companies = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'create'

  // Creation form state
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await api.get('/companies');
      if (response.data.success) {
        setCompanies(response.data.companies);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await api.post('/companies', {
        name,
        website,
        location,
        description,
      });

      if (response.data.success) {
        setSuccessMsg(`Company '${name}' registered successfully!`);
        // Reset form
        setName('');
        setWebsite('');
        setLocation('');
        setDescription('');
        
        // Fetch fresh list and switch to browse
        await fetchCompanies();
        setTimeout(() => {
          setActiveTab('browse');
          setSuccessMsg('');
        }, 1500);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to register company profile';
      setErrorMsg(msg);
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Header */}
      <div className="mb-10 text-left flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-['Outfit'] text-3xl font-extrabold text-white">Companies Profiles</h1>
          <p className="text-sm text-gray-400">Browse corporate employers and create new organizational hubs.</p>
        </div>

        {/* Tab Buttons */}
        {user && user.role === 'recruiter' && (
          <div className="flex gap-2 rounded-xl bg-gray-950/40 border border-gray-800 p-1">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'browse'
                  ? 'bg-indigo-950/50 text-indigo-400 border border-indigo-900/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-4 w-4" /> Browse
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'create'
                  ? 'bg-indigo-950/50 text-indigo-400 border border-indigo-900/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <PlusCircle className="h-4 w-4" /> Add Company
            </button>
          </div>
        )}
      </div>

      {activeTab === 'browse' ? (
        <>
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
              <p className="mt-4 text-sm text-gray-400">Loading registered companies...</p>
            </div>
          ) : companies.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center border border-gray-800">
              <Building className="mx-auto h-12 w-12 text-gray-600 mb-4" />
              <h3 className="text-lg font-bold text-white font-['Outfit']">No companies registered</h3>
              <p className="text-sm text-gray-400 mt-1">There are no organizational profiles yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companies.map((c) => (
                <div key={c._id} className="glass glass-hover rounded-2xl p-6 border border-gray-800 text-left space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-['Outfit'] text-xl font-bold text-white">{c.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
                        {c.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-purple-400" /> {c.location}
                          </span>
                        )}
                        {c.website && (
                          <span className="flex items-center gap-1 text-indigo-400 hover:underline">
                            <Globe className="h-3.5 w-3.5" />
                            <a href={c.website} target="_blank" rel="noopener noreferrer">
                              Website
                            </a>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                    {c.description || 'No summary overview provided.'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Create Company Tab (Recruiters only) */
        <div className="mx-auto max-w-xl">
          <div className="glass rounded-3xl p-8 border border-gray-800 text-left">
            <div className="mb-6">
              <h2 className="font-['Outfit'] text-2xl font-extrabold text-white">Register a Company</h2>
              <p className="text-xs text-gray-400">Establish a corporate profile for your job advertisements.</p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-5">
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

              {/* Company Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Building className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Headquarters / Location
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
                      placeholder="e.g. San Jose, CA"
                      className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Website Address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Globe className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://acme.org"
                      className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Company Overview
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute pt-2.5 pl-3">
                    <AlignLeft className="h-4 w-4 text-gray-500" />
                  </div>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter an outline of the company, its sectors, products, and culture..."
                    className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="border-t border-gray-800 pt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="btn-gradient rounded-xl px-6 py-2.5 text-xs font-bold shadow-md shadow-indigo-500/20"
                >
                  {createLoading ? 'Registering...' : 'Register Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
