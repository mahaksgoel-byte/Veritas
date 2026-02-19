import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export const ReviewsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/20 rounded-xl p-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Reviews & Testimonials</h1>
          <p className="text-text-muted">See what our community says about Veritas</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Review Card 1 */}
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-accent text-lg">★</span>
              ))}
            </div>
            <p className="text-text-muted mb-4">
              "Veritas has transformed how I collaborate with researchers worldwide. The verification system gives me confidence in every connection."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-accent font-semibold">JD</span>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">Dr. Jane Doe</h4>
                <p className="text-sm text-text-muted">Research Scientist, MIT</p>
              </div>
            </div>
          </div>

          {/* Review Card 2 */}
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-accent text-lg">★</span>
              ))}
            </div>
            <p className="text-text-muted mb-4">
              "As an educator, I've found incredible value in connecting with both students and fellow academics. The platform is intuitive and secure."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-accent font-semibold">RS</span>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">Prof. Robert Smith</h4>
                <p className="text-sm text-text-muted">Department Head, Stanford</p>
              </div>
            </div>
          </div>

          {/* Review Card 3 */}
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-accent text-lg">★</span>
              ))}
            </div>
            <p className="text-text-muted mb-4">
              "The collaboration tools have streamlined our research projects. We can share findings securely with verified partners globally."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-accent font-semibold">EJ</span>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">Dr. Emily Johnson</h4>
                <p className="text-sm text-text-muted">PhD Researcher, Oxford</p>
              </div>
            </div>
          </div>

          {/* Review Card 4 */}
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-accent text-lg">★</span>
              ))}
            </div>
            <p className="text-text-muted mb-4">
              "Finally, a platform that values academic integrity. The verification process ensures meaningful connections with qualified peers."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-accent font-semibold">MC</span>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">Dr. Michael Chen</h4>
                <p className="text-sm text-text-muted">Postdoc, Harvard Medical</p>
              </div>
            </div>
          </div>

          {/* Review Card 5 */}
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-accent text-lg">★</span>
              ))}
            </div>
            <p className="text-text-muted mb-4">
              "The student-mentor matching system has helped me find guidance for my research. Veritas is essential for early-career researchers."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-accent font-semibold">SL</span>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">Sarah Lee</h4>
                <p className="text-sm text-text-muted">Graduate Student, Berkeley</p>
              </div>
            </div>
          </div>

          {/* Review Card 6 */}
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-accent text-lg">★</span>
              ))}
            </div>
            <p className="text-text-muted mb-4">
              "Our institution adopted Veritas for inter-departmental collaboration. The results have been outstanding - research output increased by 40%."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-accent font-semibold">AW</span>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">Dr. Alan Wilson</h4>
                <p className="text-sm text-text-muted">Dean, Yale University</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-forest-800/30 border border-forest-divider/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Platform Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">4.9/5</div>
              <p className="text-sm text-text-muted">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">10,000+</div>
              <p className="text-sm text-text-muted">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">500+</div>
              <p className="text-sm text-text-muted">Institutions</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">98%</div>
              <p className="text-sm text-text-muted">Satisfaction Rate</p>
            </div>
          </div>
        </div>

        {/* Add Review Section */}
        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Share Your Experience</h3>
          <p className="text-text-muted mb-4">
            Have you used Veritas? We'd love to hear your feedback and help improve our platform.
          </p>
          <button className="px-6 py-2 bg-accent text-forest-900 rounded-lg hover:bg-accent/90 transition-colors font-semibold">
            Write a Review
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};
