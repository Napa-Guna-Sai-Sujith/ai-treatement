import { Patient, TreatmentOption, StratifiedCluster } from '../types';

export const mockPatients: Patient[] = [
  {
    id: 'P-001',
    age: 58,
    gender: 'Male',
    diagnosis: 'Non-small cell lung carcinoma (NSCLC) Stage IIIB',
    biomarkers: {
      troponin: 0.03, crp: 45.2, il6: 28.5, tnfAlpha: 12.1, vegf: 185,
      creatinine: 0.9, alt: 32, ast: 28, wbc: 8.5, hemoglobin: 13.2
    },
    comorbidities: ['Hypertension', 'Type 2 Diabetes'],
    priorTreatments: ['Cisplatin', 'Pemetrexed'],
    geneExpression: [1.2, 3.4, 2.1, 5.6, 0.8, 4.3, 2.9, 1.7, 3.8, 2.2],
  },
  {
    id: 'P-002',
    age: 45,
    gender: 'Female',
    diagnosis: 'HER2+ Breast Cancer Stage II',
    biomarkers: {
      troponin: 0.01, crp: 12.8, il6: 8.2, tnfAlpha: 5.4, vegf: 95,
      creatinine: 0.7, alt: 22, ast: 19, wbc: 6.2, hemoglobin: 14.1
    },
    comorbidities: [],
    priorTreatments: ['Trastuzumab'],
    geneExpression: [3.1, 1.2, 4.5, 2.3, 5.9, 1.8, 3.6, 4.7, 2.0, 1.5],
  },
  {
    id: 'P-003',
    age: 72,
    gender: 'Male',
    diagnosis: 'Metastatic Castration-Resistant Prostate Cancer (mCRPC)',
    biomarkers: {
      troponin: 0.08, crp: 68.3, il6: 42.1, tnfAlpha: 18.7, vegf: 210,
      creatinine: 1.4, alt: 45, ast: 52, wbc: 11.2, hemoglobin: 10.8
    },
    comorbidities: ['Coronary Artery Disease', 'Chronic Kidney Disease Stage 3', 'Osteoarthritis'],
    priorTreatments: ['Docetaxel', 'Enzalutamide', 'Radium-223'],
    geneExpression: [0.5, 2.8, 1.9, 4.1, 3.2, 5.7, 1.3, 2.6, 4.8, 3.0],
  },
  {
    id: 'P-004',
    age: 39,
    gender: 'Female',
    diagnosis: 'Acute Lymphoblastic Leukemia (ALL)',
    biomarkers: {
      troponin: 0.02, crp: 32.5, il6: 18.3, tnfAlpha: 9.8, vegf: 145,
      creatinine: 0.6, alt: 28, ast: 24, wbc: 22.4, hemoglobin: 9.5
    },
    comorbidities: [],
    priorTreatments: ['Vincristine', 'Prednisone'],
    geneExpression: [4.2, 3.7, 1.1, 5.3, 2.4, 3.9, 4.6, 1.9, 3.3, 2.8],
  },
  {
    id: 'P-005',
    age: 63,
    gender: 'Male',
    diagnosis: 'Colorectal Cancer Stage IV',
    biomarkers: {
      troponin: 0.04, crp: 52.1, il6: 35.7, tnfAlpha: 14.3, vegf: 230,
      creatinine: 1.1, alt: 38, ast: 35, wbc: 9.8, hemoglobin: 11.5
    },
    comorbidities: ['Hypertension', 'Hyperlipidemia'],
    priorTreatments: ['FOLFOX', 'Bevacizumab'],
    geneExpression: [2.5, 4.8, 3.6, 1.9, 5.2, 2.7, 4.1, 3.4, 1.6, 4.9],
  },
  {
    id: 'P-006',
    age: 51,
    gender: 'Female',
    diagnosis: 'Triple-Negative Breast Cancer Stage III',
    biomarkers: {
      troponin: 0.015, crp: 38.9, il6: 22.4, tnfAlpha: 11.2, vegf: 175,
      creatinine: 0.8, alt: 25, ast: 21, wbc: 7.5, hemoglobin: 12.8
    },
    comorbidities: ['Hypothyroidism'],
    priorTreatments: ['Doxorubicin', 'Cyclophosphamide'],
    geneExpression: [3.8, 2.1, 5.4, 1.7, 4.3, 2.9, 3.5, 5.1, 2.3, 1.4],
  },
  {
    id: 'P-007',
    age: 68,
    gender: 'Male',
    diagnosis: 'Diffuse Large B-Cell Lymphoma (DLBCL)',
    biomarkers: {
      troponin: 0.06, crp: 75.4, il6: 48.9, tnfAlpha: 21.5, vegf: 195,
      creatinine: 1.2, alt: 55, ast: 48, wbc: 14.6, hemoglobin: 10.2
    },
    comorbidities: ['Hypertension', 'Atrial Fibrillation', 'Gout'],
    priorTreatments: ['R-CHOP', 'Ibrutinib'],
    geneExpression: [1.8, 4.5, 2.7, 3.9, 5.8, 2.3, 4.2, 1.5, 3.1, 4.6],
  },
  {
    id: 'P-008',
    age: 35,
    gender: 'Female',
    diagnosis: 'Melanoma Stage IIIB',
    biomarkers: {
      troponin: 0.01, crp: 18.6, il6: 9.7, tnfAlpha: 6.3, vegf: 88,
      creatinine: 0.7, alt: 20, ast: 18, wbc: 5.8, hemoglobin: 14.5
    },
    comorbidities: [],
    priorTreatments: ['Pembrolizumab'],
    geneExpression: [5.1, 2.4, 3.8, 4.2, 1.3, 4.9, 2.6, 3.7, 5.5, 1.8],
  },
  {
    id: 'P-009',
    age: 55,
    gender: 'Male',
    diagnosis: 'Hepatocellular Carcinoma (HCC)',
    biomarkers: {
      troponin: 0.025, crp: 42.7, il6: 25.8, tnfAlpha: 13.6, vegf: 245,
      creatinine: 1.0, alt: 85, ast: 72, wbc: 7.2, hemoglobin: 12.1
    },
    comorbidities: ['Hepatitis B', 'Cirrhosis'],
    priorTreatments: ['Sorafenib'],
    geneExpression: [2.2, 5.6, 1.4, 3.8, 4.7, 2.5, 5.3, 1.9, 3.6, 4.1],
  },
  {
    id: 'P-010',
    age: 47,
    gender: 'Female',
    diagnosis: 'Ovarian Cancer Stage IIIC',
    biomarkers: {
      troponin: 0.018, crp: 28.3, il6: 15.6, tnfAlpha: 8.9, vegf: 165,
      creatinine: 0.7, alt: 23, ast: 20, wbc: 6.9, hemoglobin: 13.5
    },
    comorbidities: [],
    priorTreatments: ['Carboplatin', 'Paclitaxel'],
    geneExpression: [3.5, 1.8, 5.2, 2.6, 4.4, 3.1, 1.7, 4.8, 2.9, 5.0],
  },
];

