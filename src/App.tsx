import { useState } from 'react';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import PatientPortal from './components/PatientPortal';

export interface UserAccount {
  name: string;
  email: string;
  role: string;
  userType?: 'doctor' | 'patient';
}

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile' | 'patientPortal'>('dashboard');
  const [user, setUser] = useState<UserAccount | null>(null);

  // If user signed in as Patient, auto-route to Patient Portal
  if (user?.userType === 'patient' || currentView === 'patientPortal') {
    return (
      <PatientPortal
        user={user}
        onBackToDashboard={() => {
          if (user?.userType === 'patient') {
            setUser(null); // Sign out patient on back
          } else {
            setCurrentView('dashboard');
          }
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
      setUser={(u) => {
        setUser(u);
        if (u?.userType === 'patient') {
          setCurrentView('patientPortal');
        }
      }}
      onOpenProfile={() => setCurrentView('profile')}
      onOpenPatientPortal={() => setCurrentView('patientPortal')}
    />
  );
}
