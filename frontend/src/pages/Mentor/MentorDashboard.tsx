import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  BookOpen,
  Target,
  BarChart3,
  Brain,
  Shield,
  Star,
  Filter,
  Download,
  Bell,
  Video,
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface StudentRequest {
  id: string;
  studentName: string;
  studentEmail: string;
  paperTitle: string;
  submittedAt: Date;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  type: 'paper_review' | 'guidance' | 'consultation';
  description: string;
}

interface MentorshipSession {
  id: string;
  studentName: string;
  duration: number;
  date: Date;
  topic: string;
  rating?: number;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface AnalyticsData {
  totalStudents: number;
  activeStudents: number;
  pendingRequests: number;
  completedSessions: number;
  averageRating: number;
  responseTime: string;
  weeklyGrowth: number;
}

export const MentorDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMethod, setAuthMethod] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<StudentRequest[]>([
    {
      id: '1',
      studentName: 'Alex Thompson',
      studentEmail: 'alex@university.edu',
      paperTitle: 'Machine Learning Applications in Healthcare',
      submittedAt: new Date(Date.now() - 86400000),
      status: 'pending',
      priority: 'high',
      type: 'paper_review',
      description: 'Requesting detailed feedback on methodology section and statistical analysis approach'
    },
    {
      id: '2',
      studentName: 'Sarah Chen',
      studentEmail: 'sarah@university.edu',
      paperTitle: 'Climate Data Analysis Framework',
      submittedAt: new Date(Date.now() - 172800000),
      status: 'reviewing',
      priority: 'medium',
      type: 'guidance',
      description: 'Need guidance on data visualization techniques and research methodology'
    },
    {
      id: '3',
      studentName: 'Michael Rodriguez',
      studentEmail: 'michael@university.edu',
      paperTitle: 'Social Media Impact Study',
      submittedAt: new Date(Date.now() - 259200000),
      status: 'pending',
      priority: 'low',
      type: 'consultation',
      description: 'Quick consultation on research direction and next steps'
    }
  ]);

  const [upcomingSessions, setUpcomingSessions] = useState<MentorshipSession[]>([
    {
      id: '1',
      studentName: 'Emma Wilson',
      duration: 60,
      date: new Date(Date.now() + 3600000),
      topic: 'Thesis Chapter Review',
      notes: '',
      status: 'scheduled'
    },
    {
      id: '2',
      studentName: 'David Kim',
      duration: 45,
      date: new Date(Date.now() + 7200000),
      topic: 'Research Methodology Discussion',
      notes: '',
      status: 'scheduled'
    }
  ]);

  const [analyticsData] = useState<AnalyticsData>({
    totalStudents: 24,
    activeStudents: 18,
    pendingRequests: 12,
    completedSessions: 156,
    averageRating: 4.7,
    responseTime: '2.4 hours',
    weeklyGrowth: 15
  });

  const [selectedRequest, setSelectedRequest] = useState<StudentRequest | null>(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);

  const handleAuthentication = (method: string) => {
    setIsAuthenticated(true);
    setAuthMethod(method);
  };

  const handleRequestAction = (requestId: string, action: 'approve' | 'reject' | 'start_review') => {
    setPendingRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'reviewing' }
        : req
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-500/30 bg-red-500/20';
      case 'medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/20';
      case 'low': return 'text-green-400 border-green-500/30 bg-green-500/20';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-400 border-orange-500/30 bg-orange-500/20';
      case 'reviewing': return 'text-blue-400 border-blue-500/30 bg-blue-500/20';
      case 'approved': return 'text-green-400 border-green-500/30 bg-green-500/20';
      case 'rejected': return 'text-red-400 border-red-500/30 bg-red-500/20';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/20';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Mentor Dashboard</h1>
              <p className="text-text-muted">Manage students, review papers, and track mentorship progress</p>
            </div>
            
            {/* Authentication Status */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2"
                >
                  <Shield className="text-green-400" size={20} />
                  <span className="text-green-400 text-sm font-medium">
                    Authenticated ({authMethod})
                  </span>
                </motion.div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-yellow-400" size={20} />
                  <span className="text-yellow-400 text-sm">Not Authenticated</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Authentication Section */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-8"
          >
            <h2 className="text-2xl font-semibold text-text-primary mb-6 text-center">
              Mentor Authentication Required
            </h2>
            <p className="text-text-muted mb-8 text-center">
              Authenticate to access student management, paper review, and mentorship tools
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAuthentication('Email Verification')}
                className="bg-gradient-to-r from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6 text-left hover:border-blue-500/50 transition-all"
              >
                <Shield className="text-blue-400 mb-4 mx-auto" size={32} />
                <h3 className="text-text-primary font-medium mb-2">Email Verification</h3>
                <p className="text-text-muted text-sm">Verify with institutional email</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAuthentication('Two-Factor Auth')}
                className="bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6 text-left hover:border-green-500/50 transition-all"
              >
                <Shield className="text-green-400 mb-4 mx-auto" size={32} />
                <h3 className="text-text-primary font-medium mb-2">Two-Factor Auth</h3>
                <p className="text-text-muted text-sm">Enhanced security verification</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAuthentication('Institutional ID')}
                className="bg-gradient-to-r from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-6 text-left hover:border-purple-500/50 transition-all"
              >
                <Shield className="text-purple-400 mb-4 mx-auto" size={32} />
                <h3 className="text-text-primary font-medium mb-2">Institutional ID</h3>
                <p className="text-text-muted text-sm">Verify with institutional credentials</p>
              </motion.button>
            </div>
          </motion.div>
        )}

        {isAuthenticated && (
          <>
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border border-accent/20 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Users className="text-accent" size={24} />
                  <span className="text-xs text-text-muted bg-accent/20 rounded-full px-2 py-1">
                    +15%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-text-primary">{analyticsData.totalStudents}</h3>
                <p className="text-text-muted">Total Students</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-transparent border border-blue-500/30 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="text-blue-400" size={24} />
                  <span className="text-xs text-text-muted bg-blue-500/20 rounded-full px-2 py-1">
                    Active
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-text-primary">{analyticsData.activeStudents}</h3>
                <p className="text-text-muted">Active Students</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-yellow-500/20 via-yellow-600/10 to-transparent border border-yellow-500/30 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Clock className="text-yellow-400" size={24} />
                  <span className="text-xs text-text-muted bg-yellow-500/20 rounded-full px-2 py-1">
                    {analyticsData.pendingRequests}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-text-primary">{analyticsData.pendingRequests}</h3>
                <p className="text-text-muted">Pending Requests</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-green-500/20 via-green-600/10 to-transparent border border-green-500/30 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Star className="text-green-400" size={24} />
                  <span className="text-xs text-text-muted bg-green-500/20 rounded-full px-2 py-1">
                    {analyticsData.averageRating}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-text-primary">{analyticsData.averageRating}</h3>
                <p className="text-text-muted">Avg Rating</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-transparent border border-purple-500/30 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="text-purple-400" size={24} />
                  <span className="text-xs text-text-muted bg-purple-500/20 rounded-full px-2 py-1">
                    {analyticsData.weeklyGrowth}%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-text-primary">{analyticsData.weeklyGrowth}%</h3>
                <p className="text-text-muted">Weekly Growth</p>
              </motion.div>
            </div>

            {/* Pending Requests + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                    <AlertCircle className="text-yellow-400" size={24} />
                    Pending Requests ({pendingRequests.length})
                  </h2>
                  <button className="flex items-center gap-2 text-accent hover:text-accent/80 text-sm">
                    <Filter size={16} />
                    Filter
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {pendingRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-forest-900/30 border border-forest-divider/30 rounded-lg p-4 hover:bg-forest-900/50 cursor-pointer"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowRequestDetails(true);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                              {request.priority.toUpperCase()}
                            </span>
                            <h3 className="text-text-primary font-medium">{request.studentName}</h3>
                          </div>
                          <p className="text-accent text-sm mb-1">{request.paperTitle}</p>
                          <p className="text-text-muted text-sm">{request.description}</p>
                          <div className="flex items-center gap-4 text-xs text-text-muted mt-2">
                            <Calendar size={14} />
                            <span>{request.submittedAt.toLocaleDateString()}</span>
                            <Clock size={14} />
                            <span>{request.submittedAt.toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          <Eye size={16} className="text-text-muted" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-accent/20 border border-accent/30 rounded-lg p-4 text-left hover:bg-accent/30 transition-all"
                  >
                    <CheckCircle className="text-accent mb-2" size={20} />
                    <h4 className="text-text-primary font-medium">Approve All</h4>
                    <p className="text-text-muted text-sm">Approve pending requests</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-forest-900/50 border border-forest-divider/30 rounded-lg p-4 text-left hover:bg-forest-900/70 transition-all"
                  >
                    <MessageSquare className="text-text-muted mb-2" size={20} />
                    <h4 className="text-text-primary font-medium">Send Message</h4>
                    <p className="text-text-muted text-sm">Message all students</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-forest-900/50 border border-forest-divider/30 rounded-lg p-4 text-left hover:bg-forest-900/70 transition-all"
                  >
                    <Calendar className="text-text-muted mb-2" size={20} />
                    <h4 className="text-text-primary font-medium">Schedule Session</h4>
                    <p className="text-text-muted text-sm">Set up mentorship meetings</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-forest-900/50 border border-forest-divider/30 rounded-lg p-4 text-left hover:bg-forest-900/70 transition-all"
                  >
                    <Download className="text-text-muted mb-2" size={20} />
                    <h4 className="text-text-primary font-medium">Export Report</h4>
                    <p className="text-text-muted text-sm">Download analytics report</p>
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                  <Calendar className="text-accent" size={24} />
                  Upcoming Sessions ({upcomingSessions.length})
                </h2>
                {/* FIX 1: size was embedded inside className string — separated into its own prop */}
                <button className="flex items-center gap-2 text-accent hover:text-accent/80 text-sm">
                  <Bell size={16} />
                  Schedule New
                </button>
              </div>

              {/* FIX 2: restored the missing closing tags for the grid div and session card div */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-forest-900/30 border border-forest-divider/30 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-text-primary font-medium mb-1">{session.studentName}</h3>
                        <p className="text-accent text-sm mb-2">{session.topic}</p>
                        <div className="flex items-center gap-4 text-xs text-text-muted">
                          <Calendar size={14} />
                          <span>{session.date.toLocaleDateString()}</span>
                          <Clock size={14} />
                          <span>{formatDuration(session.duration)}</span>
                        </div>
                        {session.rating && (
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="text-yellow-400" size={14} />
                            <span>{session.rating}/5.0</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          session.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {session.status}
                        </span>
                        <Video className="text-text-muted" size={16} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mentorship Tools */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border border-accent/20 rounded-xl p-6 text-center"
              >
                <Brain className="text-accent mb-4 mx-auto" size={32} />
                <h3 className="text-text-primary font-semibold mb-2">AI Assistant</h3>
                <p className="text-text-muted text-sm">Get AI-powered insights</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-transparent border border-blue-500/30 rounded-xl p-6 text-center"
              >
                <BookOpen className="text-blue-400 mb-4 mx-auto" size={32} />
                <h3 className="text-text-primary font-semibold mb-2">Resource Library</h3>
                <p className="text-text-muted text-sm">Access teaching materials</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-500/20 via-green-600/10 to-transparent border border-green-500/30 rounded-xl p-6 text-center"
              >
                <Target className="text-green-400 mb-4 mx-auto" size={32} />
                <h3 className="text-text-primary font-semibold mb-2">Goal Tracking</h3>
                <p className="text-text-muted text-sm">Track student progress</p>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};