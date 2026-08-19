import { useState } from 'react';
import { Patient } from '../types';

interface Props {
  onImport: (patients: Patient[]) => void;
}

const csvTemplate = `id,age,gender,diagnosis,crp,il6,vegf,tnfAlpha,creatinine,alt,ast,wbc,hemoglobin,troponin
P-901,64,Male,Glioblastoma Multiforme,72,32.5,210,14.2,1.2,38,42,10.2,12.8,0.06
P-902,51,Female,Metastatic Melanoma,12.5,8.2,110,6.1,0.8,24,20,5.8,13.5,0.01`;

const highRiskCohort: Patient[] = [
  {
    id: 'P-101 (Imported)',
    age: 62,
    gender: 'Male',
    diagnosis: 'Advanced Pancreatic Adenocarcinoma',
    biomarkers: {
      troponin: 0.08, crp: 85.4, il6: 42.1, tnfAlpha: 21.8, vegf: 285,
      creatinine: 1.4, alt: 68, ast: 72, wbc: 15.6, hemoglobin: 10.2
    },
    comorbidities: ['Diabetes', 'Deep Vein Thrombosis'],
    priorTreatments: ['FOLFIRINOX'],
    geneExpression: [2.1, 5.4, 3.2, 1.1, 4.3, 5.6, 2.9, 1.5, 4.8, 3.2],
  },
  {
    id: 'P-102 (Imported)',
    age: 49,
    gender: 'Female',
    diagnosis: 'Metastatic Triple Negative Breast Cancer',
    biomarkers: {
      troponin: 0.015, crp: 52.3, il6: 28.5, tnfAlpha: 14.1, vegf: 185,
      creatinine: 0.7, alt: 31, ast: 26, wbc: 8.9, hemoglobin: 11.2
    },
    comorbidities: ['Hypothyroidism'],
    priorTreatments: ['Doxorubicin'],
    geneExpression: [4.1, 1.2, 5.2, 2.3, 4.9, 2.5, 3.8, 4.2, 1.5, 2.8],
  },
];

