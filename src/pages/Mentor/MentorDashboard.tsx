import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const MentorDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/20 rounded-xl p-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Analysis Dashboard</h1>
          <p className="text-text-muted">Welcome to your mentor analysis hub</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Student Analysis</h3>
            <p className="text-text-muted">Analyze student performance and progress</p>
          </div>
          
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Guidance Analytics</h3>
            <p className="text-text-muted">Track mentorship patterns and outcomes</p>
          </div>
          
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Mentorship Insights</h3>
            <p className="text-text-muted">Analyze mentorship effectiveness</p>
          </div>
          
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Knowledge Analysis</h3>
            <p className="text-text-muted">Analyze knowledge sharing trends</p>
          </div>
          
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Collaboration Metrics</h3>
            <p className="text-text-muted">Measure collaboration effectiveness</p>
          </div>
          
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Resource Analytics</h3>
            <p className="text-text-muted">Track resource utilization</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
