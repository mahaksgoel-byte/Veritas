import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Bot,
  User,
  X,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  MessageSquare,
  Minimize2,
  AlertCircle,
} from 'lucide-react';

/* ================= TYPES ================= */

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/* ================= GEMINI API INTEGRATION ================= */

class GeminiAPI {
  private apiKey: string;
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(
    message: string,
    conversationHistory: Message[] = []
  ): Promise<string> {
    try {
      // Build conversation context
      const contents = [
        {
          role: 'user',
          parts: [{ 
            text: 'You are Veritas AI, a helpful academic research assistant integrated into the Veritas platform. You help students, teachers, and researchers with academic questions, research topics, paper analysis, and educational concepts. Be clear, concise, and accurate in your responses.'
          }]
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I am Veritas AI, ready to assist with academic and research-related questions.' }]
        },
        // Add conversation history
        ...conversationHistory.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        })),
        // Add current message
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ];

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents.slice(-10), // Keep last 10 messages for context
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get response from Gemini');
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated');
      }

      const text = data.candidates[0].content.parts[0].text;
      return text;
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  async streamResponse(
    message: string,
    conversationHistory: Message[],
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const contents = [
        {
          role: 'user',
          parts: [{ 
            text: 'You are Veritas AI, a helpful academic research assistant. Provide clear, concise, and accurate information.'
          }]
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I am ready to assist.' }]
        },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        })),
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ];

      const streamUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent';
      
      const response = await fetch(`${streamUrl}?key=${this.apiKey}&alt=sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents.slice(-10),
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Streaming failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                onChunk(data.candidates[0].content.parts[0].text);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Streaming Error:', error);
      throw error;
    }
  }
}

/* ================= MAIN CHATBOT COMPONENT ================= */

export const VeritasChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useStreaming, setUseStreaming] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const geminiRef = useRef<GeminiAPI | null>(null);

  // Initialize Gemini API
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      geminiRef.current = new GeminiAPI(apiKey);
      setError(null);
    } else {
      setError('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file.');
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !geminiRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      if (useStreaming) {
        // Streaming response
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);

        await geminiRef.current.streamResponse(
          currentInput,
          messages,
          (chunk) => {
            setMessages((prev) => {
              const updated = [...prev];
              const lastMsg = updated[updated.length - 1];
              if (lastMsg.role === 'assistant') {
                lastMsg.content += chunk;
              }
              return updated;
            });
          }
        );
      } else {
        // Regular response
        const response = await geminiRef.current.generateResponse(
          currentInput,
          messages
        );

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      console.error('AI Error:', error);
      setError(error.message || 'Failed to get response. Please try again.');
      
      // Remove the empty assistant message if streaming
      if (useStreaming) {
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          onClick={() => setIsMinimized(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-16 h-16 bg-gradient-to-br from-accent via-emerald-500 to-cyan-400 rounded-full shadow-2xl flex items-center justify-center group"
        >
          {/* Pulse Rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-accent/40"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
              }}
            />
          ))}
          
          <MessageSquare className="text-white" size={28} />
          
          {/* Notification Badge */}
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={10} className="text-white" />
          </motion.div>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 w-[440px] h-[650px] z-50"
    >
      <div className="relative w-full h-full bg-gradient-to-br from-forest-900/95 via-forest-800/95 to-forest-900/95 backdrop-blur-2xl rounded-2xl border border-accent/20 shadow-2xl shadow-accent/20 flex flex-col overflow-hidden">
        
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-20 -right-20 w-60 h-60 bg-accent/20 rounded-full blur-[100px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-[100px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
          
          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-accent/40 rounded-full"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="relative px-5 py-4 border-b border-forest-divider/30 bg-forest-900/50 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="relative w-10 h-10 rounded-full bg-gradient-to-br from-accent via-emerald-500 to-cyan-400 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(16, 185, 129, 0.4)',
                    '0 0 30px rgba(16, 185, 129, 0.6)',
                    '0 0 20px rgba(16, 185, 129, 0.4)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Bot className="text-white" size={20} />
                
                {/* Active Indicator */}
                <motion.div
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-forest-900"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              <div>
                <h3 className="font-playfair text-lg font-bold text-text-primary flex items-center gap-2">
                  Veritas AI
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles size={14} className="text-accent" />
                  </motion.div>
                </h3>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">
                  Powered by Gemini • {geminiRef.current ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setUseStreaming(!useStreaming)}
                title={useStreaming ? 'Streaming: ON' : 'Streaming: OFF'}
                className={`p-2 rounded-lg transition-colors ${
                  useStreaming 
                    ? 'bg-accent/20 text-accent' 
                    : 'bg-forest-800/60 text-text-muted hover:text-accent'
                }`}
              >
                <Sparkles size={16} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMinimized(true)}
                className="p-2 hover:bg-forest-800/60 rounded-lg transition-colors"
              >
                <Minimize2 size={18} className="text-text-muted hover:text-accent transition-colors" />
              </motion.button>
            </div>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-red-400 leading-relaxed">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <X size={14} className="text-red-400" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-forest-700 scrollbar-track-transparent">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center px-6"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-accent via-emerald-500 to-cyan-400 flex items-center justify-center mb-6"
                >
                  <Bot size={36} className="text-white" />
                </motion.div>

                <h4 className="font-playfair text-xl font-bold text-text-primary mb-2">
                  Welcome to Veritas AI
                </h4>
                <p className="text-sm text-text-muted mb-6 max-w-xs">
                  Ask me anything about your research, papers, or academic concepts.
                  I'm here to help you learn!
                </p>

                <div className="space-y-2 w-full">
                  {[
                    'Explain quantum entanglement',
                    'Summarize recent AI research',
                    'Help with my thesis structure',
                  ].map((suggestion, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      onClick={() => setInput(suggestion)}
                      className="w-full text-left px-4 py-2.5 rounded-lg bg-forest-800/40 border border-forest-divider/30 hover:border-accent/30 text-sm text-text-muted hover:text-text-primary transition-all duration-300"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    index={index}
                    onCopy={copyToClipboard}
                    copiedId={copiedId}
                  />
                ))}
                {isLoading && <TypingIndicator />}
              </>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative px-5 py-4 border-t border-forest-divider/30 bg-forest-900/50 backdrop-blur-xl">
          {messages.length > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearChat}
              className="mb-3 text-xs text-text-muted hover:text-red-400 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={12} />
              Clear conversation
            </motion.button>
          )}

          <div className="relative flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask Veritas AI anything..."
                disabled={!geminiRef.current}
                rows={1}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-forest-800/60 border border-forest-divider/50 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:bg-forest-800 resize-none transition-all duration-300 max-h-32 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  minHeight: '48px',
                  height: 'auto',
                }}
              />

              {/* Gemini Indicator */}
              <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
                <motion.div
                  className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(168, 85, 247, 0.4)',
                      '0 0 20px rgba(168, 85, 247, 0.6)',
                      '0 0 10px rgba(168, 85, 247, 0.4)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={12} className="text-white" />
                </motion.div>
              </div>
            </div>

            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || !geminiRef.current}
              whileHover={{ scale: input.trim() && geminiRef.current ? 1.05 : 1 }}
              whileTap={{ scale: input.trim() && geminiRef.current ? 0.95 : 1 }}
              className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                input.trim() && !isLoading && geminiRef.current
                  ? 'bg-gradient-to-br from-accent via-emerald-500 to-cyan-400 shadow-lg shadow-accent/30 hover:shadow-accent/50'
                  : 'bg-forest-800/60 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Loader2 className="text-white animate-spin" size={20} />
              ) : (
                <Send
                  className={`${
                    input.trim() && geminiRef.current ? 'text-white' : 'text-text-muted'
                  }`}
                  size={20}
                />
              )}

              {/* Shimmer Effect */}
              {input.trim() && !isLoading && geminiRef.current && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-xl"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              )}
            </motion.button>
          </div>

          <p className="text-[10px] text-text-muted text-center mt-2">
            Powered by Google Gemini • Veritas Research Platform
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/* ================= MESSAGE BUBBLE COMPONENT ================= */

const MessageBubble: React.FC<{
  message: Message;
  index: number;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}> = ({ message, index, onCopy, copiedId }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-forest-700 to-forest-800 border border-accent/30'
            : 'bg-gradient-to-br from-purple-400 to-pink-400'
        }`}
      >
        {isUser ? (
          <User size={16} className="text-accent" />
        ) : (
          <Bot size={16} className="text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`relative max-w-[85%] px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-br from-accent/20 to-emerald-500/20 border border-accent/30 text-text-primary rounded-tr-sm'
              : 'bg-forest-800/60 border border-forest-divider/30 text-text-primary rounded-tl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {!isUser && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onCopy(message.content, message.id)}
              className="absolute -bottom-2 -right-2 w-6 h-6 bg-forest-900 border border-forest-divider/50 rounded-full flex items-center justify-center hover:border-accent/50 transition-colors"
            >
              {copiedId === message.id ? (
                <Check size={12} className="text-accent" />
              ) : (
                <Copy size={12} className="text-text-muted" />
              )}
            </motion.button>
          )}
        </motion.div>

        <p className="text-[10px] text-text-muted mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </motion.div>
  );
};

/* ================= TYPING INDICATOR ================= */

const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
        <Bot size={16} className="text-white" />
      </div>

      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-tl-sm bg-forest-800/60 border border-forest-divider/30">
        <motion.div
          className="flex gap-1"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-accent"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
        <span className="text-xs text-text-muted">Gemini is thinking...</span>
      </div>
    </motion.div>
  );
};

export default VeritasChatbot;