import { useState } from 'react';
import { Patient, TreatmentPlan, QuantumOptimizationResult } from '../types';
import { updatePrescribedTreatment, addDoctorSuggestion } from '../utils/patientService';

interface Props {
  treatmentPlan: TreatmentPlan | null;
  quantumResults: QuantumOptimizationResult[];
  selectedPatient: Patient | null;
  isSimulating: boolean;
  currentUser?: { name: string; email: string; role: string; docId?: string } | null;
  onRefreshPatients?: () => void;
}

export default function TreatmentPanel({
  treatmentPlan,
  quantumResults: _qr,
  selectedPatient,
  isSimulating,
  currentUser,
  onRefreshPatients
}: Props) {
  const [prescribeSuccess, setPrescribeSuccess] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [noteCategory, setNoteCategory] = useState<'Clinical Monitoring' | 'Dietary & Nutrition' | 'Medication Regimen' | 'Emergency Precautions'>('Clinical Monitoring');

  if (!selectedPatient) {
    return (
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <p className="text-slate-400 text-sm">Select a patient to generate and prescribe a treatment plan</p>
      </div>
    );
  }

  if (isSimulating) {
    return (
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-12 text-center">
        <div className="animate-spin w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-300 text-sm">Running quantum optimization for {selectedPatient.id}...</p>
        <p className="text-slate-500 text-xs mt-1">Simulating VQE, QAOA, and quantum annealing</p>
      </div>
    );
  }

  if (!treatmentPlan) {
    return (
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-8 text-center">
        <p className="text-slate-400 text-sm">No treatment plan generated yet. Navigate to Quantum Optimization first.</p>
      </div>
    );
  }

  const optimal = treatmentPlan.primaryTreatment;
  const docName = currentUser?.name || selectedPatient.assignedDoctorName || 'Dr. Rajesh Sharma, MD';
  const docId = currentUser?.docId || selectedPatient.assignedDoctorId || 'DOC-1092';

  const handleLockAndPrescribe = (treatmentResult: QuantumOptimizationResult) => {
    const newPrescription = {
      treatmentId: treatmentResult.treatmentId,
      treatmentName: treatmentResult.treatmentName,
      drugClass: 'Targeted Quantum Protocol',
      mechanism: 'Optimized via Variational Quantum Eigensolver (VQE) algorithm specifically matched to tumor biomarker signature.',
      dosageInstructions: `Standard protocol for ${treatmentResult.treatmentName} administered per physician schedule.`,
      cycleFrequency: 'Active Prescribed Regimen (Cycle 1 of 6)',
      quantumEfficacyScore: treatmentResult.effectivenessScore * 100,
      sideEffectRiskScore: treatmentResult.sideEffectScore * 100,
      costEfficiency: {
        estimatedCostUsd: 160000,
        insuranceCoveredPercent: 88,
        patientSavingsEstimated: 44000,
        monthlyEstimatedOutofPocket: 850,
        costEfficiencyTier: 'High Efficiency' as const,
        comparatorCostUsd: 225000
      },
      sideEffects: [
        {
          effect: 'Targeted Sensitivity Reaction',
          severity: 'Moderate' as const,
          managementAdvice: 'Proactive anti-emetics and weekly lab monitoring.'
        }
      ]
    };

    updatePrescribedTreatment(selectedPatient.id, newPrescription);
    setPrescribeSuccess(`Successfully locked and prescribed ${treatmentResult.treatmentName} for ${selectedPatient.name || selectedPatient.id}!`);
    if (onRefreshPatients) onRefreshPatients();
    setTimeout(() => setPrescribeSuccess(''), 4000);
  };

  const handleAddQuickDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNote.trim()) return;

    addDoctorSuggestion(selectedPatient.id, {
      id: `sug-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category: noteCategory,
      message: quickNote.trim(),
      doctorName: docName,
      docId: docId
    });

    setQuickNote('');
    setPrescribeSuccess(`Directive posted to ${selectedPatient.name || selectedPatient.id}'s suggestions board!`);
    if (onRefreshPatients) onRefreshPatients();
    setTimeout(() => setPrescribeSuccess(''), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Supervising Doctor & Patient Context Banner */}
      <div className="bg-slate-900/80 border border-indigo-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🩺</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Supervising Physician: {docName}</span>
              <span className="px-2 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">
                {docId}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Patient: <strong className="text-slate-200">{selectedPatient.name || selectedPatient.id}</strong> ({selectedPatient.diagnosis})
            </p>
          </div>
        </div>

        {prescribeSuccess && (
          <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg font-medium">
            ✓ {prescribeSuccess}
          </div>
        )}
      </div>

      {/* Primary Treatment Plan */}
      <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/5 backdrop-blur-sm rounded-2xl border border-indigo-500/20 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Quantum Optimized Regimen</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Optimized for {selectedPatient.id} ({selectedPatient.diagnosis})
              </p>
            </div>
          </div>

          <button
            onClick={() => handleLockAndPrescribe(optimal)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>✓ Lock & Prescribe to Patient</span>
          </button>
        </div>

        {/* Primary Treatment Card */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-emerald-500/20 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">RECOMMENDED PRIMARY THERAPY</span>
            </div>
            <div className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Quantum Optimal
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{optimal.treatmentName}</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Predicted Response</span>
              <span className="text-xl font-bold text-emerald-400">{(treatmentPlan.predictedResponseRate * 100).toFixed(0)}%</span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Side Effect Risk</span>
              <span className="text-xl font-bold text-amber-400">{(treatmentPlan.sideEffectRisk * 100).toFixed(0)}%</span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Quality of Life</span>
              <span className="text-xl font-bold text-cyan-400">{(treatmentPlan.qualityOfLifeScore * 100).toFixed(0)}%</span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Confidence Interval</span>
              <span className="text-xl font-bold text-indigo-400">
                {(treatmentPlan.confidenceInterval[0] * 100).toFixed(0)}-{(treatmentPlan.confidenceInterval[1] * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Efficacy vs Side Effects gauge */}
          <div className="flex items-center gap-4 bg-slate-800/30 rounded-lg p-3 border border-white/5">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-emerald-400">Treatment Efficacy</span>
                <span className="text-[10px] text-emerald-400 font-mono">{(optimal.effectivenessScore * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  style={{ width: `${optimal.effectivenessScore * 100}%` }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-amber-400">Side Effect Profile</span>
                <span className="text-[10px] text-amber-400 font-mono">{(optimal.sideEffectScore * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-400"
                  style={{ width: `${optimal.sideEffectScore * 100}%` }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-cyan-400">Q-Score</span>
                <span className="text-[10px] text-cyan-400 font-mono">{optimal.quantumScore.toFixed(1)}</span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                  style={{ width: `${optimal.quantumScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Therapies */}
        {treatmentPlan.alternativeTreatments.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-slate-400 mb-2">Alternative Treatment Options</h4>
            <div className="space-y-2">
              {treatmentPlan.alternativeTreatments.map((alt, i) => (
                <div
                  key={alt.treatmentId}
                  className="bg-slate-900/40 rounded-xl p-3 border border-white/5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-slate-600/30 text-slate-400' : 'bg-slate-700/30 text-slate-500'
                    }`}>
                      #{i + 2}
                    </div>
                    <div>
                      <span className="text-sm text-white font-medium">{alt.treatmentName}</span>
                      <div className="flex gap-3 mt-0.5">
                        <span className="text-[10px] text-slate-400">Q-Score: {alt.quantumScore.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400">Efficacy: {(alt.effectivenessScore * 100).toFixed(0)}%</span>
                        <span className="text-[10px] text-slate-400">Side Effects: {(alt.sideEffectScore * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLockAndPrescribe(alt)}
                    className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Prescribe #{i + 2}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Doctor Quick Directives Post Box */}
      <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <span>✍️</span> Post Directives to {selectedPatient.name || selectedPatient.id}'s Suggestions Board
        </h4>

        <form onSubmit={handleAddQuickDirective} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <select
              value={noteCategory}
              onChange={(e) => setNoteCategory(e.target.value as any)}
              className="px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
            >
              <option value="Clinical Monitoring">Clinical Monitoring</option>
              <option value="Dietary & Nutrition">Dietary & Nutrition</option>
              <option value="Medication Regimen">Medication Regimen</option>
              <option value="Emergency Precautions">Emergency Precautions</option>
            </select>

            <input
              type="text"
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="e.g. Schedule baseline PET scan, maintain hydration >2.5L..."
              className="sm:col-span-2 px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none placeholder-slate-500"
              required
            />

            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer hover:from-amber-600 hover:to-orange-700 transition-all"
            >
              Post Directive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