export const treatmentOptions: TreatmentOption[] = [
  {
    id: 'T-001', name: 'Pembrolizumab (Keytruda)', drugClass: 'PD-1 Inhibitor',
    mechanism: 'Blocks PD-1 interaction with PD-L1/PD-L2, restoring T-cell anti-tumor activity',
    efficacy: 0.85, sideEffectScore: 0.25, cost: 150000,
    contraindications: ['Autoimmune disease history', 'Organ transplant recipients'],
    targetBiomarkers: ['il6', 'tnfAlpha', 'wbc'],
  },
  {
    id: 'T-002', name: 'Trastuzumab Deruxtecan (Enhertu)', drugClass: 'Antibody-Drug Conjugate',
    mechanism: 'HER2-targeted antibody conjugated with topoisomerase I inhibitor payload',
    efficacy: 0.92, sideEffectScore: 0.35, cost: 180000,
    contraindications: ['Interstitial lung disease', 'Severe hepatic impairment'],
    targetBiomarkers: ['vegf', 'crp'],
  },
  {
    id: 'T-003', name: 'Atezolizumab + Bevacizumab', drugClass: 'PD-L1 + VEGF Inhibitor',
    mechanism: 'Dual checkpoint inhibition and anti-angiogenic therapy',
    efficacy: 0.78, sideEffectScore: 0.40, cost: 220000,
    contraindications: ['Uncontrolled hypertension', 'Bleeding diathesis'],
    targetBiomarkers: ['vegf', 'il6', 'crp'],
  },
  {
    id: 'T-004', name: 'CAR-T Cell Therapy', drugClass: 'Cell Therapy',
    mechanism: 'Engineered T-cells with chimeric antigen receptors targeting CD19',
    efficacy: 0.88, sideEffectScore: 0.55, cost: 450000,
    contraindications: ['Active CNS disorder', 'Severe organ dysfunction'],
    targetBiomarkers: ['wbc', 'il6', 'tnfAlpha'],
  },
  {
    id: 'T-005', name: 'Nivolumab + Ipilimumab', drugClass: 'PD-1 + CTLA-4 Inhibitor',
    mechanism: 'Dual immune checkpoint blockade enhancing T-cell activation',
    efficacy: 0.82, sideEffectScore: 0.50, cost: 280000,
    contraindications: ['Autoimmune disease', 'History of severe immunotherapy toxicity'],
    targetBiomarkers: ['il6', 'tnfAlpha', 'crp'],
  },
  {
    id: 'T-006', name: 'Olaparib (Lynparza)', drugClass: 'PARP Inhibitor',
    mechanism: 'Blocks PARP enzymes, exploiting BRCA mutation synthetic lethality',
    efficacy: 0.72, sideEffectScore: 0.20, cost: 140000,
    contraindications: ['Myelodysplastic syndrome', 'Bone marrow failure'],
    targetBiomarkers: ['hemoglobin', 'creatinine', 'alt'],
  },
  {
    id: 'T-007', name: 'Lenalidomide + Dexamethasone', drugClass: 'Immunomodulatory Drug',
    mechanism: 'Modulates cereblon E3 ligase, enhancing T-cell and NK cell function',
    efficacy: 0.68, sideEffectScore: 0.30, cost: 160000,
    contraindications: ['Pregnancy', 'Severe renal impairment'],
    targetBiomarkers: ['crp', 'il6', 'tnfAlpha', 'creatinine'],
  },
  {
    id: 'T-008', name: 'Entrectinib (Rozlytrek)', drugClass: 'TRK/ROS1 Inhibitor',
    mechanism: 'Selective tyrosine kinase inhibitor targeting NTRK/ROS1 fusions',
    efficacy: 0.76, sideEffectScore: 0.22, cost: 190000,
    contraindications: ['Congestive heart failure', 'QT prolongation'],
    targetBiomarkers: ['troponin', 'alt', 'ast'],
  },
  {
    id: 'T-009', name: 'T-DXd + Pertuzumab', drugClass: 'Dual HER2 Blockade + ADC',
    mechanism: 'Combined HER2 dimerization inhibition and cytotoxic payload delivery',
    efficacy: 0.90, sideEffectScore: 0.38, cost: 250000,
    contraindications: ['LVEF < 50%', 'Severe pulmonary disease'],
    targetBiomarkers: ['vegf', 'troponin'],
  },
  {
    id: 'T-010', name: 'Bispecific T-cell Engager (BiTE)', drugClass: 'Bispecific Antibody',
    mechanism: 'Simultaneously binds CD3 on T-cells and tumor antigen, directing cytotoxicity',
    efficacy: 0.80, sideEffectScore: 0.45, cost: 320000,
    contraindications: ['Uncontrolled seizure disorder', 'Cytokine release syndrome history'],
    targetBiomarkers: ['wbc', 'il6', 'crp'],
  },
];

