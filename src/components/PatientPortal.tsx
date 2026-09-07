import { useState } from 'react';
import { Patient } from '../types';
import { mockPatients, treatmentOptions } from '../data/mockData';
import { optimizeTreatmentPlan } from '../engine/QuantumOptimizer';
import BiomarkerRadar from './BiomarkerRadar';

interface PatientPortalProps {
  patientId: string;
  onLogout: () => void;
}

export default function PatientPortal({ patientId, onLogout }: PatientPortalProps) {
  const [activeTab, setActiveTab] = useState<'treatment' | 'biomarkers' | 'trials'>('treatment');

  // Locate the patient or fallback to P-001
  const currentPatient: Patient = mockPatients.find(
    p => p.id.toUpperCase() === patientId.toUpperCase()
  ) || mockPatients[0];

  // Optimize treatment plan for this patient
  const { plan } = optimizeTreatmentPlan(currentPatient, treatmentOptions);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Patient Portal Header */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <span className="font-mono font-bold text-teal-400">{currentPatient.id}</span>
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
        {/* Patient Summary Card */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-slate-900/40 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">Active Treatment Plan</span>
                <span className="px-2.5 py-0.5 bg-slate-800 border border-white/10 rounded-md text-xs font-mono text-slate-300">ID: {currentPatient.id}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{currentPatient.diagnosis}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span>Age: <strong className="text-slate-200">{currentPatient.age} years</strong></span>
                <span>Gender: <strong className="text-slate-200">{currentPatient.gender}</strong></span>
                <span>Prior Therapies: <strong className="text-indigo-400">{currentPatient.priorTreatments.join(', ') || 'None'}</strong></span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-white/10 rounded-xl p-4 flex items-center gap-4 shrink-0">
              <div className="text-center px-2">
                <span className="text-[10px] text-slate-400 block uppercase">Predicted Response</span>
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {(plan.predictedResponseRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center px-2">
                <span className="text-[10px] text-slate-400 block uppercase">Quality of Life</span>
                <span className="text-xl font-mono font-bold text-cyan-400">
                  {plan.qualityOfLifeScore.toFixed(0)}/100
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('treatment')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'treatment'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            My Treatment Recommendation
          </button>

          <button
            onClick={() => setActiveTab('biomarkers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'biomarkers'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
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
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'trials'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Eligible Clinical Trials
          </button>
        </div>

        {/* Tab 1: Primary Treatment */}
        {activeTab === 'treatment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Primary Drug Card */}
              <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Recommended Primary Therapy
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    Quantum Score: {plan.primaryTreatment.quantumScore.toFixed(1)}%
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{plan.primaryTreatment.treatmentName}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Optimized via Variational Quantum Eigensolver (VQE) algorithm specifically matched to your biomarker expression signature.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-800/60 p-3.5 rounded-xl border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase">Effectiveness</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">
                      {(plan.primaryTreatment.effectivenessScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-3.5 rounded-xl border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase">Side Effect Risk</span>
                    <span className="text-lg font-bold text-amber-400 font-mono">
                      {(plan.primaryTreatment.sideEffectScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-3.5 rounded-xl border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase">Drug Safety</span>
                    <span className="text-lg font-bold text-teal-400 font-mono">
                      {(plan.primaryTreatment.drugInteractionScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Alternative Options */}
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider text-xs">Alternative Treatment Regimens</h4>
                <div className="space-y-3">
                  {plan.alternativeTreatments.slice(0, 3).map((alt, idx) => (
                    <div key={alt.treatmentId} className="p-4 bg-slate-800/40 rounded-xl border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">#{idx + 2} {alt.treatmentName}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Efficacy: {(alt.effectivenessScore * 100).toFixed(0)}% | Side Effects: {(alt.sideEffectScore * 100).toFixed(0)}%
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
              <BiomarkerRadar patient={currentPatient} />
            </div>
          </div>
        )}

        {/* Tab 2: Biomarkers Panel */}
        {activeTab === 'biomarkers' && (
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Biomarker & Organ Stress Values</h3>
              <p className="text-xs text-slate-400">Current blood test and vital biomarker lab values for Patient {currentPatient.id}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'CRP Inflammatory', value: currentPatient.biomarkers.crp, unit: 'mg/L', normal: '< 10' },
                { label: 'IL-6 Cytokine', value: currentPatient.biomarkers.il6, unit: 'pg/mL', normal: '< 15' },
                { label: 'VEGF Angiogenesis', value: currentPatient.biomarkers.vegf, unit: 'pg/mL', normal: '< 150' },
                { label: 'WBC Count', value: currentPatient.biomarkers.wbc, unit: '10^9/L', normal: '4.5 - 11' },
                { label: 'Creatinine (Kidney)', value: currentPatient.biomarkers.creatinine, unit: 'mg/dL', normal: '0.6 - 1.2' },
                { label: 'Troponin (Cardiac)', value: currentPatient.biomarkers.troponin, unit: 'ng/mL', normal: '< 0.04' },
                { label: 'ALT (Liver)', value: currentPatient.biomarkers.alt, unit: 'U/L', normal: '7 - 56' },
                { label: 'Hemoglobin', value: currentPatient.biomarkers.hemoglobin, unit: 'g/dL', normal: '12 - 16' },
              ].map(b => (
                <div key={b.label} className="p-4 bg-slate-800/40 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase block">{b.label}</span>
                  <p className="text-lg font-bold font-mono text-white">{b.value} <span className="text-xs text-slate-500 font-normal">{b.unit}</span></p>
                  <span className="text-[9px] text-slate-500 block">Ref: {b.normal}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Clinical Trials */}
        {activeTab === 'trials' && (
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Matching Clinical Trials</h3>
              <p className="text-xs text-slate-400">Targeted trial protocols matched to {currentPatient.diagnosis}</p>
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
