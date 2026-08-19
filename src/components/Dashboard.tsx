import { useState, useEffect, useCallback, useRef } from 'react';
import { Patient, StratifiedCluster, TreatmentPlan, QuantumOptimizationResult } from '../types';
import { mockPatients, treatmentOptions, clusters } from '../data/mockData';
import { stratifyPatients, getClusterProbabilities } from '../engine/AIStratificationEngine';
import { optimizeTreatmentPlan } from '../engine/QuantumOptimizer';
import PatientCard from './PatientCard';
import ClusterVisualization from './ClusterVisualization';
import QuantumDashboard from './QuantumDashboard';
import TreatmentPanel from './TreatmentPanel';
import BiomarkerRadar from './BiomarkerRadar';
import GenomicLab from './GenomicLab';
import ClinicalTrials from './ClinicalTrials';
import HeorEconomics from './HeorEconomics';
import DatasetManager from './DatasetManager';
import AIQuantumPanel from './AIQuantumPanel';

import AuthModal from './AuthModal';

type Tab = 'overview' | 'stratification' | 'genomics' | 'quantum' | 'treatment' | 'trials' | 'economics' | 'dataset' | 'aiquantum';

interface DashboardProps {
  user: { name: string; email: string; role: string } | null;
  setUser: (user: { name: string; email: string; role: string } | null) => void;
  onOpenProfile: () => void;
}

export default function Dashboard({ user, setUser, onOpenProfile }: DashboardProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [stratifiedClusters, setStratifiedClusters] = useState<StratifiedCluster[]>(clusters);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan | null>(null);
  const [quantumResults, setQuantumResults] = useState<QuantumOptimizationResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [simProgress, setSimProgress] = useState(0);
  const [clusterProbs, setClusterProbs] = useState<{ clusterId: number; probability: number }[]>([]);
  const simRef = useRef<number>(0);

  const handleImportPatients = (newPatients: Patient[]) => {
    const updatedPatients = [...patients, ...newPatients];
    const { stratifiedPatients, clusters: updatedClusters } = stratifyPatients(updatedPatients);
    setPatients(stratifiedPatients);
    setStratifiedClusters(updatedClusters);
  };

  useEffect(() => {
    const { clusters: updatedClusters } = stratifyPatients(patients);
    setStratifiedClusters(updatedClusters);
  }, [patients]);

  const handlePatientSelect = useCallback((patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab('stratification');

    // Get cluster probabilities from AI engine
    const probs = getClusterProbabilities(patient);
    setClusterProbs(probs);

    // Auto-run quantum optimization
    setIsSimulating(true);
    setSimProgress(0);

    let progress = 0;
    const simId = Date.now();
    simRef.current = simId;

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        if (simRef.current === simId) {
          // Run quantum optimization
          const { results, plan } = optimizeTreatmentPlan(patient, treatmentOptions);
          setQuantumResults(results);
          setTreatmentPlan(plan);
          setIsSimulating(false);
          setSimProgress(100);
        }
      }
      if (simRef.current === simId) {
        setSimProgress(Math.min(progress, 100));
      }
    }, 150);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Auth Modal */}
      {(showAuthModal || !user) && (
        <AuthModal
          onLoginSuccess={(userData) => {
            setUser(userData);
            setShowAuthModal(false);
          }}
        />
      )}

      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">QuantumCare AI</h1>
                <p className="text-xs text-slate-400">Treatment Recommendation System</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Neon Database Live Indicator */}
              <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 rounded-lg px-3 py-1.5 border border-indigo-500/30 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-emerald-400">Neon PostgreSQL</span>
                <span className="text-[10px] text-slate-400">(Connected)</span>
              </div>

              <div className="hidden md:flex items-center gap-1 text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-1.5 border border-white/5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5" />
                Quantum Optimizer
              </div>

              {user ? (
                <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                  <button
                    onClick={onOpenProfile}
                    className="flex items-center gap-2 text-right hover:opacity-80 transition-opacity cursor-pointer"
                    title="View Profile Page"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
                      {user.name.charAt(0)}
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs font-semibold text-white hover:text-indigo-300 transition-colors">{user.name}</p>
                      <p className="text-[10px] text-indigo-400">{user.role}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setUser(null)}
                    title="Sign Out"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700 transition-all cursor-pointer"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 bg-slate-800/50 rounded-xl p-1 border border-white/5 w-fit">
          {[
            { id: 'overview' as Tab, label: 'Cohort Analytics', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
            { id: 'stratification' as Tab, label: 'AI Stratification', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
            { id: 'genomics' as Tab, label: 'Genomics', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-16v4m0 4h.01M4 12H2m10 10v-1m-4-6a4 4 0 108 0 4 4 0 00-8 0z' },
            { id: 'quantum' as Tab, label: 'Quantum Optimizer', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { id: 'treatment' as Tab, label: 'Optimal Plan', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            { id: 'trials' as Tab, label: 'Clinical Trials', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
            { id: 'economics' as Tab, label: 'HEOR Outcomes', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'dataset' as Tab, label: 'Import Dataset', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
            { id: 'aiquantum' as Tab, label: 'AI & Quantum', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* AI & Quantum: Full-width layout with separate columns */}
        {activeTab === 'aiquantum' ? (
          <AIQuantumPanel
            patient={selectedPatient}
            clusters={stratifiedClusters}
            quantumResults={quantumResults}
            isSimulating={isSimulating}
            totalPatients={patients.length}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Patient List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-white">Patient Cohort</h2>
                  <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                    {patients.length} patients
                  </span>
                </div>
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                  {patients.map((patient) => (
                    <PatientCard
                      key={patient.id}
                      patient={patient}
                      isSelected={selectedPatient?.id === patient.id}
                      onClick={() => handlePatientSelect(patient)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <ClusterVisualization clusters={stratifiedClusters} />
                  {selectedPatient && (
                    <BiomarkerRadar patient={selectedPatient} />
                  )}
                </div>
              )}

              {activeTab === 'stratification' && selectedPatient && (
                <div className="space-y-4">
                  <ClusterVisualization clusters={stratifiedClusters} highlightCluster={selectedPatient.cluster} />
                  <BiomarkerRadar patient={selectedPatient} clusterProbs={clusterProbs} />
                </div>
              )}

              {activeTab === 'quantum' && (
                <QuantumDashboard
                  isSimulating={isSimulating}
                  simProgress={simProgress}
                  quantumResults={quantumResults}
                  selectedPatient={selectedPatient}
                />
              )}

              {activeTab === 'treatment' && (
                <TreatmentPanel
                  treatmentPlan={treatmentPlan}
                  quantumResults={quantumResults}
                  selectedPatient={selectedPatient}
                  isSimulating={isSimulating}
                />
              )}

              {activeTab === 'genomics' && (
                <GenomicLab patient={selectedPatient} />
              )}

              {activeTab === 'trials' && (
                <ClinicalTrials patient={selectedPatient} />
              )}

              {activeTab === 'economics' && (
                <HeorEconomics patient={selectedPatient} treatmentPlan={treatmentPlan} />
              )}

              {activeTab === 'dataset' && (
                <DatasetManager onImport={handleImportPatients} />
              )}

              {!selectedPatient && activeTab !== 'overview' && activeTab !== 'dataset' && (
                <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">Select a patient from the cohort to begin analysis</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
