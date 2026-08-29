import { useState } from 'react';
import { mockPatients, treatmentOptions } from '../data/mockData';
import { optimizeTreatmentPlan } from '../engine/QuantumOptimizer';

interface PatientPortalProps {
  user: { name: string; email: string; role: string; userType?: 'doctor' | 'patient' } | null;
  onBackToDashboard: () => void;
}

export default function PatientPortal({ user, onBackToDashboard }: PatientPortalProps) {
  // Map signed in user or fallback to P-001
  const [selectedPatientId, setSelectedPatientId] = useState<string>('P-001');
  const [activeTab, setActiveTab] = useState<'myPlan' | 'biomarkers' | 'trials' | 'history'>('myPlan');

  const currentPatient = mockPatients.find(p => p.id === selectedPatientId) || mockPatients[0];
  const { plan: treatmentPlan } = optimizeTreatmentPlan(currentPatient, treatmentOptions);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Portal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-emerald-500/20 p-5 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-emerald-500/20">
              {user?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">{user?.name || 'Patient Portal Access'}</h1>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase rounded-full">
                  Verified Patient Access
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Personal Precision Oncology Care Plan & Quantum Optimization Outcomes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {mockPatients.map(p => (
                <option key={p.id} value={p.id}>
                  Switch Record: {p.id} ({p.diagnosis.slice(0, 25)}...)
                </option>
              ))}
            </select>

            <button
              onClick={onBackToDashboard}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Back to Main Dashboard
            </button>
          </div>
        </div>

        {/* Patient Clinical Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-white/5 p-4 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Record ID & Demographics</span>
            <p className="text-sm font-bold text-white mt-1">{currentPatient.id} • {currentPatient.age}y ({currentPatient.gender})</p>
          </div>
          <div className="bg-slate-900/60 border border-white/5 p-4 rounded-xl md:col-span-2">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Primary Oncology Diagnosis</span>
            <p className="text-sm font-bold text-indigo-300 mt-1">{currentPatient.diagnosis}</p>
          </div>
          <div className="bg-slate-900/60 border border-white/5 p-4 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Predicted Quantum Response</span>
            <p className="text-sm font-bold text-emerald-400 mt-1">
              {(treatmentPlan.predictedResponseRate * 100).toFixed(1)}% Response Rate
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-3">
          {[
            { id: 'myPlan' as const, label: 'Optimal Treatment Plan' },
            { id: 'biomarkers' as const, label: 'My Biomarker Health Status' },
            { id: 'trials' as const, label: 'Recommended Clinical Trials' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900/50 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Optimal Treatment Plan */}
        {activeTab === 'myPlan' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-indigo-950/30 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase rounded-lg">
                    ★ #1 Quantum Recommended Therapy
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-2">{treatmentPlan.primaryTreatment.treatmentName}</h2>
                  <p className="text-xs text-slate-400 mt-1">Targeted precision oncology selection calculated using QAOA quantum annealing</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block">Quantum Fit Score</span>
                  <span className="text-3xl font-black text-emerald-400 font-mono">
                    {treatmentPlan.primaryTreatment.quantumScore.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-4">
                <div className="bg-slate-900/70 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block">Efficacy Rating</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {(treatmentPlan.primaryTreatment.effectivenessScore * 100).toFixed(0)}% Effective
                  </span>
                </div>
                <div className="bg-slate-900/70 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block">Toxicity / Side Effect Risk</span>
                  <span className="text-lg font-bold text-amber-400">
                    {(treatmentPlan.primaryTreatment.sideEffectScore * 100).toFixed(0)}% Score
                  </span>
                </div>
                <div className="bg-slate-900/70 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block">Quality of Life Index</span>
                  <span className="text-lg font-bold text-indigo-400">
                    {treatmentPlan.qualityOfLifeScore.toFixed(1)} / 100
                  </span>
                </div>
              </div>
            </div>

            {/* Alternatives */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Alternative Treatment Options</h3>
              <div className="space-y-3">
                {treatmentPlan.alternativeTreatments.map((alt, idx) => (
                  <div key={alt.treatmentId} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs font-bold text-slate-300">Option #{idx + 2}: {alt.treatmentName}</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Efficacy: {(alt.effectivenessScore * 100).toFixed(0)}% | Side Effects: {(alt.sideEffectScore * 100).toFixed(0)}%</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-cyan-400">{alt.quantumScore.toFixed(1)}% Q-Score</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Biomarker Health Status */}
        {activeTab === 'biomarkers' && (
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white">Biomarker & Organ Stress Panel</h3>
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
            <h3 className="text-sm font-bold text-white">Matching Clinical Trials for {currentPatient.diagnosis}</h3>
            <div className="space-y-3">
              {[
                { nct: 'NCT-0582194', title: 'Phase III Trial of Dual Checkpoint Blockade in Refractory Solid Tumors', eligibility: 'Match: 98.4%', phase: 'Phase III' },
                { nct: 'NCT-0490123', title: 'Targeted ADC Monotherapy Evaluation with Biomarker Stratification', eligibility: 'Match: 94.1%', phase: 'Phase II' },
              ].map(t => (
                <div key={t.nct} className="p-4 bg-slate-800/40 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-400 font-bold">{t.nct}</span>
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] rounded">{t.phase}</span>
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
      </div>
    </div>
  );
}
