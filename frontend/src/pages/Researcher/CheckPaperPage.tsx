import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Eye,
  Brain,
  Target,
  BarChart3,
  TrendingUp,
  FileCheck,
  Zap,
  Shield,
  X
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface AnalysisResult {
  id: string;
  fileName: string;
  originalityScore: number;
  clarityScore: number;
  methodologyScore: number;
  overallScore: number;
  recommendations: string[];
  status: 'analyzing' | 'completed' | 'error';
  uploadedAt: Date;
}

export const CheckPaperPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setAnalysisResults([]);
      setShowResults(false);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const analyzePaper = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    const newAnalysis: AnalysisResult = {
      id: Date.now().toString(),
      fileName: selectedFile.name,
      originalityScore: 0,
      clarityScore: 0,
      methodologyScore: 0,
      overallScore: 0,
      recommendations: [],
      status: 'analyzing',
      uploadedAt: new Date()
    };

    setAnalysisResults([newAnalysis]);
    setShowResults(true);

    // Simulate AI analysis process
    setTimeout(() => {
      setAnalysisResults(prev => prev.map(result => 
        result.id === newAnalysis.id 
          ? { ...result, originalityScore: 85 }
          : result
      ));
    }, 2000);

    setTimeout(() => {
      setAnalysisResults(prev => prev.map(result => 
        result.id === newAnalysis.id 
          ? { ...result, clarityScore: 78 }
          : result
      ));
    }, 3000);

    setTimeout(() => {
      setAnalysisResults(prev => prev.map(result => 
        result.id === newAnalysis.id 
          ? { ...result, methodologyScore: 92 }
          : result
      ));
    }, 4000);

    setTimeout(() => {
      setAnalysisResults(prev => prev.map(result => 
        result.id === newAnalysis.id 
          ? { 
              ...result, 
              overallScore: 85,
              status: 'completed',
              recommendations: [
                'Consider adding more recent references to strengthen literature review',
                'Methodology section is well-structured but could benefit from more detailed sample size justification',
                'Results are clearly presented but consider adding visual aids for better comprehension',
                'Conclusion effectively summarizes findings but could address limitations more thoroughly'
              ]
            }
          : result
      ));
      setIsAnalyzing(false);
    }, 5000);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setAnalysisResults([]);
    setShowResults(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-500/20 to-green-600/10 border-green-500/30';
    if (score >= 60) return 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
    return 'from-red-500/20 to-red-600/10 border-red-500/30';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/20 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <FileCheck className="text-accent" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Paper Analysis</h1>
              <p className="text-text-muted">Upload your research paper for comprehensive AI-powered analysis</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-8"
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <Brain className="text-accent mx-auto mb-4" size={48} />
              <h2 className="text-2xl font-semibold text-text-primary mb-2">
                AI-Powered Paper Analysis
              </h2>
              <p className="text-text-muted">
                Our advanced model analyzes your paper for originality, clarity, methodology, and more
              </p>
            </div>

            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive 
                  ? 'border-accent bg-accent/10' 
                  : selectedFile 
                    ? 'border-green-500/50 bg-green-500/10' 
                    : 'border-forest-divider/50 hover:border-accent/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <AnimatePresence mode="wait">
                {!selectedFile ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-4"
                  >
                    <Upload className="text-accent mx-auto" size={48} />
                    <div>
                      <p className="text-text-primary font-medium mb-2">
                        Drag and drop your PDF here or click to browse
                      </p>
                      <p className="text-text-muted text-sm">
                        Supported format: PDF (Max 10MB)
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="selected"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-4"
                  >
                    <FileText className="text-green-400 mx-auto" size={48} />
                    <div>
                      <p className="text-text-primary font-medium mb-2">
                        {selectedFile.name}
                      </p>
                      <p className="text-text-muted text-sm">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-red-400 hover:text-red-300 flex items-center gap-2 mx-auto"
                    >
                      <X size={16} />
                      Remove File
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Analyze Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyzePaper}
              disabled={!selectedFile || isAnalyzing}
              className="w-full mt-6 bg-gradient-to-r from-accent via-emerald-500 to-accent text-text-primary font-medium rounded-lg px-6 py-4 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-text-primary border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <span>Analyzing Paper...</span>
                </>
              ) : (
                <>
                  <Zap size={20} />
                  <span>Start Analysis</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Analysis Results */}
        <AnimatePresence>
          {showResults && analysisResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              {analysisResults.map((result) => (
                <div key={result.id} className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                      <FileText size={24} />
                      {result.fileName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : result.status === 'analyzing'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {result.status === 'completed' ? 'Analysis Complete' : 
                       result.status === 'analyzing' ? 'Analyzing...' : 'Error'}
                    </span>
                  </div>

                  {/* Score Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className={`bg-gradient-to-br ${getScoreBg(result.originalityScore)} rounded-lg p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <Target className="text-accent" size={20} />
                        <span className={`text-2xl font-bold ${getScoreColor(result.originalityScore)}`}>
                          {result.originalityScore}%
                        </span>
                      </div>
                      <p className="text-text-primary font-medium">Originality</p>
                    </div>

                    <div className={`bg-gradient-to-br ${getScoreBg(result.clarityScore)} rounded-lg p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <Eye className="text-accent" size={20} />
                        <span className={`text-2xl font-bold ${getScoreColor(result.clarityScore)}`}>
                          {result.clarityScore}%
                        </span>
                      </div>
                      <p className="text-text-primary font-medium">Clarity</p>
                    </div>

                    <div className={`bg-gradient-to-br ${getScoreBg(result.methodologyScore)} rounded-lg p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <BarChart3 className="text-accent" size={20} />
                        <span className={`text-2xl font-bold ${getScoreColor(result.methodologyScore)}`}>
                          {result.methodologyScore}%
                        </span>
                      </div>
                      <p className="text-text-primary font-medium">Methodology</p>
                    </div>

                    <div className={`bg-gradient-to-br ${getScoreBg(result.overallScore)} rounded-lg p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="text-accent" size={20} />
                        <span className={`text-2xl font-bold ${getScoreColor(result.overallScore)}`}>
                          {result.overallScore}%
                        </span>
                      </div>
                      <p className="text-text-primary font-medium">Overall Score</p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {result.recommendations.length > 0 && (
                    <div className="bg-forest-900/30 border border-forest-divider/30 rounded-lg p-4">
                      <h4 className="text-text-primary font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="text-accent" size={20} />
                        Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            <span className="text-text-muted text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-lg px-4 py-2 text-accent hover:bg-accent/30"
                    >
                      <Download size={16} />
                      Download Report
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 bg-forest-900/50 border border-forest-divider/30 rounded-lg px-4 py-2 text-text-primary hover:bg-forest-900/70"
                    >
                      <Eye size={16} />
                      View Details
                    </motion.button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6 text-center">
            <Shield className="text-accent mx-auto mb-4" size={32} />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Plagiarism Detection</h3>
            <p className="text-text-muted text-sm">Advanced algorithms check against millions of academic sources</p>
          </div>

          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6 text-center">
            <Brain className="text-accent mx-auto mb-4" size={32} />
            <h3 className="text-lg font-semibold text-text-primary mb-2">AI Analysis</h3>
            <p className="text-text-muted text-sm">Machine learning evaluates structure and coherence</p>
          </div>

          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6 text-center">
            <Target className="text-accent mx-auto mb-4" size={32} />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Quality Metrics</h3>
            <p className="text-text-muted text-sm">Comprehensive scoring across multiple dimensions</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
