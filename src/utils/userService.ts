// Client-side helper service for Neon DB / Local Storage user management

export interface UserRecord {
  id?: number;
  name: string;
  email: string;
  role: string;
  licenseNumber?: string;
  isApproved: boolean;
  submittedAt?: string;
}

const STORAGE_KEY = 'quantum_registered_users';

export function getRegisteredUsers(): UserRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse registered users:', e);
    return [];
  }
}

export function saveNewUserRegistration(user: UserRecord): void {
  const existing = getRegisteredUsers();
  // Filter out any duplicate email registration
  const filtered = existing.filter(u => u.email.toLowerCase() !== user.email.toLowerCase());
  const updated = [user, ...filtered];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function updateUserApprovalStatus(email: string, isApproved: boolean): void {
  const existing = getRegisteredUsers();
  const updated = existing.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, isApproved } : u);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
