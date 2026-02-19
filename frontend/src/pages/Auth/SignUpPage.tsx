import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Microscope,
  ArrowRight,
  Stars,
  Zap,
  Globe,
  Brain,
  Atom,
} from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { RoleCard } from '../../components/ui/RoleCard';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

type PrimaryRole = 'academia' | 'research' | null;

/* =========================
   ✨ Enhanced Floating Particles
========================= */
const FloatingParticles = () => {
  const particles = Array.from({ length: 50 });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            background: i % 3 === 0 
              ? 'rgba(16, 185, 129, 0.6)' 
              : i % 3 === 1 
              ? 'rgba(6, 182, 212, 0.6)' 
              : 'rgba(52, 211, 153, 0.6)',
            boxShadow: '0 0 10px currentColor',
          }}
          initial={{
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
          }}
          animate={{
            x: [
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
            ],
            y: [
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
            ],
            opacity: [0, 1, 0.8, 0],
            scale: [0, 1.5, 1.2, 0],
          }}
          transition={{
            duration: Math.random() * 6 + 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};

/* =========================
   🌟 Enhanced Orbiting Network
========================= */
const OrbitingNetwork = () => {
  const nodes = [
    { size: 40, distance: 90, duration: 6, color: 'from-emerald-400 to-emerald-500', icon: GraduationCap, delay: 0 },
    { size: 35, distance: 120, duration: 8, color: 'from-cyan-400 to-emerald-500', icon: Microscope, delay: 0.5 },
    { size: 38, distance: 150, duration: 10, color: 'from-emerald-500 to-cyan-400', icon: Brain, delay: 1 },
    { size: 33, distance: 105, duration: 7, color: 'from-emerald-500 to-emerald-400', icon: Atom, delay: 1.5 },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Central Core with Enhanced Glow */}
      <motion.div
        className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-cyan-400 flex items-center justify-center"
        animate={{
          boxShadow: [
            '0 0 40px rgba(16, 185, 129, 0.8), 0 0 80px rgba(16, 185, 129, 0.4), 0 0 120px rgba(16, 185, 129, 0.2)',
            '0 0 60px rgba(16, 185, 129, 1), 0 0 100px rgba(16, 185, 129, 0.6), 0 0 140px rgba(16, 185, 129, 0.3)',
            '0 0 40px rgba(16, 185, 129, 0.8), 0 0 80px rgba(16, 185, 129, 0.4), 0 0 120px rgba(16, 185, 129, 0.2)',
          ],
          scale: [1, 1.08, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <Globe className="text-white" size={36} />
        </motion.div>
        
        {/* Enhanced Core Pulse Rings */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid rgba(255, 255, 255, 0.4)',
            }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{
              scale: [1, 2.2, 2.8],
              opacity: [1, 0.4, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeOut',
            }}
          />
        ))}
      </motion.div>

      {/* Enhanced Orbiting Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: node.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: node.delay,
          }}
          style={{
            width: node.distance * 2,
            height: node.distance * 2,
          }}
        >
          <motion.div
            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br ${node.color} flex items-center justify-center cursor-pointer`}
            style={{
              width: node.size,
              height: node.size,
            }}
            animate={{
              boxShadow: [
                '0 0 15px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.3)',
                '0 0 25px rgba(16, 185, 129, 0.8), 0 0 50px rgba(16, 185, 129, 0.5)',
                '0 0 15px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.3)',
              ],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            whileHover={{ scale: 1.3, rotate: 360, transition: { duration: 0.4 } }}
          >
            <motion.div
              animate={{ rotate: [-360, 0] }}
              transition={{ duration: node.duration, repeat: Infinity, ease: 'linear' }}
            >
              <node.icon className="text-white" size={node.size * 0.45} />
            </motion.div>
          </motion.div>

          {/* Connection Trails */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-emerald-400/60"
            style={{
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)',
            }}
            animate={{
              scale: [0, 3, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        </motion.div>
      ))}

      {/* Enhanced Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {nodes.map((node, i) => (
          <motion.circle
            key={i}
            cx="50%"
            cy="50%"
            r={node.distance}
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="1.5"
            strokeDasharray="8 4"
            opacity="0.3"
            animate={{ strokeDashoffset: [0, i % 2 === 0 ? -100 : 100] }}
            transition={{ duration: node.duration, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

/* =========================
   🎨 Enhanced Right Side Animation
========================= */
const AnimatedVisual = () => {
  return (
    <div className="w-1/2 relative flex items-center justify-center px-8">
      <FloatingParticles />
      
      {/* Enhanced Ambient Orbs */}
      <motion.div
        className="absolute top-10 right-10 w-[300px] h-[300px] bg-emerald-500/20 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-[280px] h-[280px] bg-cyan-500/20 rounded-full blur-[110px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.4, 0.15],
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-emerald-400/15 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      <div className="relative z-10 w-full max-w-[500px]">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 text-center"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-4 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-full px-5 py-2"
            animate={{
              boxShadow: [
                '0 0 20px rgba(16, 185, 129, 0.2)',
                '0 0 40px rgba(16, 185, 129, 0.4)',
                '0 0 20px rgba(16, 185, 129, 0.2)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Zap className="text-emerald-400" size={16} />
            </motion.div>
            <span className="text-emerald-400 font-semibold text-xs tracking-wider uppercase">
              Building Connections
            </span>
          </motion.div>
          
          <motion.h1 
            className="font-playfair text-6xl font-bold mb-3 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.span
              className="inline-block bg-gradient-to-r from-white via-emerald-400 to-cyan-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Join the
            </motion.span>
            <br />
            <motion.span
              className="inline-block bg-gradient-to-r from-cyan-400 via-emerald-500 to-emerald-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Network
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-text-muted text-base max-w-md mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Connect with students, teachers, researchers, and mentors.
            <br />
            <span className="text-emerald-400/90 font-medium">Building knowledge together.</span>
          </motion.p>
        </motion.div>

        {/* Enhanced Main Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[360px]"
        >
          <OrbitingNetwork />
        </motion.div>

        {/* Enhanced Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex justify-center gap-6 mt-6"
        >
          {[
            { label: 'Active Users', value: '10K+', color: 'emerald', gradient: 'from-emerald-400 to-emerald-500' },
            { label: 'Connections', value: '50K+', color: 'cyan', gradient: 'from-cyan-400 to-cyan-500' },
            { label: 'Institutions', value: '200+', color: 'emerald', gradient: 'from-emerald-400 to-emerald-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center relative group cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + i * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
            >
              <motion.div
                className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                {stat.value}
              </motion.div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">
                {stat.label}
              </div>
              
              {/* Hover Glow */}
              <motion.div
                className={`absolute inset-0 bg-${stat.color}-400/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 -z-10`}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

/* =========================
   📝 Enhanced Main Signup Page
========================= */
export const SignupPage = () => {
  const [primaryRole, setPrimaryRole] = useState<PrimaryRole>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emptyFields, setEmptyFields] = useState<Set<string>>(new Set());

  const submitLock = useRef(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitLock.current || loading) return;
    submitLock.current = true;
    setLoading(true);

    try {
      // Clear any previous errors
      setError(null);
      
      const formData = new FormData(e.currentTarget);

      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const password = String(formData.get('password') || '');
      const confirmPassword = String(formData.get('confirmPassword') || '');

      // Track empty fields
      const empty = new Set<string>();
      if (!name) empty.add('name');
      if (!email) empty.add('email');
      if (!password) empty.add('password');
      if (!confirmPassword) empty.add('confirmPassword');
      if (!primaryRole) empty.add('role');

      // If there are empty fields, show error and highlight them
      if (empty.size > 0) {
        setEmptyFields(empty);
        setError('Please fill all required fields');
        throw new Error('Please fill all required fields');
      }

      // Clear empty fields when all are filled
      setEmptyFields(new Set());

      // Check if passwords match
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match. Please confirm your password.');
      }

      // Check if user already exists with the same role
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email, role')
        .eq('email', email)
        .eq('role', primaryRole)
        .maybeSingle();

      if (existingUser) {
        throw new Error(`This email is already registered as ${primaryRole}. Please log in or choose a different role.`);
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: primaryRole
          },
        },
      });

      if (authError || !data.user) {
        if (authError?.message?.includes('already registered')) {
          throw new Error('This email is already registered. Please log in.');
        }
        throw authError ?? new Error('Signup failed');
      }

      // Profile insertion is handled by Supabase trigger automatically
      navigate('/login');
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err?.message !== 'Please fill all required fields') {
        setError(err?.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
      submitLock.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 flex overflow-hidden relative">
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Enhanced Animated Grid Background */}
      <motion.div 
        className="absolute inset-0 opacity-[0.07]"
        animate={{
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.15) 1px, transparent 1px),
              linear-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px, 60px 60px, 20px 20px, 20px 20px',
          }}
        />
      </motion.div>

      {/* Left Side - Enhanced Form */}
      <div className="w-1/2 flex items-center justify-center px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[440px]"
        >
          <motion.div 
            className="relative bg-gradient-to-br from-forest-800/60 via-forest-800/40 to-forest-900/60 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl p-7 shadow-[0_0_100px_rgba(16,185,129,0.15),0_20px_80px_rgba(0,0,0,0.6)]"
            whileHover={{
              boxShadow: '0 0 120px rgba(16,185,129,0.2), 0 25px 90px rgba(0,0,0,0.7)',
            }}
            transition={{ duration: 0.3 }}
          >
            
            {/* Enhanced Decorative Corners */}
            <motion.div 
              className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-emerald-500/40 rounded-tl-3xl"
              animate={{
                borderColor: ['rgba(16, 185, 129, 0.4)', 'rgba(16, 185, 129, 0.8)', 'rgba(16, 185, 129, 0.4)'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-emerald-500/40 rounded-br-3xl"
              animate={{
                borderColor: ['rgba(16, 185, 129, 0.4)', 'rgba(16, 185, 129, 0.8)', 'rgba(16, 185, 129, 0.4)'],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            />

            {/* Enhanced Ambient Glow */}
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 via-emerald-500/10 to-cyan-500/10 rounded-3xl blur-3xl -z-10"
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Enhanced Header */}
            <div className="mb-5">
              <div className="flex items-center gap-2.5 mb-2">
                <motion.div
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Stars className="text-emerald-400" size={24} />
                </motion.div>
                <motion.h1 
                  className="font-playfair text-3xl text-text-primary font-bold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Create Account
                </motion.h1>
              </div>
              <motion.p 
                className="text-text-muted text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Join a system built on verification, not virality.
              </motion.p>
            </div>

            {/* Error Display */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: 0 }}
                  animate={{ opacity: 1, height: 'auto', y: -15 }}
                  exit={{ opacity: 0, height: 0, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="pt-3 pb-2"
                >
                  <p className="text-red-400 text-sm font-sans text-center">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Primary Roles */}
            <motion.div 
              className={`flex gap-2.5 mb-3 ${emptyFields.has('role') ? 'border border-red-500 rounded-lg p-2' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <RoleCard
                title="Academia"
                description="Students & Teachers"
                icon={GraduationCap}
                selected={primaryRole === 'academia'}
                onClick={() => {
                  setPrimaryRole('academia');
                  setError(null);
                  setEmptyFields(prev => {
                    const newSet = new Set(prev);
                    newSet.delete('role');
                    return newSet;
                  });
                }}
              />
              <RoleCard
                title="Research"
                description="Researchers & Mentors"
                icon={Microscope}
                selected={primaryRole === 'research'}
                onClick={() => {
                  setPrimaryRole('research');
                  setError(null);
                  setEmptyFields(prev => {
                    const newSet = new Set(prev);
                    newSet.delete('role');
                    return newSet;
                  });
                }}
              />
            </motion.div>


            {/* Enhanced Form */}
            <motion.form 
              onSubmit={handleSignup} 
              className="space-y-2.5" 
              noValidate
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Input 
                name="name" 
                label="Full Name" 
                required 
                className={emptyFields.has('name') ? 'border-red-500' : ''}
              />
              
              <Input 
                name="email" 
                label="Email Address" 
                type="email" 
                required 
                className={emptyFields.has('email') ? 'border-red-500' : ''}
              />

              <Input 
                name="password" 
                label="Password" 
                type="password" 
                required 
                className={emptyFields.has('password') ? 'border-red-500' : ''}
              />
              
              <Input
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                required
                className={emptyFields.has('confirmPassword') ? 'border-red-500' : ''}
              />

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: '0 0 50px rgba(16, 185, 129, 0.5), 0 0 100px rgba(16, 185, 129, 0.3)',
                }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full mt-3 bg-gradient-to-r from-emerald-500 via-emerald-500 to-cyan-400 bg-[length:200%_100%] text-white font-bold rounded-xl py-3.5 shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 overflow-hidden group"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  backgroundPosition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }
                }}
              >
                {/* Enhanced Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatDelay: 1,
                  }}
                />
                
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Account
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight size={18} />
                      </motion.div>
                    </>
                  )}
                </span>
              </motion.button>
            </motion.form>

            {/* Enhanced Footer */}
            <motion.div 
              className="mt-5 pt-5 border-t border-emerald-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Link
                to="/login"
                className="text-sm text-text-muted hover:text-emerald-500 flex items-center gap-2 transition-all duration-300 group"
              >
                <motion.div
                  animate={{ x: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="rotate-180" size={14} />
                </motion.div>
                <span className="group-hover:underline">Already have an account?</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Enhanced Animation */}
      <AnimatedVisual />
    </div>
  );
};
