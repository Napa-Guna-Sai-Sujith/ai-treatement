import { Patient } from '../types';

interface Props {
  patient: Patient;
  clusterProbs?: { clusterId: number; probability: number }[];
}

const clusterColors = ['#ef4444', '#6366f1', '#22c55e', '#f59e0b', '#8b5cf6'];
const clusterLabels = ['A: High Inflam.', 'B: Oncogene', 'C: Hematologic', 'D: Multi-Morbid', 'E: Immune-Cold'];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function createRadarPath(
  values: number[],
  cx: number,
  cy: number,
  radius: number,
  numAxes: number,
  fill: string,
  stroke: string,
  opacity: number = 0.3
) {
  const angleStep = 360 / numAxes;
  const points = values.map((v, i) => polarToCartesian(cx, cy, (v / 100) * radius, i * angleStep));

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <path
      key={`${fill}-${stroke}`}
      d={pathData}
      fill={fill}
      fillOpacity={opacity}
      stroke={stroke}
      strokeWidth={1.5}
    />
  );
}

export default function BiomarkerRadar({ patient, clusterProbs }: Props) {
  const bio = patient.biomarkers;

  // Normalize biomarker values to 0-100 for radar display
  const biomarkers = [
    { label: 'CRP', value: Math.min(100, (bio.crp / 100) * 100), max: 100 },
    { label: 'IL-6', value: Math.min(100, (bio.il6 / 60) * 100), max: 100 },
    { label: 'TNF-α', value: Math.min(100, (bio.tnfAlpha / 30) * 100), max: 100 },
    { label: 'VEGF', value: Math.min(100, (bio.vegf / 300) * 100), max: 100 },
    { label: 'Creatinine', value: Math.min(100, (bio.creatinine / 3) * 100), max: 100 },
    { label: 'ALT', value: Math.min(100, (bio.alt / 100) * 100), max: 100 },
    { label: 'AST', value: Math.min(100, (bio.ast / 100) * 100), max: 100 },
    { label: 'WBC', value: Math.min(100, (bio.wbc / 25) * 100), max: 100 },
  ];

  const cx = 140;
  const cy = 140;
  const radius = 110;
  const numAxes = biomarkers.length;
  const angleStep = 360 / numAxes;

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Biomarker Profile</h2>
          <p className="text-xs text-slate-400 mt-0.5">{patient.id} - {patient.diagnosis}</p>
        </div>
        {clusterProbs && (
          <div className="flex gap-2">
            {clusterProbs.slice(0, 3).map((prob) => (
              <div key={prob.clusterId} className="text-center">
                <div
                  className="w-2 h-2 rounded-full mx-auto mb-0.5"
                  style={{ backgroundColor: clusterColors[prob.clusterId - 1] ?? '#6366f1' }}
                />
                <span className="text-[10px] text-slate-400 block">{prob.probability}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Radar Chart */}
        <div className="relative shrink-0">
          <svg width="280" height="280" viewBox="0 0 280 280">
            {/* Background grid */}
            {[0.25, 0.5, 0.75, 1].map((scale) => {
              const r = radius * scale;
              const points = Array.from({ length: numAxes }, (_, i) => {
                const p = polarToCartesian(cx, cy, r, i * angleStep);
                return `${p.x},${p.y}`;
              });
              return (
                <polygon
                  key={scale}
                  points={points.join(' ')}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={1}
                />
              );
            })}

            {/* Axes */}
            {Array.from({ length: numAxes }, (_, i) => {
              const p = polarToCartesian(cx, cy, radius, i * angleStep);
              return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />;
            })}

            {/* Patient data */}
            {createRadarPath(
              biomarkers.map((b) => b.value),
              cx, cy, radius, numAxes,
              '#6366f1', '#818cf8', 0.25
            )}

            {/* Data points */}
            {biomarkers.map((b, i) => {
              const p = polarToCartesian(cx, cy, (b.value / 100) * radius, i * angleStep);
              return <circle key={i} cx={p.x} cy={p.y} r={3} fill="#818cf8" />;
            })}

            {/* Labels */}
            {biomarkers.map((b, i) => {
              const p = polarToCartesian(cx, cy, radius + 18, i * angleStep);
              return (
                <text
                  key={i}
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[9px]"
                  fill="rgba(255,255,255,0.5)"
                  fontSize="9"
                >
                  {b.label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Biomarker values table */}
        <div className="flex-1 w-full">
          <div className="grid grid-cols-2 gap-2">
            {biomarkers.map((b) => (
              <div key={b.label} className="flex items-center gap-2 bg-slate-800/30 rounded-lg px-3 py-2 border border-white/5">
                <span className="text-xs text-slate-400 w-16">{b.label}</span>
                <div className="flex-1 h-1.5 bg-slate-700/30 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${b.value}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-white w-12 text-right">
                  {b.value.toFixed(1)}
                </span>
              </div>
            ))}
          </div>

          {/* AI Cluster probabilities */}
          {clusterProbs && clusterProbs.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-[10px] text-slate-500 mb-2">AI Cluster Assignment Probabilities</p>
              <div className="space-y-1.5">
                {clusterProbs.map((prob) => {
                  const clusterColor = clusterColors[prob.clusterId - 1] ?? '#6366f1';
                  return (
                    <div key={prob.clusterId} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: clusterColor }} />
                      <span className="text-[10px] text-slate-400 w-20">{clusterLabels[prob.clusterId - 1]}</span>
                      <div className="flex-1 h-1.5 bg-slate-700/30 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${prob.probability}%`, backgroundColor: clusterColor }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-white w-12 text-right">{prob.probability}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
