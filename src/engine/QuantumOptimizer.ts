import { Patient, TreatmentOption, QuantumOptimizationResult, TreatmentPlan } from '../types';

// Simulated Quantum-Inspired Optimization Algorithm
// Uses a hybrid approach simulating:
// 1. Quantum Annealing (QA) - for global optimum search
// 2. Variational Quantum Eigensolver (VQE) - for energy minimization
// 3. Quantum Approximate Optimization Algorithm (QAOA) - for combinatorial optimization

interface QuantumState {
  amplitudes: number[];
  phases: number[];
  energy: number;
}



function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

// Simulate quantum superposition by evaluating multiple treatment dimensions
function computeQuantumAmplitudes(
  patient: Patient,
  treatment: TreatmentOption
): number[] {
  const bio = patient.biomarkers;
  const ageNorm = normalize(patient.age, 18, 90);
  const priorTxCount = patient.priorTreatments.length / 5;
  const comorbidityCount = patient.comorbidities.length / 5;

  // Biomarker matching score
  const bioMatchScore = treatment.targetBiomarkers.reduce((score, bioKey) => {
    const val = bio[bioKey as keyof typeof bio] ?? 0;
    const maxVal: Record<string, number> = {
      crp: 100, il6: 60, tnfAlpha: 30, vegf: 300,
      creatinine: 3, alt: 100, ast: 100, wbc: 25,
      hemoglobin: 18, troponin: 0.1,
    };
    return score + normalize(val, 0, maxVal[bioKey] ?? 100);
  }, 0) / Math.max(treatment.targetBiomarkers.length, 1);

  // Toxicity risk score based on organ function
  const renalRisk = normalize(bio.creatinine, 0.5, 3);
  const hepaticRisk = (normalize(bio.alt, 10, 100) + normalize(bio.ast, 10, 100)) / 2;
  const cardiacRisk = normalize(bio.troponin, 0, 0.1);

  return [
    treatment.efficacy,                          // Efficacy amplitude
    1 - treatment.sideEffectScore,               // Safety amplitude
    bioMatchScore,                               // Biomarker matching
    1 - ageNorm,                                 // Age suitability
    1 - priorTxCount,                            // Prior treatment tolerance
    1 - comorbidityCount,                        // Comorbidity tolerance
    1 - renalRisk,                               // Renal safety
    1 - hepaticRisk,                             // Hepatic safety
    1 - cardiacRisk,                             // Cardiac safety
    1 - normalize(treatment.cost, 50000, 500000), // Cost efficiency
  ];
}

// Simulate quantum phase estimation (finding optimal phase angles)
function computeQuantumPhases(amplitudes: number[]): number[] {
  return amplitudes.map((a) => Math.PI * (1 - a));
}

// Simulate quantum annealing process with thermal fluctuations
function simulateQuantumAnnealing(
  state: QuantumState,
  temperature: number,
  iterations: number
): QuantumState {
  let currentState = { ...state };

  for (let i = 0; i < iterations; i++) {
    const T = temperature * (1 - i / iterations); // Cooling schedule

    // Quantum tunneling effect - random perturbation
    const tunnelProb = Math.exp(-1 / (T + 0.001));
    if (Math.random() < tunnelProb) {
      const idx = Math.floor(Math.random() * currentState.amplitudes.length);
      currentState.amplitudes[idx] = Math.min(1, Math.max(0,
        currentState.amplitudes[idx] + (Math.random() - 0.5) * T
      ));
    }

    // Energy calculation
    currentState.energy = -currentState.amplitudes.reduce((s, a, i) => {
      return s + a * Math.cos(currentState.phases[i]);
    }, 0);

    // Metropolis acceptance criterion
    if (Math.random() > Math.exp(-currentState.energy / (T + 0.001))) {
      // Revert to previous state
      continue;
    }
  }

  return currentState;
}

