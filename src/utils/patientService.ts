import { Patient, DoctorSuggestion, PrescribedTreatment } from '../types';
import { mockPatients } from '../data/mockData';

const PATIENTS_STORAGE_KEY = 'quantum_cohort_patients_v2';

export function getStoredPatients(): Patient[] {
  try {
    const raw = localStorage.getItem(PATIENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(mockPatients));
      return mockPatients;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(mockPatients));
      return mockPatients;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load patients from storage:', e);
    return mockPatients;
  }
}

export function savePatientsToStorage(patients: Patient[]): void {
  try {
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
  } catch (e) {
    console.error('Failed to save patients to storage:', e);
  }
}

export function getPatientById(patientId: string): Patient | undefined {
  const all = getStoredPatients();
  return all.find(p => p.id.toUpperCase() === patientId.toUpperCase());
}

export function addPatientRecord(patient: Patient): Patient[] {
  const current = getStoredPatients();
  // Filter out duplicate ID if exists
  const filtered = current.filter(p => p.id.toUpperCase() !== patient.id.toUpperCase());
  const updated = [patient, ...filtered];
  savePatientsToStorage(updated);
  return updated;
}

export function removePatientRecord(patientId: string): Patient[] {
  const current = getStoredPatients();
  const updated = current.filter(p => p.id.toUpperCase() !== patientId.toUpperCase());
  savePatientsToStorage(updated);
  return updated;
}

export function addDoctorSuggestion(patientId: string, suggestion: DoctorSuggestion): Patient[] {
  const current = getStoredPatients();
  const updated = current.map(p => {
    if (p.id.toUpperCase() === patientId.toUpperCase()) {
      const existingSuggestions = p.doctorSuggestions || [];
      return {
        ...p,
        doctorSuggestions: [suggestion, ...existingSuggestions]
      };
    }
    return p;
  });
  savePatientsToStorage(updated);
  return updated;
}

export function deleteDoctorSuggestion(patientId: string, suggestionId: string): Patient[] {
  const current = getStoredPatients();
  const updated = current.map(p => {
    if (p.id.toUpperCase() === patientId.toUpperCase()) {
      return {
        ...p,
        doctorSuggestions: (p.doctorSuggestions || []).filter(s => s.id !== suggestionId)
      };
    }
    return p;
  });
  savePatientsToStorage(updated);
  return updated;
}

export function updatePrescribedTreatment(patientId: string, treatment: PrescribedTreatment): Patient[] {
  const current = getStoredPatients();
  const updated = current.map(p => {
    if (p.id.toUpperCase() === patientId.toUpperCase()) {
      return {
        ...p,
        prescribedTreatment: treatment
      };
    }
    return p;
  });
  savePatientsToStorage(updated);
  return updated;
}
