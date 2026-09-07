import React, { useState } from 'react';
import { Patient } from '../types';

interface PatientManagerProps {
  patients: Patient[];
  onAddPatient: (patient: Patient) => void;
  onDeletePatient: (patientId: string) => void;
  onSelectPatient: (patient: Patient) => void;
}

const CANCER_DISEASES = [
  'Non-small cell lung carcinoma (NSCLC) Stage IIIB',
  'HER2+ Breast Cancer Stage II',
  'Metastatic Castration-Resistant Prostate Cancer (mCRPC)',
  'Acute Lymphoblastic Leukemia (ALL)',
  'Colorectal Cancer Stage IV',
  'Glioblastoma Multiforme (GBM) Grade IV',
  'Diffuse Large B-Cell Lymphoma (DLBCL)',
  'Pancreatic Ductal Adenocarcinoma Stage III',
  'Melanoma with BRAF V600E Mutation Stage IIIC',
  'Ovarian Cancer Stage IIIC',
  'Renal Cell Carcinoma (RCC) Stage IV',
  'Multiple Myeloma High-Risk'
];

export default function PatientManager({ patients, onAddPatient, onDeletePatient, onSelectPatient }: PatientManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDisease, setFilterDisease] = useState('all');

  // New Patient Form state with mandatory fields: name, id, email, disease
  const [name, setName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [email, setEmail] = useState('');
  const [diagnosis, setDiagnosis] = useState(CANCER_DISEASES[0]);
  const [age, setAge] = useState<number>(55);
  const [gender, setGender] = useState<'Male' | 'Female'>('Female');
  const [priorTreatments, setPriorTreatments] = useState('');
  const [comorbidities, setComorbidities] = useState('');

  // Biomarker sliders / inputs
  const [crp, setCrp] = useState<number>(25.0);
  const [il6, setIl6] = useState<number>(18.0);
  const [vegf, setVegf] = useState<number>(160.0);
  const [wbc, setWbc] = useState<number>(8.0);
  const [creatinine, setCreatinine] = useState<number>(0.9);
  const [troponin, setTroponin] = useState<number>(0.02);

  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !patientId.trim() || !email.trim() || !diagnosis.trim()) {
      setFormError('All mandatory fields (Name, Patient ID, Email, Disease) are required');
      return;
    }

    const cleanId = patientId.trim().toUpperCase();

    if (patients.some(p => p.id.toUpperCase() === cleanId)) {
      setFormError(`Patient with ID "${cleanId}" already exists! Please use a unique Patient ID.`);
      return;
    }

    const newPatient: Patient = {
      id: cleanId,
      name: name.trim(),
      email: email.trim(),
      age: Number(age) || 50,
      gender,
      diagnosis,
      biomarkers: {
        crp: Number(crp) || 20,
        il6: Number(il6) || 15,
        vegf: Number(vegf) || 150,
        wbc: Number(wbc) || 7.5,
        creatinine: Number(creatinine) || 0.9,
        troponin: Number(troponin) || 0.02,
        tnfAlpha: 10.5,
        alt: 28,
        ast: 25,
        hemoglobin: 13.0
      },
      comorbidities: comorbidities ? comorbidities.split(',').map(c => c.trim()) : [],
      priorTreatments: priorTreatments ? priorTreatments.split(',').map(t => t.trim()) : [],
      geneExpression: [2.5, 3.1, 1.8, 4.2, 3.0, 2.7, 4.0, 1.9, 3.5, 2.8]
    };

    onAddPatient(newPatient);
    setSuccessMessage(`Patient ${newPatient.name} (${newPatient.id}) registered successfully!`);
    setFormError('');

    // Reset Form
    setName('');
    setPatientId('');
    setEmail('');
    setPriorTreatments('');
    setComorbidities('');
    setShowAddForm(false);

    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDisease = filterDisease === 'all' || p.diagnosis === filterDisease;

    return matchesSearch && matchesDisease;
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-lg font-bold text-white tracking-tight">Doctor Patient Registry & Management</h2>
            </div>
            <p className="text-xs text-slate-400">
              Register new oncology patients with clinical disease profiles or manage active patient records
            </p>
          </div>

          <button
            onClick={() => { setShowAddForm(!showAddForm); setFormError(''); }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showAddForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
            </svg>
            {showAddForm ? 'Close Form' : '+ Register New Patient'}
          </button>
        </div>

        {successMessage && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </div>
        )}
      </div>

      {/* Add Patient Modal / Accordion Form */}
      {showAddForm && (
        <form onSubmit={handleCreatePatient} className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              New Patient Clinical Onboarding Form
            </h3>
            <p className="text-xs text-slate-400">Fill in mandatory patient identifying details and cancer diagnosis</p>
          </div>

          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
              {formError}
            </div>
          )}

          {/* Mandatory Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Patient Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Robert Vance"
                className="w-full px-3.5 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Patient ID <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="e.g. P-011 or PT-9902"
                className="w-full px-3.5 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Patient Email ID <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@email.com"
                className="w-full px-3.5 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Gender & Age
              </label>
              <div className="flex gap-2">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                  className="w-1/2 px-2 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  placeholder="Age"
                  min={1}
                  max={120}
                  className="w-1/2 px-2 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none text-center"
                />
              </div>
            </div>
          </div>

          {/* Cancer Disease Selector (Mandatory) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Cancer Disease / Diagnosis <span className="text-rose-400">*</span>
            </label>
            <select
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              {CANCER_DISEASES.map((dis) => (
                <option key={dis} value={dis}>{dis}</option>
              ))}
            </select>
          </div>

          {/* Clinical History & Biomarkers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Prior Treatments (Comma-separated)</label>
              <input
                type="text"
                value={priorTreatments}
                onChange={(e) => setPriorTreatments(e.target.value)}
                placeholder="e.g. Cisplatin, Radiotherapy"
                className="w-full px-3.5 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Comorbidities (Comma-separated)</label>
              <input
                type="text"
                value={comorbidities}
                onChange={(e) => setComorbidities(e.target.value)}
                placeholder="e.g. Hypertension, Diabetes"
                className="w-full px-3.5 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Biomarkers sliders */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Biomarker Baseline Values</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">CRP (mg/L): {crp}</label>
                <input type="range" min="1" max="100" step="0.5" value={crp} onChange={(e) => setCrp(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">IL-6 (pg/mL): {il6}</label>
                <input type="range" min="1" max="80" step="0.5" value={il6} onChange={(e) => setIl6(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">VEGF (pg/mL): {vegf}</label>
                <input type="range" min="20" max="400" step="5" value={vegf} onChange={(e) => setVegf(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">WBC Count: {wbc}</label>
                <input type="range" min="2" max="30" step="0.5" value={wbc} onChange={(e) => setWbc(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Creatinine: {creatinine}</label>
                <input type="range" min="0.3" max="3.0" step="0.1" value={creatinine} onChange={(e) => setCreatinine(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Troponin: {troponin}</label>
                <input type="range" min="0.01" max="0.15" step="0.01" value={troponin} onChange={(e) => setTroponin(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700 transition-all cursor-pointer"
            >
              Complete Patient Registration
            </button>
          </div>
        </form>
      )}

      {/* Patient List Search & Table */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, ID, email or disease..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-slate-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <select
              value={filterDisease}
              onChange={(e) => setFilterDisease(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
            >
              <option value="all">All Cancer Diagnoses</option>
              {CANCER_DISEASES.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <span className="text-xs text-slate-400 shrink-0">
              Showing <strong className="text-white">{filteredPatients.length}</strong> of {patients.length} patients
            </span>
          </div>
        </div>

        {/* Patient Table */}
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-semibold border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Patient ID</th>
                <th className="px-4 py-3">Patient Name</th>
                <th className="px-4 py-3">Email ID</th>
                <th className="px-4 py-3">Cancer Disease</th>
                <th className="px-4 py-3">Demographics</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-4 py-3.5 font-mono font-bold text-teal-400">
                    {p.id}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-white">
                    {p.name || `Patient ${p.id}`}
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px]">
                    {p.email || `${p.id.toLowerCase()}@hospital.org`}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium text-[11px]">
                      {p.diagnosis}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-400">
                    {p.gender}, {p.age}y
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => onSelectPatient(p)}
                      className="px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Analyze & Optimize
                    </button>
                    <button
                      onClick={() => onDeletePatient(p.id)}
                      className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      title="Remove patient from registry"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
