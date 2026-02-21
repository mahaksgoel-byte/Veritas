import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText,
  Send,
  CheckCircle,
  Plus,
  ChevronDown,
  AlertCircle,
  TrendingUp,
  Users,
  BarChart3,
  BookOpen,
  Target,
  Award,
  FileCheck,
  Activity,
  Shield,
  X
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { supabase } from '../../lib/supabase';

interface Project {
  id: string;
  name: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt?: Date;
  documents: DocFile[];
}

interface DocFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: Date;
}

/* ─────────────────────────────────────────────
   AUTH PERSISTENCE KEYS
───────────────────────────────────────────── */
const AUTH_KEY    = 'veritas_researcher_authed';
const METHOD_KEY  = 'veritas_researcher_auth_method';

/* ─────────────────────────────────────────────
   CONTRIBUTION HEATMAP
───────────────────────────────────────────── */
const generateMockData = () => {
  const data: Record<string, number> = {};
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const rand = Math.random();
    if (rand > 0.72) {
      data[key] = rand > 0.95 ? Math.floor(Math.random() * 6) + 4
                : rand > 0.88 ? Math.floor(Math.random() * 3) + 2
                : 1;
    } else {
      data[key] = 0;
    }
  }
  return data;
};

const DAYS   = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const getColor = (count: number): string => {
  if (count === 0) return 'bg-forest-900/60 border-forest-divider/20';
  if (count === 1) return 'bg-emerald-900/70 border-emerald-800/40';
  if (count === 2) return 'bg-emerald-700/80 border-emerald-600/50';
  if (count <= 4) return 'bg-emerald-500/90 border-emerald-400/60';
  return 'bg-emerald-400 border-emerald-300/70';
};

