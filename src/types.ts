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

export interface DoctorSuggestion {
  id: string;
  date: string;
  category: 'Dietary & Nutrition' | 'Medication Regimen' | 'Clinical Monitoring' | 'Emergency Precautions' | 'Lifestyle & Recovery';
  message: string;
  doctorName: string;
  docId: string;
}

export interface SideEffectItem {
  effect: string;
  severity: 'Mild' | 'Moderate' | 'High Alert';
  managementAdvice: string;
}

export interface CostEfficiencyData {
  estimatedCostUsd: number;
  insuranceCoveredPercent: number;
  patientSavingsEstimated: number;
  monthlyEstimatedOutofPocket: number;
  costEfficiencyTier: 'High Efficiency' | 'Optimal Value' | 'Premium Tier';
  comparatorCostUsd: number;
}

export interface PrescribedTreatment {
  treatmentId: string;
  treatmentName: string;
  drugClass: string;
  mechanism: string;
  dosageInstructions: string;
  cycleFrequency: string;
  quantumEfficacyScore: number;
  sideEffectRiskScore: number;
  costEfficiency: CostEfficiencyData;
  sideEffects: SideEffectItem[];
}

export interface Patient {
  id: string;
  name?: string;
  email?: string;
  age: number;
  gender: 'Male' | 'Female';
  diagnosis: string;
  biomarkers: BiomarkerData;
  comorbidities: string[];
  priorTreatments: string[];
  geneExpression: number[];
  cluster?: number;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  assignedDoctorRole?: string;
  assignedDoctorEmail?: string;
  doctorSuggestions?: DoctorSuggestion[];
  prescribedTreatment?: PrescribedTreatment;
}

export interface DoctorProfile {
  docId: string;
  name: string;
  email: string;
  role: string;
  hospital: string;
  specialty: string;
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
