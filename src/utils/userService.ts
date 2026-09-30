// Unified Client-Side Service for Doctor Accounts, Admin Approvals & Database Synchronization

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
  docId: string;
  licenseNumber?: string;
  isApproved: boolean;
  password?: string;
  submittedAt?: string;
  hospital?: string;
}

const STORAGE_KEY = 'quantum_registered_users_v5';

export const INITIAL_VERIFIED_DOCTORS: UserRecord[] = [
  {
    id: 101,
    name: 'Dr. Rajesh Sharma, MD',
    email: 'r.sharma@oncocenter.org',
    docId: 'DOC-1092',
    role: 'Immunotherapy & Checkpoint Specialist',
    licenseNumber: 'MD-892014-NY',
    hospital: 'Memorial Precision Cancer Center',
    isApproved: true,
    password: '123456',
    submittedAt: 'Verified Active'
  },
  {
    id: 102,
    name: 'Dr. Priya Patel, MD',
    email: 'p.patel@precisionmed.org',
    docId: 'DOC-2045',
    role: 'Medical Oncologist — Targeted & Chemo Regimens',
    licenseNumber: 'MD-449102-CA',
    hospital: 'National Institute of Quantum Medicine',
    isApproved: true,
    password: '123456',
    submittedAt: 'Verified Active'
  },
  {
    id: 103,
    name: 'Dr. Marcus Vance, MD',
    email: 'm.vance@quantumoncology.org',
    docId: 'DOC-3001',
    role: 'Radiation & Quantum Optimization Specialist',
    licenseNumber: 'MD-771923-BOS',
    hospital: 'Metropolitan Comprehensive Cancer Center',
    isApproved: true,
    password: '123456',
    submittedAt: 'Verified Active'
  }
];

// Helper to remove any duplicate objects by docId
function deduplicateList(users: UserRecord[]): UserRecord[] {
  const map = new Map<string, UserRecord>();

  for (const u of users) {
    if (!u || !u.docId || !u.name) continue;
    const key = u.docId.trim().toUpperCase();

    if (!map.has(key)) {
      map.set(key, {
        ...u,
        docId: key,
        email: u.email.trim().toLowerCase(),
        isApproved: Boolean(u.isApproved)
      });
    } else {
      // If duplicate exists, keep whichever record has explicit approval or latest updates
      const existing = map.get(key)!;
      map.set(key, {
        ...existing,
        ...u,
        id: existing.id,
        docId: key,
        email: u.email.trim().toLowerCase(),
        isApproved: u.isApproved !== undefined ? u.isApproved : existing.isApproved
      });
    }
  }

  return Array.from(map.values());
}

// Clean old corrupted keys once
function purgeOldKeys() {
  try {
    const oldKeys = [
      'quantum_registered_users',
      'quantum_registered_users_v2',
      'quantum_registered_users_v3',
      'quantum_registered_users_v4'
    ];
    for (const k of oldKeys) {
      localStorage.removeItem(k);
    }
  } catch {
    // ignore
  }
}

export function getRegisteredUsers(): UserRecord[] {
  try {
    purgeOldKeys();
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      saveUsersToStorage(INITIAL_VERIFIED_DOCTORS);
      return INITIAL_VERIFIED_DOCTORS;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveUsersToStorage(INITIAL_VERIFIED_DOCTORS);
      return INITIAL_VERIFIED_DOCTORS;
    }

    // Merge baseline doctors with stored users
    // First, map baseline doctors
    const map = new Map<string, UserRecord>();
    for (const doc of INITIAL_VERIFIED_DOCTORS) {
      map.set(doc.docId.toUpperCase(), { ...doc });
    }

    // Then update with stored user data (preserves approval toggles and edits)
    for (const u of parsed) {
      if (!u || !u.docId || !u.name) continue;
      const key = String(u.docId).trim().toUpperCase();
      const cleanEmail = String(u.email || '').trim().toLowerCase();
      if (cleanEmail && !cleanEmail.includes('@')) continue;

      const userObj: UserRecord = {
        id: Number(u.id) || Date.now() + Math.floor(Math.random() * 1000),
        name: String(u.name).trim(),
        email: cleanEmail,
        docId: key,
        role: u.role || 'Medical Oncologist',
        licenseNumber: u.licenseNumber || `LIC-${key}`,
        isApproved: Boolean(u.isApproved),
        password: u.password || '123456',
        submittedAt: u.submittedAt || 'Active Registration',
        hospital: u.hospital || 'Precision Cancer Center'
      };

      map.set(key, userObj);
    }

    const cleanList = Array.from(map.values());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanList));
    return cleanList;
  } catch (e) {
    console.error('Failed to get registered users:', e);
    return INITIAL_VERIFIED_DOCTORS;
  }
}

