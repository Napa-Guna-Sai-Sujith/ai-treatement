import React, { useState } from 'react';
import { Patient, DoctorSuggestion, TreatmentOption } from '../types';
import { treatmentOptions } from '../data/mockData';
import { addDoctorSuggestion, deleteDoctorSuggestion, updatePrescribedTreatment } from '../utils/patientService';

interface PatientManagerProps {
  patients: Patient[];
  currentUser?: { name: string; email: string; role: string; docId?: string } | null;
  onAddPatient: (patient: Patient) => void;
  onDeletePatient: (patientId: string) => void;
  onSelectPatient: (patient: Patient) => void;
  onRefreshPatients?: () => void;
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

export default function PatientManager({
  patients,
  currentUser,
  onAddPatient,
  onDeletePatient,
  onSelectPatient,
  onRefreshPatients
}: PatientManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDisease, setFilterDisease] = useState('all');
  const [scopeFilter, setScopeFilter] = useState<'mine' | 'all'>('mine');

  // Currently open patient for Directives & Suggestions Editor
  const [activeManagingPatient, setActiveManagingPatient] = useState<Patient | null>(null);

  // New suggestion form state
  const [newSugCategory, setNewSugCategory] = useState<DoctorSuggestion['category']>('Clinical Monitoring');
  const [newSugMessage, setNewSugMessage] = useState('');

  // Treatment change state
  const [selectedTreatmentId, setSelectedTreatmentId] = useState('');

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

  const currentDoctorId = currentUser?.docId || 'DOC-1092';
  const currentDoctorName = currentUser?.name || 'Dr. Rajesh Sharma, MD';
  const currentDoctorRole = currentUser?.role || 'Medical Oncologist';
  const currentDoctorEmail = currentUser?.email || 'r.sharma@oncocenter.org';

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
      assignedDoctorId: currentDoctorId,
      assignedDoctorName: currentDoctorName,
      assignedDoctorRole: currentDoctorRole,
      assignedDoctorEmail: currentDoctorEmail,
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
      geneExpression: [2.5, 3.1, 1.8, 4.2, 3.0, 2.7, 4.0, 1.9, 3.5, 2.8],
      doctorSuggestions: [
        {
          id: `sug-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          category: 'Clinical Monitoring',
          message: `Initial patient onboarding by ${currentDoctorName}. Baseline blood panel and radiological evaluation ordered.`,
          doctorName: currentDoctorName,
          docId: currentDoctorId
        }
      ],
      prescribedTreatment: {
        treatmentId: 'T-001',
        treatmentName: 'Pembrolizumab (Keytruda) Targeted Protocol',
        drugClass: 'PD-1 Checkpoint Inhibitor',
        mechanism: 'Immune checkpoint inhibition to restore cytotoxic T-cell antitumor activity.',
        dosageInstructions: '200 mg IV infusion every 3 weeks.',
        cycleFrequency: 'Cycle 1 (Initial Setup)',
        quantumEfficacyScore: 88.0,
        sideEffectRiskScore: 21.0,
        costEfficiency: {
          estimatedCostUsd: 150000,
          insuranceCoveredPercent: 88,
          patientSavingsEstimated: 42000,
          monthlyEstimatedOutofPocket: 850,
          costEfficiencyTier: 'High Efficiency',
          comparatorCostUsd: 220000
        },
        sideEffects: [
          {
            effect: 'Mild Fatigue & Lethargy',
            severity: 'Mild',
            managementAdvice: 'Structured hydration and rest intervals.'
          },
          {
            effect: 'Low-Grade Rash',
            severity: 'Mild',
            managementAdvice: 'Apply hydrocortisone 1% cream as prescribed.'
          }
        ]
      }
    };

    onAddPatient(newPatient);
    setSuccessMessage(`Patient ${newPatient.name} (${newPatient.id}) registered and assigned to ${currentDoctorName}!`);
    setFormError('');

    // Reset Form
    setName('');
    setPatientId('');
    setEmail('');
    setPriorTreatments('');
    setComorbidities('');
    setShowAddForm(false);

    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleAddSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeManagingPatient || !newSugMessage.trim()) return;

    const newSuggestion: DoctorSuggestion = {
      id: `sug-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category: newSugCategory,
      message: newSugMessage.trim(),
      doctorName: currentDoctorName,
      docId: currentDoctorId
    };

    const updated = addDoctorSuggestion(activeManagingPatient.id, newSuggestion);
    const updatedActive = updated.find(p => p.id === activeManagingPatient.id);
    if (updatedActive) setActiveManagingPatient(updatedActive);
    setNewSugMessage('');
    if (onRefreshPatients) onRefreshPatients();
  };

  const handleDeleteSuggestion = (sugId: string) => {
    if (!activeManagingPatient) return;
    const updated = deleteDoctorSuggestion(activeManagingPatient.id, sugId);
    const updatedActive = updated.find(p => p.id === activeManagingPatient.id);
    if (updatedActive) setActiveManagingPatient(updatedActive);
    if (onRefreshPatients) onRefreshPatients();
  };

