import { useState } from 'react';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import PatientPortal from './components/PatientPortal';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile' | 'patient'>('dashboard');
  const [user, setUser] = useState<{ name: string; email: string; role: string; docId?: string } | null>(null);
  const [loggedInPatientId, setLoggedInPatientId] = useState<string | null>(null);

  if (currentView === 'patient' && loggedInPatientId) {
    return (
      <PatientPortal
        patientId={loggedInPatientId}
        onLogout={() => {
          setLoggedInPatientId(null);
          setCurrentView('dashboard');
        }}
      />
    );
  }

  if (currentView === 'profile') {
    return (
      <ProfilePage
        user={user}
        onUpdateUser={(updated) => setUser({ ...user, ...updated })}
        onBackToDashboard={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      setUser={setUser}
      onOpenProfile={() => setCurrentView('profile')}
      onPatientLogin={(pId) => {
        setLoggedInPatientId(pId);
        setCurrentView('patient');
      }}
    />
  );
}
