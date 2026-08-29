import React, { useState } from 'react';

interface AuthModalProps {
  onLoginSuccess: (user: { name: string; email: string; role: string }) => void;
}

export default function AuthModal({ onLoginSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Medical Oncologist');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (isRegister && !name) {
      setError('Please enter your full name');
      return;
    }

    // Check for Admin Credentials
    if (email.toLowerCase().trim() === 'napagunasaisujith@gmail.com') {
      if (password !== '123456') {
        setError('Invalid password for Admin account');
        return;
      }
      onLoginSuccess({
        name: 'System Admin (Saisujith)',
        email: 'napagunasaisujith@gmail.com',
        role: 'System Administrator',
      });
      return;
    }

    // New Registration pending approval check
    if (isRegister) {
      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        role: role,
        isApproved: false,
        submittedAt: 'Just now'
      };
      
      const existing = JSON.parse(localStorage.getItem('quantum_registered_users') || '[]');
      // Filter out duplicate email if re-registering
      const filtered = existing.filter((u: any) => u.email.toLowerCase() !== newUser.email.toLowerCase());
      localStorage.setItem('quantum_registered_users', JSON.stringify([newUser, ...filtered]));

      setError('Registration submitted! Account pending Administrator approval before sign in.');
      return;
    }

    // Regular User Login - Check approval status
    const saved = JSON.parse(localStorage.getItem('quantum_registered_users') || '[]');
    const registeredUser = saved.find((u: any) => u.email.toLowerCase() === email.toLowerCase().trim());

    if (registeredUser && !registeredUser.isApproved) {
      setError('Your account is currently pending Administrator approval. Please wait for Admin authorization.');
      return;
    }

    const userName = registeredUser?.name || name || email.split('@')[0] || 'Dr. Sarah Jenkins';
    const userRole = registeredUser?.role || role;

    onLoginSuccess({
      name: userName.charAt(0).toUpperCase() + userName.slice(1),
      email: email.trim(),
      role: userRole
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Glow effect background */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isRegister ? 'Create QuantumCare Account' : 'Welcome to QuantumCare AI'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isRegister ? 'Register to access precision oncology tools' : 'Sign in to access AI & Quantum Treatment Dashboard'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Sarah Jenkins"
                className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="oncologist@hospital.org"
              className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Role / Specialty</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              >
                <option value="Medical Oncologist">Medical Oncologist</option>
                <option value="Genomic Researcher">Genomic Researcher</option>
                <option value="Clinical Trial Investigator">Clinical Trial Investigator</option>
                <option value="Biostatistician">Biostatistician</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 cursor-pointer"
          >
            {isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
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
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(''); }}
                className="text-indigo-400 hover:underline font-semibold cursor-pointer"
              >
                Register
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
