import { Patient } from '../types';

interface Props {
  patient: Patient | null;
}

const pathways = [
  { id: 'MAPK', name: 'MAPK/ERK Signaling', description: 'Regulates cell growth and differentiation', targetedBy: ['Pembrolizumab', 'Entrectinib'], riskLevel: 'High' },
  { id: 'PI3K', name: 'PI3K/AKT/mTOR Pathway', description: 'Key regulator of survival and metabolism', targetedBy: ['T-DXd', 'Trastuzumab'], riskLevel: 'Critical' },
  { id: 'DDR', name: 'DNA Damage Response (DDR)', description: 'Repairs double-strand DNA breaks', targetedBy: ['Olaparib'], riskLevel: 'Moderate' },
  { id: 'VEGF', name: 'Angiogenesis / VEGF Pathway', description: 'Promotes new blood vessel formation', targetedBy: ['Bevacizumab'], riskLevel: 'High' },
];

const genes = ['BRCA1', 'TP53', 'EGFR', 'KRAS', 'ALK', 'PIK3CA', 'HER2', 'MYC', 'PTEN', 'BRAF'];

export default function GenomicLab({ patient }: Props) {
  if (!patient) {
    return (
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <p className="text-slate-400 text-sm">Select a patient to analyze genomics & transcriptomic pathways</p>
      </div>
    );
  }

  // Generate deterministic gene expression based on patient id & features
  const getExpression = (gene: string, idx: number) => {
    const base = (patient.id.charCodeAt(patient.id.length - 1) * (idx + 1)) % 100;
    if (gene === 'HER2' && patient.diagnosis.includes('HER2')) return 92;
    if (gene === 'BRCA1' && patient.diagnosis.includes('Ovarian')) return 88;
    if (gene === 'EGFR' && patient.diagnosis.includes('Lung')) return 84;
    return Math.max(15, Math.min(98, base));
  };

  return (
    <div className="space-y-4">
      {/* Genomic Heatmap */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Transcriptomic & Genomic Heatmap</h2>
            <p className="text-xs text-slate-400 mt-0.5">Next-Generation Sequencing (NGS) Z-score profiles</p>
          </div>
          <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
            99.8% Confidence
          </span>
        </div>

        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {genes.map((gene, idx) => {
            const exp = getExpression(gene, idx);
            let color = 'from-slate-700 to-slate-800';
            if (exp > 80) color = 'from-rose-500/20 to-rose-600/40 border-rose-500/40 text-rose-300';
            else if (exp > 50) color = 'from-amber-500/20 to-amber-600/40 border-amber-500/40 text-amber-300';
            else color = 'from-emerald-500/20 to-emerald-600/40 border-emerald-500/40 text-emerald-300';

            return (
              <div
                key={gene}
                className={`border rounded-xl p-3 text-center flex flex-col items-center justify-between transition-all duration-300 bg-gradient-to-b ${color}`}
              >
                <span className="text-xs font-bold font-mono tracking-wider">{gene}</span>
                <span className="text-lg font-bold mt-2 font-mono">{exp}</span>
                <span className="text-[8px] text-slate-400 uppercase mt-1">Z-Score</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pathway Impact Diagram */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-5">
        <h2 className="text-sm font-semibold text-white mb-3">Pathway Aberration Mapping</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pathways.map((path) => {
            const isHigh = path.riskLevel === 'Critical' || path.riskLevel === 'High';
            return (
              <div key={path.id} className="bg-slate-900/60 rounded-xl p-4 border border-white/5 relative overflow-hidden group hover:border-indigo-500/30">
                <div className="absolute right-3 top-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    path.riskLevel === 'Critical'
                      ? 'bg-rose-500/20 text-rose-400'
                      : path.riskLevel === 'High'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {path.riskLevel} Aberration
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white pr-24">{path.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{path.description}</p>

                {/* SVG connection visualization */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">Targeted Therapies:</span>
                  <div className="flex flex-wrap gap-1">
                    {path.targetedBy.map(t => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Simulated pathway activity bar */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-slate-500">Phosphorylation Activity</span>
                    <span className={`text-[10px] font-mono ${isHigh ? 'text-rose-400' : 'text-slate-400'}`}>
                      {isHigh ? 'Hyperactive (84%)' : 'Normal (32%)'}
                    </span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isHigh ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: isHigh ? '84%' : '32%' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
