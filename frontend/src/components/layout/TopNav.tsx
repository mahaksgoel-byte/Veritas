import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { ChevronDown, BarChart3, Info, User, LogOut, FileCheck, Video, Users, Search, Inbox, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { fetchBaseProfile, fetchRoleProfile } from '../../lib/profileService';
import { ProfileModal } from './profile/ProfileModal';
import { UserRole } from '../../lib/profileService';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole | null;
  mode?: 'light' | 'dark';
}

export const TopNav: React.FC = React.memo(() => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileUpdateTrigger, setProfileUpdateTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userIdRef = useRef<string | null>(null);

  // FIX #5: Use refs for auth listener to avoid stale closures
  const profileRef = useRef<Profile | null>(null);
  const userIdStateRef = useRef<string | null>(null);

  // Refs for click-outside detection (FIX #2)
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // FIX #5: Keep all refs in sync with state
  useEffect(() => {
    userIdRef.current = userId;
    userIdStateRef.current = userId;
  }, [userId]);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  /* ================= NAVIGATION LINKS ================= */

  // FIX #3: Memoize navigation links so they don't recalculate on every render
  const navigationLinks = useMemo(() => {
    if (!profile?.role) return [];

    if (profile.role === 'mentor') {
      return [
        { icon: BarChart3, label: 'Analysis',      path: '/mentor' },
        { icon: LinkIcon,  label: 'Connect',        path: '/mentor/connect' },
        { icon: Inbox,     label: 'Submissions',    path: '/mentor/submissions' },
        { icon: Users,     label: 'Online Meeting', path: '/mentor/online-meeting' },
        { icon: FileCheck, label: 'Check Paper',    path: '/researcher/check-paper' },
        { icon: Info,      label: 'About',          path: '/about' },
      ];
    } else if (profile.role === 'researcher') {
      // FIX #4: Only check 'researcher' here since we normalize 'research' → 'researcher' on load
      return [
        { icon: BarChart3, label: 'Analysis',       path: '/researcher' },
        { icon: LinkIcon,  label: 'Connect',        path: '/researcher/connect' },
        { icon: FileCheck, label: 'Check Paper',    path: '/researcher/check-paper' },
        { icon: Video,     label: 'Video Analysis', path: '/researcher/video-analysis' },
        { icon: Users,     label: 'Online Meeting', path: '/researcher/online-meeting' },
        { icon: Info,      label: 'About',          path: '/about' },
      ];
    } else if (profile.role === 'admin') {
      return [
        { icon: BarChart3, label: 'Generation', path: '/admin' },
        { icon: Info,      label: 'About',      path: '/about' },
      ];
    }

    return [
      { icon: BarChart3, label: 'Analysis', path: '/' },
      { icon: Info,      label: 'About',    path: '/about' },
    ];
  }, [profile?.role]);

  /* ================= DERIVED VALUES ================= */

  const initials =
    profile?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  const getRoleLabel = (p: Profile | null): string => {
    if (!p?.role) return 'USER';
    if (p.role === 'mentor') return 'Mentor';
    if (p.role === 'researcher') return 'Researcher';
    if (p.role === 'admin') return 'Admin';
    return p.role;
  };

  const roleLabel = getRoleLabel(profile);

  /* ================= HELPERS ================= */

  // FIX #4: Normalize role variants (e.g. 'research' → 'researcher') on load
  const normalizeRole = (role: string | null): UserRole | null => {
    if (!role) return null;
    if (role === 'research') return 'researcher' as UserRole;
    return role as UserRole;
  };

  // Helper to build a full profile object from base + role data
  const buildFinalProfile = async (userId: string, profileData: any): Promise<Profile> => {
    const normalized = { ...profileData, role: normalizeRole(profileData.role) };
    const roleKey = normalized.role as 'admin' | 'mentor' | 'researcher' | null;
    if (roleKey && ['admin', 'mentor', 'researcher'].includes(roleKey)) {
      try {
        const { data: roleData, error: roleError } = await fetchRoleProfile(userId, roleKey);
        if (!roleError && roleData) Object.assign(normalized, roleData);
      } catch {
        // role profile fetch failed — proceed with base profile only
      }
    }
    return normalized as Profile;
  };

  /* ================= SEARCH ================= */

  const performSearch = useCallback(async (query: string, isMounted: () => boolean) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);

    try {
      let queryBuilder = supabase
        .from('profiles')
        .select('id, name, email, role')
        .ilike('name', `%${query}%`)
        .order('name', { ascending: true })
        .limit(8);

      if (userIdRef.current) {
        queryBuilder = queryBuilder.neq('id', userIdRef.current);
      }

      const { data, error } = await queryBuilder;

      // FIX #6: Guard against setState on unmounted component
      if (!isMounted()) return;

      if (error) {
        console.error('[Search] Supabase error code:', error.code, '| message:', error.message);
        setSearchResults([]);
        setShowSearchResults(true);
        return;
      }

      setSearchResults((data ?? []) as Profile[]);
      setShowSearchResults(true);
    } catch (err) {
      if (!isMounted()) return;
      console.error('[Search] Unexpected exception:', err);
      setSearchResults([]);
      setShowSearchResults(true);
    } finally {
      if (isMounted()) setSearchLoading(false);
    }
  }, []);

  // Track mounted state for search async guard (FIX #6)
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    searchDebounceRef.current = setTimeout(() => {
      performSearch(value, () => isMountedRef.current);
    }, 300);
  }, [performSearch]);

  const handleProfileClick = useCallback((profileId: string) => {
    setShowSearchResults(false);
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/profile/${profileId}`);
  }, [navigate]);

  /* ================= FETCH BASE PROFILE ================= */

  // FIX #1: Read userId from ref inside the effect to avoid stale closure,
  // and correctly depend on profileUpdateTrigger only (userId triggers via ref).
  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (cancelled) return;

      if (!authData.user) {
        setProfile(null);
        setUserId(null);
        localStorage.removeItem('veritas_profile');
        localStorage.removeItem('veritas_user_id');
        return;
      }

      const currentUserId = authData.user.id;

      // If a different user was previously loaded, clear stale cache
      if (userIdRef.current && userIdRef.current !== currentUserId) {
        localStorage.removeItem('veritas_profile');
        localStorage.removeItem('veritas_user_id');
        setProfile(null);
      }

      setUserId(currentUserId);

      const cachedProfile = localStorage.getItem('veritas_profile');
      const cachedUserId = localStorage.getItem('veritas_user_id');

      if (cachedProfile && cachedUserId === currentUserId) {
        try {
          if (!cancelled) setProfile(JSON.parse(cachedProfile));
          return;
        } catch {
          localStorage.removeItem('veritas_profile');
          localStorage.removeItem('veritas_user_id');
        }
      }

      try {
        const { data: profileData, error } = await fetchBaseProfile(currentUserId);
        if (cancelled) return;

        if (error || !profileData) {
          setProfile({ id: currentUserId, name: 'User', email: 'user@example.com', role: null, mode: 'dark' });
          return;
        }

        const finalProfile = await buildFinalProfile(currentUserId, profileData);
        if (cancelled) return;

        setProfile(finalProfile);
        localStorage.setItem('veritas_profile', JSON.stringify(finalProfile));
        localStorage.setItem('veritas_user_id', currentUserId);
      } catch {
        if (!cancelled) {
          setProfile({ id: currentUserId, name: 'User', email: 'user@example.com', role: null, mode: 'dark' });
        }
      }
    };

    loadProfile();
    return () => { cancelled = true; };
  }, [profileUpdateTrigger]); // profileUpdateTrigger is the only external trigger needed

  /* ================= AUTH STATE LISTENER ================= */

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // FIX #5: Use refs instead of stale closure state
        const currentUserId = userIdStateRef.current;
        const currentProfile = profileRef.current;

        if (currentUserId !== session.user.id || !currentProfile) {
          localStorage.removeItem('veritas_profile');
          localStorage.removeItem('veritas_user_id');
          setProfile(null);
          setUserId(null);

          try {
            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('timeout')), 3000)
            );
            const { data: profileData, error } = await Promise.race([
              fetchBaseProfile(session.user.id),
              timeoutPromise,
            ]) as any;

            if (!error && profileData) {
              const finalProfile = await buildFinalProfile(session.user.id, profileData);
              setProfile(finalProfile);
              setUserId(session.user.id);
              localStorage.setItem('veritas_profile', JSON.stringify(finalProfile));
              localStorage.setItem('veritas_user_id', session.user.id);
            } else {
              setProfile({ id: session.user.id, name: 'User', email: 'user@example.com', role: null, mode: 'dark' });
              setUserId(session.user.id);
            }
          } catch {
            setProfile({ id: session.user.id, name: 'User', email: 'user@example.com', role: null, mode: 'dark' });
            setUserId(session.user.id);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setUserId(null);
        localStorage.removeItem('veritas_profile');
        localStorage.removeItem('veritas_user_id');
      }
    });
    return () => subscription.unsubscribe();
  }, []); // Safe now — uses refs internally

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setProfile(null);
      setUserId(null);
      localStorage.removeItem('veritas_profile');
      localStorage.removeItem('veritas_user_id');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  /* ================= CLICK OUTSIDE (FIX #2) ================= */

  // Use ref.contains() instead of stopPropagation — reliable and non-fragile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  /* ================= RENDER ================= */

  return (
    <>
      <header className="h-20 bg-forest-900 px-8 flex items-center justify-between border-b border-forest-divider/30">

        {/* Brand */}
        <div className="flex items-center">
          <h1 className="font-playfair text-xl text-text-primary tracking-wide">
            Veritas<span className="text-accent">.</span>
          </h1>
        </div>

        {/* Search Bar — FIX #2: attach ref for click-outside */}
        <div ref={searchRef} className="relative flex-1 max-w-md mx-8">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim() && (searchResults.length > 0 || showSearchResults)) {
                  setShowSearchResults(true);
                }
              }}
              placeholder="Search profiles by name..."
              className="w-full pl-12 pr-4 py-2 bg-forest-800/50 border border-forest-divider/50 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent/50 focus:bg-forest-800/70 transition-colors"
            />

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showSearchResults && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute top-full left-0 right-0 mt-2 bg-forest-800/95 backdrop-blur-lg border border-forest-divider/50 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3),0_0_20px_rgba(16,185,129,0.1)] z-50 max-h-80 overflow-y-auto"
                >
                  {searchLoading ? (
                    <div className="px-4 py-6 text-center">
                      <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-text-muted text-sm">Searching...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <motion.button
                        key={result.id}
                        whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                        onClick={() => handleProfileClick(result.id)}
                        className="w-full text-left px-4 py-3 hover:bg-accent/10 transition-colors border-b border-forest-divider/20 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-text-primary font-medium">{result.name}</p>
                            <p className="text-text-muted text-sm">{result.email}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.role === 'mentor'     ? 'bg-blue-500/20 text-blue-400' :
                            result.role === 'admin'      ? 'bg-purple-500/20 text-purple-400' :
                            result.role === 'researcher' ? 'bg-green-500/20 text-green-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {result.role}
                          </span>
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <Search className="text-text-muted mx-auto mb-2" size={24} />
                      <p className="text-text-muted text-sm">No profiles found</p>
                      <p className="text-text-muted/60 text-xs mt-1">Try a different name</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1">
          {navigationLinks.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`
                  group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-300 relative overflow-hidden
                  ${isActive
                    ? 'bg-gradient-to-r from-accent/20 via-accent/10 to-transparent text-accent shadow-lg shadow-accent/10'
                    : 'text-text-muted hover:bg-forest-800/60 hover:text-text-primary'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent rounded-t-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                )}
                <Icon
                  size={16}
                  className={`transition-all duration-300 ${
                    isActive ? 'text-accent' : 'group-hover:text-accent group-hover:scale-110'
                  }`}
                />
                <span className={`transition-all duration-300 ${isActive ? 'font-semibold' : ''}`}>
                  {label}
                </span>
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile Dropdown — FIX #2: attach ref for click-outside */}
        {profile && (
          <div className="relative" ref={dropdownRef}>
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setDropdownOpen((prev) => !prev)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 rounded-full bg-forest-800 flex items-center justify-center text-xs font-serif text-accent border border-forest-divider">
                {initials}
              </div>
              <div className="text-right">
                <p className="text-sm text-text-primary">{profile.name || 'User'}</p>
                <p className="text-[10px] text-text-muted uppercase">{roleLabel}</p>
              </div>
              <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} className="text-text-muted" />
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-2 w-48 bg-forest-800/95 backdrop-blur-lg border border-forest-divider/50 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3),0_0_20px_rgba(16,185,129,0.1)] z-50"
                >
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                    onClick={() => { setProfileModalOpen(true); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 group"
                  >
                    <User size={16} className="text-text-muted group-hover:text-accent transition-colors" />
                    <span className="text-sm text-text-primary group-hover:text-accent transition-colors">My Profile</span>
                  </motion.button>

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

      {/* FIX #7: Allow ProfileModal for any authenticated user, not just those with a role */}
      {profile && userId && (
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