const ContributionHeatmap: React.FC<{ data: Record<string, number> }> = ({ data }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; count: number } | null>(null);

  const { weeks, monthLabels, totalCount } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(today);
    start.setDate(start.getDate() - 364);
    start.setDate(start.getDate() - start.getDay());

    const weeksArr: { date: Date; key: string }[][] = [];
    const monthLabelMap: { weekIndex: number; month: string }[] = [];
    const seenMonths = new Set<string>();
    let total = 0;

    const cursor = new Date(start);
    while (cursor <= today) {
      const week: { date: Date; key: string }[] = [];
      for (let d = 0; d < 7; d++) {
        const dayDate = new Date(cursor);
        const key = dayDate.toISOString().split('T')[0];
        week.push({ date: dayDate, key });
        if (dayDate <= today) total += data[key] ?? 0;
        cursor.setDate(cursor.getDate() + 1);
      }
      const firstVisible = week.find(w => w.date <= today);
      if (firstVisible) {
        const monthKey = `${firstVisible.date.getFullYear()}-${firstVisible.date.getMonth()}`;
        if (!seenMonths.has(monthKey)) {
          seenMonths.add(monthKey);
          monthLabelMap.push({ weekIndex: weeksArr.length, month: MONTHS[firstVisible.date.getMonth()] });
        }
      }
      weeksArr.push(week);
    }

    return { weeks: weeksArr, monthLabels: monthLabelMap, totalCount: total };
  }, [data]);

  return (
    <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
            <Activity className="text-accent" size={22} />
            Submission Activity
          </h2>
          <p className="text-text-muted text-sm mt-0.5">
            <span className="text-accent font-semibold">{totalCount}</span> submissions in the last year
          </p>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="relative" style={{ minWidth: `${weeks.length * 14 + 32}px` }}>
          <div className="flex mb-1 ml-8">
            {weeks.map((_, wi) => {
              const label = monthLabels.find(m => m.weekIndex === wi);
              return (
                <div key={wi} style={{ width: 14, minWidth: 14 }} className="relative">
                  {label && (
                    <span className="absolute left-0 text-[10px] text-text-muted whitespace-nowrap">
                      {label.month}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-0">
            <div className="flex flex-col mr-1" style={{ gap: 2 }}>
              {DAYS.map((day, i) => (
                <div key={i} style={{ height: 11, fontSize: 9 }} className="flex items-center text-text-muted pr-1 leading-none">
                  {day}
                </div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: 2, marginRight: 2 }}>
                {week.map(({ date, key }) => {
                  const count = data[key] ?? 0;
                  const isFuture = date > new Date();
                  return (
                    <div
                      key={key}
                      onMouseEnter={(e) => {
                        if (isFuture) return;
                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                        setTooltip({ x: rect.left + rect.width / 2, y: rect.top, date: key, count });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      className={`rounded-sm border transition-opacity cursor-default
                        ${isFuture ? 'opacity-0 pointer-events-none' : 'hover:opacity-80'}
                        ${getColor(count)}`}
                      style={{ width: 11, height: 11 }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="text-[10px] text-text-muted mr-0.5">Less</span>
        {['bg-forest-900/60 border-forest-divider/20','bg-emerald-900/70 border-emerald-800/40','bg-emerald-700/80 border-emerald-600/50','bg-emerald-500/90 border-emerald-400/60','bg-emerald-400 border-emerald-300/70'].map((c, i) => (
          <div key={i} className={`rounded-sm border ${c}`} style={{ width: 11, height: 11 }} />
        ))}
        <span className="text-[10px] text-text-muted ml-0.5">More</span>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y - 44, transform: 'translateX(-50%)' }}
        >
          <div className="bg-forest-900 border border-forest-divider/60 rounded-lg px-3 py-1.5 shadow-xl text-center">
            <p className="text-text-primary text-xs font-semibold">
              {tooltip.count} submission{tooltip.count !== 1 ? 's' : ''}
            </p>
            <p className="text-text-muted text-[10px]">{tooltip.date}</p>
          </div>
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-forest-900 border-r border-b border-forest-divider/60 rotate-45 -mt-1" />
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────── */
export const ResearcherDashboard: React.FC = () => {
  // ── Auth: read from localStorage so it persists across reloads ──
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem(AUTH_KEY) === 'true'
  );
  const [authMethod, setAuthMethod] = useState<string | null>(
    () => localStorage.getItem(METHOD_KEY)
  );

  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionLogs, setSubmissionLogs] = useState<string[]>([]);
  const [papersSent, setPapersSent] = useState(12);
  const [papersApproved, setPapersApproved] = useState(8);
  const [newProjectName, setNewProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [procedure, setProcedure] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const heatmapData = useMemo(() => generateMockData(), []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleString();
    setSubmissionLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const handleAuthentication = (method: string) => {
    // Persist so the banner doesn't reappear on reload
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(METHOD_KEY, method);
    setIsAuthenticated(true);
    setAuthMethod(method);
    addLog(`Authentication successful using ${method}`);
  };

  // Call this if you ever want to log the user out of the dashboard auth
  // (wire to a button or call from your global logout handler)
  const handleDeauthenticate = () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(METHOD_KEY);
    setIsAuthenticated(false);
    setAuthMethod(null);
  };

  // Also clear dashboard auth when Supabase session ends
  useEffect(() => {
    // Optional: listen for the custom logout event your TopNav dispatches,
    // or import supabase here and listen to onAuthStateChange.
    // Example with a custom event:
    const onSignOut = () => handleDeauthenticate();
    window.addEventListener('veritas:signout', onSignOut);
    return () => window.removeEventListener('veritas:signout', onSignOut);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    addLog(`Selected ${files.length} file(s): ${files.map(f => f.name).join(', ')}`);
  };

  const handleFileRemove = (index: number) => {
    const file = selectedFiles[index];
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    addLog(`Removed file: ${file.name}`);
  };

  const fetchPapers = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data, error } = await supabase
    .from('papers')
    .select('*')
    .eq('submitted_by', user.id)
    .order('created_at', { ascending: false })

  if (!error && data) {
    setProjects(data)
  }
}

  const handleSubmitProject = async () => {
  if (!newProjectName.trim() || !procedure.trim()) {
    addLog('❌ Project name and procedure are required')
    return
  }

  try {
    setIsSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      addLog('❌ User not authenticated')
      return
    }

    const { data, error } = await supabase
      .from('papers')
      .insert([
        {
          title: newProjectName,
          description: projectDescription,
          procedure: procedure,
          submitted_by: user.id,
          status: 'submitted'
        }
      ])
      .select()
      .single()

    if (error) throw error

    addLog('✅ Paper saved to database')

    // Reset form
    setNewProjectName('')
    setProjectDescription('')
    setProcedure('')
    setSelectedFiles([])
    setShowProjectDropdown(false)

    fetchPapers() // refresh list

  } catch (err: any) {
    addLog(`❌ ${err.message}`)
  } finally {
    setIsSubmitting(false)
  }
}

  const statsCards = [
    { title: 'Papers Sent to Mentor', value: papersSent,    icon: Send,        color: 'from-blue-500/20 to-blue-600/10',     borderColor: 'border-blue-500/30',   trend: '+3 this week' },
    { title: 'Papers Approved',       value: papersApproved, icon: CheckCircle, color: 'from-green-500/20 to-green-600/10',   borderColor: 'border-green-500/30',  trend: '+2 this week' },
    { title: 'Approval Rate',         value: `${Math.round((papersApproved / papersSent) * 100)}%`, icon: TrendingUp, color: 'from-purple-500/20 to-purple-600/10', borderColor: 'border-purple-500/30', trend: 'Above average' },
    { title: 'Active Projects',       value: projects.filter(p => p.status === 'submitted').length, icon: Activity,   color: 'from-orange-500/20 to-orange-600/10', borderColor: 'border-orange-500/30', trend: 'In review' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Research Analysis Dashboard</h1>
              <p className="text-text-muted">Welcome to your researcher analysis hub</p>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2"
                >
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-green-400 text-sm font-medium">Authenticated ({authMethod})</span>
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

        {/* Authentication Section — only shown when NOT authenticated */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Shield className="text-accent" size={24} />
              Get Authenticated
            </h2>
            <p className="text-text-muted mb-6">
              Authenticate your identity to access all researcher features and submit documents for review.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Email Verification', sub: 'Verify via email link',    icon: FileText, color: 'blue',   method: 'Email Verification' },
                { label: 'Two-Factor Auth',     sub: 'Enhanced security',        icon: Users,    color: 'green',  method: 'Two-Factor Auth' },
                { label: 'Institutional ID',    sub: 'Verify with institution',  icon: Award,    color: 'purple', method: 'Institutional ID' },
              ].map(({ label, sub, icon: Icon, color, method }) => (
                <motion.button
                  key={method}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAuthentication(method)}
                  className={`bg-gradient-to-r from-${color}-500/20 to-${color}-600/10 border border-${color}-500/30 rounded-lg p-4 text-left hover:border-${color}-500/50 transition-all`}
                >
                  <Icon className={`text-${color}-400 mb-2`} size={24} />
                  <h3 className="text-text-primary font-medium">{label}</h3>
                  <p className="text-text-muted text-sm">{sub}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} border ${stat.borderColor} rounded-xl p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="text-accent" size={24} />
                <span className="text-xs text-text-muted bg-accent/20 rounded-full px-2 py-1">{stat.trend}</span>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-1">{stat.value}</h3>
              <p className="text-text-muted text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Contribution Heatmap */}
        <ContributionHeatmap data={heatmapData} />

        {/* New Project + Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Plus className="text-accent" size={24} />
              Start New Project
            </h2>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                disabled={!isAuthenticated}
                className={`w-full flex items-center justify-between gap-3 bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/20 rounded-lg px-4 py-3 text-left transition-all ${
                  !isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'hover:border-accent/40'
                }`}
              >
                <span className="text-text-primary font-medium">
                  {isAuthenticated ? 'Create New Research Project' : 'Authenticate to Start Project'}
                </span>
                <motion.div animate={{ rotate: showProjectDropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="text-accent" size={20} />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {showProjectDropdown && isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 z-10 bg-forest-800/95 backdrop-blur-lg border border-forest-divider/50 rounded-xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Project Name</label>
                        <input
                          type="text"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          className="w-full px-3 py-2 bg-forest-900/50 border border-forest-divider/50 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent/50"
                          placeholder="Enter project name..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Project Description</label>
                        <textarea
                          value={projectDescription}
                          onChange={(e) => setProjectDescription(e.target.value)}
                          className="w-full px-3 py-2 bg-forest-900/50 border border-forest-divider/50 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent/50 resize-none"
                          rows={3}
                          placeholder="Brief description of your research..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Submit your complete procedure in order *
                        </label>
                        <textarea
                          value={procedure}
                          onChange={(e) => setProcedure(e.target.value)}
                          className="w-full px-3 py-2 bg-forest-900/50 border border-forest-divider/50 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent/50 resize-none"
                          rows={4}
                          placeholder="1. Research methodology&#10;2. Data collection process&#10;3. Analysis approach&#10;4. Expected outcomes..."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Upload Documents</label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="w-full px-3 py-2 bg-forest-900/50 border border-forest-divider/50 rounded-lg text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent/20 file:text-accent hover:file:bg-accent/30"
                        />
                      </div>
                      {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-text-primary">Selected Files</label>
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-forest-900/50 border border-forest-divider/30 rounded-lg px-3 py-2">
                              <span className="text-text-primary text-sm truncate flex-1">{file.name}</span>
                              <button onClick={() => handleFileRemove(index)} className="text-red-400 hover:text-red-300 ml-2">
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmitProject}
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-accent via-emerald-500 to-accent text-text-primary font-medium rounded-lg px-4 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              className="w-4 h-4 border-2 border-text-primary border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Submit Project
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Submission Logs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
              <FileCheck className="text-accent" size={24} />
              Submission Logs
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
              {submissionLogs.length === 0 ? (
                <p className="text-text-muted text-sm">No submissions yet. Start a new project to see logs here.</p>
              ) : (
                submissionLogs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-forest-900/30 border border-forest-divider/30 rounded-lg px-3 py-2 text-sm font-mono"
                  >
                    <span className="text-text-muted">{log}</span>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Projects */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
              <BookOpen className="text-accent" size={24} />
              Recent Projects
            </h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-forest-900/30 border border-forest-divider/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-text-primary font-medium">{project.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'submitted' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : project.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-text-muted text-sm mb-2">{project.documents.length} documents</p>
                  {project.submittedAt && (
                    <p className="text-text-muted text-xs">Submitted: {project.submittedAt.toLocaleString()}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Additional Research Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <Target className="text-accent mb-4" size={24} />
            <h3 className="text-xl font-semibold text-text-primary mb-2">Research Targets</h3>
            <p className="text-text-muted">Set and track research objectives</p>
          </div>
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <BarChart3 className="text-accent mb-4" size={24} />
            <h3 className="text-xl font-semibold text-text-primary mb-2">Analytics</h3>
            <p className="text-text-muted">View detailed research analytics</p>
          </div>
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
            <Users className="text-accent mb-4" size={24} />
            <h3 className="text-xl font-semibold text-text-primary mb-2">Collaboration</h3>
            <p className="text-text-muted">Connect with other researchers</p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};