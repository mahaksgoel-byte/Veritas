import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export const AboutPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/20 rounded-xl p-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">About Veritas</h1>
          <p className="text-text-muted">Building a trusted academic and research network</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Our Mission</h3>
            <p className="text-text-muted mb-4">
              Veritas is dedicated to creating a verified network where academics and researchers can connect, collaborate, and share knowledge with confidence.
            </p>
            <p className="text-text-muted">
              We believe in the power of verified credentials and trusted connections to advance scientific and academic discourse.
            </p>
          </div>
          
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Our Vision</h3>
            <p className="text-text-muted mb-4">
              To create the world's most trusted academic and research platform where every connection is meaningful and every contribution is valued.
            </p>
            <p className="text-text-muted">
              We're building a future where knowledge sharing is secure, verifiable, and accessible to all qualified individuals.
            </p>
          </div>
        </div>

        <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-accent">V</span>
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Verification</h4>
              <p className="text-sm text-text-muted">Every user is verified to ensure trust and authenticity</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-accent">C</span>
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Collaboration</h4>
              <p className="text-sm text-text-muted">Fostering meaningful connections between academics and researchers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-accent">K</span>
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Knowledge</h4>
              <p className="text-sm text-text-muted">Advancing the frontiers of human understanding together</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