export const clusters: StratifiedCluster[] = [
  {
    id: 1,
    name: 'Cluster A: High Inflammation / High Angiogenesis',
    description: 'Patients with elevated inflammatory markers (CRP, IL-6, TNF-α) and high VEGF levels. Typically advanced/metastatic disease with poor prognosis. Respond well to combination immunotherapy + anti-angiogenic therapy.',
    patientCount: 0,
    avgAge: 0,
    dominantBiomarkers: [
      { name: 'CRP', value: 68.2 },
      { name: 'IL-6', value: 42.8 },
      { name: 'VEGF', value: 225 },
      { name: 'TNF-α', value: 19.4 },
    ],
    recommendedTherapies: ['Atezolizumab + Bevacizumab', 'Nivolumab + Ipilimumab', 'Pembrolizumab'],
    color: '#ef4444',
  },
  {
    id: 2,
    name: 'Cluster B: HER2/Oncogene-Driven',
    description: 'Patients with HER2 amplification or oncogene addiction profiles. Good organ function and inflammatory markers. Excellent candidates for targeted therapy with ADCs.',
    patientCount: 0,
    avgAge: 0,
    dominantBiomarkers: [
      { name: 'VEGF', value: 145 },
      { name: 'CRP', value: 22.4 },
      { name: 'IL-6', value: 14.8 },
      { name: 'Hemoglobin', value: 13.8 },
    ],
    recommendedTherapies: ['Trastuzumab Deruxtecan', 'T-DXd + Pertuzumab', 'Entrectinib'],
    color: '#6366f1',
  },
  {
    id: 3,
    name: 'Cluster C: Chemo-Sensitive / Hematologic',
    description: 'Patients with hematologic malignancies or chemosensitive solid tumors. Often younger with fewer comorbidities. High WBC counts reflecting bone marrow involvement.',
    patientCount: 0,
    avgAge: 0,
    dominantBiomarkers: [
      { name: 'WBC', value: 18.5 },
      { name: 'IL-6', value: 22.5 },
      { name: 'Hemoglobin', value: 10.1 },
      { name: 'CRP', value: 32.5 },
    ],
    recommendedTherapies: ['CAR-T Cell Therapy', 'BiTE Therapy', 'Lenalidomide + Dexamethasone'],
    color: '#22c55e',
  },
  {
    id: 4,
    name: 'Cluster D: Multi-Morbid / High Toxicity Risk',
    description: 'Older patients with multiple comorbidities and elevated organ function markers. High troponin, creatinine, and liver enzymes indicate organ stress. Require careful therapy selection with low side effect profiles.',
    patientCount: 0,
    avgAge: 0,
    dominantBiomarkers: [
      { name: 'Creatinine', value: 1.4 },
      { name: 'Troponin', value: 0.07 },
      { name: 'ALT', value: 52 },
      { name: 'AST', value: 48 },
    ],
    recommendedTherapies: ['Olaparib', 'Entrectinib', 'Pembrolizumab'],
    color: '#f59e0b',
  },
  {
    id: 5,
    name: 'Cluster E: Immune-Cold / Low Biomarker',
    description: 'Patients with relatively low inflammatory markers and moderate biomarker expression. Often earlier stage disease. May benefit from checkpoint inhibitors but with lower predicted response.',
    patientCount: 0,
    avgAge: 0,
    dominantBiomarkers: [
      { name: 'CRP', value: 15.2 },
      { name: 'IL-6', value: 8.9 },
      { name: 'TNF-α', value: 5.8 },
      { name: 'VEGF', value: 88 },
    ],
    recommendedTherapies: ['Pembrolizumab', 'Olaparib', 'Lenalidomide + Dexamethasone'],
    color: '#8b5cf6',
  },
];
