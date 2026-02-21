import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  MessageSquare, 
  Settings, 
  Phone,
  Share,
  Maximize2,
  Volume2,
  VolumeX,
  Calendar,
  Clock,
  UserPlus,
  Shield,
  Wifi,
  ChevronDown,
  X,
  Send,
  Paperclip
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface MeetingParticipant {
  id: string;
  name: string;
  role: string;
  isMuted: boolean;
  isVideoOn: boolean;
  avatar?: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isOwn?: boolean;
}

export const OnlineMeetingPage: React.FC = () => {
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<MeetingParticipant[]>([
    { id: '1', name: 'Dr. Sarah Johnson', role: 'Mentor', isMuted: false, isVideoOn: true },
    { id: '2', name: 'Prof. Michael Chen', role: 'Research Lead', isMuted: true, isVideoOn: false },
    { id: '3', name: 'Alex Thompson', role: 'Researcher', isMuted: false, isVideoOn: true },
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Dr. Sarah Johnson', message: 'Welcome everyone! Let\'s discuss the research progress.', timestamp: new Date(Date.now() - 300000) },
    { id: '2', sender: 'Prof. Michael Chen', message: 'Great! I have some updates on the methodology.', timestamp: new Date(Date.now() - 240000) },
    { id: '3', sender: 'Alex Thompson', message: 'Looking forward to hearing about it.', timestamp: new Date(Date.now() - 180000) },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInMeeting) {
      interval = setInterval(() => {
        setMeetingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInMeeting]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const startMeeting = () => {
    setIsInMeeting(true);
    // Simulate getting user media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.log('Error accessing media devices:', err);
      });
  };

  const endMeeting = () => {
    setIsInMeeting(false);
    setMeetingDuration(0);
    // Stop media streams
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: 'You',
        message: newMessage,
        timestamp: new Date(),
        isOwn: true
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="text-accent" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">Online Meeting Room</h1>
                <p className="text-text-muted">Collaborate with your research team in real-time</p>
              </div>
            </div>
            
            {isInMeeting && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-forest-800/50 border border-forest-divider/30 rounded-lg px-3 py-2">
                  <Clock className="text-accent" size={16} />
                  <span className="text-text-primary font-mono">{formatDuration(meetingDuration)}</span>
                </div>
                <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-2">
                  <Wifi className="text-green-400" size={16} />
                  <span className="text-green-400 text-sm">Connected</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {!isInMeeting ? (
          /* Meeting Setup Screen */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Join Meeting */}
              <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-8">
                <h2 className="text-2xl font-semibold text-text-primary mb-6 flex items-center gap-3">
                  <Video size={28} />
                  Join Meeting
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Meeting ID</label>
                    <input
                      type="text"
                      placeholder="Enter meeting ID or personal link"
                      className="w-full px-4 py-3 bg-forest-900/50 border border-forest-divider/50 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Your Name</label>
                    <input
                      type="text"
                      placeholder="Enter your display name"
                      defaultValue="Researcher"
                      className="w-full px-4 py-3 bg-forest-900/50 border border-forest-divider/50 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent/50"
                    />
                  </div>

                  {/* Audio/Video Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-text-primary flex items-center gap-2">
                        <Video size={18} />
                        Camera
                      </span>
                      <button
                        onClick={() => setIsVideoOn(!isVideoOn)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          isVideoOn 
                            ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                            : 'bg-red-500/20 border-red-500/30 text-red-400'
                        }`}
                      >
                        {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-text-primary flex items-center gap-2">
                        <Mic size={18} />
                        Microphone
                      </span>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          !isMuted 
                            ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                            : 'bg-red-500/20 border-red-500/30 text-red-400'
                        }`}
                      >
                        {!isMuted ? <Mic size={18} /> : <MicOff size={18} />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startMeeting}
                    className="w-full bg-gradient-to-r from-accent via-emerald-500 to-accent text-text-primary font-medium rounded-lg px-6 py-4 flex items-center justify-center gap-3"
                  >
                    <Users size={20} />
                    Join Meeting
                  </motion.button>
                </div>
              </div>

              {/* Scheduled Meetings */}
              <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-8">
                <h2 className="text-2xl font-semibold text-text-primary mb-6 flex items-center gap-3">
                  <Calendar size={28} />
                  Scheduled Meetings
                </h2>

                <div className="space-y-4">
                  {[
                    { time: '10:00 AM', title: 'Research Methodology Review', participants: 5 },
                    { time: '2:00 PM', title: 'Data Analysis Discussion', participants: 3 },
                    { time: '4:30 PM', title: 'Weekly Team Sync', participants: 8 },
                  ].map((meeting, index) => (
                    <div key={index} className="bg-forest-900/30 border border-forest-divider/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-text-primary font-medium">{meeting.title}</h3>
                        <span className="text-accent text-sm">{meeting.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-text-muted text-sm">
                        <Users size={14} />
                        <span>{meeting.participants} participants</span>
                      </div>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 bg-forest-900/50 border border-forest-divider/30 rounded-lg px-4 py-3 text-text-primary hover:bg-forest-900/70 flex items-center justify-center gap-2"
                >
                  <Calendar size={18} />
                  Schedule New Meeting
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* In Meeting Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-[600px] bg-forest-900 rounded-xl overflow-hidden relative"
          >
            {/* Main Video Area */}
            <div className="flex h-full">
              {/* Video Grid */}
              <div className="flex-1 grid grid-cols-2 gap-2 p-4">
                {/* Local Video */}
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 rounded px-2 py-1">
                    <span className="text-white text-xs">You</span>
                  </div>
                </div>

                {/* Participant Videos */}
                {participants.map((participant) => (
                  <div key={participant.id} className="relative bg-black rounded-lg overflow-hidden">
                    {participant.isVideoOn ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-forest-800 to-forest-900">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-accent text-lg font-bold">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <p className="text-text-primary text-sm">{participant.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-forest-800 to-forest-900">
                        <div className="text-center">
                          <VideoOff className="text-text-muted mx-auto mb-2" size={24} />
                          <p className="text-text-primary text-sm">{participant.name}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute bottom-2 left-2 bg-black/60 rounded px-2 py-1">
                      <span className="text-white text-xs">{participant.name}</span>
                    </div>

                    {participant.isMuted && (
                      <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
                        <MicOff size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Side Panel */}
              <div className="w-80 bg-forest-800/50 border-l border-forest-divider/30 flex flex-col">
                {/* Chat */}
                <AnimatePresence>
                  {showChat && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="flex-1 flex flex-col border-b border-forest-divider/30"
                    >
                      <div className="p-3 border-b border-forest-divider/30">
                        <h3 className="text-text-primary font-medium flex items-center gap-2">
                          <MessageSquare size={16} />
                          Chat
                        </h3>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {chatMessages.map((msg) => (
                          <div key={msg.id} className={`space-y-1 ${msg.isOwn ? 'text-right' : ''}`}>
                            <div className={`inline-block max-w-[200px] rounded-lg px-3 py-2 ${
                              msg.isOwn 
                                ? 'bg-accent/20 text-accent' 
                                : 'bg-forest-900/50 text-text-primary'
                            }`}>
                              <p className="text-xs font-medium mb-1">{msg.sender}</p>
                              <p className="text-sm">{msg.message}</p>
                            </div>
                            <p className="text-text-muted text-xs">
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>

                      <div className="p-3 border-t border-forest-divider/30">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 bg-forest-900/50 border border-forest-divider/30 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent/50 text-sm"
                          />
                          <button className="text-accent hover:text-accent/80 p-2">
                            <Paperclip size={16} />
                          </button>
                          <button
                            onClick={sendMessage}
                            className="bg-accent hover:bg-accent/80 text-forest-900 rounded-lg p-2"
                          >
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Meeting Controls */}
                <div className="p-4 space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowChat(!showChat)}
                    className={`w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 transition-all ${
                      showChat 
                        ? 'bg-accent/20 text-accent border border-accent/30' 
                        : 'bg-forest-900/50 text-text-primary border border-forest-divider/30 hover:bg-forest-900/70'
                    }`}
                  >
                    <MessageSquare size={16} />
                    <span className="text-sm">Chat</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowParticipants(!showParticipants)}
                    className={`w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 transition-all ${
                      showParticipants 
                        ? 'bg-accent/20 text-accent border border-accent/30' 
                        : 'bg-forest-900/50 text-text-primary border border-forest-divider/30 hover:bg-forest-900/70'
                    }`}
                  >
                    <Users size={16} />
                    <span className="text-sm">Participants ({participants.length + 1})</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 transition-all ${
                      isScreenSharing 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-forest-900/50 text-text-primary border border-forest-divider/30 hover:bg-forest-900/70'
                    }`}
                  >
                    <Monitor size={16} />
                    <span className="text-sm">Share Screen</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full transition-all ${
                    isMuted 
                      ? 'bg-red-500 text-white' 
                      : 'bg-forest-800/80 text-text-primary hover:bg-forest-700/80'
                  }`}
                >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-full transition-all ${
                    !isVideoOn 
                      ? 'bg-red-500 text-white' 
                      : 'bg-forest-800/80 text-text-primary hover:bg-forest-700/80'
                  }`}
                >
                  {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
                </motion.button>

                <div className="h-8 w-px bg-forest-divider/50" />

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full bg-forest-800/80 text-text-primary hover:bg-forest-700/80 transition-all"
                >
                  <Monitor size={20} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full bg-forest-800/80 text-text-primary hover:bg-forest-700/80 transition-all"
                >
                  <Settings size={20} />
                </motion.button>

                <div className="h-8 w-px bg-forest-divider/50" />

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={endMeeting}
                  className="px-6 py-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all flex items-center gap-2"
                >
                  <Phone size={20} />
                  Leave Meeting
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features Section */}
        {!isInMeeting && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6 text-center">
              <Shield className="text-accent mx-auto mb-4" size={32} />
              <h3 className="text-lg font-semibold text-text-primary mb-2">Secure Meetings</h3>
              <p className="text-text-muted text-sm">End-to-end encryption for all research discussions</p>
            </div>

            <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6 text-center">
              <Users className="text-accent mx-auto mb-4" size={32} />
              <h3 className="text-lg font-semibold text-text-primary mb-2">Team Collaboration</h3>
              <p className="text-text-muted text-sm">Real-time collaboration with research team members</p>
            </div>

            <div className="bg-forest-800/50 border border-forest-divider/50 rounded-xl p-6 text-center">
              <Monitor className="text-accent mx-auto mb-4" size={32} />
              <h3 className="text-lg font-semibold text-text-primary mb-2">Screen Sharing</h3>
              <p className="text-text-muted text-sm">Share presentations and research findings</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