export function saveUsersToStorage(users: UserRecord[]): void {
  try {
    const clean = deduplicateList(users);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  } catch (e) {
    console.error('Failed to save users to storage:', e);
  }
}

export function saveNewUserRegistration(user: Omit<UserRecord, 'id'>): UserRecord[] {
  const current = getRegisteredUsers();
  const cleanDocId = (user.docId || `DOC-${Date.now().toString().slice(-4)}`).trim().toUpperCase();
  const cleanEmail = user.email.trim().toLowerCase();

  const newUser: UserRecord = {
    ...user,
    id: Date.now(),
    docId: cleanDocId,
    email: cleanEmail,
    isApproved: false,
    submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  // Replace any existing user with same Doc ID
  const map = new Map<string, UserRecord>();
  for (const u of current) {
    map.set(u.docId.toUpperCase(), u);
  }
  map.set(cleanDocId, newUser);

  const updated = Array.from(map.values());
  saveUsersToStorage(updated);
  return updated;
}

export function updateUserApprovalStatus(docIdOrId: string | number, isApproved: boolean): UserRecord[] {
  const current = getRegisteredUsers();
  const searchStr = String(docIdOrId).trim().toUpperCase();

  const updated = current.map(u => {
    if (u.docId.toUpperCase() === searchStr || String(u.id) === searchStr) {
      return { ...u, isApproved };
    }
    return u;
  });

  const clean = deduplicateList(updated);
  saveUsersToStorage(clean);
  return clean;
}

export function updateUserDetails(docIdOrId: string | number, details: Partial<UserRecord>): UserRecord[] {
  const current = getRegisteredUsers();
  const searchStr = String(docIdOrId).trim().toUpperCase();

  const updated = current.map(u => {
    if (u.docId.toUpperCase() === searchStr || String(u.id) === searchStr) {
      return {
        ...u,
        ...details,
        docId: details.docId ? details.docId.trim().toUpperCase() : u.docId,
        email: details.email ? details.email.trim().toLowerCase() : u.email
      };
    }
    return u;
  });

  const clean = deduplicateList(updated);
  saveUsersToStorage(clean);
  return clean;
}

export function deleteUserAccount(docIdOrId: string | number): UserRecord[] {
  const current = getRegisteredUsers();
  const searchStr = String(docIdOrId).trim().toUpperCase();

  const updated = current.filter(u => 
    u.docId.toUpperCase() !== searchStr && 
    String(u.id) !== searchStr
  );

  saveUsersToStorage(updated);
  return updated;
}

export function resetToInitialVerifiedDoctors(): UserRecord[] {
  purgeOldKeys();
  saveUsersToStorage(INITIAL_VERIFIED_DOCTORS);
  return INITIAL_VERIFIED_DOCTORS;
}

export function verifyAndPurgeInvalidAccounts(): { purgedCount: number; cleanList: UserRecord[] } {
  purgeOldKeys();
  const current = getRegisteredUsers();
  const initialLength = current.length;
  const cleanList = deduplicateList(current);

  // Ensure default 3 doctors are always present
  const map = new Map<string, UserRecord>();
  for (const d of INITIAL_VERIFIED_DOCTORS) {
    map.set(d.docId.toUpperCase(), d);
  }
  for (const c of cleanList) {
    map.set(c.docId.toUpperCase(), c);
  }

  const final = Array.from(map.values());
  saveUsersToStorage(final);
  const purgedCount = Math.max(0, initialLength - final.length);
  return { purgedCount, cleanList: final };
}