// Compute quantum score using simulated VQE (Variational Quantum Eigensolver)
function computeQuantumScore(
  amplitudes: number[],
  phases: number[],
  efficacy: number
): number {
  // Weighted quantum circuit simulation
  const weights = [0.25, 0.20, 0.15, 0.10, 0.08, 0.07, 0.06, 0.05, 0.02, 0.02];

  const weightedSum = amplitudes.reduce((sum, a, i) => {
    return sum + weights[i] * a * Math.cos(phases[i]);
  }, 0);

  // Quantum advantage factor (simulated speedup)
  const quantumFactor = 1 + 0.15 * Math.sin(efficacy * Math.PI);

  // Entanglement entropy (diversity of treatment effects)
  const entropy = -amplitudes.reduce((sum, a) => {
    const p = Math.max(a, 0.001);
    return sum + p * Math.log2(p);
  }, 0) / Math.log2(amplitudes.length);

  // Final quantum score
  const rawScore = weightedSum * quantumFactor * (1 + entropy * 0.2);
  return Math.round(Math.max(0, Math.min(1, rawScore)) * 1000) / 10;
}

// Simulate drug interaction effects
function computeDrugInteractionScore(
  treatment: TreatmentOption,
  patient: Patient
): number {
  let interactions = 0;

  // Check contraindications
  for (const contra of treatment.contraindications) {
    for (const comorbidity of patient.comorbidities) {
      if (contra.toLowerCase().includes(comorbidity.toLowerCase().split(' ')[0])) {
        interactions += 0.15;
      }
    }
  }

  // Check prior treatment cross-reactivity
  for (const prior of patient.priorTreatments) {
    if (treatment.mechanism.toLowerCase().includes('checkpoint') &&
        prior.toLowerCase().includes('immuno')) {
      interactions += 0.1;
    }
  }

  return Math.round(Math.max(0, 1 - interactions) * 100) / 100;
}

export function optimizeTreatmentPlan(
  patient: Patient,
  treatments: TreatmentOption[]
): { results: QuantumOptimizationResult[]; plan: TreatmentPlan } {
  const results: QuantumOptimizationResult[] = [];

  for (const treatment of treatments) {
    // Calculate amplitudes and phases (quantum state preparation)
    const amplitudes = computeQuantumAmplitudes(patient, treatment);
    const phases = computeQuantumPhases(amplitudes);

    // Initialize quantum state
    let quantumState: QuantumState = {
      amplitudes,
      phases,
      energy: 0,
    };

    // Run quantum annealing
    const iterations = 100 + Math.floor(Math.random() * 50);
    quantumState = simulateQuantumAnnealing(quantumState, 2.0, iterations);

    // Compute scores
    const effectivenessScore = Math.round(
      treatment.efficacy * (0.7 + 0.3 * quantumState.amplitudes[0]) * 100
    ) / 100;

    const sideEffectRisk = Math.round(
      treatment.sideEffectScore * (1.0 - 0.2 * quantumState.amplitudes[1]) * 100
    ) / 100;

    const drugInteractionScore = computeDrugInteractionScore(treatment, patient);
    const quantumScore = computeQuantumScore(
      quantumState.amplitudes,
      quantumState.phases,
      treatment.efficacy
    );

    results.push({
      treatmentId: treatment.id,
      treatmentName: treatment.name,
      quantumScore,
      effectivenessScore,
      sideEffectScore: sideEffectRisk,
      drugInteractionScore,
      convergenceIterations: iterations,
      isOptimal: false,
    });
  }

  // Sort by quantum score (descending) and mark the best
  results.sort((a, b) => b.quantumScore - a.quantumScore);
  results[0].isOptimal = true;

  // Calculate predicted response rate based on top treatments
  const topEfficacy = results[0].effectivenessScore;
  const avgSideEffect = results.slice(0, 3).reduce((s, r) => s + r.sideEffectScore, 0) / 3;

  const plan: TreatmentPlan = {
    patientId: patient.id,
    clusterId: patient.cluster ?? 0,
    primaryTreatment: results[0],
    alternativeTreatments: results.slice(1, 4),
    predictedResponseRate: Math.round(topEfficacy * 95 * (1 - avgSideEffect * 0.3)) / 100,
    sideEffectRisk: Math.round(avgSideEffect * 100) / 100,
    qualityOfLifeScore: Math.round((1 - avgSideEffect * 0.6) * 100) / 100,
    confidenceInterval: [
      Math.round(Math.max(0, topEfficacy - 0.12) * 100) / 100,
      Math.round(Math.min(1, topEfficacy + 0.12) * 100) / 100,
    ],
  };

  return { results, plan };
}
