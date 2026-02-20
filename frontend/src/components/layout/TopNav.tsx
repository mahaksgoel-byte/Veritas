import React, { useEffect, useState } from 'react';
import { ChevronDown, BarChart3, Info, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { fetchBaseProfile, fetchRoleProfile } from '../../lib/profileService';
import { ProfileModal } from './profile/ProfileModal';
import { UserRole } from '../../lib/profileService';

interface Profile {
  name: string;
  email: string;
  role: UserRole | null;
  mode?: 'light' | 'dark';
}

export const TopNav: React.FC = React.memo(() => {
  console.log('TopNav component rendering...');
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileUpdateTrigger, setProfileUpdateTrigger] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation links based on user role
  const getNavigationLinks = () => {
    if (!profile?.role) return [];
    
    if (profile.role === 'mentor') {
      return [
        { icon: BarChart3, label: 'Analysis', path: '/mentor' },
        { icon: Info, label: 'About', path: '/about' },
      ];
    } else if (profile.role === 'researcher' || profile.role === 'research') {
      return [
        { icon: BarChart3, label: 'Analysis', path: '/researcher' },
        { icon: Info, label: 'About', path: '/about' },
      ];
    } else if (profile.role === 'admin') {
      return [
        { icon: BarChart3, label: 'Generation', path: '/admin' },
        { icon: Info, label: 'About', path: '/about' },
      ];
    }
    
    // Default fallback for any other role
    return [
      { icon: BarChart3, label: 'Analysis', path: '/' },
      { icon: Info, label: 'About', path: '/about' },
    ];
  };

  const navigationLinks = getNavigationLinks();
  console.log('Navigation Links:', navigationLinks);
  console.log('Current Path:', location.pathname);
  console.log('Profile Role:', profile?.role);

  /* ================= FETCH BASE PROFILE ================= */

  useEffect(() => {
    const loadProfile = async () => {
      console.log('Loading profile...');
      
      // Get current auth user first
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        console.log('No authenticated user found');
        setProfile(null);
        setUserId(null);
        // Clear cache if no user is authenticated
        localStorage.removeItem('veritas_profile');
        localStorage.removeItem('veritas_user_id');
        return;
      }

      const currentUserId = authData.user.id;
      console.log('Current user ID:', currentUserId);
      
      // Clear previous user's data if user changed
      if (userId && userId !== currentUserId) {
        console.log('User changed, clearing previous data');
        localStorage.removeItem('veritas_profile');
        localStorage.removeItem('veritas_user_id');
        setProfile(null);
      }

      setUserId(currentUserId);

      // Try to get profile from local storage first
      const cachedProfile = localStorage.getItem('veritas_profile');
      const cachedUserId = localStorage.getItem('veritas_user_id');
      
      if (cachedProfile && cachedUserId === currentUserId) {
        try {
          const parsedProfile = JSON.parse(cachedProfile);
          setProfile(parsedProfile);
          console.log('Profile loaded from cache:', parsedProfile);
          return;
        } catch (err) {
          console.error('Error parsing cached profile:', err);
          localStorage.removeItem('veritas_profile');
          localStorage.removeItem('veritas_user_id');
        }
      }

      // Fetch fresh data from database
      try {
        const { data: profileData, error } = await fetchBaseProfile(currentUserId);
        if (error) {
          console.error('Profile fetch error:', error);
          setProfile({
            name: 'User',
            email: 'user@example.com',
            role: null,
            mode: 'dark'
          });
        } else {
          console.log('Profile data fetched from DB:', profileData);
          
          const finalProfile = profileData;
          
          // Fetch role-specific profile data
          if (profileData.role === 'admin') {
            try {
              const { data: roleData, error: roleError } = await fetchRoleProfile(currentUserId, 'admin');
              if (!roleError && roleData) {
                console.log('Admin role data fetched:', roleData);
                Object.assign(finalProfile, roleData);
              } else {
                console.log('Admin role table not found or error fetching, using base profile only');
              }
            } catch (roleErr) {
              console.log('Admin role fetch failed, using base profile only:', roleErr);
            }
          } else if (profileData.role === 'mentor') {
            try {
              const { data: roleData, error: roleError } = await fetchRoleProfile(currentUserId, 'mentor');
              if (!roleError && roleData) {
                console.log('Mentor role data fetched:', roleData);
                Object.assign(finalProfile, roleData);
              } else {
                console.log('Mentor role table not found or error fetching, using base profile only');
              }
            } catch (roleErr) {
              console.log('Mentor role fetch failed, using base profile only:', roleErr);
            }
          } else if (profileData.role === 'researcher') {
            try {
              const { data: roleData, error: roleError } = await fetchRoleProfile(currentUserId, 'researcher');
              if (!roleError && roleData) {
                console.log('Researcher role data fetched:', roleData);
                Object.assign(finalProfile, roleData);
              } else {
                console.log('Researcher role table not found or error fetching, using base profile only');
              }
            } catch (roleErr) {
              console.log('Researcher role fetch failed, using base profile only:', roleErr);
            }
          }
          
          setProfile(finalProfile);
          // Cache profile data with current user ID
          localStorage.setItem('veritas_profile', JSON.stringify(finalProfile));
          localStorage.setItem('veritas_user_id', currentUserId);
        }
      } catch (err) {
        console.error('Profile fetch exception:', err);
        setProfile({
          name: 'User',
          email: 'user@example.com',
          role: null,
          mode: 'dark'
        });
      }
    };

    loadProfile();
  }, [profileUpdateTrigger]); // Run on mount and when profile update is triggered

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Only clear cache if it's a different user or no profile exists
          if (userId !== session.user.id || !profile) {
            console.log('New user or no profile, clearing cache and reloading');
            localStorage.removeItem('veritas_profile');
            localStorage.removeItem('veritas_user_id');
            setProfile(null);
            setUserId(null);
            
            // Load fresh profile data
            try {
              console.log('Fetching base profile for user:', session.user.id);
              
              // Add timeout to detect hanging requests
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Profile fetch timeout')), 100);
              });
              
              const profilePromise = fetchBaseProfile(session.user.id);
              const { data: profileData, error } = await Promise.race([profilePromise, timeoutPromise]) as any;
              
              console.log('Base profile fetch result:', { profileData, error });
              
              if (!error && profileData) {
                console.log('Profile data found:', profileData);
                const finalProfile = profileData;
                
                // Fetch role-specific data
                if (profileData.role === 'admin') {
                  const { data: roleData } = await fetchRoleProfile(session.user.id, 'admin');
                  if (roleData) Object.assign(finalProfile, roleData);
                } else if (profileData.role === 'mentor') {
                  const { data: roleData } = await fetchRoleProfile(session.user.id, 'mentor');
                  if (roleData) Object.assign(finalProfile, roleData);
                } else if (profileData.role === 'researcher') {
                  const { data: roleData } = await fetchRoleProfile(session.user.id, 'researcher');
                  if (roleData) Object.assign(finalProfile, roleData);
                }
                
                console.log('Final profile to set:', finalProfile);
                setProfile(finalProfile);
                setUserId(session.user.id);
                localStorage.setItem('veritas_profile', JSON.stringify(finalProfile));
                localStorage.setItem('veritas_user_id', session.user.id);
              } else {
                console.error('No profile data found or error:', error);
                // Set default profile
                const defaultProfile = {
                  name: 'User',
                  email: 'user@example.com',
                  role: null,
                  mode: 'dark' as const
                };
                setProfile(defaultProfile);
                setUserId(session.user.id);
              }
            } catch (err) {
              console.error('Error loading profile after sign in:', err);
              // Set default profile even on error
              const defaultProfile = {
                name: 'User',
                email: 'user@example.com',
                role: null,
                mode: 'dark' as const
              };
              setProfile(defaultProfile);
              setUserId(session.user.id);
            }
          } else {
            console.log('Same user already loaded, skipping');
          }
        } else if (event === 'SIGNED_OUT') {
          // Clear everything on sign out
          setProfile(null);
          setUserId(null);
          localStorage.removeItem('veritas_profile');
          localStorage.removeItem('veritas_user_id');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Function to clear cache when profile is updated (call this from profile modal)
  const clearProfileCache = () => {
    console.log('Clearing profile cache...');
    localStorage.removeItem('veritas_profile');
    localStorage.removeItem('veritas_user_id');
    // Trigger profile reload by incrementing the trigger
    setProfileUpdateTrigger(prev => prev + 1);
  };

  // Make this function available globally for profile updates
  useEffect(() => {
    (window as any).clearProfileCache = clearProfileCache;
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await supabase.auth.signOut();
      // Clear local storage and state
      localStorage.removeItem('veritas_profile');
      localStorage.removeItem('veritas_user_id');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Clear state
      setProfile(null);
      setUserId(null);
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear state and redirect even if there's an error
      setProfile(null);
      setUserId(null);
      localStorage.removeItem('veritas_profile');
      localStorage.removeItem('veritas_user_id');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  /* ================= DERIVED VALUES ================= */

  const initials =
    profile?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  const getRoleLabel = (profile: Profile | null): string => {
    if (!profile?.role) return 'USER';
    if (profile.role === 'mentor') return 'Mentor';
    if (profile.role === 'researcher') return 'Researcher';
    if (profile.role === 'admin') return 'Admin';
    return profile.role;
  };

  const roleLabel = getRoleLabel(profile);

  return (
    <>
      <header className="h-20 bg-forest-900 px-8 flex items-center justify-between border-b border-forest-divider/30">
        {/* Brand */}
        <div className="flex items-center">
          <h1 className="font-playfair text-xl text-text-primary tracking-wide">
            Veritas<span className="text-accent">.</span>
          </h1>
        </div>
        
        {/* Navigation Links - Centered */}
        <nav className="flex items-center gap-1">
          {navigationLinks.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;

            return (
              <Link
                key={path}
                to={path}
                onClick={() => {
                  console.log(`Clicked ${label} - navigating to: ${path}`);
                  console.log('Current role:', profile?.role);
                }}
                className={`
                  group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden
                  ${isActive
                    ? "bg-gradient-to-r from-accent/20 via-accent/10 to-transparent text-accent shadow-lg shadow-accent/10"
                    : "text-text-muted hover:bg-forest-800/60 hover:text-text-primary"
                  }
                `}
              >
                {/* Horizontal Active Indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent rounded-t-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                )}
                
                <Icon
                  size={16}
                  className={`
                    transition-all duration-300
                    ${isActive ? "text-accent" : "group-hover:text-accent group-hover:scale-110"}
                  `}
                />
                <span className={`
                  transition-all duration-300
                  ${isActive && "font-semibold"}
                `}>
                  {label}
                </span>

                {/* Hover Glow Effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile Dropdown */}
        {profile && (
          <div className="relative">
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 rounded-full bg-forest-800 flex items-center justify-center text-xs font-serif text-accent border border-forest-divider">
                {profile?.name ? initials : 'U'}
              </div>

              <div className="text-right">
                <p className="text-sm text-text-primary">{profile?.name || 'User'}</p>
                <p className="text-[10px] text-text-muted uppercase">
                  {roleLabel}
                </p>
              </div>

              <motion.div
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} className="text-text-muted" />
              </motion.div>
            </motion.div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-48 bg-forest-800/95 backdrop-blur-lg border border-forest-divider/50 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3),0_0_20px_rgba(16,185,129,0.1)] z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* My Profile */}
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                    onClick={() => {
                      setProfileModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 group"
                  >
                    <User size={16} className="text-text-muted group-hover:text-accent transition-colors" />
                    <span className="text-sm text-text-primary group-hover:text-accent transition-colors">My Profile</span>
                  </motion.button>

                  
                  {/* Logout */}
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 group border-t border-forest-divider/30"
                  >
                    <LogOut size={16} className="text-text-muted group-hover:text-red-400 transition-colors" />
                    <span className="text-sm text-text-primary group-hover:text-red-400 transition-colors">Logout</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </header>

      {/* Profile Modal */}
      {profile && userId && profile.role && (
        <ProfileModal
          open={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          userId={userId}
          role={profile.role}
        />
      )}

    </>
  );
});
