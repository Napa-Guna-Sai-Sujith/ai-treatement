import { Patient } from '../types';

interface Props {
  patient: Patient;
  isSelected: boolean;
  onClick: () => void;
}

const clusterColors = ['#ef4444', '#6366f1', '#22c55e', '#f59e0b', '#8b5cf6'];
const clusterNames = ['High Inflam.', 'Oncogene', 'Hematologic', 'Multi-Morbid', 'Immune-Cold'];

export default function PatientCard({ patient, isSelected, onClick }: Props) {
  const clusterId = patient.cluster ?? 0;
  const clusterColor = clusterColors[clusterId] ?? '#6366f1';
  const clusterName = clusterNames[clusterId] ?? 'Unknown';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
        isSelected
          ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
          : 'bg-slate-800/30 border-white/5 hover:border-white/10 hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
          patient.gender === 'Male' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'
        }`}>
          {patient.gender === 'Male' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{patient.id}</span>
            <span className="text-xs text-slate-500">|</span>
            <span className="text-xs text-slate-400">{patient.age}y</span>
          </div>
          <p className="text-xs text-slate-400 truncate mt-0.5">{patient.diagnosis}</p>
        </div>

        {/* Cluster badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: clusterColor }} />
          <span className="text-[10px] font-medium text-slate-400">{clusterName}</span>
        </div>
      </div>

      {/* Biomarker quick summary */}
      <div className="flex gap-2 mt-2 pt-2 border-t border-white/5">
        {[
          { label: 'CRP', value: patient.biomarkers.crp, high: 40 },
          { label: 'IL-6', value: patient.biomarkers.il6, high: 25 },
          { label: 'VEGF', value: patient.biomarkers.vegf, high: 200 },
        ].map((b) => (
          <div key={b.label} className="flex items-center gap-1">
            <span className="text-[10px] text-slate-500">{b.label}</span>
            <span className={`text-[10px] font-medium ${b.value > b.high ? 'text-rose-400' : 'text-emerald-400'}`}>
              {b.value.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </button>
  );
}
