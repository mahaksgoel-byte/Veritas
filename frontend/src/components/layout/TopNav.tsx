import React, { useEffect, useState } from 'react';
import { ChevronDown, BarChart3, Info, Star, CreditCard, User, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { fetchBaseProfile } from '../../lib/profileService';
import { ProfileModal } from './profile/ProfileModal';
import { SettingsModal } from './profile/SettingsModal';
import { UserRole } from '../../lib/profileService';

interface Profile {
  name: string;
  email: string;
  role: UserRole | null;
  mode?: 'light' | 'dark';
}

export const TopNav: React.FC = React.memo(() => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation links based on user role
  const getNavigationLinks = () => {
    if (!profile?.role) return [];
    
    if (profile.role === 'academia') {
      return [
        { icon: BarChart3, label: 'Analysis', path: '/academia' },
        { icon: Info, label: 'About', path: '/about' },
        { icon: Star, label: 'Reviews', path: '/reviews' },
        { icon: CreditCard, label: 'Subscription', path: '/subscription' },
      ];
    } else {
      return [
        { icon: BarChart3, label: 'Analysis', path: '/research' },
        { icon: Info, label: 'About', path: '/about' },
        { icon: Star, label: 'Reviews', path: '/reviews' },
        { icon: CreditCard, label: 'Subscription', path: '/subscription' }
      ];
    }
  };

  const navigationLinks = getNavigationLinks();

  /* ================= FETCH BASE PROFILE ================= */

  useEffect(() => {
    const loadProfile = async () => {
      // Check if profile is already loaded to prevent re-fetching
      if (profile) return;

      // First, try to get profile from local storage
      const cachedProfile = localStorage.getItem('veritas_profile');
      const cachedUserId = localStorage.getItem('veritas_user_id');
      
      if (cachedProfile && cachedUserId) {
        try {
          const parsedProfile = JSON.parse(cachedProfile);
          setProfile(parsedProfile);
          setUserId(cachedUserId);
          console.log('Profile loaded from cache:', parsedProfile);
          return; // Skip database fetch
        } catch (err) {
          console.error('Error parsing cached profile:', err);
          // Clear corrupted cache
          localStorage.removeItem('veritas_profile');
          localStorage.removeItem('veritas_user_id');
        }
      }

      // If no cached data or cache is corrupted, fetch from database
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        console.log('No user found in auth');
        return;
      }

      console.log('User ID:', data.user.id);
      setUserId(data.user.id);

      try {
        const { data: profileData, error } = await fetchBaseProfile(data.user.id);
        if (error) {
          console.error('Profile fetch error:', error);
          // Set a default profile when fetch fails so TopNav still shows
          setProfile({
            name: 'User',
            email: 'user@example.com',
            role: null,
            mode: 'dark' // Default to dark mode
          });
        } else {
          console.log('Profile data fetched from DB:', profileData);
          setProfile(profileData);
          // Cache profile data
          localStorage.setItem('veritas_profile', JSON.stringify(profileData));
          localStorage.setItem('veritas_user_id', data.user.id);
        }
      } catch (err) {
        console.error('Profile fetch exception:', err);
        // Set a default profile when exception occurs
        setProfile({
          name: 'User',
          email: 'user@example.com',
          role: null,
          mode: 'dark' // Default to dark mode
        });
      }
    };

    loadProfile();
  }, []); // Empty dependency array ensures this runs only once

  // Function to clear cache when profile is updated (call this from profile modal)
  const clearProfileCache = () => {
    localStorage.removeItem('veritas_profile');
    localStorage.removeItem('veritas_user_id');
  };

  // Make this function available globally for profile updates
  useEffect(() => {
    (window as any).clearProfileCache = clearProfileCache;
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Clear local storage
      localStorage.removeItem('veritas_profile');
      localStorage.removeItem('veritas_user_id');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
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
    if (profile.role === 'academia') return 'Academia';
    if (profile.role === 'research') return 'Research';
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

                  {/* Settings */}
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                    onClick={() => {
                      setSettingsModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 group border-t border-forest-divider/30"
                  >
                    <Settings size={16} className="text-text-muted group-hover:text-accent transition-colors" />
                    <span className="text-sm text-text-primary group-hover:text-accent transition-colors">Settings</span>
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

      {/* Settings Modal */}
      {profile && userId && profile.role && (
        <SettingsModal
          open={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          userId={userId}
          currentRole={profile.role}
        />
      )}
    </>
  );
});
