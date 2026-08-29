import React, { useState } from 'react';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  institution: string;
  specialty: string;
  licenseNumber: string;
  quantumSimulationAccess: boolean;
  twoFactorEnabled: boolean;
}

interface Props {
  user: { name: string; email: string; role: string } | null;
  onUpdateUser: (updated: { name: string; email: string; role: string }) => void;
  onBackToDashboard: () => void;
}

export default function ProfilePage({ user, onUpdateUser, onBackToDashboard }: Props) {
  const isAdmin = user?.email?.toLowerCase().trim() === 'napagunasaisujith@gmail.com';

  const defaultUsers = [
    { id: 2, name: 'Dr. Alex Vance', email: 'a.vance@precisionmed.io', role: 'Genomic Researcher', isApproved: false, submittedAt: '10 mins ago' },
    { id: 3, name: 'Elena Rostova', email: 'e.rostova@trials.net', role: 'Clinical Trial Investigator', isApproved: false, submittedAt: '35 mins ago' },
    { id: 4, name: 'Dr. Marcus Vance', email: 'm.vance@hospital.org', role: 'Medical Oncologist', isApproved: false, submittedAt: '2 hours ago' },
  ];

  const loadAllUsers = () => {
    const saved = JSON.parse(localStorage.getItem('quantum_registered_users') || '[]');
    // Combine saved new registrations with default users (filtering out duplicates by email)
    const combined = [...saved];
    for (const du of defaultUsers) {
      if (!combined.some(u => u.email.toLowerCase() === du.email.toLowerCase())) {
        combined.push(du);
      }
    }
    return combined;
  };

  const [pendingUsers, setPendingUsers] = useState(loadAllUsers);

  // Auto updation effect to dynamically reflect new registrations in real time
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPendingUsers(loadAllUsers());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || (isAdmin ? 'System Admin (Saisujith)' : 'Dr. Sarah Jenkins'),
    email: user?.email || (isAdmin ? 'napagunasaisujith@gmail.com' : 's.jenkins@oncology.org'),
    role: user?.role || (isAdmin ? 'System Administrator' : 'Medical Oncologist'),
    institution: isAdmin ? 'Antigravity Quantum Center' : 'Memorial Precision Cancer Center',
    specialty: isAdmin ? 'Platform Architecture & Security' : 'Thoracic & Precision Oncology',
    licenseNumber: isAdmin ? 'ADM-9901-SAISUJITH' : 'MD-892014-NY',
    quantumSimulationAccess: true,
    twoFactorEnabled: true,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'approval' | 'activity'>(isAdmin ? 'approval' : 'profile');

  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const saveUsersToStorage = (updatedList: any[]) => {
    setPendingUsers(updatedList);
    const saved = updatedList.filter(u => !defaultUsers.some(du => du.id === u.id));
    localStorage.setItem('quantum_registered_users', JSON.stringify(saved));
  };

  const toggleUserApproval = (id: number) => {
    const updated = pendingUsers.map(u => u.id === id ? { ...u, isApproved: !u.isApproved } : u);
    saveUsersToStorage(updated);
  };

  const updateUserData = (id: number, data: Partial<{ name: string; email: string; role: string }>) => {
    const updated = pendingUsers.map(u => u.id === id ? { ...u, ...data } : u);
    saveUsersToStorage(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: profile.name,
      email: profile.email,
      role: profile.role,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-900 border border-white/10 px-3 py-1.5 rounded-xl"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-mono">
              {isAdmin ? 'System Administrator Verified' : 'Profile Verified'}
            </span>
          </div>
        </div>

        {/* Profile Card Header */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/30">
              {profile.name.charAt(0)}
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{profile.name}</h1>
                {isAdmin && (
                  <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase rounded">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-400 font-medium">{profile.role} • {profile.specialty}</p>
              <p className="text-xs text-slate-400">{profile.institution}</p>
            </div>

            <div className="sm:ml-auto flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono rounded-lg">
                License: {profile.licenseNumber}
              </span>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex gap-2 mt-6 border-t border-white/10 pt-4 overflow-x-auto">
            {isAdmin && (
              <button
                onClick={() => setActiveTab('approval')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'approval' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                User Approvals ({pendingUsers.filter(u => !u.isApproved).length} Pending)
              </button>
            )}

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'profile' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Account Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'security' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Security & Credentials
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'activity' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Recent Audit Logs
            </button>
          </div>
        </div>

        {/* Tab 1: User Approval Management Console */}
        {activeTab === 'approval' && isAdmin && (
          <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-6 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  User Approval Management Console
                </h2>
                <p className="text-xs text-slate-400">Approve or revoke access requests for researchers and clinical staff</p>
              </div>
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono rounded-lg">
                Admin Control Active
              </span>
            </div>

            <div className="space-y-3">
              {pendingUsers.map((u) => (
                <div
                  key={u.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-4 ${
                    u.isApproved
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-slate-800/40 border-white/5'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-white">{u.name}</span>
                        <span className="text-xs text-indigo-400 font-medium">• {u.role}</span>
                        {(u as any).docId && (
                          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold rounded">
                            {(u as any).docId}
                          </span>
                        )}
                        {(u as any).govtLicenseId && (
                          <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono rounded">
                            Govt Lic: {(u as any).govtLicenseId}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span>Email: <strong className="text-slate-300 font-mono">{u.email}</strong></span>
                        {(u as any).hospitalName && <span>Hospital: <strong className="text-slate-300">{(u as any).hospitalName}</strong></span>}
                        {(u as any).degree && <span>Degree: <strong className="text-slate-300">{(u as any).degree}</strong></span>}
                        {(u as any).experienceYears && <span>Exp: <strong className="text-indigo-400">{(u as any).experienceYears} Years</strong></span>}
                      </div>
                      <p className="text-[10px] text-slate-500">Submitted: {u.submittedAt}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingUserId(editingUserId === u.id ? null : u.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {editingUserId === u.id ? 'Cancel Edit' : 'Edit User Profile'}
                      </button>

                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        u.isApproved
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {u.isApproved ? '✓ Approved' : '⏳ Pending'}
                      </span>

                      <button
                        onClick={() => toggleUserApproval(u.id)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow ${
                          u.isApproved
                            ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/20'
                        }`}
                      >
                        {u.isApproved ? 'Revoke Access' : 'Approve User'}
                      </button>
                    </div>
                  </div>

                  {/* Inline Admin Edit Form */}
                  {editingUserId === u.id && (
                    <div className="mt-3 p-3 bg-slate-900/80 rounded-xl border border-indigo-500/30 space-y-3">
                      <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Admin Quick Profile Editor</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">User Name</label>
                          <input
                            type="text"
                            value={u.name}
                            onChange={(e) => updateUserData(u.id, { name: e.target.value })}
                            className="w-full px-2.5 py-1 bg-slate-800 border border-white/10 rounded-lg text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Email</label>
                          <input
                            type="email"
                            value={u.email}
                            onChange={(e) => updateUserData(u.id, { email: e.target.value })}
                            className="w-full px-2.5 py-1 bg-slate-800 border border-white/10 rounded-lg text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Role / Specialty</label>
                          <select
                            value={u.role}
                            onChange={(e) => updateUserData(u.id, { role: e.target.value })}
                            className="w-full px-2.5 py-1 bg-slate-800 border border-white/10 rounded-lg text-xs text-white"
                          >
                            <option value="Medical Oncologist">Medical Oncologist</option>
                            <option value="Genomic Researcher">Genomic Researcher</option>
                            <option value="Clinical Trial Investigator">Clinical Trial Investigator</option>
                            <option value="Biostatistician">Biostatistician</option>
                            <option value="System Administrator">System Administrator</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Profile Form */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-sm font-bold text-white">Personal & Professional Profile</h2>
                <p className="text-xs text-slate-400">Update your clinical research credentials and profile information</p>
              </div>
              {isSaved && (
                <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg">
                  ✓ Profile changes saved!
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Clinical Role</label>
                <select
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="System Administrator">System Administrator</option>
                  <option value="Medical Oncologist">Medical Oncologist</option>
                  <option value="Genomic Researcher">Genomic Researcher</option>
                  <option value="Clinical Trial Investigator">Clinical Trial Investigator</option>
                  <option value="Biostatistician">Biostatistician</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Specialty</label>
                <input
                  type="text"
                  value={profile.specialty}
                  onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Institution / Center</label>
                <input
                  type="text"
                  value={profile.institution}
                  onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">License ID</label>
                <input
                  type="text"
                  value={profile.licenseNumber}
                  onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Security */}
        {activeTab === 'security' && (
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-6">
            <h2 className="text-sm font-bold text-white border-b border-white/10 pb-3">Security & Permissions</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-white/5">
                <div>
                  <p className="text-xs font-semibold text-white">Quantum VQE / QAOA Engine Authorization</p>
                  <p className="text-[10px] text-slate-400">Allows executing quantum computing optimization algorithms on NISQ hardware</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.quantumSimulationAccess}
                  onChange={(e) => setProfile({ ...profile, quantumSimulationAccess: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-white/5">
                <div>
                  <p className="text-xs font-semibold text-white">Two-Factor Authentication (2FA)</p>
                  <p className="text-[10px] text-slate-400">Protects clinical data access with hardware security keys or authenticator apps</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.twoFactorEnabled}
                  onChange={(e) => setProfile({ ...profile, twoFactorEnabled: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === 'activity' && (
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white border-b border-white/10 pb-3">Recent System Audit Logs</h2>

            <div className="space-y-2">
              {[
                { time: 'Just now', action: 'Optimized Treatment Plan for Patient P-001 (Pembrolizumab)', status: 'Success' },
                { time: '12 mins ago', action: 'Queried Neon PostgreSQL database tables (patients, clusters, users)', status: 'Connected' },
                { time: '1 hour ago', action: 'Imported CSV Patient Cohort (10 candidates)', status: 'Imported' },
                { time: '3 hours ago', action: 'Admin logged in: napagunasaisujith@gmail.com', status: 'Authenticated' },
              ].map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl text-xs">
                  <div>
                    <p className="text-slate-200 font-medium">{log.action}</p>
                    <p className="text-[10px] text-slate-500">{log.time}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-mono border border-indigo-500/20">
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
