import { Patient } from '../types';

interface Props {
  patient: Patient | null;
}

interface Trial {
  id: string;
  title: string;
  phase: string;
  sponsor: string;
  condition: string;
  criteria: string[];
  matchScore: number;
  status: string;
}

const trialDatabase: Trial[] = [
  {
    id: 'NCT05984123',
    title: 'Pembrolizumab Combo in Advanced Refractory NSCLC',
    phase: 'Phase III',
    sponsor: 'Merck Sharp & Dohme LLC',
    condition: 'Non-small cell lung carcinoma',
    criteria: ['Prior checkpoint inhibitor', 'Elevated CRP/IL-6'],
    matchScore: 0,
    status: 'Recruiting',
  },
  {
    id: 'NCT06109312',
    title: 'Efficacy of Trastuzumab Deruxtecan vs. Standard Care in HER2+ Breast Cancer',
    phase: 'Phase III',
    sponsor: 'AstraZeneca / Daiichi Sankyo',
    condition: 'Breast Cancer',
    criteria: ['HER2+', 'Prior Trastuzumab exposure'],
    matchScore: 0,
    status: 'Active, not recruiting',
  },
  {
    id: 'NCT05221084',
    title: 'CAR-T Next Gen CD19/CD22 Dual Targeted Therapy',
    phase: 'Phase II',
    sponsor: 'Novartis Pharmaceuticals',
    condition: 'Leukemia / Lymphoma',
    criteria: ['CD19+', 'Relapsed/Refractory status'],
    matchScore: 0,
    status: 'Recruiting',
  },
  {
    id: 'NCT04885231',
    title: 'Olaparib in BRCA-mutated Ovarian / Prostate Carcinomas',
    phase: 'Phase II',
    sponsor: 'AstraZeneca',
    condition: 'BRCA-mutated cancers',
    criteria: ['Deleterious BRCA1/2 mutation', 'High tumor mutational burden'],
    matchScore: 0,
    status: 'Enrolling by invitation',
  },
  {
    id: 'NCT05663114',
    title: 'Combination PD-1 / CTLA-4 Checkpoint Blockade in Rare Tumors',
    phase: 'Phase I/II',
    sponsor: 'Bristol-Myers Squibb',
    condition: 'Solid Tumors',
    criteria: ['Metastatic disease', 'Exhausted standard care options'],
    matchScore: 0,
    status: 'Recruiting',
  },
];

export default function ClinicalTrials({ patient }: Props) {
  if (!patient) {
    return (
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <p className="text-slate-400 text-sm">Select a patient to screen and match against active clinical trials</p>
      </div>
    );
  }

  // Determine trial matches
  const matchedTrials = trialDatabase.map((trial) => {
    let score = 30; // base score

    if (patient.diagnosis.toLowerCase().includes(trial.condition.toLowerCase().split(' ')[0])) {
      score += 45;
    }

    if (patient.biomarkers.crp > 40 && trial.criteria.some(c => c.includes('CRP'))) {
      score += 20;
    }

    if (patient.diagnosis.toLowerCase().includes('breast') && trial.title.includes('HER2')) {
      score += 20;
    }

    if (patient.priorTreatments.length > 0 && trial.criteria.some(c => c.toLowerCase().includes('prior'))) {
      score += 15;
    }

    return {
      ...trial,
      matchScore: Math.min(98, score),
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-5">
        <div>
          <h2 className="text-sm font-semibold text-white">AI-Powered Clinical Trial Matching</h2>
          <p className="text-xs text-slate-400 mt-0.5">Matching patient profile criteria with global oncology trials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {matchedTrials.map((trial) => {
          const isHighMatch = trial.matchScore >= 70;
          return (
            <div
              key={trial.id}
              className={`rounded-2xl border p-4 transition-all duration-300 ${
                isHighMatch
                  ? 'bg-emerald-600/10 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                  : 'bg-slate-800/30 border-white/5'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {trial.id}
                    </span>
                    <span className="text-[10px] bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded-full">
                      {trial.phase}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      trial.status === 'Recruiting'
                        ? 'bg-emerald-500/20 text-emerald-400 animate-pulse'
                        : 'bg-slate-700/30 text-slate-400'
                    }`}>
                      {trial.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1.5">{trial.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Sponsor: {trial.sponsor}</p>

                  {/* Inclusion Criteria matched */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {trial.criteria.map((crit) => (
                      <span
                        key={crit}
                        className="text-[9px] px-2 py-0.5 rounded bg-slate-800/80 border border-white/5 text-slate-400 flex items-center gap-1"
                      >
                        <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {crit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Match Score Display */}
                <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                  <div className="text-center">
                    <div className="text-2xl font-black font-mono" style={{
                      color: isHighMatch ? '#34d399' : '#a78bfa'
                    }}>
                      {trial.matchScore}%
                    </div>
                    <span className="text-[9px] text-slate-500 uppercase font-medium">Match Score</span>
                  </div>

                  <button className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    isHighMatch
                      ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500 shadow-lg shadow-emerald-500/25'
                      : 'bg-slate-800 text-slate-400 border-white/5 hover:border-white/10'
                  }`}>
                    Pre-Screen
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
