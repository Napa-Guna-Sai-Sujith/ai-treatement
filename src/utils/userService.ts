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

const STORAGE_KEY = 'quantum_registered_users_v4';

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

// Clean legacy keys once to prevent old ghost duplicates from resurfacing
function purgeLegacyStorage() {
  try {
    localStorage.removeItem('quantum_registered_users');
    localStorage.removeItem('quantum_registered_users_v2');
    localStorage.removeItem('quantum_registered_users_v3');
  } catch {
    // ignore
  }
}

export function getRegisteredUsers(): UserRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      purgeLegacyStorage();
      saveUsersToStorage(INITIAL_VERIFIED_DOCTORS);
      return INITIAL_VERIFIED_DOCTORS;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveUsersToStorage(INITIAL_VERIFIED_DOCTORS);
      return INITIAL_VERIFIED_DOCTORS;
    }

    // Strict deduplication by Doc ID and Email
    const seenDocIds = new Set<string>();
    const seenEmails = new Set<string>();
    const cleanList: UserRecord[] = [];

    for (const u of parsed) {
      if (!u || typeof u !== 'object') continue;
      if (!u.name || !u.email || !u.docId) continue;

      const cleanDocId = String(u.docId).trim().toUpperCase();
      const cleanEmail = String(u.email).trim().toLowerCase();

      if (!cleanEmail.includes('@') || cleanDocId.length < 3) continue;

      // Skip if this docId or email was already added (prevent duplicates)
      if (seenDocIds.has(cleanDocId) || seenEmails.has(cleanEmail)) continue;

      seenDocIds.add(cleanDocId);
      seenEmails.add(cleanEmail);

      cleanList.push({
        id: Number(u.id) || Date.now() + Math.floor(Math.random() * 1000),
        name: String(u.name).trim(),
        email: cleanEmail,
        docId: cleanDocId,
        role: u.role || 'Medical Oncologist',
        licenseNumber: u.licenseNumber || `LIC-${cleanDocId}`,
        isApproved: Boolean(u.isApproved),
        password: u.password || '123456',
        submittedAt: u.submittedAt || 'Active Registration',
        hospital: u.hospital || 'Precision Cancer Center'
      });
    }

    // Ensure baseline doctors are always available if not explicitly removed
    if (cleanList.length === 0) {
      saveUsersToStorage(INITIAL_VERIFIED_DOCTORS);
      return INITIAL_VERIFIED_DOCTORS;
    }

    saveUsersToStorage(cleanList);
    return cleanList;
  } catch (e) {
    console.error('Failed to get registered users:', e);
    return INITIAL_VERIFIED_DOCTORS;
  }
}

export function saveUsersToStorage(users: UserRecord[]): void {
  try {
    // Deduplicate one more time before saving to be 100% airtight
    const seenDocIds = new Set<string>();
    const seenEmails = new Set<string>();
    const deduped: UserRecord[] = [];

    for (const u of users) {
      const docKey = u.docId.toUpperCase();
      const emailKey = u.email.toLowerCase();
      if (!seenDocIds.has(docKey) && !seenEmails.has(emailKey)) {
        seenDocIds.add(docKey);
        seenEmails.add(emailKey);
        deduped.push(u);
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped));
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

  // Remove any previous conflicting entry with same docId or email
  const filtered = current.filter(u => 
    u.docId.toUpperCase() !== cleanDocId && 
    u.email.toLowerCase() !== cleanEmail
  );

  const updated = [newUser, ...filtered];
  saveUsersToStorage(updated);
  return updated;
}

export function updateUserApprovalStatus(userIdOrDocIdOrEmail: string | number, isApproved: boolean): UserRecord[] {
  const current = getRegisteredUsers();
  const searchStr = String(userIdOrDocIdOrEmail).trim().toLowerCase();

  const updated = current.map(u => {
    if (
      String(u.id) === searchStr ||
      u.docId.toLowerCase() === searchStr ||
      u.email.toLowerCase() === searchStr
    ) {
      return { ...u, isApproved };
    }
    return u;
  });

  saveUsersToStorage(updated);
  return updated;
}

export function updateUserDetails(userId: number, details: Partial<UserRecord>): UserRecord[] {
  const current = getRegisteredUsers();
  const updated = current.map(u => {
    if (u.id === userId) {
      return {
        ...u,
        ...details,
        docId: details.docId ? details.docId.trim().toUpperCase() : u.docId,
        email: details.email ? details.email.trim().toLowerCase() : u.email
      };
    }
    return u;
  });

  saveUsersToStorage(updated);
  return updated;
}

export function deleteUserAccount(userId: number): UserRecord[] {
  const current = getRegisteredUsers();
  const updated = current.filter(u => u.id !== userId);
  saveUsersToStorage(updated);
  return updated;
}

export function verifyAndPurgeInvalidAccounts(): { purgedCount: number; cleanList: UserRecord[] } {
  purgeLegacyStorage();
  const current = getRegisteredUsers();
  const seenDocIds = new Set<string>();
  const seenEmails = new Set<string>();
  const validList: UserRecord[] = [];
  let purgedCount = 0;

  for (const u of current) {
    if (!u.name || !u.email || !u.docId) {
      purgedCount++;
      continue;
    }

    const docKey = u.docId.toUpperCase();
    const emailKey = u.email.toLowerCase();

    if (seenDocIds.has(docKey) || seenEmails.has(emailKey)) {
      purgedCount++;
      continue;
    }

    seenDocIds.add(docKey);
    seenEmails.add(emailKey);
    validList.push(u);
  }

  // Ensure initial doctors exist
  for (const defaultDoc of INITIAL_VERIFIED_DOCTORS) {
    if (!validList.some(u => u.docId.toUpperCase() === defaultDoc.docId.toUpperCase())) {
      validList.push(defaultDoc);
    }
  }

  saveUsersToStorage(validList);
  return { purgedCount, cleanList: validList };
}
