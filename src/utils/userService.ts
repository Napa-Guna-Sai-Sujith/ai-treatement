// Unified Client-Side Service for Doctor Accounts, Admin Approvals & Database Synchronization

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
  docId?: string;
  licenseNumber?: string;
  isApproved: boolean;
  password?: string;
  submittedAt?: string;
  hospital?: string;
}

const STORAGE_KEY = 'quantum_registered_users_v3';
const LEGACY_STORAGE_KEY = 'quantum_registered_users';

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

export function getRegisteredUsers(): UserRecord[] {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    
    // Check legacy storage migration if v3 is empty
    if (!raw) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        try {
          const legacyParsed = JSON.parse(legacyRaw);
          if (Array.isArray(legacyParsed) && legacyParsed.length > 0) {
            raw = legacyRaw;
          }
        } catch {
          // ignore
        }
      }
    }

    let parsed: any[] = [];
    if (raw) {
      parsed = JSON.parse(raw);
    }

    // Merge baseline doctors with stored users, deduplicating by Doc ID and Email
    const validUsersMap = new Map<string, UserRecord>();

    // First insert initial verified doctors
    for (const doc of INITIAL_VERIFIED_DOCTORS) {
      validUsersMap.set(doc.docId!.toUpperCase(), doc);
      validUsersMap.set(doc.email.toLowerCase(), doc);
    }

    // Then merge parsed users if they have valid fields
    if (Array.isArray(parsed)) {
      for (const u of parsed) {
        if (!u || typeof u !== 'object') continue;
        if (!u.name || !u.email || !u.docId) continue; // Purge corrupted/empty entries
        
        const cleanDocId = String(u.docId).trim().toUpperCase();
        const cleanEmail = String(u.email).trim().toLowerCase();
        
        // Skip invalid placeholders or malformed emails
        if (!cleanEmail.includes('@') || cleanDocId.length < 3) continue;

        const normalized: UserRecord = {
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
        };

        // If it overrides initial doctors (e.g. status updated), update
        validUsersMap.set(cleanDocId, normalized);
      }
    }

    const result = Array.from(new Set(validUsersMap.values()));
    saveUsersToStorage(result);
    return result;
  } catch (e) {
    console.error('Failed to get registered users:', e);
    return INITIAL_VERIFIED_DOCTORS;
  }
}

export function saveUsersToStorage(users: UserRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    // Keep legacy in sync for compatibility
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(users));
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

  const filtered = current.filter(u => 
    u.docId?.toUpperCase() !== cleanDocId && 
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
      (u.docId && u.docId.toLowerCase() === searchStr) ||
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
      return { ...u, ...details };
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

  // Ensure default doctors are always present
  for (const defaultDoc of INITIAL_VERIFIED_DOCTORS) {
    if (!validList.some(u => u.docId?.toUpperCase() === defaultDoc.docId?.toUpperCase())) {
      validList.push(defaultDoc);
    }
  }

  saveUsersToStorage(validList);
  return { purgedCount, cleanList: validList };
}
