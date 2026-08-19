import { useState } from 'react';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile'>('dashboard');
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  if (currentView === 'profile') {
    return (
      <ProfilePage
        user={user}
        onUpdateUser={(updated) => setUser(updated)}
        onBackToDashboard={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      setUser={setUser}
      onOpenProfile={() => setCurrentView('profile')}
    />
  );
}
