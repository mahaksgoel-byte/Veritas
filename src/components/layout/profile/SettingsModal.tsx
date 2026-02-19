import React, { useState } from 'react';
import { X, GraduationCap, Microscope, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { UserRole, updateUserMode } from '../../../lib/profileService';
import { useTheme } from '../../../contexts/ThemeContext';

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  currentRole: UserRole;
}

export const SettingsModal: React.FC<Props> = ({
  open,
  onClose,
  userId,
  currentRole,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const { mode } = useTheme();

  const handleRoleChange = async () => {
    if (selectedRole === currentRole) {
      onClose(); // Close if no change
      return;
    }

    setLoading(true);
    setSaveStatus('saving');

    try {
      // Update role in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', userId);

      if (error) {
        console.error('Role update error:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        console.log('Role updated successfully');
        setSaveStatus('success');
        
        // Update mode in profiles table
        await updateUserMode(userId, mode);

        // Clear cache to force refresh
        if ((window as any).clearProfileCache) {
          (window as any).clearProfileCache();
        }

        // Sign out and redirect to login
        setTimeout(async () => {
          await supabase.auth.signOut();
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error) {
      console.error('Role change exception:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: 'academia' as UserRole,
      label: 'Academia',
      description: 'Students & Educators',
      icon: GraduationCap,
      color: 'from-emerald-500 to-cyan-500'
    },
    {
      value: 'research' as UserRole,
      label: 'Research',
      description: 'Researchers & Mentors',
      icon: Microscope,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 dark:bg-black/60 light:bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dark:bg-forest-900 light:bg-light-100 dark:border dark:border-forest-divider/30 light:border light:border-light-divider/30 rounded-2xl dark:shadow-2xl light:shadow-lg">
              {/* Header */}
              <div className="px-6 py-4 dark:border-b dark:border-forest-divider/30 light:border-b light:border-light-divider/30 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-playfair text-text-primary">Settings</h2>
                  <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Account Configuration</p>
                </div>
                <button
                  onClick={onClose}
                  className="dark:p-2 dark:hover:bg-forest-800 light:p-2 light:hover:bg-light-200 rounded-lg transition-colors"
                >
                  <X size={18} className="text-text-muted" />
                </button>
              </div>

              {/* Success/Error Messages */}
              <AnimatePresence>
                {saveStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-accent/90 text-white px-4 py-2 rounded-lg shadow-lg z-50"
                  >
                    <Check size={16} className="mr-2" />
                    <span className="font-medium">Role updated! Redirecting...</span>
                  </motion.div>
                )}
                {saveStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
                  >
                    <AlertCircle size={16} className="mr-2" />
                    <span className="font-medium">Failed to update role</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Body */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-playfair text-text-primary mb-4">Change Role</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roleOptions.map((role) => {
                      const isSelected = selectedRole === role.value;
                      const isCurrent = currentRole === role.value;
                      
                      return (
                        <motion.button
                          key={role.value}
                          whileHover={{ scale: isSelected ? 1 : 1.02 }}
                          whileTap={{ scale: isSelected ? 1 : 0.98 }}
                          onClick={() => setSelectedRole(role.value)}
                          className={`
                            relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 text-left min-h-[100px]
                            ${isSelected 
                              ? 'border-accent bg-accent/20 text-accent shadow-lg' 
                              : 'border-forest-divider/50 bg-forest-800/50 hover:border-accent/50 hover:bg-forest-700/50'
                            }
                          `}
                        >
                                                    
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-accent/30' : 'bg-forest-700'}`}>
                              <role.icon size={18} className={isSelected ? 'text-accent' : 'text-accent'} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-text-primary truncate">{role.label}</div>
                              <div className="text-xs text-text-muted truncate leading-tight mt-0.5">{role.description}</div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-forest-divider/30">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 border border-forest-divider/50 text-text-primary rounded-lg hover:bg-forest-800 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleRoleChange}
                    disabled={loading || selectedRole === currentRole}
                    className="flex-1 px-4 py-2.5 bg-accent/90 text-forest-900 font-medium rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-forest-900/30 border-t-transparent rounded-full"
                        />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>{selectedRole === currentRole ? 'No Change' : 'Update Role'}</span>
                        {selectedRole !== currentRole && <Check size={16} />}
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
