import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LinkIcon, Users, Mail, Calendar, MessageSquare, Star, ExternalLink, Filter, Search } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface Connection {
  id: string;
  name: string;
  role: 'mentor' | 'researcher' | 'collaborator';
  institution: string;
  expertise: string[];
  status: 'pending' | 'connected' | 'declined';
  requestDate: Date;
  lastMessage?: string;
  rating?: number;
  mutualConnections?: number;
}

interface Mentor {
  id: string;
  name: string;
  institution: string;
  expertise: string[];
  rating: number;
  availability: 'available' | 'busy' | 'offline';
  responseRate: number;
  totalMentorships: number;
}

export const ResearcherConnectPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'connections' | 'discover'>('connections');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('all');

  // Mock data
  useEffect(() => {
    setConnections([
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        role: 'mentor',
        institution: 'MIT',
        expertise: ['Machine Learning', 'Data Science', 'Research Methodology'],
        status: 'connected',
        requestDate: new Date('2024-01-15'),
        lastMessage: 'Great progress on your research paper!',
        rating: 4.8,
        mutualConnections: 12
      },
      {
        id: '2',
        name: 'Prof. Michael Chen',
        role: 'mentor',
        institution: 'Stanford University',
        expertise: ['Biomedical Engineering', 'Clinical Research'],
        status: 'pending',
        requestDate: new Date('2024-02-01'),
        lastMessage: 'Looking forward to collaborating on your project'
      },
      {
        id: '3',
        name: 'Dr. Emily Rodriguez',
        role: 'collaborator',
        institution: 'Harvard Medical School',
        expertise: ['Neuroscience', 'Statistical Analysis'],
        status: 'connected',
        requestDate: new Date('2023-12-10'),
        lastMessage: 'Let me know if you need help with the data analysis',
        mutualConnections: 8
      }
    ]);

    setMentors([
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        institution: 'MIT',
        expertise: ['Machine Learning', 'Data Science', 'Research Methodology'],
        rating: 4.8,
        availability: 'available',
        responseRate: 95,
        totalMentorships: 24
      },
      {
        id: '2',
        name: 'Prof. Michael Chen',
        institution: 'Stanford University',
        expertise: ['Biomedical Engineering', 'Clinical Research'],
        rating: 4.9,
        availability: 'busy',
        responseRate: 88,
        totalMentorships: 31
      },
      {
        id: '3',
        name: 'Dr. James Wilson',
        institution: 'Oxford University',
        expertise: ['Quantum Computing', 'Theoretical Physics', 'Mathematical Modeling'],
        rating: 4.7,
        availability: 'available',
        responseRate: 92,
        totalMentorships: 18
      },
      {
        id: '4',
        name: 'Dr. Lisa Anderson',
        institution: 'Johns Hopkins',
        expertise: ['Medical Research', 'Clinical Trials', 'Biostatistics'],
        rating: 4.6,
        availability: 'offline',
        responseRate: 85,
        totalMentorships: 27
      }
    ]);
  }, []);

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpertise = expertiseFilter === 'all' || 
                           mentor.expertise.some(exp => exp.toLowerCase().includes(expertiseFilter.toLowerCase()));
    return matchesSearch && matchesExpertise;
  });

  const handleConnectRequest = (mentorId: string) => {
    console.log('Sending connect request to mentor:', mentorId);
    // In a real app, this would send a request to the mentor
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'declined': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-500/20 text-green-400';
      case 'busy': return 'bg-yellow-500/20 text-yellow-400';
      case 'offline': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Researcher Connect</h1>
              <p className="text-text-muted">Connect with mentors and collaborators in your field</p>
            </div>
            <div className="flex items-center gap-2">
              <LinkIcon className="text-accent" size={24} />
              <span className="text-accent font-semibold">12 Active Connections</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-1">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('connections')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'connections'
                  ? 'bg-accent/20 text-accent'
                  : 'text-text-muted hover:bg-forest-700/50 hover:text-text-primary'
              }`}
            >
              My Connections
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'discover'
                  ? 'bg-accent/20 text-accent'
                  : 'text-text-muted hover:bg-forest-700/50 hover:text-text-primary'
              }`}
            >
              Discover Mentors
            </button>
          </div>
        </div>

        {/* Connections Tab */}
        {activeTab === 'connections' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {connections.map((connection) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                      {connection.name}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(connection.status)}`}>
                        {connection.status}
                      </span>
                    </h3>
                    <p className="text-text-muted text-sm">{connection.institution}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {connection.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-400 fill-yellow-400" size={16} />
                        <span className="text-text-primary text-sm">{connection.rating}</span>
                      </div>
                    )}
                    {connection.mutualConnections && (
                      <div className="flex items-center gap-1 text-text-muted text-xs">
                        <Users size={14} />
                        <span>{connection.mutualConnections} mutual</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {connection.expertise.map((exp, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                  <p className="text-text-muted text-sm">Connected: {connection.requestDate.toLocaleDateString()}</p>
                  {connection.lastMessage && (
                    <div className="bg-forest-900/50 border border-forest-divider/30 rounded-lg p-3">
                      <p className="text-text-muted text-xs italic">"{connection.lastMessage}"</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-forest-700/50 hover:bg-forest-700 text-text-primary py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <MessageSquare size={16} />
                    Message
                  </button>
                  <button className="flex-1 bg-accent/20 hover:bg-accent/30 text-accent py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <ExternalLink size={16} />
                    View Profile
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Discover Mentors Tab */}
        {activeTab === 'discover' && (
          <div>
            {/* Search and Filter */}
            <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Search Mentors</label>
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
                  <label className="block text-sm font-medium text-text-primary mb-2">Expertise Filter</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <select
                      value={expertiseFilter}
                      onChange={(e) => setExpertiseFilter(e.target.value)}
                      className="w-full pl-12 pr-4 py-2 bg-forest-900/50 border border-forest-divider/50 rounded-lg text-text-primary focus:outline-none focus:border-accent/50 appearance-none"
                    >
                      <option value="all">All Expertise</option>
                      <option value="machine learning">Machine Learning</option>
                      <option value="data science">Data Science</option>
                      <option value="biomedical">Biomedical Engineering</option>
                      <option value="clinical research">Clinical Research</option>
                      <option value="quantum computing">Quantum Computing</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6 hover:border-accent/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-1">{mentor.name}</h3>
                      <p className="text-text-muted text-sm mb-2">{mentor.institution}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(mentor.availability)}`}>
                      {mentor.availability}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-400 fill-yellow-400" size={16} />
                        <span className="text-text-primary font-medium">{mentor.rating}</span>
                      </div>
                      <span className="text-text-muted text-sm">{mentor.totalMentorships} mentorships</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Mail className="text-text-muted" size={14} />
                      <span className="text-text-muted text-sm">{mentor.responseRate}% response rate</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.slice(0, 3).map((exp, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-forest-900/50 border border-forest-divider/30 rounded text-xs text-text-muted"
                        >
                          {exp}
                        </span>
                      ))}
                      {mentor.expertise.length > 3 && (
                        <span className="px-2 py-1 bg-forest-900/50 border border-forest-divider/30 rounded text-xs text-text-muted">
                          +{mentor.expertise.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleConnectRequest(mentor.id)}
                    disabled={mentor.availability === 'offline'}
                    className="w-full bg-accent/20 hover:bg-accent/30 text-accent py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                  >
                    <Users size={16} />
                    {mentor.availability === 'offline' ? 'Unavailable' : 'Request Connection'}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
