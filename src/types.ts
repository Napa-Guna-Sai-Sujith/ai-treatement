export interface Patient {
  id: string;
  age: number;
  gender: 'Male' | 'Female';
  diagnosis: string;
  biomarkers: BiomarkerData;
  comorbidities: string[];
  priorTreatments: string[];
  geneExpression: number[];
  cluster?: number;
}

export interface BiomarkerData {
  troponin: number;
  crp: number;
  il6: number;
  tnfAlpha: number;
  vegf: number;
  creatinine: number;
  alt: number;
  ast: number;
  wbc: number;
  hemoglobin: number;
}

export interface TreatmentOption {
  id: string;
  name: string;
  drugClass: string;
  mechanism: string;
  efficacy: number;
  sideEffectScore: number;
  cost: number;
  contraindications: string[];
  targetBiomarkers: string[];
}

export interface StratifiedCluster {
  id: number;
  name: string;
  description: string;
  patientCount: number;
  avgAge: number;
  dominantBiomarkers: { name: string; value: number }[];
  recommendedTherapies: string[];
  color: string;
}

export interface QuantumOptimizationResult {
  treatmentId: string;
  treatmentName: string;
  quantumScore: number;
  effectivenessScore: number;
  sideEffectScore: number;
  drugInteractionScore: number;
  convergenceIterations: number;
  isOptimal: boolean;
}

export interface TreatmentPlan {
  patientId: string;
  clusterId: number;
  primaryTreatment: QuantumOptimizationResult;
  alternativeTreatments: QuantumOptimizationResult[];
  predictedResponseRate: number;
  sideEffectRisk: number;
  qualityOfLifeScore: number;
  confidenceInterval: [number, number];
}

export interface DatabaseSyncState {
  isConnected: boolean;
  tableCounts: {
    patients: number;
    treatments: number;
    clusters: number;
  };
  lastSynced: string | null;
}

export interface SimulationState {
  patients: Patient[];
  clusters: StratifiedCluster[];
  treatmentOptions: TreatmentOption[];
  selectedPatient: Patient | null;
  treatmentPlan: TreatmentPlan | null;
  quantumResults: QuantumOptimizationResult[];
  isSimulating: boolean;
  simulationSpeed: number;
}

