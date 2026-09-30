import React, { useState, useEffect } from 'react';
import {
  UserRecord,
  getRegisteredUsers,
  updateUserApprovalStatus,
  updateUserDetails,
  deleteUserAccount,
  verifyAndPurgeInvalidAccounts,
  resetToInitialVerifiedDoctors
} from '../utils/userService';

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
  user: { name: string; email: string; role: string; docId?: string } | null;
  onUpdateUser: (updated: { name: string; email: string; role: string; docId?: string }) => void;
  onBackToDashboard: () => void;
}

export default function ProfilePage({ user, onUpdateUser, onBackToDashboard }: Props) {
  const isAdmin = user?.email?.toLowerCase().trim() === 'napagunasaisujith@gmail.com' || user?.role === 'System Administrator';

  const [registeredUsers, setRegisteredUsers] = useState<UserRecord[]>([]);
  const [userFilter, setUserFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<UserRecord>>({});
  const [actionNotice, setActionNotice] = useState<string>('');

  useEffect(() => {
    // Clean initial load with deduplication
    const users = getRegisteredUsers();
    setRegisteredUsers(users);
  }, []);

  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || (isAdmin ? 'System Admin (Saisujith)' : 'Dr. Rajesh Sharma, MD'),
    email: user?.email || (isAdmin ? 'napagunasaisujith@gmail.com' : 'r.sharma@oncocenter.org'),
    role: user?.role || (isAdmin ? 'System Administrator' : 'Immunotherapy & Checkpoint Specialist'),
    institution: isAdmin ? 'Antigravity Quantum Center' : 'Memorial Precision Cancer Center',
    specialty: isAdmin ? 'Platform Architecture & Security' : 'Thoracic & Immunological Oncology',
    licenseNumber: isAdmin ? 'ADM-9901-SAISUJITH' : 'MD-892014-NY',
    quantumSimulationAccess: true,
    twoFactorEnabled: true,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'approval' | 'activity'>(isAdmin ? 'approval' : 'profile');

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleToggleApproval = (docId: string, currentApproved: boolean) => {
    const updated = updateUserApprovalStatus(docId, !currentApproved);
    setRegisteredUsers(updated);
    showNotification(`Doctor ${docId} access ${!currentApproved ? '✓ APPROVED' : '🔒 REVOKED'}`);
  };

  const handleDeleteUser = (docId: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete and remove ${name} (${docId}) from the system database?`)) {
      const updated = deleteUserAccount(docId);
      setRegisteredUsers(updated);
      showNotification(`Account "${name} (${docId})" permanently removed from database.`);
    }
  };

  const handleStartEdit = (u: UserRecord) => {
    setEditingDocId(u.docId);
    setEditFormData({
      name: u.name,
      email: u.email,
      docId: u.docId,
      role: u.role
    });
  };

  const handleSaveEdit = (originalDocId: string) => {
    const updated = updateUserDetails(originalDocId, editFormData);
    setRegisteredUsers(updated);
    setEditingDocId(null);
    showNotification('Doctor profile details updated successfully!');
  };

  const handleVerifyAndPurge = () => {
    const { purgedCount, cleanList } = verifyAndPurgeInvalidAccounts();
    setRegisteredUsers(cleanList);
    showNotification(
      purgedCount > 0
        ? `Database clean: Purged ${purgedCount} duplicate/glitched entries. Total active doctors: ${cleanList.length}.`
        : `Database verified: All ${cleanList.length} doctor accounts are 100% unique with 0 duplicates.`
    );
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset database to clean verified doctors (DOC-1092, DOC-2045, DOC-3001) and clear any corrupt duplicates?')) {
      const reset = resetToInitialVerifiedDoctors();
      setRegisteredUsers(reset);
      showNotification('Database successfully reset to initial clean verified doctor cohort.');
    }
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

  // Extra safety: Deduplicate by Doc ID before filtering and rendering
  const dedupedUsersMap = new Map<string, UserRecord>();
  for (const u of registeredUsers) {
    if (u && u.docId) {
      dedupedUsersMap.set(u.docId.toUpperCase(), u);
    }
  }
  const uniqueRegisteredUsers = Array.from(dedupedUsersMap.values());

  const filteredUsers = uniqueRegisteredUsers.filter(u => {
    const matchesFilter =
      userFilter === 'all'
        ? true
        : userFilter === 'pending'
          ? !u.isApproved
          : u.isApproved;

    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.docId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const pendingCount = uniqueRegisteredUsers.filter(u => !u.isApproved).length;
  const approvedCount = uniqueRegisteredUsers.filter(u => u.isApproved).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
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
              {isAdmin ? 'System Administrator Console' : 'Doctor Profile Verified'}
            </span>
          </div>
        </div>

        {/* Global Action Notification Toast */}
        {actionNotice && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center justify-between shadow-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice('')} className="text-emerald-400 hover:text-white font-bold text-xs">
              ✕
            </button>
          </div>
        )}

        {/* Profile Card Header */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/30">
              {profile.name.charAt(0)}
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <h1 className="text-xl font-bold text-white">{profile.name}</h1>
                {isAdmin && (
                  <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase rounded">
                    Admin Access
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
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'approval' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Doctor Approvals ({pendingCount} Pending)
              </button>
            )}

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                activeTab === 'profile' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Account Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                activeTab === 'security' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Security & Credentials
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                activeTab === 'activity' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Recent Audit Logs
            </button>
          </div>
        </div>

        {/* TAB 1: USER APPROVAL & ACCOUNT MANAGEMENT CONSOLE (ADMIN ONLY) */}
        {activeTab === 'approval' && isAdmin && (
          <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-6 space-y-5 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  Doctor Account & Approval Management Console
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Approve new practitioner registrations, revoke doctor access, or clean up any duplicate/glitched accounts
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Reset to Clean Defaults */}
                <button
                  onClick={handleResetToDefaults}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition-all cursor-pointer"
                  title="Reset to 3 verified baseline doctors"
                >
                  Reset Defaults
                </button>

                {/* Verify & Purge Button */}
                <button
                  onClick={handleVerifyAndPurge}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  title="Clean all duplicate doctor accounts immediately"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Purge Duplicates & Clean DB
                </button>
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex bg-slate-800/80 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
                <button
                  onClick={() => setUserFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    userFilter === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Doctors ({uniqueRegisteredUsers.length})
                </button>
                <button
                  onClick={() => setUserFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    userFilter === 'pending' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  onClick={() => setUserFilter('approved')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    userFilter === 'approved' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Approved ({approvedCount})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctor, email, Doc ID..."
                  className="w-full px-3 py-1.5 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder-slate-500"
                />
              </div>
            </div>

            {/* Doctor Accounts List */}
            {filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs bg-slate-800/20 rounded-xl border border-white/5">
                No doctor accounts found matching the current filter.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((u) => (
                  <div
                    key={u.docId}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-4 ${
                      u.isApproved
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/5'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white">{u.name}</span>
                          <span className="text-xs text-indigo-400 font-medium">• {u.role}</span>
                          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold rounded border border-indigo-500/30">
                            Doc ID: {u.docId}
                          </span>
                          {u.licenseNumber && (
                            <span className="px-2 py-0.5 bg-slate-800 border border-white/10 text-slate-300 text-[10px] font-mono rounded">
                              Lic: {u.licenseNumber}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-slate-400">{u.email}</p>
                        <p className="text-[10px] text-slate-500">Registration Status: {u.submittedAt}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleStartEdit(u)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          {editingDocId === u.docId ? 'Cancel' : 'Edit'}
                        </button>

                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          u.isApproved
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {u.isApproved ? '✓ Active' : '⏳ Pending'}
                        </span>

                        <button
                          onClick={() => handleToggleApproval(u.docId, u.isApproved)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow ${
                            u.isApproved
                              ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/20'
                          }`}
                        >
                          {u.isApproved ? 'Revoke Access' : 'Approve Doctor'}
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u.docId, u.name)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                          title="Permanently remove account"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Inline Admin Edit Form */}
                    {editingDocId === u.docId && (
                      <div className="mt-3 p-4 bg-slate-900/90 rounded-xl border border-indigo-500/40 space-y-3">
                        <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Admin Quick Doctor Editor</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Doctor Name</label>
                            <input
                              type="text"
                              value={editFormData.name || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                              className="w-full px-2.5 py-1.5 bg-slate-800 border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Email ID</label>
                            <input
                              type="email"
                              value={editFormData.email || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                              className="w-full px-2.5 py-1.5 bg-slate-800 border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Doctor ID (Doc ID)</label>
                            <input
                              type="text"
                              value={editFormData.docId || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, docId: e.target.value.toUpperCase() })}
                              placeholder="e.g. DOC-9842"
                              className="w-full px-2.5 py-1.5 bg-slate-800 border border-white/10 rounded-lg text-xs text-white font-mono uppercase focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label className="text-[10px] text-slate-400 block mb-1">Treatment Specialization Role</label>
                            <select
                              value={editFormData.role || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                              className="w-full px-2.5 py-1.5 bg-slate-800 border border-white/10 rounded-lg text-xs text-white focus:outline-none"
                            >
                              <option value="Medical Oncologist — Targeted & Chemo Regimens">Medical Oncologist — Targeted & Chemo Regimens</option>
                              <option value="Immunotherapy & Checkpoint Specialist">Immunotherapy & Checkpoint Specialist</option>
                              <option value="Cell & Gene Therapy / CAR-T Specialist">Cell & Gene Therapy / CAR-T Specialist</option>
                              <option value="Radiation & Quantum Optimization Specialist">Radiation & Quantum Optimization Specialist</option>
                              <option value="Clinical Trial Principal Investigator">Clinical Trial Principal Investigator</option>
                              <option value="Precision Genomic & Biomarker Researcher">Precision Genomic & Biomarker Researcher</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setEditingDocId(null)}
                            className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(u.docId)}
                            className="px-4 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE FORM */}
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
                  <option value="Immunotherapy & Checkpoint Specialist">Immunotherapy & Checkpoint Specialist</option>
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

        {/* TAB 3: SECURITY */}
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

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === 'activity' && (
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white border-b border-white/10 pb-3">Recent System Audit Logs</h2>

            <div className="space-y-2">
              {[
                { time: 'Just now', action: 'Doctor directory verified with 0 duplicate entries', status: 'Clean' },
                { time: '5 mins ago', action: 'Admin revoked access for doctor and synchronized permissions', status: 'Updated' },
                { time: '15 mins ago', action: 'Optimized Treatment Plan for Patient P-001 (Pembrolizumab)', status: 'Success' },
                { time: '30 mins ago', action: 'Admin logged in: napagunasaisujith@gmail.com', status: 'Authenticated' }
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
