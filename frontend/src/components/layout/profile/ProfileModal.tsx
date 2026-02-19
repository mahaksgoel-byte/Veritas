import React, { useEffect, useState, useRef } from 'react';
import { X, Sparkles, User, Edit3, Save, Shield, Camera, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchRoleProfile,
  saveRoleProfile,
  updateBaseProfile,
  fetchBaseProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  getProfilePictureUrl,
  UserRole,
} from '../../../lib/profileService';
import { RoleProfileForm } from './RoleProfileForm';

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  role: UserRole;
}

export const ProfileModal: React.FC<Props> = ({
  open,
  onClose,
  userId,
  role,
}) => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [uploadingPfp, setUploadingPfp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ================= FETCH ROLE PROFILE ================= */

  useEffect(() => {
    if (!open) return;

    const loadProfile = async () => {
      setLoading(true);
      
      // Fetch both base profile and role profile data
      const [baseResponse, roleResponse] = await Promise.all([
        fetchBaseProfile(userId),
        fetchRoleProfile(userId, role)
      ]);
      
      console.log('Base profile response:', baseResponse);
      console.log('Role profile response:', roleResponse);
      
      // Extract data properly from Supabase responses
      const baseData = baseResponse.data || {};
      const roleData = roleResponse.data || {};
      
      console.log('Extracted base data:', baseData);
      console.log('Extracted role data:', roleData);
      
      // Set profile picture URL if it exists
      if ((baseData as any).pfp) {
        setProfilePictureUrl((baseData as any).pfp);
      } else {
        // Don't try to get URL from storage - keep it null
        setProfilePictureUrl(null);
      }
      
      // Merge the data, with role data taking precedence for any overlapping fields
      const mergedData = {
        ...baseData,
        ...roleData
      };
      
      console.log('Merged form data:', mergedData);
      setFormData(mergedData);
      setLoading(false);
    };

    loadProfile();
  }, [open, role, userId]);

  /* ================= HANDLERS ================= */

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingPfp(true);
      const publicUrl = await uploadProfilePicture(userId, file);
      
      // Update both local state and form data
      setProfilePictureUrl(publicUrl);
      setFormData(prev => ({ ...prev, pfp: publicUrl }));
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture');
    } finally {
      setUploadingPfp(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      setUploadingPfp(true);
      await deleteProfilePicture(userId);
      
      // Update form data to remove pfp
      setFormData(prev => ({ ...prev, pfp: null }));
      setProfilePictureUrl(null);
    } catch (error) {
      console.error('Error removing profile picture:', error);
      alert('Failed to remove profile picture');
    } finally {
      setUploadingPfp(false);
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    
    // Separate base profile data from role-specific data
    const baseProfileData = {
      name: formData.name,
      email: formData.email,
      role: role, // Also update the role in profiles table
      pfp: formData.pfp // Include profile picture URL
    };
    
    // Remove name, email, and role from role data to avoid conflicts
    const roleData = { ...formData };
    delete roleData.name;
    delete roleData.email;
    delete roleData.role;

    console.log('Saving base profile data:', baseProfileData);
    console.log('Saving role data:', roleData);

    try {
      // Save both base profile and role profile
      await Promise.all([
        updateBaseProfile(userId, baseProfileData),
        saveRoleProfile(userId, role, roleData)
      ]);
      
      // Clear the cached profile to force refresh on next load
      if ((window as any).clearProfileCache) {
        (window as any).clearProfileCache();
      }
      
      setSaveStatus('success');
      
      setTimeout(() => {
        setEditing(false);
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
      
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 dark:bg-black/40 light:bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dark:bg-forest-900 light:bg-light-100 dark:border dark:border-accent/20 light:border light:border-light-divider/30 rounded-3xl p-1 dark:shadow-2xl light:shadow-lg">
              {/* Enhanced Decorative Corners */}
              <div className="absolute top-2 left-2 w-16 h-16 dark:border-l-2 dark:border-t-2 dark:border-accent/30 light:border-l-2 light:border-t-2 light:border-light-accent/30 rounded-tl-2xl" />
              <div className="absolute bottom-2 right-2 w-16 h-16 dark:border-r-2 dark:border-b-2 dark:border-accent/30 light:border-r-2 light:border-b-2 light:border-light-accent/30 rounded-br-2xl" />
              
              {/* Enhanced Ambient Glow */}
              <motion.div
                className="absolute -inset-3 bg-gradient-to-r from-accent/10 via-emerald-500/10 to-cyan-500/10 rounded-3xl blur-3xl -z-10"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              <div className="relative dark:bg-forest-900 light:bg-light-100 p-8 rounded-b-3xl flex-grow overflow-y-auto custom-scrollbar">
                {/* Header */}
                <div className="sticky top-0 dark:bg-gradient-to-r dark:from-forest-900 dark:to-forest-800 light:bg-gradient-to-r light:from-light-200 light:to-light-100 dark:border-b dark:border-forest-divider/30 light:border-b light:border-light-divider/30 px-8 py-6 flex justify-between items-center rounded-t-3xl">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="relative group"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Profile Picture Container */}
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent/30 bg-gradient-to-br from-accent/20 via-emerald-500/20 to-cyan-500/20">
                        {profilePictureUrl ? (
                          <motion.img
                            src={profilePictureUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User size={20} className="text-accent" />
                          </div>
                        )}
                      </div>
                      
                      {/* Upload/Remove Button Overlay */}
                      {editing && (
                        <motion.div
                          className="absolute inset-0 w-12 h-12 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (profilePictureUrl) {
                              handleRemoveProfilePicture();
                            } else {
                              fileInputRef.current?.click();
                            }
                          }}
                        >
                          {uploadingPfp ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles size={16} className="text-white" />
                            </motion.div>
                          ) : profilePictureUrl ? (
                            <X size={16} className="text-white" />
                          ) : (
                            <Camera size={16} className="text-white" />
                          )}
                        </motion.div>
                      )}
                      
                      {/* Animated Sparkle */}
                      <motion.div
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles size={10} className="text-white" />
                      </motion.div>
                    </motion.div>
                    
                    {/* Hidden File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                    <div>
                      <h2 
                        className="text-2xl font-playfair text-text-primary font-bold"
                      >
                        Profile Details
                      </h2>
                      <div 
                        className="flex items-center gap-2 mt-1"
                      >
                        <Shield size={12} className="text-accent" />
                        <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                          {role.charAt(0).toUpperCase() + role.slice(1)} Profile
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!editing && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setEditing(true)}
                        className="px-4 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 text-sm font-semibold transition-all duration-200 flex items-center gap-2"
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="p-2 hover:bg-forest-700/50 rounded-lg transition-all duration-200 group"
                    >
                      <X size={16} className="text-text-muted group-hover:text-accent transition-colors" />
                    </motion.button>
                  </div>
                </div>

                {/* Minimal Success Message */}
                <AnimatePresence>
                  {saveStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="fixed top-32 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md z-50"
                    >
                      <Check size={12} />
                      <span className="text-xs font-medium">Profile updated</span>
                    </motion.div>
                  )}
                  {saveStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="fixed top-32 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md z-50"
                    >
                      <X size={12} />
                      <span className="text-xs font-medium">Save failed</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Body */}
                <div className="p-6 relative">
                  {loading ? (
                    <motion.div 
                      className="flex items-center justify-center py-16"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex flex-col items-center gap-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 via-emerald-500/20 to-cyan-500/20 flex items-center justify-center"
                        >
                          <Sparkles size={24} className="text-accent" />
                        </motion.div>
                        <motion.p 
                          className="text-text-muted text-sm font-medium"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Loading profile…
                        </motion.p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-8">
                      <RoleProfileForm
                        role={role}
                        data={formData}
                        editing={editing}
                        onChange={updateField}
                      />
                    </div>
                  )}

                  {/* Actions */}
                  {editing && (
                    <motion.div 
                      className="mt-4 pt-4 border-t border-forest-divider/30 flex justify-end gap-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setEditing(false)}
                        className="px-4 py-2 rounded-lg bg-forest-800/50 border border-forest-divider/50 text-text-muted hover:text-text-primary hover:bg-forest-800 transition-all duration-200 flex items-center gap-2"
                      >
                        <X size={14} />
                        <span>Cancel</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        disabled={saveStatus === 'saving'}
                        className="px-5 py-2 rounded-lg bg-gradient-to-r from-accent via-emerald-500 to-accent text-black font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {saveStatus === 'saving' ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles size={14} className="text-black" />
                            </motion.div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save size={14} />
                            <span>Save</span>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};