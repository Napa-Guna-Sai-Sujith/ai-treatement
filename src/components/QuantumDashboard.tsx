import { useState } from 'react';
import { Patient, QuantumOptimizationResult } from '../types';

interface Props {
  isSimulating: boolean;
  simProgress: number;
  quantumResults: QuantumOptimizationResult[];
  selectedPatient: Patient | null;
}

export default function QuantumDashboard({ isSimulating, simProgress, quantumResults, selectedPatient }: Props) {
  const [circuitDepth, setCircuitDepth] = useState<number>(4);
  const [shotCount, setShotCount] = useState<number>(1024);
  const [quantumNoiseModel, setQuantumNoiseModel] = useState<string>('Depolarizing Noise (0.02%)');

  // Simulate quantum state visualization data

  const generateQubitStates = () => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      amplitude: isSimulating
        ? Math.abs(Math.sin(Date.now() / 1000 + i * 0.8))
        : quantumResults.length > 0
          ? quantumResults[0].quantumScore * (1 - i * 0.1)
          : 0.5,
      phase: isSimulating
        ? ((Date.now() / 500 + i * 45) % 360)
        : (i * 45),
    }));
  };

  const qubits = generateQubitStates();

  return (
    <div className="space-y-4">
      {/* Quantum Optimization Header */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Quantum Optimization Engine</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isSimulating
                ? 'Running simulated VQE + QAOA optimization...'
                : quantumResults.length > 0
                  ? 'Optimization complete — optimal treatment identified'
                  : 'Select a patient and run optimization'}
            </p>
          </div>
          {isSimulating && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs text-cyan-400 font-medium">Optimizing</span>
            </div>
          )}
        </div>

        {/* Qubit Visualization */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5 mb-4 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs font-medium text-cyan-400">Quantum State |ψ⟩ Superposition</span>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap py-2 relative">
            {qubits.map((qubit) => (
              <div key={qubit.id} className="flex flex-col items-center">
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative z-10"
                    style={{
                      background: `conic-gradient(from ${qubit.phase}deg, #06b6d4, #6366f1, #a855f7, #06b6d4)`,
                      opacity: 0.3 + qubit.amplitude * 0.7,
                      transform: `scale(${Math.min(1.2, 0.6 + qubit.amplitude * 0.4)})`,
                    }}
                  >
                    <div className="w-5 h-5 rounded-full bg-slate-900/80 flex items-center justify-center">
                      <span className="text-[8px] font-mono text-cyan-300 font-bold">|ψ⟩</span>
                    </div>
                  </div>
                  <div
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full animate-ping z-20 pointer-events-none"
                    style={{
                      backgroundColor: `hsl(${qubit.phase}, 80%, 60%)`,
                      opacity: qubit.amplitude,
                    }}
                  />
                </div>
                <span className="text-[9px] text-slate-500 mt-1 font-mono">q[{qubit.id}]</span>
                <span className="text-[8px] text-slate-400 font-mono">{qubit.amplitude.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          {isSimulating && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400">Quantum Annealing Progress</span>
                <span className="text-[10px] text-cyan-400 font-mono">{simProgress.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${simProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-slate-600 mt-1">
                <span>Initial state |ψ₀⟩</span>
                <span>VQE iterations</span>
                <span>Optimal |ψ*⟩</span>
              </div>
            </div>
          )}

          {/* Quantum Circuit Parameter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Ansatz Circuit Depth: {circuitDepth} p-layers</label>
              <input
                type="range"
                min="1"
                max="10"
                value={circuitDepth}
                onChange={(e) => setCircuitDepth(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Shots (Sampling): {shotCount}</label>
              <select
                value={shotCount}
                onChange={(e) => setShotCount(parseInt(e.target.value))}
                className="w-full px-2 py-1 bg-slate-800 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="512">512 Shots</option>
                <option value="1024">1024 Shots</option>
                <option value="4096">4096 Shots (High Precision)</option>
                <option value="8192">8192 Shots (Research Grade)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Quantum Noise Simulator</label>
              <select
                value={quantumNoiseModel}
                onChange={(e) => setQuantumNoiseModel(e.target.value)}
                className="w-full px-2 py-1 bg-slate-800 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Ideal (No Noise)">Ideal State Vector</option>
                <option value="Depolarizing Noise (0.02%)">Depolarizing Noise (0.02%)</option>
                <option value="Thermal Relaxation T1/T2">Thermal Relaxation T1/T2</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {quantumResults.length > 0 && (
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Optimization Results — Ranked by Quantum Score</h3>
          <div className="space-y-2">
            {quantumResults.slice(0, 5).map((result, index) => (
              <div
                key={result.treatmentId}
                className={`rounded-xl p-3 border transition-all duration-300 ${
                  result.isOptimal
                    ? 'bg-emerald-600/10 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                    : 'bg-slate-800/30 border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    index === 0
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : index === 1
                        ? 'bg-slate-600/30 text-slate-400'
                        : 'bg-slate-700/30 text-slate-500'
                  }`}>
                    #{index + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{result.treatmentName}</span>
                      {result.isOptimal && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                          OPTIMAL
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4 mt-1">
                      <span className="text-[10px] text-slate-400">
                        Q-Score: <span className="text-cyan-400 font-mono">{result.quantumScore.toFixed(1)}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Efficacy: <span className="text-emerald-400 font-mono">{(result.effectivenessScore * 100).toFixed(0)}%</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Side Effects: <span className="text-amber-400 font-mono">{(result.sideEffectScore * 100).toFixed(0)}%</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Interaction: <span className="text-indigo-400 font-mono">{(result.drugInteractionScore * 100).toFixed(0)}%</span>
                      </span>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="w-24">
                    <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${result.quantumScore}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-500 mt-0.5 block text-right">
                      Convergence: {result.convergenceIterations} iters
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedPatient && !isSimulating && quantumResults.length === 0 && (
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm">Select a patient to run quantum optimization</p>
        </div>
      )}
    </div>
  );
}
