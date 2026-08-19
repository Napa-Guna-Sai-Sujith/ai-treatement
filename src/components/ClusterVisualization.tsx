import { StratifiedCluster } from '../types';

interface Props {
  clusters: StratifiedCluster[];
  highlightCluster?: number;
}

export default function ClusterVisualization({ clusters, highlightCluster }: Props) {
  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">AI Patient Stratification</h2>
          <p className="text-xs text-slate-400 mt-0.5">K-Means clustering with biomarker-weighted features</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Clusters: {clusters.length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Patients: {clusters.reduce((s, c) => s + c.patientCount, 0)}
          </span>
        </div>
      </div>

      {/* Cluster grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {clusters.map((cluster) => {
          const isHighlighted = highlightCluster !== undefined && cluster.id === highlightCluster + 1;
          return (
            <div
              key={cluster.id}
              className={`rounded-xl border p-4 transition-all duration-300 ${
                isHighlighted
                  ? 'bg-indigo-600/15 border-indigo-500/40 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                  : 'bg-slate-800/30 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3.5 h-3.5 rounded-full shadow-lg"
                    style={{ backgroundColor: cluster.color, boxShadow: `0 0 12px ${cluster.color}40` }}
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-white">{cluster.name}</h3>
                    <p className="text-xs text-slate-500">{cluster.description.slice(0, 80)}...</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white">{cluster.patientCount}</span>
                  <span className="text-xs text-slate-500 block">patients</span>
                </div>
              </div>

              {/* Biomarker bars */}
              <div className="space-y-1.5 mb-3">
                {cluster.dominantBiomarkers.map((bio) => (
                  <div key={bio.name} className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 w-14 shrink-0">{bio.name}</span>
                    <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, bio.value / 3)}%`,
                          backgroundColor: cluster.color,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 w-12 text-right">{bio.value.toFixed(1)}</span>
                  </div>
                ))}
              </div>

              {/* Recommended therapies */}
              <div className="flex flex-wrap gap-1">
                {cluster.recommendedTherapies.map((therapy) => (
                  <span
                    key={therapy}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 border border-white/5"
                  >
                    {therapy}
                  </span>
                ))}
              </div>

              {cluster.avgAge > 0 && (
                <div className="mt-2 pt-2 border-t border-white/5 flex gap-3 text-[10px] text-slate-500">
                  <span>Avg Age: {cluster.avgAge}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
