import React, { useState } from 'react';

interface AuthModalProps {
  onLoginSuccess: (user: { name: string; email: string; role: string; userType?: 'doctor' | 'patient' }) => void;
}

export default function AuthModal({ onLoginSuccess }: AuthModalProps) {
  const [accountType, setAccountType] = useState<'doctor' | 'patient'>('doctor');
  const [isRegister, setIsRegister] = useState(false);

  // Common credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Doctor Specific Details
  const [docId, setDocId] = useState('');
  const [govtLicenseId, setGovtLicenseId] = useState('GOVT-LIC-892014-NY');
  const [degree, setDegree] = useState('MD, DM (Medical Oncology)');
  const [experienceYears, setExperienceYears] = useState('12');
  const [docHospitalName, setDocHospitalName] = useState('Memorial Precision Cancer Center');
  const [role, setRole] = useState('Medical Oncologist');

  // Patient Specific Details
  const [patientLoginId, setPatientLoginId] = useState('');
  const [hospitalPatientId, setHospitalPatientId] = useState('');
  const [patientHospitalName, setPatientHospitalName] = useState('Memorial Precision Cancer Center');
  const [diagnosis, setDiagnosis] = useState('Non-small cell lung carcinoma (NSCLC)');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mandatory Doctor ID login check for Doctors
    if (!isRegister && accountType === 'doctor') {
      if (!docId || !password) {
        setError('Doctor ID Number and Password are required to sign in');
        return;
      }

      // Check for Admin Doctor ID or Admin email mapped to doc id
      if (docId.trim().toUpperCase() === 'DOC-ADMIN' || docId.trim().toLowerCase() === 'napagunasaisujith@gmail.com') {
        if (password !== '123456') {
          setError('Invalid password for Administrator account');
          return;
        }
        onLoginSuccess({
          name: 'System Admin (Saisujith)',
          email: 'napagunasaisujith@gmail.com',
          role: 'System Administrator',
          userType: 'doctor'
        });
        return;
      }

      // Default demo doctor ID
      if (docId.trim().toUpperCase() === 'DOC-992014') {
        if (password !== '123456') {
          setError('Invalid password for Doctor ID DOC-992014');
          return;
        }
        onLoginSuccess({
          name: 'Dr. Sarah Jenkins',
          email: 's.jenkins@oncology.org',
          role: 'Medical Oncologist',
          userType: 'doctor'
        });
        return;
      }

      // Check registered users for matching docId or govtLicenseId
      const saved = JSON.parse(localStorage.getItem('quantum_registered_users') || '[]');
      const registeredUser = saved.find((u: any) => 
        u.userType === 'doctor' && (
          u.docId?.toUpperCase() === docId.trim().toUpperCase() ||
          u.govtLicenseId?.toUpperCase() === docId.trim().toUpperCase() ||
          u.licenseNumber?.toUpperCase() === docId.trim().toUpperCase()
        )
      );

      if (!registeredUser) {
        setError('Doctor ID not found. Please verify your assigned Doctor ID or register a new account.');
        return;
      }

      if (!registeredUser.isApproved) {
        setError('Your Doctor account is pending Administrator approval. Please wait for Admin authorization.');
        return;
      }

      onLoginSuccess({
        name: registeredUser.name,
        email: registeredUser.email || `${registeredUser.name.toLowerCase().replace(/\s+/g, '')}@hospital.org`,
        role: registeredUser.role || 'Medical Oncologist',
        userType: 'doctor'
      });
      return;
    }

    // Patient login
    if (!isRegister && accountType === 'patient') {
      if (!patientLoginId || !password) {
        setError('Hospital Patient ID or Email is required to sign in');
        return;
      }

      const saved = JSON.parse(localStorage.getItem('quantum_registered_users') || '[]');
      const registeredUser = saved.find((u: any) => 
        u.userType === 'patient' && (
          u.hospitalPatientId?.toUpperCase() === patientLoginId.trim().toUpperCase() ||
          u.email?.toLowerCase() === patientLoginId.trim().toLowerCase() ||
          patientLoginId.trim().toUpperCase() === 'P-001'
        )
      );

      const patientName = registeredUser?.name || 'Patient User';
      const patientRole = registeredUser?.role || 'Oncology Patient';

      onLoginSuccess({
        name: patientName,
        email: registeredUser?.email || `${patientLoginId.toLowerCase()}@hospital.org`,
        role: patientRole,
        userType: 'patient'
      });
      return;
    }

    if (isRegister) {
      if (!name) {
        setError('Please enter your full name');
        return;
      }

      if (accountType === 'doctor') {
        if (!govtLicenseId) {
          setError('Government License ID is mandatory for Doctor registration');
          return;
        }
        if (!docHospitalName) {
          setError('Please specify your Hospital / Medical Institute name');
          return;
        }
      }

      if (accountType === 'patient') {
        if (!hospitalPatientId) {
          setError('Please enter your Hospital Patient ID (e.g. P-001 or HOSP-9920)');
          return;
        }
        if (!patientHospitalName) {
          setError('Please enter your Hospital Name');
          return;
        }
      }

      const generatedDocId = `DOC-${Math.floor(100000 + Math.random() * 900000)}`;

      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@hospital.org`,
        docId: accountType === 'doctor' ? generatedDocId : undefined,
        govtLicenseId: accountType === 'doctor' ? govtLicenseId.trim() : undefined,
        degree: accountType === 'doctor' ? degree.trim() : undefined,
        experienceYears: accountType === 'doctor' ? experienceYears : undefined,
        hospitalName: accountType === 'doctor' ? docHospitalName.trim() : patientHospitalName.trim(),
        role: accountType === 'patient' ? `Patient (${diagnosis})` : role,
        licenseNumber: accountType === 'doctor' ? govtLicenseId.trim() : `ID: ${hospitalPatientId.trim()}`,
        hospitalPatientId: hospitalPatientId.trim(),
        diagnosis: diagnosis,
        userType: accountType,
        isApproved: accountType === 'patient' ? true : false,
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const existing = JSON.parse(localStorage.getItem('quantum_registered_users') || '[]');
      const filtered = existing.filter((u: any) => u.email.toLowerCase() !== newUser.email.toLowerCase());
      localStorage.setItem('quantum_registered_users', JSON.stringify([newUser, ...filtered]));

      if (accountType === 'patient') {
        onLoginSuccess({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          userType: 'patient'
        });
        return;
      }

      setError(`Registration submitted! Assigned Doctor ID: ${generatedDocId}. Pending Administrator approval before sign in.`);
      return;
    }
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

        {/* Account Type Selection (Doctor Profile vs Patient Profile) */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => setAccountType('doctor')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              accountType === 'doctor'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Doctor Profile
          </button>

          <button
            type="button"
            onClick={() => setAccountType('patient')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              accountType === 'patient'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Patient Profile
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sign In Inputs */}
          {!isRegister && (
            <>
              {accountType === 'doctor' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Doctor ID Number
                  </label>
                  <input
                    type="text"
                    value={docId}
                    onChange={(e) => setDocId(e.target.value)}
                    placeholder="Enter your Doctor ID"
                    className="w-full px-4 py-2.5 bg-slate-800/60 border border-indigo-500/40 rounded-xl text-white font-mono text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Hospital Patient ID Number / Email
                  </label>
                  <input
                    type="text"
                    value={patientLoginId}
                    onChange={(e) => setPatientLoginId(e.target.value)}
                    placeholder="Enter Patient ID or Email"
                    className="w-full px-4 py-2.5 bg-slate-800/60 border border-emerald-500/40 rounded-xl text-white font-mono text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>
              )}

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
            </>
          )}

          {/* Registration Form Inputs */}
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  {accountType === 'patient' ? 'Patient Full Name' : 'Doctor / Specialist Full Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={accountType === 'patient' ? 'e.g. John Doe' : 'Dr. Sarah Jenkins'}
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>

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

              {accountType === 'doctor' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                      ★ Govt License ID (Mandatory)
                    </label>
                    <input
                      type="text"
                      value={govtLicenseId}
                      onChange={(e) => setGovtLicenseId(e.target.value)}
                      placeholder="e.g. GOVT-LIC-892014-NY"
                      className="w-full px-4 py-2.5 bg-slate-800/60 border border-amber-500/40 rounded-xl text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Hospital / Cancer Center Name
                    </label>
                    <input
                      type="text"
                      value={docHospitalName}
                      onChange={(e) => setDocHospitalName(e.target.value)}
                      placeholder="e.g. Memorial Precision Cancer Center"
                      className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Degree / Course Completed</label>
                      <input
                        type="text"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        placeholder="e.g. MD, DM Oncology"
                        className="w-full px-3 py-2 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Experience (Years)</label>
                      <input
                        type="number"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        placeholder="12"
                        className="w-full px-3 py-2 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Medical Role / Specialty</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    >
                      <option value="Medical Oncologist">Medical Oncologist</option>
                      <option value="Genomic Researcher">Genomic Researcher</option>
                      <option value="Clinical Trial Investigator">Clinical Trial Investigator</option>
                      <option value="Biostatistician">Biostatistician</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Hospital Patient ID Number
                    </label>
                    <input
                      type="text"
                      value={hospitalPatientId}
                      onChange={(e) => setHospitalPatientId(e.target.value)}
                      placeholder="e.g. P-001 or HOSP-9920"
                      className="w-full px-4 py-2.5 bg-slate-800/60 border border-emerald-500/30 rounded-xl text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Hospital Name
                    </label>
                    <input
                      type="text"
                      value={patientHospitalName}
                      onChange={(e) => setPatientHospitalName(e.target.value)}
                      placeholder="e.g. Memorial Precision Cancer Center"
                      className="w-full px-4 py-2.5 bg-slate-800/60 border border-emerald-500/30 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Primary Oncology Diagnosis</label>
                    <select
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800/60 border border-emerald-500/30 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    >
                      <option value="Non-small cell lung carcinoma (NSCLC)">Non-small cell lung carcinoma (NSCLC)</option>
                      <option value="HER2+ Breast Cancer Stage II">HER2+ Breast Cancer Stage II</option>
                      <option value="Metastatic Castration-Resistant Prostate Cancer">Metastatic Castration-Resistant Prostate Cancer</option>
                      <option value="Acute Lymphoblastic Leukemia (ALL)">Acute Lymphoblastic Leukemia (ALL)</option>
                      <option value="Colorectal Cancer Stage IV">Colorectal Cancer Stage IV</option>
                    </select>
                  </div>
                </>
              )}
            </>
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
