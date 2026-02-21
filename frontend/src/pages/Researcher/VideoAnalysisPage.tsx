import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Video, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Eye,
  Brain,
  Mic,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Clock,
  Users,
  Zap,
  X,
  FileText,
  Volume2
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface VideoAnalysisResult {
  id: string;
  fileName: string;
  duration: string;
  sentimentScore: number;
  engagementScore: number;
  clarityScore: number;
  misinformationScore: number;
  keyTopics: string[];
  transcript: string;
  status: 'analyzing' | 'completed' | 'error';
  uploadedAt: Date;
}

export const VideoAnalysisPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<VideoAnalysisResult[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setAnalysisResults([]);
      setShowResults(false);
    } else {
      alert('Please select a video file (MP4, AVI, MOV, etc.)');
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

  const analyzeVideo = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    const newAnalysis: VideoAnalysisResult = {
      id: Date.now().toString(),
      fileName: selectedFile.name,
      duration: '00:00',
      sentimentScore: 0,
      engagementScore: 0,
      clarityScore: 0,
      misinformationScore: 0,
      keyTopics: [],
      transcript: '',
      status: 'analyzing',
      uploadedAt: new Date()
    };

    setAnalysisResults([newAnalysis]);
    setShowResults(true);

    // Simulate AI analysis process
    setTimeout(() => {
      setAnalysisResults(prev => prev.map(result => 
        result.id === newAnalysis.id 
          ? { ...result, sentimentScore: 75 }
          : result
      ));
    }, 2000);

    setTimeout(() => {
      setAnalysisResults(prev => prev.map(result => 
        result.id === newAnalysis.id 
          ? { ...result, engagementScore: 82 }
          : result
      ));
    }, 3000);

    setTimeout(() => {
      setAnalysisResults(prev => prev.map(result => 
        result.id === newAnalysis.id 
          ? { ...result, clarityScore: 88 }
          : result
      ));
    }, 4000);

    setTimeout(() => {
      setAnalysisResults(prev => prev.map(result => 
        result.id === newAnalysis.id 
          ? { 
              ...result, 
              misinformationScore: 15,
              keyTopics: ['Climate Change', 'Scientific Research', 'Data Analysis', 'Policy Discussion'],
              transcript: `The video discusses recent findings in climate research, emphasizing the importance of data-driven approaches to understanding environmental changes. The speaker presents several case studies demonstrating how advanced analytics can help predict climate patterns and inform policy decisions. Key points include the need for interdisciplinary collaboration and the role of technology in addressing climate challenges.`,
              status: 'completed'
            }
          : result
      ));
      setIsAnalyzing(false);
    }, 5000);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setVideoUrl('');
    setAnalysisResults([]);
    setShowResults(false);
    setIsPlaying(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getScoreColor = (score: number, isMisinformation: boolean = false) => {
    if (isMisinformation) {
      if (score <= 20) return 'text-green-400';
      if (score <= 40) return 'text-yellow-400';
      return 'text-red-400';
    }
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number, isMisinformation: boolean = false) => {
    if (isMisinformation) {
      if (score <= 20) return 'from-green-500/20 to-green-600/10 border-green-500/30';
      if (score <= 40) return 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
      return 'from-red-500/20 to-red-600/10 border-red-500/30';
    }
    if (score >= 80) return 'from-green-500/20 to-green-600/10 border-green-500/30';
    if (score >= 60) return 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
    return 'from-red-500/20 to-red-600/10 border-red-500/30';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/20 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <Video className="text-accent" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Video Content Analysis</h1>
              <p className="text-text-muted">Analyze video content for misinformation, sentiment, and engagement metrics</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* File Upload Area */}
            <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Upload size={24} />
                Upload Video
              </h2>

              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
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
                  accept="video/*"
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
                      className="space-y-3"
                    >
                      <Video className="text-accent mx-auto" size={40} />
                      <div>
                        <p className="text-text-primary font-medium mb-1">
                          Drag and drop video or click to browse
                        </p>
                        <p className="text-text-muted text-sm">
                          MP4, AVI, MOV (Max 100MB)
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="selected"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="space-y-3"
                    >
                      <Video className="text-green-400 mx-auto" size={40} />
                      <div>
                        <p className="text-text-primary font-medium mb-1">
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
                        Remove Video
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={analyzeVideo}
                disabled={!selectedFile || isAnalyzing}
                className="w-full mt-4 bg-gradient-to-r from-accent via-emerald-500 to-accent text-text-primary font-medium rounded-lg px-4 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-text-primary border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <span>Analyzing Video...</span>
                  </>
                ) : (
                  <>
                    <Brain size={18} />
                    <span>Analyze Content</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Video Preview */}
            {videoUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-text-primary mb-4">Video Preview</h3>
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-48 object-cover"
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  />
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlayPause}
                        className="text-white hover:text-accent transition-colors"
                      >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <div className="flex-1">
                        <div className="bg-white/20 rounded-full h-1">
                          <div 
                            className="bg-accent h-full rounded-full transition-all"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Analysis Results */}
          <AnimatePresence>
            {showResults && analysisResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {analysisResults.map((result) => (
                  <div key={result.id} className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                        <FileText size={20} />
                        Analysis Results
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
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className={`bg-gradient-to-br ${getScoreBg(result.sentimentScore)} rounded-lg p-3`}>
                        <div className="flex items-center justify-between mb-1">
                          <MessageSquare className="text-accent" size={16} />
                          <span className={`text-lg font-bold ${getScoreColor(result.sentimentScore)}`}>
                            {result.sentimentScore}%
                          </span>
                        </div>
                        <p className="text-text-primary text-sm">Sentiment</p>
                      </div>

                      <div className={`bg-gradient-to-br ${getScoreBg(result.engagementScore)} rounded-lg p-3`}>
                        <div className="flex items-center justify-between mb-1">
                          <TrendingUp className="text-accent" size={16} />
                          <span className={`text-lg font-bold ${getScoreColor(result.engagementScore)}`}>
                            {result.engagementScore}%
                          </span>
                        </div>
                        <p className="text-text-primary text-sm">Engagement</p>
                      </div>

                      <div className={`bg-gradient-to-br ${getScoreBg(result.clarityScore)} rounded-lg p-3`}>
                        <div className="flex items-center justify-between mb-1">
                          <Volume2 className="text-accent" size={16} />
                          <span className={`text-lg font-bold ${getScoreColor(result.clarityScore)}`}>
                            {result.clarityScore}%
                          </span>
                        </div>
                        <p className="text-text-primary text-sm">Clarity</p>
                      </div>

                      <div className={`bg-gradient-to-br ${getScoreBg(result.misinformationScore, true)} rounded-lg p-3`}>
                        <div className="flex items-center justify-between mb-1">
                          <AlertCircle className="text-accent" size={16} />
                          <span className={`text-lg font-bold ${getScoreColor(result.misinformationScore, true)}`}>
                            {result.misinformationScore}%
                          </span>
                        </div>
                        <p className="text-text-primary text-sm">Misinformation Risk</p>
                      </div>
                    </div>

                    {/* Key Topics */}
                    {result.keyTopics.length > 0 && (
                      <div className="bg-forest-900/30 border border-forest-divider/30 rounded-lg p-3 mb-4">
                        <h4 className="text-text-primary font-medium mb-2 flex items-center gap-2">
                          <BarChart3 size={16} />
                          Key Topics Detected
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.keyTopics.map((topic, index) => (
                            <span
                              key={index}
                              className="bg-accent/20 border border-accent/30 rounded-full px-3 py-1 text-xs text-accent"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Transcript Preview */}
                    {result.transcript && (
                      <div className="bg-forest-900/30 border border-forest-divider/30 rounded-lg p-3">
                        <h4 className="text-text-primary font-medium mb-2 flex items-center gap-2">
                          <FileText size={16} />
                          Transcript Preview
                        </h4>
                        <p className="text-text-muted text-sm leading-relaxed">
                          {result.transcript.substring(0, 200)}...
                        </p>
                        <button className="text-accent hover:text-accent/80 text-sm mt-2 flex items-center gap-1">
                          <Eye size={14} />
                          View Full Transcript
                        </button>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-lg px-3 py-2 text-accent hover:bg-accent/30 text-sm"
                      >
                        <Download size={14} />
                        Download Report
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 bg-forest-900/50 border border-forest-divider/30 rounded-lg px-3 py-2 text-text-primary hover:bg-forest-900/70 text-sm"
                      >
                        <Zap size={14} />
                        Detailed Analysis
                      </motion.button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6 text-center">
            <Brain className="text-accent mx-auto mb-4" size={32} />
            <h3 className="text-lg font-semibold text-text-primary mb-2">AI-Powered Analysis</h3>
            <p className="text-text-muted text-sm">Advanced machine learning models detect patterns and content</p>
          </div>

          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6 text-center">
            <Mic className="text-accent mx-auto mb-4" size={32} />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Speech Recognition</h3>
            <p className="text-text-muted text-sm">Accurate transcription and sentiment analysis</p>
          </div>

          <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6 text-center">
            <AlertCircle className="text-accent mx-auto mb-4" size={32} />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Misinformation Detection</h3>
            <p className="text-text-muted text-sm">Identify potential false information and claims</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
