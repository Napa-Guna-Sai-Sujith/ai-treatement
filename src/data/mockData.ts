import { Patient, TreatmentOption, StratifiedCluster, DoctorProfile } from '../types';

export const mockDoctors: DoctorProfile[] = [
  {
    docId: 'DOC-1092',
    name: 'Dr. Rajesh Sharma, MD',
    email: 'r.sharma@oncocenter.org',
    role: 'Immunotherapy & Checkpoint Specialist',
    hospital: 'Memorial Precision Cancer Center',
    specialty: 'Thoracic & Immunological Oncology'
  },
  {
    docId: 'DOC-2045',
    name: 'Dr. Priya Patel, MD',
    email: 'p.patel@precisionmed.org',
    role: 'Medical Oncologist — Targeted & Chemo Regimens',
    hospital: 'National Institute of Quantum Medicine',
    specialty: 'Genomic & Targeted Molecular Therapies'
  },
  {
    docId: 'DOC-3001',
    name: 'Dr. Marcus Vance, MD',
    email: 'm.vance@quantumoncology.org',
    role: 'Radiation & Quantum Optimization Specialist',
    hospital: 'Metropolitan Comprehensive Cancer Center',
    specialty: 'Quantum-Assisted Radiogenomics'
  }
];

export const mockPatients: Patient[] = [
  {
    id: 'P-001',
    name: 'Robert Davis',
    email: 'r.davis@medcare.org',
    age: 58,
    gender: 'Male',
    diagnosis: 'Non-small cell lung carcinoma (NSCLC) Stage IIIB',
    assignedDoctorId: 'DOC-1092',
    assignedDoctorName: 'Dr. Rajesh Sharma, MD',
    assignedDoctorRole: 'Immunotherapy & Checkpoint Specialist',
    assignedDoctorEmail: 'r.sharma@oncocenter.org',
    biomarkers: {
      troponin: 0.03, crp: 45.2, il6: 28.5, tnfAlpha: 12.1, vegf: 185,
      creatinine: 0.9, alt: 32, ast: 28, wbc: 8.5, hemoglobin: 13.2
    },
    comorbidities: ['Hypertension', 'Type 2 Diabetes'],
    priorTreatments: ['Cisplatin', 'Pemetrexed'],
    geneExpression: [1.2, 3.4, 2.1, 5.6, 0.8, 4.3, 2.9, 1.7, 3.8, 2.2],
    doctorSuggestions: [
      {
        id: 'sug-101',
        date: '2026-09-07',
        category: 'Dietary & Nutrition',
        message: 'Maintain fluid intake above 2.5 Liters daily before and after Keytruda infusions. Limit sodium and avoid unregulated herbal immune stimulants.',
        doctorName: 'Dr. Rajesh Sharma, MD',
        docId: 'DOC-1092'
      },
      {
        id: 'sug-102',
        date: '2026-09-05',
        category: 'Clinical Monitoring',
        message: 'Weekly complete blood counts (CBC) and liver function tests (LFT) scheduled on Tuesdays. Thoracic contrast PET-CT scan slated for Week 6.',
        doctorName: 'Dr. Rajesh Sharma, MD',
        docId: 'DOC-1092'
      },
      {
        id: 'sug-103',
        date: '2026-09-02',
        category: 'Emergency Precautions',
        message: 'If temperature exceeds 38.3°C or any sudden shortness of breath or persistent cough manifests, call our 24/7 on-call triage team immediately.',
        doctorName: 'Dr. Rajesh Sharma, MD',
        docId: 'DOC-1092'
      }
    ],
    prescribedTreatment: {
      treatmentId: 'T-001',
      treatmentName: 'Pembrolizumab (Keytruda) + Carboplatin Chemotherapy',
      drugClass: 'PD-1 Checkpoint Inhibitor + Platinum Doublet',
      mechanism: 'Selective PD-1 blockade restoring CD8+ cytotoxic T-cell antitumor response synergized with DNA crosslinking cytotoxicity.',
      dosageInstructions: '200 mg IV infusion every 21 days (3-week cycles) with AUC 5 Carboplatin.',
      cycleFrequency: 'Cycle 3 of 6 (Active / In Progress)',
      quantumEfficacyScore: 89.4,
      sideEffectRiskScore: 22.5,
      costEfficiency: {
        estimatedCostUsd: 145000,
        insuranceCoveredPercent: 88,
        patientSavingsEstimated: 45000,
        monthlyEstimatedOutofPocket: 820,
        costEfficiencyTier: 'High Efficiency',
        comparatorCostUsd: 210000
      },
      sideEffects: [
        {
          effect: 'Mild Fatigue & Somnolence',
          severity: 'Mild',
          managementAdvice: 'Preserve regular sleep cycles. Light 20-minute daily aerobic walking recommended.'
        },
        {
          effect: 'Immune-Related Cutaneous Rash / Pruritus',
          severity: 'Moderate',
          managementAdvice: 'Apply prescribed hydrocortisone 1% cream twice daily; keep skin hydrated.'
        },
        {
          effect: 'Subclinical Immune Pneumonitis Risk',
          severity: 'High Alert',
          managementAdvice: 'Immediate clinical notification required if dry cough or exertional dyspnea occurs.'
        }
      ]
    }
  },
  {
    id: 'P-002',
    name: 'Maria Garcia',
    email: 'm.garcia@precisionhealth.org',
    age: 45,
    gender: 'Female',
    diagnosis: 'HER2+ Breast Cancer Stage II',
    assignedDoctorId: 'DOC-1092',
    assignedDoctorName: 'Dr. Rajesh Sharma, MD',
    assignedDoctorRole: 'Immunotherapy & Checkpoint Specialist',
    assignedDoctorEmail: 'r.sharma@oncocenter.org',
    biomarkers: {
      troponin: 0.01, crp: 12.8, il6: 8.2, tnfAlpha: 5.4, vegf: 95,
      creatinine: 0.7, alt: 22, ast: 19, wbc: 6.2, hemoglobin: 14.1
    },
    comorbidities: [],
    priorTreatments: ['Trastuzumab'],
    geneExpression: [3.1, 1.2, 4.5, 2.3, 5.9, 1.8, 3.6, 4.7, 2.0, 1.5],
    doctorSuggestions: [
      {
        id: 'sug-104',
        date: '2026-09-06',
        category: 'Medication Regimen',
        message: 'Take oral dexamethasone premedication 8mg the evening before and morning of ADC infusion as prescribed.',
        doctorName: 'Dr. Rajesh Sharma, MD',
        docId: 'DOC-1092'
      },
      {
        id: 'sug-105',
        date: '2026-09-03',
        category: 'Clinical Monitoring',
        message: 'Baseline cardiac LVEF echocardiogram confirmed normal (64%). Follow-up echo scheduled in 3 months.',
        doctorName: 'Dr. Rajesh Sharma, MD',
        docId: 'DOC-1092'
      }
    ],
    prescribedTreatment: {
      treatmentId: 'T-002',
      treatmentName: 'Trastuzumab Deruxtecan (Enhertu)',
      drugClass: 'HER2-Directed Antibody-Drug Conjugate (ADC)',
      mechanism: 'High drug-to-antibody ratio delivers potent topoisomerase I inhibitor payload directly to HER2-overexpressing neoplastic cells.',
      dosageInstructions: '5.4 mg/kg IV infusion every 3 weeks.',
      cycleFrequency: 'Cycle 2 of 8 (Active / In Progress)',
      quantumEfficacyScore: 93.8,
      sideEffectRiskScore: 28.0,
      costEfficiency: {
        estimatedCostUsd: 175000,
        insuranceCoveredPercent: 90,
        patientSavingsEstimated: 52000,
        monthlyEstimatedOutofPocket: 650,
        costEfficiencyTier: 'High Efficiency',
        comparatorCostUsd: 245000
      },
      sideEffects: [
        {
          effect: 'Nausea & Mild Emesis',
          severity: 'Moderate',
          managementAdvice: 'Take Ondansetron 8mg 30 minutes before meals as needed.'
        },
        {
          effect: 'Transient Alopecia / Hair Thinning',
          severity: 'Mild',
          managementAdvice: 'Cold cap therapy provided during infusion session.'
        },
        {
          effect: 'Interstitial Lung Disease (ILD) Warning',
          severity: 'High Alert',
          managementAdvice: 'Promptly inform physician if fever or respiratory distress develops.'
        }
      ]
    }
  },
  {
    id: 'P-003',
    name: 'James Wilson',
    email: 'j.wilson@oncoclinic.net',
    age: 72,
    gender: 'Male',
    diagnosis: 'Metastatic Castration-Resistant Prostate Cancer (mCRPC)',
    assignedDoctorId: 'DOC-1092',
    assignedDoctorName: 'Dr. Rajesh Sharma, MD',
    assignedDoctorRole: 'Immunotherapy & Checkpoint Specialist',
    assignedDoctorEmail: 'r.sharma@oncocenter.org',
    biomarkers: {
      troponin: 0.08, crp: 68.3, il6: 42.1, tnfAlpha: 18.7, vegf: 210,
      creatinine: 1.4, alt: 45, ast: 52, wbc: 11.2, hemoglobin: 10.8
    },
    comorbidities: ['Coronary Artery Disease', 'Chronic Kidney Disease Stage 3', 'Osteoarthritis'],
    priorTreatments: ['Docetaxel', 'Enzalutamide', 'Radium-223'],
    geneExpression: [0.5, 2.8, 1.9, 4.1, 3.2, 5.7, 1.3, 2.6, 4.8, 3.0],
    doctorSuggestions: [
      {
        id: 'sug-106',
        date: '2026-09-04',
        category: 'Medication Regimen',
        message: 'Take Olaparib tablets twice daily with water. Maintain ongoing LHRH agonist subcutaneous depot injections.',
        doctorName: 'Dr. Rajesh Sharma, MD',
        docId: 'DOC-1092'
      },
      {
        id: 'sug-107',
        date: '2026-09-01',
        category: 'Dietary & Nutrition',
        message: 'Kidney-friendly low potassium and moderate protein diet advised in coordination with clinical nephrology.',
        doctorName: 'Dr. Rajesh Sharma, MD',
        docId: 'DOC-1092'
      }
    ],
    prescribedTreatment: {
      treatmentId: 'T-006',
      treatmentName: 'Olaparib (Lynparza) + Androgen Receptor Inhibitor',
      drugClass: 'PARP Inhibitor + Hormonal Therapy',
      mechanism: 'Synthetic lethality exploiting homologous recombination repair deficiency (HRR/BRCA pathway).',
      dosageInstructions: '300 mg orally twice daily continuously with food.',
      cycleFrequency: 'Month 4 of Long-term Maintenance',
      quantumEfficacyScore: 81.2,
      sideEffectRiskScore: 19.5,
      costEfficiency: {
        estimatedCostUsd: 135000,
        insuranceCoveredPercent: 86,
        patientSavingsEstimated: 38000,
        monthlyEstimatedOutofPocket: 910,
        costEfficiencyTier: 'Optimal Value',
        comparatorCostUsd: 195000
      },
      sideEffects: [
        {
          effect: 'Mild Normocytic Anemia',
          severity: 'Moderate',
          managementAdvice: 'Monthly hemoglobin tracking. Iron supplementation coordinated.'
        },
        {
          effect: 'Loss of Appetite & Dysgeusia',
          severity: 'Mild',
          managementAdvice: 'Eat frequent small calorie-dense meals and stay well hydrated.'
        }
      ]
    }
  },
  {
    id: 'P-004',
    name: 'Emily Chen',
    email: 'e.chen@lymphoma-center.org',
    age: 39,
    gender: 'Female',
    diagnosis: 'Acute Lymphoblastic Leukemia (ALL)',
    assignedDoctorId: 'DOC-1092',
    assignedDoctorName: 'Dr. Rajesh Sharma, MD',
    assignedDoctorRole: 'Immunotherapy & Checkpoint Specialist',
    assignedDoctorEmail: 'r.sharma@oncocenter.org',
    biomarkers: {
      troponin: 0.02, crp: 32.5, il6: 18.3, tnfAlpha: 9.8, vegf: 145,
      creatinine: 0.6, alt: 28, ast: 24, wbc: 22.4, hemoglobin: 9.5
    },
    comorbidities: [],
    priorTreatments: ['Vincristine', 'Prednisone'],
    geneExpression: [4.2, 3.7, 1.1, 5.3, 2.4, 3.9, 4.6, 1.9, 3.3, 2.8],
    doctorSuggestions: [
      {
        id: 'sug-108',
        date: '2026-09-07',
        category: 'Emergency Precautions',
        message: 'Strict neutropenic precautions: avoid crowded public areas, unpasteurized dairy, and raw foods during cell expansion window.',
        doctorName: 'Dr. Rajesh Sharma, MD',
        docId: 'DOC-1092'
      },
      {
        id: 'sug-109',
        date: '2026-09-05',
        category: 'Clinical Monitoring',
        message: 'Inpatient observation protocol for 72 hours post infusion with Tocilizumab available on floor for CRS management.',
        doctorName: 'Dr. Rajesh Sharma, MD',
        docId: 'DOC-1092'
      }
    ],
    prescribedTreatment: {
      treatmentId: 'T-004',
      treatmentName: 'Autologous CD19 CAR-T Cell Therapy',
      drugClass: 'Genetically Engineered Chimeric Antigen Receptor T-Cell Therapy',
      mechanism: 'Synthetic HLA-independent recognition of CD19 surface antigens inducing rapid, targeted leukemic blast lysis.',
      dosageInstructions: 'Single IV infusion of 2.5 x 10^6 transduced CAR+ viable T-cells/kg after lymphodepletion.',
      cycleFrequency: 'Post-Infusion Day +14 Monitoring Phase',
      quantumEfficacyScore: 94.6,
      sideEffectRiskScore: 48.0,
      costEfficiency: {
        estimatedCostUsd: 380000,
        insuranceCoveredPercent: 92,
        patientSavingsEstimated: 95000,
        monthlyEstimatedOutofPocket: 1200,
        costEfficiencyTier: 'Premium Tier',
        comparatorCostUsd: 490000
      },
      sideEffects: [
        {
          effect: 'Cytokine Release Syndrome (CRS)',
          severity: 'High Alert',
          managementAdvice: 'Monitored continuously in specialized cellular therapy unit with IL-6 antagonist readiness.'
        },
        {
          effect: 'Hypogammaglobulinemia',
          severity: 'Moderate',
          managementAdvice: 'Monthly IVIG replacement therapy administered as needed.'
        }
      ]
    }
  },
  {
    id: 'P-005',
    name: 'Michael Brown',
    email: 'm.brown@cancercare.org',
    age: 63,
    gender: 'Male',
    diagnosis: 'Colorectal Cancer Stage IV',
    assignedDoctorId: 'DOC-1092',
    assignedDoctorName: 'Dr. Rajesh Sharma, MD',
    assignedDoctorRole: 'Immunotherapy & Checkpoint Specialist',
    assignedDoctorEmail: 'r.sharma@oncocenter.org',
    biomarkers: {
      troponin: 0.04, crp: 52.1, il6: 35.7, tnfAlpha: 14.3, vegf: 230,
      creatinine: 1.1, alt: 38, ast: 35, wbc: 9.8, hemoglobin: 11.5
    },
    comorbidities: ['Hypertension', 'Hyperlipidemia'],
    priorTreatments: ['FOLFOX', 'Bevacizumab'],
    geneExpression: [2.5, 4.8, 3.6, 1.9, 5.2, 2.7, 4.1, 3.4, 1.6, 4.9],
    doctorSuggestions: [
      {
        id: 'sug-110',
        date: '2026-09-06',
        category: 'Clinical Monitoring',
        message: 'Log home blood pressure twice daily. Report systolic reading above 150 mmHg to oncology nurse.',
        doctorName: 'Dr. Rajesh Sharma, MD',
        docId: 'DOC-1092'
      },
      {
        id: 'sug-111',
        date: '2026-09-02',
        category: 'Dietary & Nutrition',
        message: 'High fiber, low red-meat Mediterranean diet recommended. Avoid cold beverages during infusion week.',
        doctorName: 'Dr. Rajesh Sharma, MD',
        docId: 'DOC-1092'
      }
    ],
    prescribedTreatment: {
      treatmentId: 'T-003',
      treatmentName: 'Atezolizumab + Bevacizumab Combination',
      drugClass: 'PD-L1 Inhibitor + Anti-VEGF Monoclonal Antibody',
      mechanism: 'Simultaneous reversal of immune suppression and disruption of tumor microvascular neo-angiogenesis.',
      dosageInstructions: 'Atezolizumab 1200 mg + Bevacizumab 15 mg/kg IV every 3 weeks.',
      cycleFrequency: 'Cycle 4 of 6 (Active / In Progress)',
      quantumEfficacyScore: 84.5,
      sideEffectRiskScore: 32.0,
      costEfficiency: {
        estimatedCostUsd: 195000,
        insuranceCoveredPercent: 87,
        patientSavingsEstimated: 48000,
        monthlyEstimatedOutofPocket: 1050,
        costEfficiencyTier: 'High Efficiency',
        comparatorCostUsd: 260000
      },
      sideEffects: [
        {
          effect: 'Hypertension Exacerbation',
          severity: 'Moderate',
          managementAdvice: 'Titrate ACE-inhibitor dosage under cardiology oversight.'
        },
        {
          effect: 'Mild Proteinuria',
          severity: 'Mild',
          managementAdvice: 'Dipstick urine analysis before each bi-weekly cycle.'
        }
      ]
    }
  },
  {
    id: 'P-006',
    name: 'Susan Taylor',
    email: 's.taylor@medcenter.org',
    age: 51,
    gender: 'Female',
    diagnosis: 'Triple-Negative Breast Cancer Stage III',
    assignedDoctorId: 'DOC-2045',
    assignedDoctorName: 'Dr. Priya Patel, MD',
    assignedDoctorRole: 'Medical Oncologist — Targeted & Chemo Regimens',
    assignedDoctorEmail: 'p.patel@precisionmed.org',
    biomarkers: {
      troponin: 0.015, crp: 38.9, il6: 22.4, tnfAlpha: 11.2, vegf: 175,
      creatinine: 0.8, alt: 25, ast: 21, wbc: 7.5, hemoglobin: 12.8
    },
    comorbidities: ['Hypothyroidism'],
    priorTreatments: ['Doxorubicin', 'Cyclophosphamide'],
    geneExpression: [3.8, 2.1, 5.4, 1.7, 4.3, 2.9, 3.5, 5.1, 2.3, 1.4],
    doctorSuggestions: [
      {
        id: 'sug-112',
        date: '2026-09-07',
        category: 'Clinical Monitoring',
        message: 'TSH and morning cortisol levels will be assessed prior to each cycle to monitor endocrine organ function.',
        doctorName: 'Dr. Priya Patel, MD',
        docId: 'DOC-2045'
      },
      {
        id: 'sug-113',
        date: '2026-09-04',
        category: 'Lifestyle & Recovery',
        message: 'Gentle yoga and acupuncture support sessions scheduled every Thursday at the integrative oncology suite.',
        doctorName: 'Dr. Priya Patel, MD',
        docId: 'DOC-2045'
      }
    ],
    prescribedTreatment: {
      treatmentId: 'T-005',
      treatmentName: 'Nivolumab + Ipilimumab Dual Checkpoint Blockade',
      drugClass: 'PD-1 + CTLA-4 Immune Checkpoint Inhibitor',
      mechanism: 'Synergistic co-stimulation of effector T-cell proliferation and intra-tumoral regulatory T-cell depletion.',
      dosageInstructions: 'Nivolumab 3 mg/kg + Ipilimumab 1 mg/kg IV every 3 weeks for 4 doses.',
      cycleFrequency: 'Cycle 2 of 4 Induction Phase',
      quantumEfficacyScore: 88.0,
      sideEffectRiskScore: 36.5,
      costEfficiency: {
        estimatedCostUsd: 230000,
        insuranceCoveredPercent: 89,
        patientSavingsEstimated: 58000,
        monthlyEstimatedOutofPocket: 980,
        costEfficiencyTier: 'High Efficiency',
        comparatorCostUsd: 310000
      },
      sideEffects: [
        {
          effect: 'Endocrine Immune Disturbance (Thyroiditis)',
          severity: 'Moderate',
          managementAdvice: 'Levothyroxine dosage adjusted according to bi-weekly thyroid panels.'
        },
        {
          effect: 'Mild Colitis / Bowel Frequency',
          severity: 'High Alert',
          managementAdvice: 'Report any diarrhea exceeding 3 episodes/day for early corticosteroid intervention.'
        }
      ]
    }
  },
  {
    id: 'P-007',
    name: 'Arthur Miller',
    email: 'a.miller@trials.org',
    age: 68,
    gender: 'Male',
    diagnosis: 'Diffuse Large B-Cell Lymphoma (DLBCL)',
    assignedDoctorId: 'DOC-2045',
    assignedDoctorName: 'Dr. Priya Patel, MD',
    assignedDoctorRole: 'Medical Oncologist — Targeted & Chemo Regimens',
    assignedDoctorEmail: 'p.patel@precisionmed.org',
    biomarkers: {
      troponin: 0.06, crp: 75.4, il6: 48.9, tnfAlpha: 21.5, vegf: 195,
      creatinine: 1.2, alt: 55, ast: 48, wbc: 14.6, hemoglobin: 10.2
    },
    comorbidities: ['Hypertension', 'Atrial Fibrillation', 'Gout'],
    priorTreatments: ['R-CHOP', 'Ibrutinib'],
    geneExpression: [1.8, 4.5, 2.7, 3.9, 5.8, 2.3, 4.2, 1.5, 3.1, 4.6],
    doctorSuggestions: [
      {
        id: 'sug-114',
        date: '2026-09-07',
        category: 'Medication Regimen',
        message: 'Step-up dosing protocol begins Monday. Take prescribed allopurinol for tumor lysis syndrome prophylaxis.',
        doctorName: 'Dr. Priya Patel, MD',
        docId: 'DOC-2045'
      },
      {
        id: 'sug-115',
        date: '2026-09-03',
        category: 'Emergency Precautions',
        message: 'Keep hospital emergency medical card in wallet at all times describing BiTE therapy protocol.',
        doctorName: 'Dr. Priya Patel, MD',
        docId: 'DOC-2045'
      }
    ],
    prescribedTreatment: {
      treatmentId: 'T-010',
      treatmentName: 'Bispecific T-cell Engager (BiTE) Therapy',
      drugClass: 'CD20 x CD3 Bispecific Antibody',
      mechanism: 'Engineered dual antibody physically links endogenous cytotoxic T-cells to malignant B-cells, triggering targeted cell lysis.',
      dosageInstructions: 'Step-up IV infusion regimen: 1mg Day 1, 5mg Day 8, 30mg full dose on Day 15.',
      cycleFrequency: 'Cycle 1 (Step-up Dosing Complete)',
      quantumEfficacyScore: 86.9,
      sideEffectRiskScore: 34.0,
      costEfficiency: {
        estimatedCostUsd: 260000,
        insuranceCoveredPercent: 91,
        patientSavingsEstimated: 64000,
        monthlyEstimatedOutofPocket: 1100,
        costEfficiencyTier: 'High Efficiency',
        comparatorCostUsd: 350000
      },
      sideEffects: [
        {
          effect: 'Low-Grade Pyrexia / Chills',
          severity: 'Mild',
          managementAdvice: 'Premedicate with paracetamol 1000mg and diphenhydramine 25mg.'
        },
        {
          effect: 'Transient Neurotoxicity (ICANS)',
          severity: 'High Alert',
          managementAdvice: 'Daily ICE score handwriting and orientation assessment at home.'
        }
      ]
    }
  },
  {
    id: 'P-008',
    name: 'Jessica Lee',
    email: 'j.lee@oncocare.io',
    age: 35,
    gender: 'Female',
    diagnosis: 'Melanoma with BRAF V600E Mutation Stage IIIC',
    assignedDoctorId: 'DOC-2045',
    assignedDoctorName: 'Dr. Priya Patel, MD',
    assignedDoctorRole: 'Medical Oncologist — Targeted & Chemo Regimens',
    assignedDoctorEmail: 'p.patel@precisionmed.org',
    biomarkers: {
      troponin: 0.01, crp: 18.6, il6: 9.7, tnfAlpha: 6.3, vegf: 88,
      creatinine: 0.7, alt: 20, ast: 18, wbc: 5.8, hemoglobin: 14.5
    },
    comorbidities: [],
    priorTreatments: ['Pembrolizumab'],
    geneExpression: [5.1, 2.4, 3.8, 4.2, 1.3, 4.9, 2.6, 3.7, 5.5, 1.8],
    doctorSuggestions: [
      {
        id: 'sug-116',
        date: '2026-09-06',
        category: 'Medication Regimen',
        message: 'Take Entrectinib capsules with a meal once daily at the same time each evening. Avoid grapefruit juice entirely.',
        doctorName: 'Dr. Priya Patel, MD',
        docId: 'DOC-2045'
      },
      {
        id: 'sug-117',
        date: '2026-09-02',
        category: 'Lifestyle & Recovery',
        message: 'High SPF 50+ broad spectrum sunscreen must be applied before going outdoors due to photosensitivity.',
        doctorName: 'Dr. Priya Patel, MD',
        docId: 'DOC-2045'
      }
    ],
    prescribedTreatment: {
      treatmentId: 'T-008',
      treatmentName: 'Entrectinib (Rozlytrek) Targeted Kinase Inhibitor',
      drugClass: 'Selective CNS-Active Tyrosine Kinase Inhibitor',
      mechanism: 'Potent inhibition of TRK A/B/C and ROS1 oncogenic fusion kinases suppressing downstream MAPK/AKT proliferation pathways.',
      dosageInstructions: '600 mg orally once daily with food.',
      cycleFrequency: 'Month 3 of Oral Targeted Therapy',
      quantumEfficacyScore: 91.5,
      sideEffectRiskScore: 16.0,
      costEfficiency: {
        estimatedCostUsd: 160000,
        insuranceCoveredPercent: 93,
        patientSavingsEstimated: 46000,
        monthlyEstimatedOutofPocket: 540,
        costEfficiencyTier: 'High Efficiency',
        comparatorCostUsd: 225000
      },
      sideEffects: [
        {
          effect: 'Mild Dysgeusia / Metallic Taste',
          severity: 'Mild',
          managementAdvice: 'Chew sugar-free lemon candy or mints; use wooden/bamboo utensils.'
        },
        {
          effect: 'Peripheral Edema in Lower Extremities',
          severity: 'Mild',
          managementAdvice: 'Elevate legs in evening; light compression stockings recommended.'
        }
      ]
    }
  },
  {
    id: 'P-009',
    name: 'David Kim',
    email: 'd.kim@liverinstitute.org',
    age: 55,
    gender: 'Male',
    diagnosis: 'Hepatocellular Carcinoma (HCC)',
    assignedDoctorId: 'DOC-2045',
    assignedDoctorName: 'Dr. Priya Patel, MD',
    assignedDoctorRole: 'Medical Oncologist — Targeted & Chemo Regimens',
    assignedDoctorEmail: 'p.patel@precisionmed.org',
    biomarkers: {
      troponin: 0.025, crp: 42.7, il6: 25.8, tnfAlpha: 13.6, vegf: 245,
      creatinine: 1.0, alt: 85, ast: 72, wbc: 7.2, hemoglobin: 12.1
    },
    comorbidities: ['Hepatitis B', 'Cirrhosis Child-Pugh A'],
    priorTreatments: ['Sorafenib'],
    geneExpression: [2.2, 5.6, 1.4, 3.8, 4.7, 2.5, 5.3, 1.9, 3.6, 4.1],
    doctorSuggestions: [
      {
        id: 'sug-118',
        date: '2026-09-07',
        category: 'Clinical Monitoring',
        message: 'Weekly liver function markers (ALT, AST, Bilirubin, Albumin) and AFP tumor marker tracking.',
        doctorName: 'Dr. Priya Patel, MD',
        docId: 'DOC-2045'
      },
      {
        id: 'sug-119',
        date: '2026-09-04',
        category: 'Dietary & Nutrition',
        message: 'Strict sodium restriction (< 2g/day) to prevent ascites and portal hypertension complications.',
        doctorName: 'Dr. Priya Patel, MD',
        docId: 'DOC-2045'
      }
    ],
    prescribedTreatment: {
      treatmentId: 'T-007',
      treatmentName: 'Lenalidomide + Low-Dose Dexamethasone',
      drugClass: 'Next-Generation Immunomodulatory Compound (IMiD)',
      mechanism: 'E3 ubiquitin ligase cereblon modulation leading to selective ubiquitination of oncogenic factors and NK cell activation.',
      dosageInstructions: '25 mg orally daily on days 1–21 of repeated 28-day cycles.',
      cycleFrequency: 'Cycle 3 of 6 (Active / In Progress)',
      quantumEfficacyScore: 82.4,
      sideEffectRiskScore: 23.0,
      costEfficiency: {
        estimatedCostUsd: 155000,
        insuranceCoveredPercent: 88,
        patientSavingsEstimated: 41000,
        monthlyEstimatedOutofPocket: 780,
        costEfficiencyTier: 'Optimal Value',
        comparatorCostUsd: 215000
      },
      sideEffects: [
        {
          effect: 'Thrombocytopenia Risk',
          severity: 'Moderate',
          managementAdvice: 'Weekly platelet checks; avoid intramuscular injections or heavy contact sports.'
        },
        {
          effect: 'Mild Pruritus',
          severity: 'Mild',
          managementAdvice: 'Apply calamine or emollient moisturizer after showering.'
        }
      ]
    }
  },
  {
    id: 'P-010',
    name: 'Rachel Adams',
    email: 'r.adams@womenscancer.net',
    age: 47,
    gender: 'Female',
    diagnosis: 'Ovarian Cancer Stage IIIC',
    assignedDoctorId: 'DOC-2045',
    assignedDoctorName: 'Dr. Priya Patel, MD',
    assignedDoctorRole: 'Medical Oncologist — Targeted & Chemo Regimens',
    assignedDoctorEmail: 'p.patel@precisionmed.org',
    biomarkers: {
      troponin: 0.018, crp: 28.3, il6: 15.6, tnfAlpha: 8.9, vegf: 165,
      creatinine: 0.7, alt: 23, ast: 20, wbc: 6.9, hemoglobin: 13.5
    },
    comorbidities: [],
    priorTreatments: ['Carboplatin', 'Paclitaxel'],
    geneExpression: [3.5, 1.8, 5.2, 2.6, 4.4, 3.1, 1.7, 4.8, 2.9, 5.0],
    doctorSuggestions: [
      {
        id: 'sug-120',
        date: '2026-09-07',
        category: 'Clinical Monitoring',
        message: 'CA-125 tumor marker level dropped 42% from baseline. Next pelvic MRI scheduled for Week 8.',
        doctorName: 'Dr. Priya Patel, MD',
        docId: 'DOC-2045'
      },
      {
        id: 'sug-121',
        date: '2026-09-03',
        category: 'Medication Regimen',
        message: 'Maintain Vitamin D3 (2000 IU/day) and Calcium supplementation alongside targeted dual HER2 blockade.',
        doctorName: 'Dr. Priya Patel, MD',
        docId: 'DOC-2045'
      }
    ],
    prescribedTreatment: {
      treatmentId: 'T-009',
      treatmentName: 'T-DXd + Pertuzumab Precision Regimen',
      drugClass: 'Dual HER2 Dimerization Blockade + Cytotoxic ADC',
      mechanism: 'Prevents HER2 heterodimerization while delivering cleavable exatecan derivative payload directly into tumor bed.',
      dosageInstructions: 'T-DXd 5.4 mg/kg + Pertuzumab 420 mg IV every 3 weeks.',
      cycleFrequency: 'Cycle 3 of 6 (Active / In Progress)',
      quantumEfficacyScore: 92.1,
      sideEffectRiskScore: 26.5,
      costEfficiency: {
        estimatedCostUsd: 215000,
        insuranceCoveredPercent: 90,
        patientSavingsEstimated: 56000,
        monthlyEstimatedOutofPocket: 890,
        costEfficiencyTier: 'High Efficiency',
        comparatorCostUsd: 290000
      },
      sideEffects: [
        {
          effect: 'Mild Neutropenia',
          severity: 'Moderate',
          managementAdvice: 'Granulocyte colony-stimulating factor (G-CSF) prescribed if ANC < 1.0.'
        },
        {
          effect: 'Nausea / Taste Changes',
          severity: 'Mild',
          managementAdvice: 'Ginger tea, mint infusions, and small frequent cold meals.'
        }
      ]
    }
  }
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
