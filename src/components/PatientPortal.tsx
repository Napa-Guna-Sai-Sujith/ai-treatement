import { useState, useEffect } from 'react';
import { Patient } from '../types';
import { getStoredPatients } from '../utils/patientService';
import { treatmentOptions } from '../data/mockData';
import { optimizeTreatmentPlan } from '../engine/QuantumOptimizer';
import BiomarkerRadar from './BiomarkerRadar';

interface PatientPortalProps {
  patientId: string;
  onLogout: () => void;
}

export default function PatientPortal({ patientId, onLogout }: PatientPortalProps) {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'treatment' | 'economics' | 'sideeffects' | 'biomarkers' | 'trials'>('suggestions');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [acknowledgedSuggestions, setAcknowledgedSuggestions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const all = getStoredPatients();
    const found = all.find(p => p.id.toUpperCase() === patientId.toUpperCase()) || all[0];
    setPatient(found);
  }, [patientId]);

  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Optimize fallback treatment plan if prescribedTreatment is not yet explicitly set
  const { plan } = optimizeTreatmentPlan(patient, treatmentOptions);

  const prescribed = patient.prescribedTreatment || {
    treatmentId: plan.primaryTreatment.treatmentId,
    treatmentName: plan.primaryTreatment.treatmentName,
    drugClass: 'Targeted Quantum-Optimized Therapy',
    mechanism: 'Optimized via Variational Quantum Eigensolver (VQE) algorithm tailored to your genomic and biomarker signature.',
    dosageInstructions: 'Standard clinical infusion protocol administered per physician scheduling.',
    cycleFrequency: 'Cycle 1 of 6 (Scheduled)',
    quantumEfficacyScore: plan.primaryTreatment.effectivenessScore * 100,
    sideEffectRiskScore: plan.primaryTreatment.sideEffectScore * 100,
    costEfficiency: {
      estimatedCostUsd: 150000,
      insuranceCoveredPercent: 88,
      patientSavingsEstimated: 42000,
      monthlyEstimatedOutofPocket: 850,
      costEfficiencyTier: 'High Efficiency' as const,
      comparatorCostUsd: 220000
    },
    sideEffects: [
      {
        effect: 'Mild General Fatigue',
        severity: 'Mild' as const,
        managementAdvice: 'Prioritize adequate hydration and structured afternoon rest periods.'
      },
      {
        effect: 'Digestive Sensitivity / Mild Nausea',
        severity: 'Moderate' as const,
        managementAdvice: 'Take prescribed anti-emetic medications 30 minutes before meal times.'
      }
    ]
  };

  const doctorName = patient.assignedDoctorName || 'Dr. Rajesh Sharma, MD';
  const doctorId = patient.assignedDoctorId || 'DOC-1092';
  const doctorRole = patient.assignedDoctorRole || 'Immunotherapy & Oncology Specialist';
  const doctorEmail = patient.assignedDoctorEmail || 'r.sharma@oncocenter.org';

  const suggestions = patient.doctorSuggestions || [];

  const filteredSuggestions = suggestions.filter(s => {
    if (filterCategory === 'all') return true;
    return s.category === filterCategory;
  });

  const toggleAcknowledge = (id: string) => {
    setAcknowledgedSuggestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Patient Bar */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">Patient Care Portal</h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                  Verified Patient Access
                </span>
              </div>
              <p className="text-xs text-slate-400">Personal AI & Quantum Precision Oncology Record</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-slate-400">Patient ID:</span>
              <span className="font-mono font-bold text-teal-400">{patient.id}</span>
            </div>

            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6 w-full">
        {/* Attending Physician / Superior Doctor Banner ("Undercover Superiorance") */}
        <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/70 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/30 shrink-0">
                🩺
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                    Attending Physician & Clinical Supervisor
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                    Doc ID: {doctorId}
                  </span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">{doctorName}</h2>
                <p className="text-xs text-indigo-300/90 font-medium">{doctorRole}</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span>Direct Clinic Contact: <strong className="text-slate-200">{doctorEmail}</strong></span>
                  <span>• Status: <strong className="text-emerald-400 font-semibold">Active Care Supervision</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Patient Snapshot */}
            <div className="bg-slate-950/70 border border-white/10 rounded-xl p-4 flex items-center gap-4 shrink-0">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Patient Record</span>
                <span className="text-sm font-bold text-white">{patient.name || `Patient ${patient.id}`}</span>
                <span className="text-[11px] text-teal-400 font-mono block">{patient.diagnosis}</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center px-2">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Demographics</span>
                <span className="text-xs font-mono font-bold text-white">
                  {patient.gender}, {patient.age}y
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'suggestions'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Doctor's Suggestions Board ({suggestions.length})
          </button>

          <button
            onClick={() => setActiveTab('treatment')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'treatment'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Prescribed Treatment Plan
          </button>

          <button
            onClick={() => setActiveTab('economics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'economics'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Cost Efficiency & Financials
          </button>

          <button
            onClick={() => setActiveTab('sideeffects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'sideeffects'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Side Effects & Management
          </button>

          <button
            onClick={() => setActiveTab('biomarkers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'biomarkers'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Biomarker Health Status
          </button>

          <button
            onClick={() => setActiveTab('trials')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'trials'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Clinical Trials
          </button>
        </div>

        {/* TAB 1: DOCTOR'S SUGGESTIONS BOARD */}
        {activeTab === 'suggestions' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <h3 className="text-base font-bold text-white">Doctor's Clinical Suggestions Board</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Personal directives, dietary guidance, follow-up tests, and instructions issued by <strong className="text-white">{doctorName}</strong>
                  </p>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-semibold">Filter:</span>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-1.5 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value="all">All Directives ({suggestions.length})</option>
                    <option value="Dietary & Nutrition">Dietary & Nutrition</option>
                    <option value="Medication Regimen">Medication Regimen</option>
                    <option value="Clinical Monitoring">Clinical Monitoring</option>
                    <option value="Emergency Precautions">Emergency Precautions</option>
                    <option value="Lifestyle & Recovery">Lifestyle & Recovery</option>
                  </select>
                </div>
              </div>

              {filteredSuggestions.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No suggestions under this category.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {filteredSuggestions.map((sug) => {
                    const isAck = !!acknowledgedSuggestions[sug.id];
                    return (
                      <div
                        key={sug.id}
                        className={`p-5 rounded-2xl border transition-all space-y-3 relative overflow-hidden ${
                          isAck
                            ? 'bg-slate-900/40 border-emerald-500/30'
                            : sug.category === 'Emergency Precautions'
                              ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-500/10'
                              : 'bg-slate-800/40 border-white/10 hover:border-amber-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            sug.category === 'Dietary & Nutrition' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            sug.category === 'Emergency Precautions' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            sug.category === 'Medication Regimen' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                            sug.category === 'Clinical Monitoring' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                            'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}>
                            {sug.category}
                          </span>

                          <span className="text-[10px] text-slate-400 font-mono">
                            {sug.date}
                          </span>
                        </div>

                        <p className="text-xs text-slate-200 leading-relaxed font-medium">
                          "{sug.message}"
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <span>Prescribed by:</span>
                            <strong className="text-slate-200">{sug.doctorName}</strong>
                            <span className="text-indigo-400 font-mono">({sug.docId})</span>
                          </div>

                          <button
                            onClick={() => toggleAcknowledge(sug.id)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                              isAck
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-white/10'
                            }`}
                          >
                            {isAck ? '✓ Acknowledged' : 'Mark as Read'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRESCRIBED TREATMENT PLAN */}
        {activeTab === 'treatment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Main Prescribed Treatment Card */}
              <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden space-y-5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Doctor-Prescribed Optimal Regimen
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    Quantum VQE Score: {prescribed.quantumEfficacyScore.toFixed(1)}%
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">{prescribed.treatmentName}</h3>
                  <p className="text-xs text-indigo-300 font-semibold mt-0.5">
                    Drug Class: {prescribed.drugClass}
                  </p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-white/5">
                    <strong className="text-emerald-400 block mb-1">Mechanism of Action:</strong>
                    {prescribed.mechanism}
                  </p>
                </div>

                {/* Dosage & Cycle Progress */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-800/60 p-3.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Dosage Protocol</span>
                    <span className="text-xs font-bold text-slate-200 mt-1 block">{prescribed.dosageInstructions}</span>
                  </div>
                  <div className="bg-slate-800/60 p-3.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Treatment Timeline</span>
                    <span className="text-xs font-bold text-teal-400 mt-1 block">{prescribed.cycleFrequency}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-800/60 p-3.5 rounded-xl border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Predicted Efficacy</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">
                      {prescribed.quantumEfficacyScore.toFixed(0)}%
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-3.5 rounded-xl border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Side Effect Risk</span>
                    <span className="text-lg font-bold text-amber-400 font-mono">
                      {prescribed.sideEffectRiskScore.toFixed(0)}%
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-3.5 rounded-xl border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Physician Endorsement</span>
                    <span className="text-xs font-bold text-indigo-300 block mt-1">
                      {doctorName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Alternative Treatments Considered */}
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Alternative Treatment Options Evaluated by Quantum Engine</h4>
                <div className="space-y-3">
                  {plan.alternativeTreatments.slice(0, 3).map((alt, idx) => (
                    <div key={alt.treatmentId} className="p-4 bg-slate-800/40 rounded-xl border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">#{idx + 2} {alt.treatmentName}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Efficacy: {(alt.effectivenessScore * 100).toFixed(0)}% | Toxicity Risk: {(alt.sideEffectScore * 100).toFixed(0)}%
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400">{alt.quantumScore.toFixed(1)}% Q-Score</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Radar Biomarker Profile */}
            <div className="lg:col-span-1 space-y-6">
              <BiomarkerRadar patient={patient} />
            </div>
          </div>
        )}

        {/* TAB 3: COST EFFICIENCY & FINANCIALS */}
        {activeTab === 'economics' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    Health Economics & Treatment Cost-Efficiency Analysis
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Financial optimization metrics calculated for <strong className="text-white">{prescribed.treatmentName}</strong>
                  </p>
                </div>
                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold rounded-lg">
                  Tier: {prescribed.costEfficiency.costEfficiencyTier}
                </span>
              </div>

              {/* High-level cost cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Total Regimen Cost</span>
                  <p className="text-xl font-bold font-mono text-white mt-1">
                    ${prescribed.costEfficiency.estimatedCostUsd.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-500">Benchmark: ${prescribed.costEfficiency.comparatorCostUsd.toLocaleString()}</span>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Estimated Insurance Coverage</span>
                  <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
                    {prescribed.costEfficiency.insuranceCoveredPercent}%
                  </p>
                  <span className="text-[10px] text-slate-500">Tier 1 Formulary Authorization</span>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Quantum Cost Savings</span>
                  <p className="text-xl font-bold font-mono text-cyan-400 mt-1">
                    +${prescribed.costEfficiency.patientSavingsEstimated.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-500">vs standard hospital chemo</span>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Monthly Out-of-Pocket</span>
                  <p className="text-xl font-bold font-mono text-amber-400 mt-1">
                    ${prescribed.costEfficiency.monthlyEstimatedOutofPocket}/mo
                  </p>
                  <span className="text-[10px] text-slate-500">With co-pay assistance</span>
                </div>
              </div>

              {/* Comparison Visualizer */}
              <div className="bg-slate-950/60 p-5 rounded-xl border border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Comparative Cost Efficiency Breakdown</h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-emerald-400 font-semibold">Prescribed Plan: {prescribed.treatmentName}</span>
                      <span className="text-emerald-400 font-mono font-bold">${prescribed.costEfficiency.estimatedCostUsd.toLocaleString()}</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${(prescribed.costEfficiency.estimatedCostUsd / prescribed.costEfficiency.comparatorCostUsd) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Traditional Un-optimized Chemotherapy Regimen</span>
                      <span className="text-slate-400 font-mono">${prescribed.costEfficiency.comparatorCostUsd.toLocaleString()}</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-600 rounded-full w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SIDE EFFECTS & DOCTOR MITIGATION ADVICE */}
        {activeTab === 'sideeffects' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                    Anticipated Side Effects & Doctor Mitigation Advice
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Proactive management strategies prescribed for <strong className="text-white">{prescribed.treatmentName}</strong>
                  </p>
                </div>
                <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-lg">
                  Toxicity Score: {prescribed.sideEffectRiskScore.toFixed(0)}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prescribed.sideEffects.map((se, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-2xl border space-y-3 ${
                      se.severity === 'High Alert'
                        ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-500/10'
                        : se.severity === 'Moderate'
                          ? 'bg-amber-950/20 border-amber-500/30'
                          : 'bg-slate-800/40 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{se.effect}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        se.severity === 'High Alert' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        se.severity === 'Moderate' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {se.severity}
                      </span>
                    </div>

                    <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-purple-400 block font-semibold mb-1">Doctor's Mitigation Advice:</span>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {se.managementAdvice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Emergency Hotline Alert */}
              <div className="p-4 bg-slate-950/80 border border-rose-500/30 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <h5 className="text-xs font-bold text-white">24/7 Clinical Emergency Hotline</h5>
                    <p className="text-[11px] text-slate-400">If you experience persistent high fever or acute breathlessness, call directly.</p>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-mono font-bold shrink-0">
                  +1 (800) 555-ONCO-CARE
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BIOMARKERS PANEL */}
        {activeTab === 'biomarkers' && (
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Biomarker & Organ Stress Values</h3>
              <p className="text-xs text-slate-400">Current blood test and vital biomarker lab values for Patient {patient.id}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'CRP Inflammatory', value: patient.biomarkers.crp, unit: 'mg/L', normal: '< 10' },
                { label: 'IL-6 Cytokine', value: patient.biomarkers.il6, unit: 'pg/mL', normal: '< 15' },
                { label: 'VEGF Angiogenesis', value: patient.biomarkers.vegf, unit: 'pg/mL', normal: '< 150' },
                { label: 'WBC Count', value: patient.biomarkers.wbc, unit: '10^9/L', normal: '4.5 - 11' },
                { label: 'Creatinine (Kidney)', value: patient.biomarkers.creatinine, unit: 'mg/dL', normal: '0.6 - 1.2' },
                { label: 'Troponin (Cardiac)', value: patient.biomarkers.troponin, unit: 'ng/mL', normal: '< 0.04' },
                { label: 'ALT (Liver)', value: patient.biomarkers.alt, unit: 'U/L', normal: '7 - 56' },
                { label: 'Hemoglobin', value: patient.biomarkers.hemoglobin, unit: 'g/dL', normal: '12 - 16' },
              ].map(b => (
                <div key={b.label} className="p-4 bg-slate-800/40 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">{b.label}</span>
                  <p className="text-lg font-bold font-mono text-white">{b.value} <span className="text-xs text-slate-500 font-normal">{b.unit}</span></p>
                  <span className="text-[9px] text-slate-500 block">Ref: {b.normal}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CLINICAL TRIALS */}
        {activeTab === 'trials' && (
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Matching Clinical Trials</h3>
              <p className="text-xs text-slate-400">Targeted trial protocols matched to {patient.diagnosis}</p>
            </div>

            <div className="space-y-3">
              {[
                { nct: 'NCT-0582194', title: 'Phase III Trial of Dual Checkpoint Blockade in Refractory Solid Tumors', eligibility: 'Match: 98.4%', phase: 'Phase III' },
                { nct: 'NCT-0490123', title: 'Targeted ADC Monotherapy Evaluation with Biomarker Stratification', eligibility: 'Match: 94.1%', phase: 'Phase II' },
                { nct: 'NCT-0612984', title: 'Quantum Annealing Guided Personalized Neoantigen Immunotherapy', eligibility: 'Match: 91.8%', phase: 'Phase I/II' },
              ].map(t => (
                <div key={t.nct} className="p-4 bg-slate-800/40 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-teal-400 font-bold">{t.nct}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">{t.phase}</span>
                    </div>
                    <p className="text-xs text-slate-200 mt-1 font-medium">{t.title}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg shrink-0">
                    {t.eligibility}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