  const handleUpdateTreatmentSelection = (treatmentOpt: TreatmentOption) => {
    if (!activeManagingPatient) return;

    const newPrescription = {
      treatmentId: treatmentOpt.id,
      treatmentName: treatmentOpt.name,
      drugClass: treatmentOpt.drugClass,
      mechanism: treatmentOpt.mechanism,
      dosageInstructions: `Standard protocol for ${treatmentOpt.name} administered per physician schedule.`,
      cycleFrequency: 'Active Prescribed Regimen',
      quantumEfficacyScore: treatmentOpt.efficacy * 100,
      sideEffectRiskScore: treatmentOpt.sideEffectScore * 100,
      costEfficiency: {
        estimatedCostUsd: treatmentOpt.cost,
        insuranceCoveredPercent: 88,
        patientSavingsEstimated: Math.round(treatmentOpt.cost * 0.25),
        monthlyEstimatedOutofPocket: 900,
        costEfficiencyTier: 'High Efficiency' as const,
        comparatorCostUsd: Math.round(treatmentOpt.cost * 1.35)
      },
      sideEffects: [
        {
          effect: `Treatment-related sensitivity to ${treatmentOpt.drugClass}`,
          severity: 'Moderate' as const,
          managementAdvice: 'Follow clinical monitoring protocol and notify care team if persistent symptoms occur.'
        }
      ]
    };

    const updated = updatePrescribedTreatment(activeManagingPatient.id, newPrescription);
    const updatedActive = updated.find(p => p.id === activeManagingPatient.id);
    if (updatedActive) setActiveManagingPatient(updatedActive);
    if (onRefreshPatients) onRefreshPatients();
  };

  // Filter patients based on Doctor assignment scope, search, and disease
  const filteredPatients = patients.filter(p => {
    const isMyPatient = (p.assignedDoctorId || '').toUpperCase() === currentDoctorId.toUpperCase() ||
      (p.assignedDoctorName || '').toLowerCase().includes(currentDoctorName.toLowerCase());

    const matchesScope = scopeFilter === 'all' ? true : isMyPatient;

    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.assignedDoctorName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDisease = filterDisease === 'all' || p.diagnosis === filterDisease;

    return matchesScope && matchesSearch && matchesDisease;
  });

  const myPatientsCount = patients.filter(p => 
    (p.assignedDoctorId || '').toUpperCase() === currentDoctorId.toUpperCase() ||
    (p.assignedDoctorName || '').toLowerCase().includes(currentDoctorName.toLowerCase())
  ).length;

