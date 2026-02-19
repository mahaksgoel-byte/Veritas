import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const AdminDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-500/20 via-orange-500/10 to-transparent border border-red-500/20 rounded-xl p-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Admin Dashboard</h1>
          <p className="text-text-muted">System administration and user management</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">User Management</h3>
            <p className="text-text-muted">Manage all user accounts and roles</p>
          </div>
          
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">System Analytics</h3>
            <p className="text-text-muted">Monitor system performance and usage</p>
          </div>
          
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Role Permissions</h3>
            <p className="text-text-muted">Configure role-based access controls</p>
          </div>
          
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Audit Logs</h3>
            <p className="text-text-muted">View system activity logs</p>
          </div>
          
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Content Moderation</h3>
            <p className="text-text-muted">Moderate user-generated content</p>
          </div>
          
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">System Settings</h3>
            <p className="text-text-muted">Configure system-wide settings</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
