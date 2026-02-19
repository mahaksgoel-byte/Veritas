import React from 'react';
import { TopNav } from '../layout/TopNav';
import { ThemeToggle } from '../ui/ThemeToggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {

  return (
    <div className="min-h-screen bg-forest-900 flex flex-col">
      {/* Top Navigation */}
      <TopNav />

      {/* Page Content */}
      <main className="flex-1 px-8 py-8 bg-forest-900">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
};