export default function DatasetManager({ onImport }: Props) {
  const [dataInput, setDataInput] = useState('');
  const [importError, setImportError] = useState('');
  const [activePreset, setActivePreset] = useState<'csv' | 'json' | 'manual'>('manual');

  // Manual addition state
  const [manualPatient, setManualPatient] = useState<Partial<Patient>>({
    id: '',
    age: 50,
    gender: 'Male',
    diagnosis: '',
  });

  const [manualBiomarkers, setManualBiomarkers] = useState({
    troponin: 0.02, crp: 20, il6: 15, tnfAlpha: 10, vegf: 120,
    creatinine: 0.9, alt: 35, ast: 32, wbc: 6.5, hemoglobin: 13.5
  });

  const handleCsvImport = () => {
    if (!dataInput.trim()) {
      setImportError('Data field cannot be empty');
      return;
    }

    try {
      const lines = dataInput.trim().split('\n');
      if (lines.length < 2) {
        setImportError('Insufficient data lines found in CSV input');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const parsedPatients: Patient[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length < headers.length) continue;

        const p: any = {
          id: values[headers.indexOf('id')] || `P-${Date.now().toString().slice(-4)}`,
          age: parseInt(values[headers.indexOf('age')]) || 55,
          gender: values[headers.indexOf('gender')] === 'Female' ? 'Female' : 'Male',
          diagnosis: values[headers.indexOf('diagnosis')] || 'Oncology Candidate',
          comorbidities: [],
          priorTreatments: [],
          geneExpression: Array.from({ length: 10 }, () => parseFloat((Math.random() * 5).toFixed(1))),
          biomarkers: {
            troponin: parseFloat(values[headers.indexOf('troponin')]) || 0.02,
            crp: parseFloat(values[headers.indexOf('crp')]) || 15.0,
            il6: parseFloat(values[headers.indexOf('il6')]) || 10.0,
            tnfAlpha: parseFloat(values[headers.indexOf('tnfalpha')]) || 8.0,
            vegf: parseFloat(values[headers.indexOf('vegf')]) || 100.0,
            creatinine: parseFloat(values[headers.indexOf('creatinine')]) || 0.8,
            alt: parseFloat(values[headers.indexOf('alt')]) || 30,
            ast: parseFloat(values[headers.indexOf('ast')]) || 28,
            wbc: parseFloat(values[headers.indexOf('wbc')]) || 7.2,
            hemoglobin: parseFloat(values[headers.indexOf('hemoglobin')]) || 13.5,
          }
        };

        parsedPatients.push(p);
      }

      if (parsedPatients.length === 0) {
        setImportError('No valid rows could be parsed');
        return;
      }

      onImport(parsedPatients);
      setDataInput('');
      setImportError('');
      alert(`Success! Successfully uploaded ${parsedPatients.length} new patients`);
    } catch (err: any) {
      setImportError(`Parse error: ${err.message}`);
    }
  };

  const loadDemoCohort = () => {
    onImport(highRiskCohort);
    alert(`Success! Imported ${highRiskCohort.length} high-risk clinical candidates.`);
  };

  const handleAddManualPatient = () => {
    if (!manualPatient.id || !manualPatient.diagnosis) {
      setImportError('Manual patient must have ID and Diagnosis values specified');
      return;
    }

    const newP: Patient = {
      id: manualPatient.id,
      age: manualPatient.age || 50,
      gender: manualPatient.gender === 'Female' ? 'Female' : 'Male',
      diagnosis: manualPatient.diagnosis,
      biomarkers: { ...manualBiomarkers },
      comorbidities: [],
      priorTreatments: [],
      geneExpression: Array.from({ length: 10 }, () => parseFloat((Math.random() * 5).toFixed(1))),
    };

    onImport([newP]);
    setManualPatient({ id: '', age: 50, gender: 'Male', diagnosis: '' });
    setImportError('');
    alert(`Manual patient ${newP.id} added successfully!`);
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-5">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Dataset & Patient Profile Uploader
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Import patient cohorts instantly via manual data entry, raw CSV template strings, or demo files.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActivePreset('manual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activePreset === 'manual' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Manual Add
          </button>
          <button
            onClick={() => setActivePreset('csv')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activePreset === 'csv' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CSV Data String
          </button>
          <button
            onClick={loadDemoCohort}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-all border border-emerald-500/20"
          >
            Import Demo Cohort
          </button>
        </div>
      </div>

      {activePreset === 'manual' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3 bg-slate-900/40 p-4 rounded-xl border border-white/5">
            <h3 className="text-xs font-semibold text-white mb-2 uppercase tracking-wide">1. Demographics</h3>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Patient ID / Reference Number</label>
              <input
                type="text"
                placeholder="e.g. P-105"
                value={manualPatient.id || ''}
                onChange={(e) => setManualPatient({ ...manualPatient, id: e.target.value })}
                className="w-full bg-slate-800/80 border border-white/10 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Diagnosis</label>
              <input
                type="text"
                placeholder="e.g. Advanced Colorectal Adenocarcinoma"
                value={manualPatient.diagnosis || ''}
                onChange={(e) => setManualPatient({ ...manualPatient, diagnosis: e.target.value })}
                className="w-full bg-slate-800/80 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={manualPatient.age || 50}
                  onChange={(e) => setManualPatient({ ...manualPatient, age: parseInt(e.target.value) || 50 })}
                  className="w-full bg-slate-800/80 border border-white/10 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Biological Gender</label>
                <select
                  value={manualPatient.gender || 'Male'}
                  onChange={(e) => setManualPatient({ ...manualPatient, gender: e.target.value as any })}
                  className="w-full bg-slate-800/80 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3 bg-slate-900/40 p-4 rounded-xl border border-white/5">
            <h3 className="text-xs font-semibold text-white mb-2 uppercase tracking-wide">2. Biomarker Attributes</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <label className="text-[9px] text-slate-400 flex justify-between">
                  <span>CRP (mg/L)</span>
                  <span className="text-white font-mono">{manualBiomarkers.crp}</span>
                </label>
                <input
                  type="range" min="0" max="100" step="1"
                  value={manualBiomarkers.crp}
                  onChange={(e) => setManualBiomarkers({ ...manualBiomarkers, crp: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500 h-1 bg-slate-700/60 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-400 flex justify-between">
                  <span>IL-6 (pg/mL)</span>
                  <span className="text-white font-mono">{manualBiomarkers.il6}</span>
                </label>
                <input
                  type="range" min="0" max="60" step="1"
                  value={manualBiomarkers.il6}
                  onChange={(e) => setManualBiomarkers({ ...manualBiomarkers, il6: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500 h-1 bg-slate-700/60 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-400 flex justify-between">
                  <span>VEGF (pg/mL)</span>
                  <span className="text-white font-mono">{manualBiomarkers.vegf}</span>
                </label>
                <input
                  type="range" min="0" max="300" step="1"
                  value={manualBiomarkers.vegf}
                  onChange={(e) => setManualBiomarkers({ ...manualBiomarkers, vegf: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500 h-1 bg-slate-700/60 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-400 flex justify-between">
                  <span>WBC (10^9/L)</span>
                  <span className="text-white font-mono">{manualBiomarkers.wbc}</span>
                </label>
                <input
                  type="range" min="2" max="30" step="0.5"
                  value={manualBiomarkers.wbc}
                  onChange={(e) => setManualBiomarkers({ ...manualBiomarkers, wbc: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 h-1 bg-slate-700/60 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-400 flex justify-between">
                  <span>Creatinine (mg/dL)</span>
                  <span className="text-white font-mono">{manualBiomarkers.creatinine}</span>
                </label>
                <input
                  type="range" min="0.1" max="3" step="0.1"
                  value={manualBiomarkers.creatinine}
                  onChange={(e) => setManualBiomarkers({ ...manualBiomarkers, creatinine: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 h-1 bg-slate-700/60 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-400 flex justify-between">
                  <span>Troponin (ng/mL)</span>
                  <span className="text-white font-mono">{manualBiomarkers.troponin}</span>
                </label>
                <input
                  type="range" min="0" max="0.15" step="0.01"
                  value={manualBiomarkers.troponin}
                  onChange={(e) => setManualBiomarkers({ ...manualBiomarkers, troponin: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 h-1 bg-slate-700/60 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-end">
              <button
                onClick={handleAddManualPatient}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all"
              >
                Add Manual Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {activePreset === 'csv' && (
        <div className="space-y-4">
          {/* File Upload Dropzone */}
          <div className="bg-slate-900/50 border-2 border-dashed border-indigo-500/30 hover:border-indigo-500/60 rounded-xl p-4 transition-all text-center group cursor-pointer relative">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const content = event.target?.result as string;
                    if (content) {
                      setDataInput(content);
                      setImportError('');
                    }
                  };
                  reader.readAsText(file);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-white">
                Drag & Drop your <span className="text-indigo-400 font-mono">.csv</span> or <span className="text-indigo-400 font-mono">.txt</span> file here
              </p>
              <p className="text-[10px] text-slate-400">or click to browse local files from your system</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">CSV Content Preview & Manual Edit</span>
            <button
              onClick={() => setDataInput(csvTemplate)}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 border-b border-indigo-500/20 cursor-pointer"
            >
              Paste Sample CSV Template
            </button>
          </div>

          <textarea
            rows={5}
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
            placeholder="P-101,64,Male,Glioblastoma Multiforme,72,32.5,210,14.2,1.2,38,42,10.2,12.8,0.06"
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-indigo-500/50 resize-none h-32"
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-white/5">
            <p className="text-[10px] text-slate-500 max-w-xl leading-relaxed">
              Format header: <span className="font-mono text-slate-400">id, age, gender, diagnosis, crp, il6, vegf, tnfAlpha, creatinine, alt, ast, wbc, hemoglobin, troponin</span>. All parameters are seamlessly parsed.
            </p>
            <button
              onClick={handleCsvImport}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/20 transition-all shrink-0 cursor-pointer"
            >
              Parse & Import CSV Data
            </button>
          </div>
        </div>
      )}

      {importError && (
        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs text-rose-400 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {importError}
        </div>
      )}
    </div>
  );
}
