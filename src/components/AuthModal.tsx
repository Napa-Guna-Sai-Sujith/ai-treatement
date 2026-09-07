import React, { useState } from 'react';
import { mockPatients } from '../data/mockData';

interface AuthModalProps {
  onLoginSuccess: (user: { name: string; email: string; role: string }) => void;
  onPatientLoginSuccess?: (patientId: string) => void;
  onClose?: () => void;
}

export default function AuthModal({ onLoginSuccess, onPatientLoginSuccess, onClose }: AuthModalProps) {
  // 3-way Role Switcher: 'doctor' | 'admin' | 'patient'
  const [roleMode, setRoleMode] = useState<'doctor' | 'admin' | 'patient'>('doctor');
  const [isRegister, setIsRegister] = useState(false);

  // Doctor credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [docId, setDocId] = useState('');
  const [doctorRole, setDoctorRole] = useState('Medical Oncologist — Targeted & Chemo Regimens');

  // Admin credentials
  const [adminEmail, setAdminEmail] = useState('napagunasaisujith@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');

  // Patient credentials
  const [patientId, setPatientId] = useState('');
  const [patientPassword, setPatientPassword] = useState('');

  const [error, setError] = useState('');

  // 1. DOCTOR LOGIN & REGISTRATION HANDLER
  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      if (!name || !email || !docId || !password) {
        setError('Please fill in all registration fields');
        return;
      }
    } else {
      if (!docId || !password) {
        setError('Please enter your Doctor ID and password');
        return;
      }
    }

    const inputIdentifier = docId.trim().toLowerCase();

    // Doctor Registration (Pending approval)
    if (isRegister) {
      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        docId: docId.trim().toUpperCase(),
        role: doctorRole,
        isApproved: false,
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const existing = JSON.parse(localStorage.getItem('quantum_registered_users') || '[]');
      const filtered = existing.filter((u: any) => 
        u.email.toLowerCase() !== newUser.email.toLowerCase() && 
        u.docId?.toUpperCase() !== newUser.docId.toUpperCase()
      );
      localStorage.setItem('quantum_registered_users', JSON.stringify([newUser, ...filtered]));

      setError('Doctor registration submitted! Account pending Administrator approval before sign in.');
      return;
    }

    // Doctor Sign In verification
    const saved = JSON.parse(localStorage.getItem('quantum_registered_users') || '[]');
    const registeredUser = saved.find((u: any) => 
      (u.docId && u.docId.toLowerCase() === inputIdentifier) ||
      (u.email && u.email.toLowerCase() === inputIdentifier)
    );

    if (registeredUser && !registeredUser.isApproved) {
      setError(`Doctor account (${registeredUser.docId || registeredUser.email}) is currently pending Administrator approval.`);
      return;
    }

    const userName = registeredUser?.name || name || `Doctor (${docId.trim().toUpperCase()})`;
    const userEmail = registeredUser?.email || (email.includes('@') ? email : `${inputIdentifier}@oncology.org`);
    const finalRole = registeredUser?.role || doctorRole;

    onLoginSuccess({
      name: userName.charAt(0).toUpperCase() + userName.slice(1),
      email: userEmail.trim(),
      role: finalRole
    });
  };

  // 2. SYSTEM ADMIN LOGIN HANDLER
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setError('Please enter Admin email and password');
      return;
    }

    const cleanEmail = adminEmail.trim().toLowerCase();

    if (cleanEmail === 'napagunasaisujith@gmail.com' || cleanEmail === 'adm-9901' || cleanEmail === 'admin') {
      if (adminPassword !== '123456') {
        setError('Invalid password for System Administrator account');
        return;
      }

      onLoginSuccess({
        name: 'System Admin (Saisujith)',
        email: 'napagunasaisujith@gmail.com',
        role: 'System Administrator',
      });
      return;
    }

    setError('Access Denied: Unrecognized Administrator credentials');
  };

  // 3. PATIENT LOGIN HANDLER
  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId.trim() || !patientPassword.trim()) {
      setError('Please enter both Patient ID and Password');
      return;
    }

    const cleanId = patientId.trim().toUpperCase();
    const patientExists = mockPatients.some(p => p.id.toUpperCase() === cleanId);
    
    if (!patientExists) {
      setError(`Patient record for ID "${cleanId}" not found in database. Try P-001, P-002, ..., P-010.`);
      return;
    }

    // Default password for all patients is 123456
    if (patientPassword.trim() !== '123456') {
      setError('Invalid patient password. Default password is: 123456');
      return;
    }

    if (onPatientLoginSuccess) {
      onPatientLoginSuccess(cleanId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className={`absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-colors duration-300 ${
          roleMode === 'admin' ? 'bg-amber-500/20' : roleMode === 'patient' ? 'bg-teal-500/20' : 'bg-indigo-500/20'
        }`} />
        <div className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-colors duration-300 ${
          roleMode === 'admin' ? 'bg-orange-500/20' : roleMode === 'patient' ? 'bg-emerald-500/20' : 'bg-purple-500/20'
        }`} />

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* 3-Role Dropdown Selector */}
        <div className="mb-5 relative z-10">
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Select Account Portal</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              roleMode === 'admin' ? 'bg-amber-500/20 text-amber-300' : roleMode === 'patient' ? 'bg-teal-500/20 text-teal-300' : 'bg-indigo-500/20 text-indigo-300'
            }`}>
              {roleMode.toUpperCase()} MODE
            </span>
          </label>
          <div className="relative">
            <select
              value={roleMode}
              onChange={(e) => {
                setRoleMode(e.target.value as 'doctor' | 'admin' | 'patient');
                setError('');
                setIsRegister(false);
              }}
              className="w-full px-4 py-2.5 bg-slate-950/90 border border-white/15 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer pr-10"
            >
              <option value="doctor">🩺 Doctor / Medical Practitioner Portal</option>
              <option value="admin">🛡️ System Administrator Portal (napagunasaisujith@gmail.com)</option>
              <option value="patient">🧬 Patient Care Portal (P-001, P-002, etc.)</option>
            </select>
            <div className="absolute right-3.5 top-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Role Icon & Header Title */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg mb-3 ${
            roleMode === 'admin'
              ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30'
              : roleMode === 'patient'
                ? 'bg-gradient-to-br from-teal-400 to-emerald-600 shadow-emerald-500/30'
                : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30'
          }`}>
            {roleMode === 'admin' ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ) : roleMode === 'patient' ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            )}
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            {roleMode === 'admin'
              ? 'Administrator Console Sign In'
              : roleMode === 'patient'
                ? 'Patient Care Sign In'
                : isRegister
                  ? 'Doctor & Practitioner Registration'
                  : 'Doctor Sign In'
            }
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {roleMode === 'admin'
              ? 'System Administrator credentials with approval privileges'
              : roleMode === 'patient'
                ? 'Access personal biomarker profile & quantum treatment plan'
                : isRegister
                  ? 'Register doctor profile for AI & Quantum treatment access'
                  : 'Enter your Doctor ID to access AI & Quantum Treatment Dashboard'
            }
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* CASE 1: ADMIN LOGIN */}
        {roleMode === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Admin Email ID
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="napagunasaisujith@gmail.com"
                className="w-full px-4 py-2.5 bg-slate-800/60 border border-amber-500/30 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-800/60 border border-amber-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <p className="text-[10px] text-amber-400/80 mt-1 font-mono">Default credentials: napagunasaisujith@gmail.com / 123456</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-700 transition-all duration-200 cursor-pointer text-xs"
            >
              Sign In as Administrator
            </button>
          </form>
        )}

        {/* CASE 2: PATIENT LOGIN */}
        {roleMode === 'patient' && (
          <form onSubmit={handlePatientSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Patient ID
              </label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="e.g. P-001, P-002, P-003"
                className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all uppercase"
              />
              <p className="text-[10px] text-slate-500 mt-1">Provided on your hospital admission card (e.g. P-001 to P-010)</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Patient Password
              </label>
              <input
                type="password"
                value={patientPassword}
                onChange={(e) => setPatientPassword(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-xs"
              />
              <p className="text-[10px] text-teal-400/90 mt-1 font-mono">Default Patient Password: 123456</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:from-teal-600 hover:to-emerald-700 transition-all duration-200 cursor-pointer text-xs"
            >
              Sign In to Patient Portal
            </button>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-slate-400">
                🔒 Patient accounts are registered by clinical staff. No public registration required.
              </p>
            </div>
          </form>
        )}

        {/* CASE 3: DOCTOR LOGIN & REGISTRATION */}
        {roleMode === 'doctor' && (
          <form onSubmit={handleDoctorSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Doctor Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Sarah Jenkins, MD"
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-xs"
                />
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Doctor Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@oncology.org"
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-xs"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Doctor ID (Doc ID)</label>
              <input
                type="text"
                value={docId}
                onChange={(e) => setDocId(e.target.value)}
                placeholder="e.g. DOC-8842 / MD-9910"
                className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-xs"
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Treatment Specialization Role</label>
                <select
                  value={doctorRole}
                  onChange={(e) => setDoctorRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-xs"
                >
                  <option value="Medical Oncologist — Targeted & Chemo Regimens">Medical Oncologist — Targeted & Chemo Regimens</option>
                  <option value="Immunotherapy & Checkpoint Specialist">Immunotherapy & Checkpoint Specialist</option>
                  <option value="Cell & Gene Therapy / CAR-T Specialist">Cell & Gene Therapy / CAR-T Specialist</option>
                  <option value="Radiation & Quantum Optimization Specialist">Radiation & Quantum Optimization Specialist</option>
                  <option value="Clinical Trial Principal Investigator">Clinical Trial Principal Investigator</option>
                  <option value="Precision Genomic & Biomarker Researcher">Precision Genomic & Biomarker Researcher</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 cursor-pointer text-xs"
            >
              {isRegister ? 'Register Doctor Account' : 'Sign In as Doctor'}
            </button>

            <div className="mt-4 text-center text-xs text-slate-400">
              {isRegister ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsRegister(false); setError(''); }}
                    className="text-indigo-400 hover:underline font-semibold cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  Need a Doctor Account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsRegister(true); setError(''); }}
                    className="text-indigo-400 hover:underline font-semibold cursor-pointer"
                  >
                    Register Doctor Profile
                  </button>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
