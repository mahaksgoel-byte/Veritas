import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LinkIcon, Users, Mail, Calendar, MessageSquare, Star, ExternalLink, Clock, CheckCircle, X, TrendingUp, Award, BookOpen } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface Researcher {
  id: string;
  name: string;
  institution: string;
  researchArea: string[];
  status: 'pending' | 'accepted' | 'declined';
  requestDate: Date;
  lastMessage?: string;
  experience: number;
  publications: number;
  avatar?: string;
}

interface CollaborationRequest {
  id: string;
  researcherName: string;
  projectTitle: string;
  researchArea: string;
  experience: string;
  message: string;
  requestDate: Date;
  status: 'pending' | 'accepted' | 'declined';
}

export const MentorConnectPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'researchers' | 'requests'>('researchers');
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');

  // Mock data
  useEffect(() => {
    setResearchers([
      {
        id: '1',
        name: 'Alex Thompson',
        institution: 'Stanford University',
        researchArea: ['Machine Learning', 'Natural Language Processing', 'AI Ethics'],
        status: 'pending',
        requestDate: new Date('2024-02-15'),
        lastMessage: 'Interested in collaborating on NLP research',
        experience: 3,
        publications: 8
      },
      {
        id: '2',
        name: 'Maria Garcia',
        institution: 'MIT',
        researchArea: ['Computer Vision', 'Deep Learning', 'Medical Imaging'],
        status: 'accepted',
        requestDate: new Date('2024-01-20'),
        lastMessage: 'Excited to work together on medical imaging project',
        experience: 5,
        publications: 15
      },
      {
        id: '3',
        name: 'David Kim',
        institution: 'UC Berkeley',
        researchArea: ['Quantum Computing', 'Algorithm Optimization'],
        status: 'pending',
        requestDate: new Date('2024-02-10'),
        experience: 2,
        publications: 4
      }
    ]);

    setRequests([
      {
        id: '1',
        researcherName: 'Alex Thompson',
        projectTitle: 'Advanced NLP for Medical Text Analysis',
        researchArea: 'Natural Language Processing',
        experience: '3 years of research experience in ML and NLP',
        message: 'I am working on a project that uses advanced NLP techniques to analyze medical records and identify patterns. I believe your expertise in AI ethics would be invaluable for ensuring responsible AI implementation in healthcare.',
        requestDate: new Date('2024-02-15'),
        status: 'pending'
      },
      {
        id: '2',
        researcherName: 'Sarah Johnson',
        projectTitle: 'Computer Vision for Early Disease Detection',
        researchArea: 'Computer Vision',
        experience: '5 years developing deep learning models for medical imaging',
        message: 'I have developed a novel CNN architecture for detecting early signs of diabetic retinopathy from retinal scans. I would love to collaborate with someone experienced in clinical validation studies.',
        requestDate: new Date('2024-02-12'),
        status: 'accepted'
      }
    ]);
  }, []);

  const filteredResearchers = researchers.filter(researcher => {
    const matchesSearch = researcher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         researcher.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = areaFilter === 'all' || 
                       researcher.researchArea.some(area => area.toLowerCase().includes(areaFilter.toLowerCase()));
    return matchesSearch && matchesArea;
  });

  const handleAcceptRequest = (requestId: string) => {
    console.log('Accepting collaboration request:', requestId);
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'accepted' } : req
    ));
  };

  const handleDeclineRequest = (requestId: string) => {
    console.log('Declining collaboration request:', requestId);
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'declined' } : req
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'declined': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Mentor Connect</h1>
              <p className="text-text-muted">Manage researcher collaborations and mentorship requests</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="text-accent" size={20} />
                <div>
                  <p className="text-accent font-semibold text-lg">24</p>
                  <p className="text-text-muted text-xs">Active Researchers</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-accent" size={20} />
                <div>
                  <p className="text-accent font-semibold text-lg">3</p>
                  <p className="text-text-muted text-xs">Pending Requests</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-1">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('researchers')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'researchers'
                  ? 'bg-accent/20 text-accent'
                  : 'text-text-muted hover:bg-forest-700/50 hover:text-text-primary'
              }`}
            >
              My Researchers
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'requests'
                  ? 'bg-accent/20 text-accent'
                  : 'text-text-muted hover:bg-forest-700/50 hover:text-text-primary'
              }`}
            >
              Collaboration Requests
            </button>
          </div>
        </div>

        {/* Researchers Tab */}
        {activeTab === 'researchers' && (
          <div>
            {/* Search and Filter */}
            <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Search Researchers</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or institution..."
                      className="w-full pl-12 pr-4 py-2 bg-forest-900/50 border border-forest-divider/50 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Research Area Filter</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <select
                      value={areaFilter}
                      onChange={(e) => setAreaFilter(e.target.value)}
                      className="w-full pl-12 pr-4 py-2 bg-forest-900/50 border border-forest-divider/50 rounded-lg text-text-primary focus:outline-none focus:border-accent/50 appearance-none"
                    >
                      <option value="all">All Areas</option>
                      <option value="machine learning">Machine Learning</option>
                      <option value="natural language processing">NLP</option>
                      <option value="computer vision">Computer Vision</option>
                      <option value="quantum computing">Quantum Computing</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Researchers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResearchers.map((researcher) => (
                <motion.div
                  key={researcher.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6 hover:border-accent/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-1">{researcher.name}</h3>
                      <p className="text-text-muted text-sm mb-2">{researcher.institution}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(researcher.status)}`}>
                      {researcher.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Clock className="text-text-muted" size={14} />
                        <span className="text-text-primary">{researcher.experience} years</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="text-text-muted" size={14} />
                        <span className="text-text-primary">{researcher.publications} papers</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {researcher.researchArea.map((area, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-forest-900/50 border border-forest-divider/30 rounded text-xs text-text-muted"
                        >
                          {area}
                        </span>
                      ))}
                    </div>

                    {researcher.lastMessage && (
                      <div className="bg-forest-900/50 border border-forest-divider/30 rounded-lg p-3">
                        <p className="text-text-muted text-xs italic">"{researcher.lastMessage}"</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button className="flex-1 bg-forest-700/50 hover:bg-forest-700 text-text-primary py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <MessageSquare size={16} />
                        Message
                      </button>
                      <button className="flex-1 bg-accent/20 hover:bg-accent/30 text-accent py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <ExternalLink size={16} />
                        View Profile
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Collaboration Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {requests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">{request.projectTitle}</h3>
                    <p className="text-text-muted text-sm">
                      <span className="font-medium">{request.researcherName}</span> • {request.requestDate.toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-text-primary font-medium mb-2">Research Experience</h4>
                    <p className="text-text-muted text-sm bg-forest-900/50 border border-forest-divider/30 rounded-lg p-3">
                      {request.experience}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-text-primary font-medium mb-2">Collaboration Message</h4>
                    <div className="bg-forest-900/50 border border-forest-divider/30 rounded-lg p-4">
                      <p className="text-text-primary text-sm leading-relaxed">{request.message}</p>
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} />
                        Accept Request
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(request.id)}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <X size={16} />
                        Decline Request
                      </button>
                    </div>
                  )}

                  {request.status === 'accepted' && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-400 text-sm font-medium flex items-center gap-2">
                        <CheckCircle size={16} />
                        Collaboration request accepted! You can now coordinate with the researcher.
                      </p>
                    </div>
                  )}

                  {request.status === 'declined' && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                        <X size={16} />
                        This collaboration request was declined.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
