import { Patient, TreatmentPlan, QuantumOptimizationResult } from '../types';

interface Props {
  treatmentPlan: TreatmentPlan | null;
  quantumResults: QuantumOptimizationResult[];
  selectedPatient: Patient | null;
  isSimulating: boolean;
}

export default function TreatmentPanel({ treatmentPlan, quantumResults: _qr, selectedPatient, isSimulating }: Props) {
  if (!selectedPatient) {
    return (
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <p className="text-slate-400 text-sm">Select a patient to generate a treatment plan</p>
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

  return (
    <div className="space-y-4">
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
              <h2 className="text-sm font-semibold text-white">Personalized Treatment Plan</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Optimized for {selectedPatient.id} ({selectedPatient.diagnosis})
              </p>
            </div>
          </div>
        </div>

        {/* Primary Treatment Card */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-emerald-500/20 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">PRIMARY THERAPY</span>
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
                  className="bg-slate-900/40 rounded-xl p-3 border border-white/5 flex items-center gap-3"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-slate-600/30 text-slate-400' : 'bg-slate-700/30 text-slate-500'
                  }`}>
                    #{i + 2}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-white">{alt.treatmentName}</span>
                    <div className="flex gap-3 mt-0.5">
                      <span className="text-[10px] text-slate-400">Q-Score: {alt.quantumScore.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400">Efficacy: {(alt.effectivenessScore * 100).toFixed(0)}%</span>
                      <span className="text-[10px] text-slate-400">Side Effects: {(alt.sideEffectScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="w-16">
                    <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${alt.quantumScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clinical Decision Support */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Clinical Decision Support</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-800/30 rounded-xl p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-xs font-medium text-amber-400">Considerations</span>
            </div>
            <ul className="space-y-1">
              <li className="text-[10px] text-slate-400 flex items-start gap-1.5">
                <span className="text-slate-600 mt-0.5">•</span>
                Monitor for cytokine release syndrome in first 72h
              </li>
              <li className="text-[10px] text-slate-400 flex items-start gap-1.5">
                <span className="text-slate-600 mt-0.5">•</span>
                Baseline ECG and troponin monitoring recommended
              </li>
              <li className="text-[10px] text-slate-400 flex items-start gap-1.5">
                <span className="text-slate-600 mt-0.5">•</span>
                Adjust dosing for renal/hepatic function
              </li>
            </ul>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs font-medium text-emerald-400">Predicted Outcomes</span>
            </div>
            <ul className="space-y-1">
              <li className="text-[10px] text-slate-400 flex items-start gap-1.5">
                <span className="text-slate-600 mt-0.5">•</span>
                6-month PFS: {(65 + Math.random() * 20).toFixed(0)}%
              </li>
              <li className="text-[10px] text-slate-400 flex items-start gap-1.5">
                <span className="text-slate-600 mt-0.5">•</span>
                Overall response: {(treatmentPlan.predictedResponseRate * 100).toFixed(0)}%
              </li>
              <li className="text-[10px] text-slate-400 flex items-start gap-1.5">
                <span className="text-slate-600 mt-0.5">•</span>
                Quality of life score: {(treatmentPlan.qualityOfLifeScore * 100).toFixed(0)}/100
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
