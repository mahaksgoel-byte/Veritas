import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { ArrowRight, DoorOpen, Sparkles, Eye, Shield, Zap, } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

/* =========================
   ✨ Floating Particles
========================= */
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent/30 rounded-full"
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
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

/* =========================
   🌟 Ambient Glow Orbs
========================= */
const AmbientOrbs = () => {
  return (
    <>
      <motion.div
        className="absolute top-20 left-20 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 left-40 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[150px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-cyan-500/15 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </>
  );
};

/* =========================
   👁️ REALISTIC WATCHING EYE - FROM MADMAX
========================= */
interface EyeProps {
  passwordFocused: boolean;
  eyeX: any;
  eyeY: any;
  blinkState: boolean;
}

const RealisticEye = ({ passwordFocused, eyeX, eyeY, blinkState }: EyeProps) => {
  return (
    <motion.div
      className="w-72 h-72 relative"
      style={{ perspective: '1500px' }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: passwordFocused
            ? 'radial-gradient(circle, rgba(16,185,129,0.6) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)',
        }}
        animate={{
          scale: passwordFocused ? [1, 1.4, 1] : [1, 1.2, 1],
          opacity: passwordFocused ? [0.6, 1, 0.6] : [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Eye socket */}
      <motion.div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #2a2a2a, #0a0a0a 70%)',
          boxShadow: passwordFocused
            ? 'inset 0 0 80px rgba(0,0,0,1), inset 0 15px 40px rgba(16,185,129,0.5), 0 30px 90px rgba(16,185,129,0.7), 0 0 130px rgba(16,185,129,0.5)'
            : 'inset 0 0 80px rgba(0,0,0,1), inset 0 15px 40px rgba(0,0,0,0.7), 0 30px 90px rgba(0,0,0,0.9), 0 0 100px rgba(16,185,129,0.2)',
        }}
        animate={{
          rotateX: passwordFocused ? [0, 3, -3, 0] : 0,
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {/* Decorative rings */}
        <motion.div
          className="absolute inset-8 rounded-full border-2"
          style={{
            borderColor: passwordFocused
              ? 'rgba(16,185,129,0.5)'
              : 'rgba(16,185,129,0.25)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-12 rounded-full border"
          style={{
            borderColor: passwordFocused
              ? 'rgba(16,185,129,0.3)'
              : 'rgba(16,185,129,0.15)',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {!blinkState && !passwordFocused ? (
          <>
            {/* Eyeball */}
            <motion.div
              style={{ x: eyeX, y: eyeY }}
              className="relative w-36 h-36 rounded-full flex items-center justify-center"
              animate={{ scale: passwordFocused ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Sclera (white part) */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 45% 40%, #f0f0f0, #f8f8f8 50%, #ffffff)',
                  boxShadow: 'inset 0 -10px 25px rgba(0,0,0,0.25), 0 0 60px rgba(255,255,255,0.6)',
                }}
              />

              {/* Iris - outer layer */}
              <motion.div
                className="absolute inset-0 rounded-full opacity-75"
                style={{
                  background: 'radial-gradient(circle at 45% 45%, rgba(16,185,129,0.7) 0%, rgba(16,185,129,0.5) 45%, transparent 75%)',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              />

              {/* Iris - inner layer */}
              <motion.div
                className="absolute inset-6 rounded-full opacity-65"
                style={{
                  background: 'radial-gradient(circle at 55% 35%, rgba(0,139,139,0.5) 0%, transparent 70%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              />

              {/* Iris fibers/striation */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-[2px] top-1/2"
                  style={{
                    background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.4), transparent)',
                    transform: `rotate(${i * 18}deg)`,
                    transformOrigin: 'center',
                  }}
                />
              ))}

              {/* Pupil */}
              <motion.div
                className="relative w-16 h-16 bg-black rounded-full overflow-hidden"
                style={{
                  boxShadow: '0 0 30px rgba(16,185,129,0.7), inset 0 3px 12px rgba(0,0,0,1)',
                }}
                animate={{
                  scale: passwordFocused ? [1, 0.8, 1] : 1,
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {/* Pupil highlights */}
                <div className="absolute top-2 left-2 w-4 h-4 bg-white/90 rounded-full blur-[0.5px]" />
                <div className="absolute bottom-2.5 right-2.5 w-2 h-2 bg-white/50 rounded-full blur-[0.5px]" />
              </motion.div>
            </motion.div>

            {/* Light reflections */}
            <motion.div
              style={{ x: eyeX, y: eyeY }}
              className="absolute top-8 left-8 w-9 h-9 bg-white/85 rounded-full blur-sm pointer-events-none"
            />
            <motion.div
              style={{ x: eyeX, y: eyeY }}
              className="absolute top-10 left-10 w-6 h-6 bg-white/65 rounded-full blur-[3px] pointer-events-none"
            />
          </>
        ) : (
          // Closed eye animation - for both blink and password focus
          <motion.div
            className="relative w-44 h-8 flex items-center justify-center"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: passwordFocused ? 0.08 : 0.05 }}
            transition={{ 
              duration: passwordFocused ? 0.6 : 0.12,
              ease: passwordFocused ? [0.65, 0, 0.35, 1] : 'easeInOut'
            }}
          >
            {/* Main eyelid */}
            <div 
              className="w-full h-full rounded-full shadow-2xl relative overflow-hidden"
              style={{
                background: passwordFocused 
                  ? 'linear-gradient(to bottom, #0d8a5c 0%, #065d3c 50%, #033d23 100%)'
                  : 'linear-gradient(to bottom, #6b6b6b 0%, #4a4a4a 50%, #2a2a2a 100%)',
                boxShadow: passwordFocused
                  ? '0 0 40px rgba(16,185,129,0.8), inset 0 2px 8px rgba(0,0,0,0.8), inset 0 -2px 8px rgba(16,185,129,0.5)'
                  : '0 0 20px rgba(0,0,0,0.5), inset 0 2px 8px rgba(0,0,0,0.8)',
              }}
            >
              {/* Eyelid texture/shine */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: passwordFocused
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.3) 0%, transparent 50%, rgba(13,138,92,0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
                }}
              />
              
              {/* Intense glow effect for password focus */}
              {passwordFocused && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.4) 0%, transparent 70%)',
                  }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </div>

            {/* Eyelid crease/detail */}
            <motion.div
              className="absolute top-0 w-full h-[2px] rounded-full"
              style={{
                background: passwordFocused
                  ? 'linear-gradient(to right, transparent, rgba(16,185,129,0.6) 50%, transparent)'
                  : 'linear-gradient(to right, transparent, rgba(100,100,100,0.4) 50%, transparent)',
                boxShadow: passwordFocused 
                  ? '0 0 15px rgba(16,185,129,0.8)'
                  : '0 0 8px rgba(0,0,0,0.3)',
              }}
              animate={passwordFocused ? {
                opacity: [0.6, 1, 0.6],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Eyelashes - hide when eyes are closed */}
      {!passwordFocused && (
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[3px] h-14 bg-gradient-to-b from-gray-900 to-transparent origin-bottom"
              style={{
                top: '0%',
                left: `${8 + i * 6}%`,
                transform: `rotate(${-45 + i * 7}deg)`,
              }}
              animate={{ opacity: blinkState ? 0 : [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

/* =========================
   👁️ WATCHING EYES WITH MADMAX QUALITY
========================= */
const WatchingEyes = ({ passwordFocused }: { passwordFocused: boolean }) => {
  const eyeContainerRef = useRef<HTMLDivElement>(null);
  const [blinkState, setBlinkState] = useState(false);

  // Eye tracking with spring animation
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const eyeX = useSpring(0, springConfig);
  const eyeY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (eyeContainerRef.current) {
        const rect = eyeContainerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX);
        const maxMovement = 30;
        const normalizedDistance = Math.min(distance / 250, 1);
        const moveX = Math.cos(angle) * normalizedDistance * maxMovement;
        const moveY = Math.sin(angle) * normalizedDistance * maxMovement;
        eyeX.set(moveX);
        eyeY.set(moveY);
      }
    };

    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [eyeX, eyeY]);

  // Blinking
  useEffect(() => {
    if (passwordFocused) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        setBlinkState(true);
        setTimeout(() => setBlinkState(false), 100 + Math.random() * 80);
      }
    }, 2000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [passwordFocused]);

  return (
    <div className="w-1/2 relative flex items-center justify-center px-12">
      <FloatingParticles />
      <AmbientOrbs />
      
      <div ref={eyeContainerRef} className="relative z-10 w-full max-w-[600px]">
        
        {/* Header Text */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 text-center"
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6 bg-accent/10 backdrop-blur-sm border border-accent/20 rounded-full px-6 py-3"
            animate={{
              boxShadow: [
                '0 0 20px rgba(16, 185, 129, 0.2)',
                '0 0 40px rgba(16, 185, 129, 0.3)',
                '0 0 20px rgba(16, 185, 129, 0.2)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Shield className="text-accent" size={20} />
            <span className="text-accent font-semibold text-sm tracking-wider uppercase">
              Secure Authentication Portal
            </span>
          </motion.div>
          
          <h1 className="font-playfair text-7xl font-bold mb-4 bg-gradient-to-r from-white via-accent/90 to-emerald-400 bg-clip-text text-transparent leading-tight">
            Identity
            <br />
            Verification
          </h1>
          
          <p className="text-text-muted text-lg max-w-md mx-auto leading-relaxed">
            Advanced biometric monitoring system.
            <br />
            <span className="text-accent/80">Your presence is being observed.</span>
          </p>
        </motion.div>

        {/* Eyes Container */}
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative w-full flex items-center justify-center gap-12 mb-12"
        >
          {/* Left Eye */}
          <RealisticEye
            passwordFocused={passwordFocused}
            eyeX={eyeX}
            eyeY={eyeY}
            blinkState={blinkState}
          />
          
          {/* Right Eye */}
          <RealisticEye
            passwordFocused={passwordFocused}
            eyeX={eyeX}
            eyeY={eyeY}
            blinkState={blinkState}
          />
        </motion.div>

        {/* Status Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex justify-center gap-6"
        >
          {[
            { icon: Eye, label: 'TRACKING', active: true },
            { icon: Shield, label: 'SECURED', active: passwordFocused },
            { icon: Zap, label: 'ANALYZING', active: passwordFocused },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-2 bg-forest-800/30 backdrop-blur-sm border border-forest-divider/30 rounded-full px-4 py-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.1 }}
            >
              <motion.div
                animate={{
                  scale: item.active ? [1, 1.2, 1] : 1,
                  opacity: item.active ? [0.5, 1, 0.5] : 0.5,
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >
                <item.icon className={item.active ? 'text-accent' : 'text-white/50'} size={16} />
              </motion.div>
              <span className={`text-xs font-mono tracking-[0.12em] font-medium ${item.active ? 'text-accent' : 'text-white/50'}`}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

/* =========================
   🚪 Premium Login Form - KEPT UNCHANGED
========================= */
export const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError || !data.user) {
        throw authError ?? new Error('Authentication failed');
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Profile not found');
      }

      switch (profile.role) {
        case 'academia':
          navigate('/academia');
          break;
        case 'research':
          navigate('/research');
          break;
        default:
          throw new Error('Invalid user role');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 flex overflow-hidden relative">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Left Side – Eyes & Text */}
      <WatchingEyes passwordFocused={passwordFocused} />

      {/* Right Side – Login Form */}
      <div className="w-1/2 flex items-center justify-center px-12 z-10">
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-[520px]"
        >
          <div className="relative bg-gradient-to-br from-forest-800/60 via-forest-800/40 to-forest-900/60 backdrop-blur-2xl border border-accent/20 rounded-3xl p-12 shadow-[0_0_100px_rgba(16,185,129,0.15),0_20px_80px_rgba(0,0,0,0.6)]">
            
            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-accent/30 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-accent/30 rounded-br-3xl" />

            {/* Ambient Glow */}
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-accent/10 via-emerald-500/10 to-cyan-500/10 rounded-3xl blur-3xl -z-10"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="text-accent" size={32} />
                </motion.div>
                <h1 className="font-playfair text-5xl text-text-primary font-bold">
                  Welcome back
                </h1>
              </div>
              <p className="text-text-muted text-lg leading-relaxed">
                Your identity is being verified through our advanced
                <span className="text-accent font-semibold"> biometric monitoring system</span>.
              </p>
              {/* Error Display */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              >
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  required
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full bg-gradient-to-r from-accent via-emerald-500 to-accent bg-[length:200%_100%] text-white font-bold text-lg rounded-xl px-8 py-5 shadow-[0_0_30px_rgba(16,185,129,0.3)] disabled:opacity-50 overflow-hidden group"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                
                <span className="relative flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Access Portal
                      <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-10 pt-8 border-t border-accent/20 flex justify-between items-center">
              <Link
                to="/signup"
                className="text-sm font-semibold text-text-muted hover:text-accent flex items-center gap-2 transition-colors group"
              >
                Create new account
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <DoorOpen size={22} className="text-accent/60" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};