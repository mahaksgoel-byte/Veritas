import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export const SubscriptionPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/20 rounded-xl p-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Subscription Plans</h1>
          <p className="text-text-muted">Choose the plan that best fits your academic and research needs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-2">Free</h3>
            <div className="text-3xl font-bold text-accent mb-4">$0<span className="text-sm text-text-muted">/month</span></div>
            <ul className="space-y-2 mb-6">
              <li className="text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Basic profile creation
              </li>
              <li className="text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Limited connections (50)
              </li>
              <li className="text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Access to public content
              </li>
              <li className="text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Basic search functionality
              </li>
            </ul>
            <button className="w-full py-2 px-4 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors">
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-forest-800/50 border-2 border-accent rounded-xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-forest-900 px-3 py-1 rounded-full text-xs font-semibold">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Pro</h3>
            <div className="text-3xl font-bold text-accent mb-4">$29<span className="text-sm text-text-muted">/month</span></div>
            <ul className="space-y-2 mb-6">
              <li className="text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Enhanced profile features
              </li>
              <li className="text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Unlimited connections
              </li>
              <li className="text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Access to premium content
              </li>
              <li className="text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Advanced search & filters
              </li>
              <li className="text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Collaboration tools
              </li>
              <li className="text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Priority support
              </li>
            </ul>
            <button className="w-full py-2 px-4 bg-accent text-forest-900 rounded-lg hover:bg-accent/90 transition-colors font-semibold">
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-2">Enterprise</h3>
            <div className="text-3xl font-bold text-accent mb-4">$99<span className="text-sm text-text-muted">/month</span></div>
            <ul className="space-y-2 mb-6">
              <li className="text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                All Pro features
              </li>
              <li className="text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Institution branding
              </li>
              <li className="text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Custom integrations
              </li>
              <li className="text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Advanced analytics
              </li>
              <li className="text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Dedicated account manager
              </li>
              <li className="text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Custom training sessions
              </li>
            </ul>
            <button className="w-full py-2 px-4 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>

        <div className="bg-forest-800/30 border border-forest-divider/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-3">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-text-primary mb-2">Can I change my plan anytime?</h4>
              <p className="text-text-muted text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-2">Is there a free trial for paid plans?</h4>
              <p className="text-text-muted text-sm">Yes, we offer a 14-day free trial for Pro and Enterprise plans with full access to all features.</p>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-2">Do you offer discounts for institutions?</h4>
              <p className="text-text-muted text-sm">Yes, we offer special pricing for educational institutions and research organizations. Contact our sales team for details.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
