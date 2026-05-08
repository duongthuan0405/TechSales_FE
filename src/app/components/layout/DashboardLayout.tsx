import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

interface DashboardLayoutProps {
  role: 'customer' | 'sales' | 'business' | 'technical';
  currentPath: string;
  onNavigate: (path: string) => void;
  userName: string;
  userRole: string;
  onLogout: () => void;
  children: ReactNode;
}

export function DashboardLayout({
  role,
  currentPath,
  onNavigate,
  userName,
  userRole,
  onLogout,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar role={role} currentPath={currentPath} onNavigate={onNavigate} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav userName={userName} userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
