import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/apiInstance';
import { User as UserIcon, Mail, Phone, BookOpen, GraduationCap, Briefcase, FileText, CheckCircle, AlertCircle, Upload } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [department, setDepartment] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [phone, setPhone] = useState('');
  
  // Recruiter specific
  const [companyName, setCompanyName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companies, setCompanies] = useState([]);

  // File upload state
  const [resumeFile, setResumeFile] = useState(null);
  
  // Notice & loading state
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch list of companies for recruiter dropdown
  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      if (response.data.success) {
        setCompanies(response.data.companies);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.profile?.bio || '');
      setSkills(user.profile?.skills?.join(', ') || '');
      setDepartment(user.profile?.department || '');
      setGraduationYear(user.profile?.graduationYear || '');
      setPhone(user.profile?.phone || '');
      setCompanyName(user.profile?.companyName || '');
      setCompanyId(user.profile?.company?._id || user.profile?.company || '');

      if (user.role === 'recruiter') {
        fetchCompanies();
      }
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      setErrorMsg('Only PDF resumes are supported');
      setResumeFile(null);
    } else {
      setErrorMsg('');
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    formData.append('phone', phone);

    if (user.role === 'student') {
      formData.append('skills', skills);
      formData.append('department', department);
      if (graduationYear) formData.append('graduationYear', Number(graduationYear));
      
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }
    } else if (user.role === 'recruiter') {
      formData.append('companyName', companyName);
      formData.append('companyId', companyId);
    }

    const res = await updateProfile(formData);
    if (res.success) {
      setSuccessMsg('Profile updated successfully!');
      setResumeFile(null); // Reset file input
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setErrorMsg(res.message || 'Profile update failed');
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="text-gray-400">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 text-left">
        <h1 className="font-['Outfit'] text-3xl font-extrabold text-white">Profile Settings</h1>
        <p className="text-sm text-gray-400">Update your personal information and preferences.</p>
      </div>

      <div className="glass rounded-3xl p-8 border border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Role badge */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-indigo-950/50 border border-indigo-900 flex items-center justify-center text-indigo-400 font-bold">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">{name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            <span className="rounded-full bg-indigo-950 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-900 uppercase">
              {user.role}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-left">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-left">
                Phone Number
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="555-123-4567"
                  className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Student Specific Fields */}
            {user.role === 'student' && (
              <>
                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-left">
                    Department / Stream
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Computer Science"
                      className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Graduation Year */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-left">
                    Graduation Year
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <GraduationCap className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="number"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      placeholder="e.g. 2026"
                      className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Skills tags string */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-left">
                    Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Node.js, Express, MongoDB, JavaScript"
                    className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 px-3.5 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </>
            )}

            {/* Recruiter Specific Fields */}
            {user.role === 'recruiter' && (
              <>
                {/* Company Link / Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-left">
                    Associated Company Profile
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                    </div>
                    <select
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 pl-9 pr-3 text-xs text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select a Company Profile...</option>
                      {companies.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.name} ({company.location})
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1.5 text-left">
                    Don't see your company?{' '}
                    <span className="text-indigo-400 hover:underline">
                      <a href="/companies">Create a new company profile</a>
                    </span>
                  </p>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-left">
                    Display Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Google, Microsoft, etc."
                    className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 px-3.5 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </>
            )}

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-left">
                Biography / Profile Summary
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell recruiters about yourself..."
                className="block w-full rounded-xl border border-gray-800 bg-gray-950/40 py-2.5 px-3.5 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Student Resume Uploader */}
            {user.role === 'student' && (
              <div className="md:col-span-2 border-t border-gray-800/80 pt-6">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-left">
                  My Resume (PDF)
                </label>
                
                {user.profile?.resume ? (
                  <div className="flex items-center justify-between rounded-xl bg-indigo-950/20 border border-indigo-900/60 p-4 mb-4">
                    <div className="flex items-center space-x-3 text-left">
                      <FileText className="h-8 w-8 text-indigo-400 shrink-0" />
                      <div className="text-xs">
                        <p className="font-bold text-gray-200 truncate max-w-[200px] md:max-w-[400px]">
                          {user.profile.resumeOriginalName || user.profile.resume}
                        </p>
                        <a
                          href={`http://localhost:5000/uploads/resumes/${user.profile.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-indigo-400 hover:underline font-semibold mt-0.5 block"
                        >
                          View Uploaded Resume
                        </a>
                      </div>
                    </div>
                    <span className="text-[10px] bg-indigo-900/40 border border-indigo-800/50 px-2 py-0.5 rounded font-bold text-indigo-300">
                      Active
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 rounded-xl bg-yellow-950/20 border border-yellow-900/40 p-4 mb-4 text-left">
                    <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" />
                    <span className="text-xs text-yellow-400 font-medium">
                      No resume uploaded yet. Recruiters won't be able to review your details easily.
                    </span>
                  </div>
                )}

                {/* Upload replacement input */}
                <div className="relative flex items-center justify-center border border-dashed border-gray-800 rounded-2xl p-6 bg-gray-950/20 hover:border-gray-700 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                    <span className="text-xs font-semibold text-gray-400 block">
                      {resumeFile ? `Selected: ${resumeFile.name}` : 'Click to select and upload new PDF Resume'}
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-1">PDF format only, maximum size 5MB</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-800 pt-5 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient rounded-xl px-6 py-2.5 text-xs font-bold shadow-md shadow-indigo-500/20"
            >
              {loading ? 'Saving Changes...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