  return (
    <div className="space-y-6 font-sans">
      {/* Header section with Doctor Context Banner */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-lg font-bold text-white tracking-tight">Doctor Patient Registry & Supervision</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-mono font-bold">
                Doc ID: {currentDoctorId} ({currentDoctorName})
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage your assigned oncology patients, prescribe treatments, and issue clinical directives to patients' suggestion boards
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

      {/* MODAL / PANEL: DOCTOR SUGGESTIONS & PRESCRIPTION MANAGEMENT */}
      {activeManagingPatient && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 backdrop-blur-2xl shadow-2xl space-y-6 animate-fade-in relative">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-amber-500/20">
                ✍️
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Doctor Directives & Suggestions for {activeManagingPatient.name} ({activeManagingPatient.id})
                </h3>
                <p className="text-xs text-slate-400">
                  Diagnosis: <strong className="text-teal-300">{activeManagingPatient.diagnosis}</strong> • Supervising Doctor: <strong className="text-indigo-300">{activeManagingPatient.assignedDoctorName || currentDoctorName}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveManagingPatient(null)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close Editor
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Add New Suggestion Form & Existing List */}
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-white/5 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  + Add Clinical Suggestion to Patient's Board
                </span>
                <form onSubmit={handleAddSuggestion} className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">Directive Category</label>
                    <select
                      value={newSugCategory}
                      onChange={(e) => setNewSugCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                    >
                      <option value="Dietary & Nutrition">Dietary & Nutrition</option>
                      <option value="Medication Regimen">Medication Regimen</option>
                      <option value="Clinical Monitoring">Clinical Monitoring</option>
                      <option value="Emergency Precautions">Emergency Precautions</option>
                      <option value="Lifestyle & Recovery">Lifestyle & Recovery</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">Suggestion / Instructions Message</label>
                    <textarea
                      rows={3}
                      value={newSugMessage}
                      onChange={(e) => setNewSugMessage(e.target.value)}
                      placeholder="e.g. Maintain hydration > 2.5L daily, avoid NSAIDs, schedule follow-up CT scan on Week 6..."
                      className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder-slate-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 hover:from-amber-600 hover:to-orange-700 transition-all cursor-pointer"
                  >
                    Post Directive to Patient Board
                  </button>
                </form>
              </div>

              {/* Existing Suggestions for this patient */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Active Directives on Patient Board ({(activeManagingPatient.doctorSuggestions || []).length})
                </span>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {(activeManagingPatient.doctorSuggestions || []).map((sug) => (
                    <div key={sug.id} className="p-3 bg-slate-800/50 rounded-xl border border-white/5 flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-bold uppercase">
                            {sug.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{sug.date}</span>
                        </div>
                        <p className="text-slate-200">{sug.message}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteSuggestion(sug.id)}
                        className="text-rose-400 hover:text-rose-300 p-1 text-[11px] font-bold"
                        title="Delete directive"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Prescribe / Switch Treatment Regimen */}
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-white/5 space-y-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Selected Prescribed Treatment Plan
                </span>

                {activeManagingPatient.prescribedTreatment ? (
                  <div className="p-3.5 bg-slate-800/60 rounded-xl border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{activeManagingPatient.prescribedTreatment.treatmentName}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {activeManagingPatient.prescribedTreatment.quantumEfficacyScore.toFixed(0)}% Efficacy
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-300 font-medium">{activeManagingPatient.prescribedTreatment.drugClass}</p>
                    <p className="text-[11px] text-slate-400">{activeManagingPatient.prescribedTreatment.mechanism}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
                      <span>Timeline: <strong className="text-slate-200">{activeManagingPatient.prescribedTreatment.cycleFrequency}</strong></span>
                      <span>Cost: <strong className="text-cyan-400 font-mono">${activeManagingPatient.prescribedTreatment.costEfficiency.estimatedCostUsd.toLocaleString()}</strong></span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No custom treatment plan locked. Quantum optimal plan will be used.</p>
                )}

                <div className="pt-2">
                  <label className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">
                    Change / Prescribe Alternative Oncology Regimen:
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedTreatmentId}
                      onChange={(e) => setSelectedTreatmentId(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                    >
                      <option value="">Select Treatment...</option>
                      {treatmentOptions.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.drugClass})</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        const opt = treatmentOptions.find(t => t.id === selectedTreatmentId);
                        if (opt) handleUpdateTreatmentSelection(opt);
                      }}
                      disabled={!selectedTreatmentId}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                    >
                      Assign Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal / Form */}
      {showAddForm && (
        <form onSubmit={handleCreatePatient} className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              New Patient Clinical Onboarding (Assigned to {currentDoctorName})
            </h3>
            <p className="text-xs text-slate-400">Fill in mandatory patient details. The patient will be assigned under your supervision.</p>
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
                placeholder="e.g. Arthur Miller"
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

      {/* Patient List Search, Scope Toggle & Table */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Scope Switcher: My Assigned Patients vs All Patients */}
            <div className="flex bg-slate-800/80 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setScopeFilter('mine')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  scopeFilter === 'mine'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                My Assigned Patients ({myPatientsCount})
              </button>
              <button
                onClick={() => setScopeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  scopeFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Hospital Patients ({patients.length})
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient, doc, or ID..."
                className="w-full px-3.5 py-2 bg-slate-800/80 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-slate-500"
              />
            </div>

            <select
              value={filterDisease}
              onChange={(e) => setFilterDisease(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
            >
              <option value="all">All Diagnoses</option>
              {CANCER_DISEASES.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Patient Table */}
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-semibold border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Patient ID</th>
                <th className="px-4 py-3">Patient Name</th>
                <th className="px-4 py-3">Supervising Doctor</th>
                <th className="px-4 py-3">Cancer Disease</th>
                <th className="px-4 py-3">Directives / Plan</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPatients.map((p) => {
                const isMine = (p.assignedDoctorId || '').toUpperCase() === currentDoctorId.toUpperCase();
                return (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-4 py-3.5 font-mono font-bold text-teal-400">
                      {p.id}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-white">
                      <div>{p.name || `Patient ${p.id}`}</div>
                      <span className="text-[10px] text-slate-500 font-mono">{p.email}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          isMine ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-white/10'
                        }`}>
                          {p.assignedDoctorName || 'Dr. Rajesh Sharma, MD'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium text-[11px]">
                        {p.diagnosis}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[11px] text-slate-300">
                        <span className="text-amber-400 font-semibold">{(p.doctorSuggestions || []).length} Suggestions</span>
                        <p className="text-[10px] text-slate-500 truncate max-w-xs">
                          {p.prescribedTreatment?.treatmentName || 'Quantum AI Optimal'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => setActiveManagingPatient(p)}
                        className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        title="Doctor Directives & Suggestions Editor"
                      >
                        ✍️ Directives ({ (p.doctorSuggestions || []).length })
                      </button>
                      <button
                        onClick={() => onSelectPatient(p)}
                        className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Analyze
                      </button>
                      <button
                        onClick={() => onDeletePatient(p.id)}
                        className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        title="Remove patient from registry"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
