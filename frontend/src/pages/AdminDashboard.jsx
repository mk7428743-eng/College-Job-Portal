import React, { useState, useEffect } from 'react';
import api from '../utils/apiInstance';
import { Shield, Users, Briefcase, FileSpreadsheet, Lock, Unlock, Search, TrendingUp, LayoutDashboard, Clock, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  
  // Filters for users list
  const [roleFilter, setRoleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('analytics'); // 'analytics' or 'users'
  const [msg, setMsg] = useState('');

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const params = {};
      if (roleFilter) params.role = roleFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await api.get('/admin/users', { params });
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await fetchAnalytics();
      await fetchUsers();
      setLoading(false);
    };
    initData();
  }, []);

  // Fetch users when filters change
  useEffect(() => {
    if (!loading) {
      fetchUsers();
    }
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleBlock = async (userId) => {
    setBlockLoading(true);
    try {
      const response = await api.put(`/admin/users/${userId}/block`);
      if (response.data.success) {
        // Update users state list
        setUsers(prev =>
          prev.map(u => (u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u))
        );
        // Refresh analytics dashboard
        fetchAnalytics();
        setMsg(response.data.message);
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
    } finally {
      setBlockLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p className="mt-4 text-sm text-gray-400">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 text-left flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-['Outfit'] text-3xl font-extrabold text-white flex items-center gap-2">
            <Shield className="h-8 w-8 text-indigo-500" /> Admin Operations Control
          </h1>
          <p className="text-sm text-gray-400">Monitor portal activity, view metrics analytics, and manage users.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 rounded-xl bg-gray-950/40 border border-gray-800 p-1">
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeSubTab === 'analytics'
                ? 'bg-indigo-950/50 text-indigo-400 border border-indigo-900/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" /> Metrics
          </button>
          <button
            onClick={() => setActiveSubTab('users')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeSubTab === 'users'
                ? 'bg-indigo-950/50 text-indigo-400 border border-indigo-900/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" /> User Base
          </button>
        </div>
      </div>

      {msg && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-indigo-950/30 border border-indigo-800/40 p-4 text-xs text-indigo-400 text-left">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {activeSubTab === 'analytics' ? (
        /* Analytics View */
        <div className="space-y-8 text-left">
          {/* Analytics Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass rounded-2xl p-6 border border-gray-800 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-950/50 border border-indigo-900 flex items-center justify-center text-indigo-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Students</p>
                <p className="font-['Outfit'] text-2xl font-black text-white mt-1">{analytics?.totalStudents || 0}</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-gray-800 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-950/50 border border-purple-900 flex items-center justify-center text-purple-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Recruiters</p>
                <p className="font-['Outfit'] text-2xl font-black text-white mt-1">{analytics?.totalRecruiters || 0}</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-gray-800 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-950/50 border border-blue-900 flex items-center justify-center text-blue-400">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active Jobs</p>
                <p className="font-['Outfit'] text-2xl font-black text-white mt-1">{analytics?.totalJobs || 0}</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-gray-800 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-950/50 border border-emerald-900 flex items-center justify-center text-emerald-400">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Applications</p>
                <p className="font-['Outfit'] text-2xl font-black text-white mt-1">{analytics?.totalApplications || 0}</p>
              </div>
            </div>
          </div>

          {/* Sub-analytics & Recents grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Applications status breakdown */}
            <div className="glass rounded-3xl p-6 border border-gray-800 flex flex-col justify-between">
              <div>
                <h3 className="font-['Outfit'] text-lg font-bold text-white mb-4">Application Funnel</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-gray-300 mb-1">
                      <span>Applied</span>
                      <span className="font-bold">{analytics?.statusCounts?.applied || 0}</span>
                    </div>
                    <div className="h-2 rounded bg-gray-950">
                      <div
                        className="h-2 rounded bg-blue-500"
                        style={{
                          width: `${
                            analytics?.totalApplications
                              ? ((analytics.statusCounts.applied || 0) / analytics.totalApplications) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-300 mb-1">
                      <span>Shortlisted</span>
                      <span className="font-bold">{analytics?.statusCounts?.shortlisted || 0}</span>
                    </div>
                    <div className="h-2 rounded bg-gray-950">
                      <div
                        className="h-2 rounded bg-yellow-500"
                        style={{
                          width: `${
                            analytics?.totalApplications
                              ? ((analytics.statusCounts.shortlisted || 0) / analytics.totalApplications) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-300 mb-1">
                      <span>Selected</span>
                      <span className="font-bold">{analytics?.statusCounts?.selected || 0}</span>
                    </div>
                    <div className="h-2 rounded bg-gray-950">
                      <div
                        className="h-2 rounded bg-emerald-500"
                        style={{
                          width: `${
                            analytics?.totalApplications
                              ? ((analytics.statusCounts.selected || 0) / analytics.totalApplications) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-300 mb-1">
                      <span>Rejected</span>
                      <span className="font-bold">{analytics?.statusCounts?.rejected || 0}</span>
                    </div>
                    <div className="h-2 rounded bg-gray-950">
                      <div
                        className="h-2 rounded bg-red-500"
                        style={{
                          width: `${
                            analytics?.totalApplications
                              ? ((analytics.statusCounts.rejected || 0) / analytics.totalApplications) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: Recent Jobs */}
            <div className="glass rounded-3xl p-6 border border-gray-800 space-y-4 lg:col-span-2">
              <h3 className="font-['Outfit'] text-lg font-bold text-white">Recent Job Postings</h3>
              <div className="divide-y divide-gray-800/80">
                {analytics?.recentJobs?.map((job) => (
                  <div key={job._id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white hover:text-indigo-400">
                        <a href={`/jobs/${job._id}`}>{job.title}</a>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{job.company?.name || 'Company Profile'}</p>
                    </div>
                    <span className="text-[10px] text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
                {(!analytics?.recentJobs || analytics.recentJobs.length === 0) && (
                  <p className="text-xs text-gray-500 py-6 text-center">No recent jobs available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Users Tab Control & View */
        <div className="space-y-6 text-left">
          {/* User Search & Filter */}
          <div className="glass rounded-2xl p-4 border border-gray-800 flex flex-wrap gap-4 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center max-w-md gap-3">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user name or email..."
                  className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="btn-gradient rounded-xl px-4 py-2 text-xs font-bold shadow-md"
              >
                Search
              </button>
            </form>

            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-xl border border-gray-800 bg-gray-950/40 py-2 px-3 text-xs text-gray-400 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>
          </div>

          {/* Users List Table */}
          <div className="glass rounded-3xl border border-gray-800 overflow-hidden">
            {usersLoading ? (
              <div className="py-20 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                <p className="mt-2 text-xs text-gray-400">Loading user database...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="py-20 text-center text-xs text-gray-500">No users found matching query</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-950/30 font-semibold text-gray-400">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Date Joined</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-900/20 transition-colors">
                        <td className="p-4 font-bold text-white">{user.name}</td>
                        <td className="p-4 text-gray-300">{user.email}</td>
                        <td className="p-4">
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                            user.role === 'recruiter'
                              ? 'bg-purple-950/35 border-purple-950 text-purple-400'
                              : 'bg-indigo-950/35 border-indigo-950 text-indigo-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-center">
                          {user.isBlocked ? (
                            <span className="inline-flex items-center gap-0.5 rounded bg-red-950/40 border border-red-900 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                              Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 rounded bg-emerald-950/40 border border-emerald-900 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleToggleBlock(user._id)}
                            disabled={blockLoading}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-bold border transition-all ${
                              user.isBlocked
                                ? 'bg-emerald-950/20 border-emerald-900/60 text-emerald-400 hover:bg-emerald-900 hover:text-white'
                                : 'bg-red-950/20 border-red-900/60 text-red-400 hover:bg-red-900 hover:text-white'
                            }`}
                          >
                            {user.isBlocked ? (
                              <>
                                <Unlock className="h-3 w-3" /> Unblock
                              </>
                            ) : (
                              <>
                                <Lock className="h-3 w-3" /> Block
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
