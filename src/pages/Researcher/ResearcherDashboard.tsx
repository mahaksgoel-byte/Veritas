import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const ResearcherDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/20 rounded-xl p-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Analysis Dashboard</h1>
          <p className="text-text-muted">Welcome to your researcher analysis hub</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Research Data Analysis</h3>
            <p className="text-text-muted">Analyze research data and patterns</p>
          </div>
          
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Research Trend Insights</h3>
            <p className="text-text-muted">Discover emerging research trends</p>
          </div>
          
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Research Performance Metrics</h3>
            <p className="text-text-muted">Track research impact and KPIs</p>
          </div>
          
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Citation Analysis</h3>
            <p className="text-text-muted">Analyze citation patterns and impact</p>
          </div>
          
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Researcher Reports</h3>
            <p className="text-text-muted">Generate comprehensive analysis reports</p>
          </div>
          
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Research Comparative Studies</h3>
            <p className="text-text-muted">Compare research across domains</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
