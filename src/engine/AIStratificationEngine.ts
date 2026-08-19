import { Patient, StratifiedCluster, BiomarkerData } from '../types';
import { clusters as clusterDefinitions } from '../data/mockData';

// Simulated AI/ML stratification using k-means-like clustering
// In production, this would be a trained neural network or GBM model

function extractFeatureVector(biomarkers: BiomarkerData): number[] {
  return [
    biomarkers.crp / 100,
    biomarkers.il6 / 60,
    biomarkers.vegf / 300,
    biomarkers.tnfAlpha / 30,
    biomarkers.creatinine / 3,
    biomarkers.alt / 100,
    biomarkers.ast / 100,
    biomarkers.wbc / 25,
    biomarkers.hemoglobin / 18,
    biomarkers.troponin / 0.1,
  ];
}

function computeClusterCentroids(): number[][] {
  return clusterDefinitions.map((cluster) => {
    const crp = cluster.dominantBiomarkers.find(b => b.name === 'CRP')?.value ?? 50;
    const il6 = cluster.dominantBiomarkers.find(b => b.name === 'IL-6')?.value ?? 25;
    const vegf = cluster.dominantBiomarkers.find(b => b.name === 'VEGF')?.value ?? 150;
    const tnf = cluster.dominantBiomarkers.find(b => b.name === 'TNF-α')?.value ?? 15;
    return [crp / 100, il6 / 60, vegf / 300, tnf / 30];
  });
}

function euclideanDistance(a: number[], b: number[]): number {
  const minLen = Math.min(a.length, b.length);
  return Math.sqrt(
    Array.from({ length: minLen }, (_, i) => (a[i] - b[i]) ** 2).reduce((s, v) => s + v, 0)
  );
}

function kmeansClustering(patients: Patient[]): Map<string, number> {
  const centroids = computeClusterCentroids();
  const assignments = new Map<string, number>();

  for (const patient of patients) {
    const features = extractFeatureVector(patient.biomarkers);
    let minDist = Infinity;
    let bestCluster = 0;

    for (let c = 0; c < centroids.length; c++) {
      const dist = euclideanDistance(features, centroids[c]);
      if (dist < minDist) {
        minDist = dist;
        bestCluster = c;
      }
    }
    assignments.set(patient.id, bestCluster);
  }

  return assignments;
}

export function stratifyPatients(patients: Patient[]): {
  stratifiedPatients: Patient[];
  clusters: StratifiedCluster[];
} {
  const assignments = kmeansClustering(patients);

  // Assign clusters
  const stratifiedPatients = patients.map((p) => ({
    ...p,
    cluster: assignments.get(p.id) ?? 0,
  }));

  // Update cluster statistics
  const clusterMap = new Map<number, Patient[]>();
  for (const p of stratifiedPatients) {
    const cId = p.cluster ?? 0;
    if (!clusterMap.has(cId)) clusterMap.set(cId, []);
    clusterMap.get(cId)!.push(p);
  }

  const updatedClusters = clusterDefinitions.map((c, i) => {
    const clusterPatients = clusterMap.get(i) ?? [];
    return {
      ...c,
      patientCount: clusterPatients.length,
      avgAge: clusterPatients.length > 0
        ? Math.round(clusterPatients.reduce((s, p) => s + p.age, 0) / clusterPatients.length)
        : 0,
    };
  });

  return { stratifiedPatients, clusters: updatedClusters };
}

export function getClusterProbabilities(patient: Patient): { clusterId: number; probability: number }[] {
  const features = extractFeatureVector(patient.biomarkers);
  const centroids = computeClusterCentroids();

  const distances = centroids.map((c, i) => ({
    clusterId: i + 1,
    distance: euclideanDistance(features, c),
  }));

  // Convert distances to probabilities using softmax
  const invDistances = distances.map(d => ({
    clusterId: d.clusterId,
    invDist: 1 / (d.distance + 0.001),
  }));

  const sumInvDist = invDistances.reduce((s, d) => s + d.invDist, 0);

  return invDistances.map(d => ({
    clusterId: d.clusterId,
    probability: Math.round((d.invDist / sumInvDist) * 1000) / 10,
  })).sort((a, b) => b.probability - a.probability);
}
