import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'patient';
}

interface MainLayoutProps {
  children: React.ReactNode;
  userRole: 'admin' | 'patient';
}

export const MainLayout = ({ children, userRole }: MainLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return null; // Or a loading spinner
  }

  const searchPlaceholder = userRole === 'admin' 
    ? 'Find Patients or Appointments...' 
    : 'Find Appointments...';

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-background">
        <AppSidebar 
          userRole={userRole}
          userName={user.name}
          onLogout={handleLogout}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader 
            userName={user.name}
            userRole={userRole}
            searchPlaceholder={searchPlaceholder}
          />
          
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};