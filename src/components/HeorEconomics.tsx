import { Patient, TreatmentPlan } from '../types';

interface Props {
  patient: Patient | null;
  treatmentPlan: TreatmentPlan | null;
}

export default function HeorEconomics({ patient, treatmentPlan }: Props) {
  if (!patient || !treatmentPlan) {
    return (
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-400 text-sm">Select a patient and generate a treatment plan to run cost-effectiveness modeling</p>
      </div>
    );
  }

  // Cost estimates based on algorithm results
  const primaryTxCost = 145000 + (patient.age * 500); // simulated annual cost
  const baselineCost = 195000; // standard chemo cost
  const annualSavings = baselineCost - primaryTxCost;

  // QALY improvements
  const baselineQaly = 1.2;
  const optimizedQaly = (treatmentPlan.qualityOfLifeScore * 2.5).toFixed(2);
  const qalyGain = (parseFloat(optimizedQaly) - baselineQaly).toFixed(2);

  return (
    <div className="space-y-4">
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-5">
          <span className="text-xs text-slate-400 block">Optimized Therapy Cost</span>
          <span className="text-2xl font-bold text-white font-mono mt-1">
            ${primaryTxCost.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-400 block mt-1">
            ▼ {((annualSavings / baselineCost) * 100).toFixed(1)}% reduction vs SoC
          </span>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-5">
          <span className="text-xs text-slate-400 block">Projected Cost Savings</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            ${annualSavings.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Per-patient annual baseline savings
          </span>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-5">
          <span className="text-xs text-slate-400 block">QALY Gain improvement</span>
          <span className="text-2xl font-bold text-cyan-400 font-mono mt-1">
            +{qalyGain} Years
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Quality-Adjusted Life Years
          </span>
        </div>
      </div>

      {/* Cost-Effectiveness Frontier */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Cost-Effectiveness ICER Analysis</h2>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Scatter map chart */}
          <div className="relative w-64 h-64 bg-slate-900/60 border border-white/5 rounded-xl shrink-0">
            {/* Axis labels */}
            <div className="absolute left-2 top-2 text-[8px] text-slate-500 uppercase vertical-text">Efficacy (QALYs)</div>
            <div className="absolute right-2 bottom-2 text-[8px] text-slate-500 uppercase">Cost ($)</div>

            {/* ICER Threshold Line */}
            <svg className="absolute inset-0 w-full h-full" overflow="visible">
              <line x1="10%" y1="90%" x2="90%" y2="20%" stroke="rgba(129, 140, 248, 0.3)" strokeWidth="2" strokeDasharray="4" />

              {/* SoC Point */}
              <circle cx="20%" cy="80%" r="6" fill="#f43f5e" />
              <text x="25%" y="83%" fill="#f43f5e" className="text-[9px] font-bold">Standard of Care</text>

              {/* Optimized Point */}
              <circle cx="80%" cy="30%" r="8" fill="#10b981" className="animate-pulse" />
              <text x="60%" y="25%" fill="#10b981" className="text-[10px] font-bold">Quantum Plan</text>
            </svg>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white">ICER Ratio Analysis</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Incremental Cost-Effectiveness Ratio (ICER) describes the marginal cost per quality-adjusted life year gained.
              </p>
            </div>

            <div className="bg-slate-900/40 rounded-xl p-3 border border-white/5 text-xs text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-500">Incremental Cost</span>
                <span className="font-mono text-rose-400">-${annualSavings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-500">Incremental Effectiveness</span>
                <span className="font-mono text-emerald-400">+{qalyGain} QALYs</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold pt-2 text-white">
                <span>ICER Profile</span>
                <span className="text-emerald-400">Dominant Strategy</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 leading-relaxed italic">
              Note: A strategy is considered "dominant" when it offers greater effectiveness at a lower cost than the current baseline.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
