import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Check, AlertCircle, Save, Shield, Microscope, GraduationCap } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { UserRole } from '../../lib/profileService';
import { Section, Grid, Input, Button } from '../ui';
import { createNewUser, CreateUserRequest } from '../../lib/adminService';

interface FormData {
  // Basic user info
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: UserRole;
  orcid: string;
}

const initialFormData: FormData = {
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  role: 'researcher',
  orcid: ''
};

interface UserCreationFormProps {
  onUserCreated?: () => void;
}

export const UserCreationForm: React.FC<UserCreationFormProps> = ({ onUserCreated }) => {
  const { mode } = useTheme();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // ORCID validation (optional but if provided, should be valid format)
    if (formData.orcid && !/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(formData.orcid)) {
      newErrors.orcid = 'Please enter a valid ORCID ID format (0000-0000-0000-0000)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const request: CreateUserRequest = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        orcid: formData.orcid
      };

      const result = await createNewUser(request);
      
      if (result.success) {
        setSubmitStatus('success');
        // Reset form after successful creation
        setTimeout(() => {
          setFormData(initialFormData);
          setSubmitStatus('idle');
          onUserCreated?.();
        }, 2000);
      }
    } catch (error) {
      console.error('User creation failed:', error);
      setSubmitStatus('error');
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Failed to create user' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-4xl mx-auto p-6 rounded-2xl border ${
        mode === 'dark' 
          ? 'bg-forest-800/50 border-forest-divider/50' 
          : 'bg-light-200/50 border-light-divider/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <motion.div
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-emerald-500/20 flex items-center justify-center border border-accent/30"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <UserPlus size={20} className="text-accent" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-playfair text-text-primary font-bold">
            Create New User
          </h2>
          <p className="text-text-muted text-sm">
            Add a new user to the system with their role and profile information
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-3"
          >
            <Check size={20} className="text-green-400" />
            <span className="text-green-100">User created successfully!</span>
          </motion.div>
        )}
        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3"
          >
            <AlertCircle size={20} className="text-red-400" />
            <span className="text-red-100">{errors.submit || 'Failed to create user'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <Section title="User Credentials">
          <Grid>
            <Input
              id="name"
              label="Full Name"
              value={formData.name}
              onChange={(v) => updateField('name', v)}
              error={errors.name}
              required
            />
            <Input
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(v) => updateField('email', v)}
              error={errors.email}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={(v) => updateField('password', v)}
              error={errors.password}
              required
            />
            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(v) => updateField('confirmPassword', v)}
              error={errors.confirmPassword}
              required
            />
            <Input
              id="orcid"
              label="ORCID ID (Optional)"
              placeholder="0000-0000-0000-0000"
              value={formData.orcid}
              onChange={(v) => updateField('orcid', v)}
              error={errors.orcid}
            />
          </Grid>

          {/* Role Selection */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
              <Shield size={16} className="text-accent" />
              User Role
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['researcher', 'mentor'] as UserRole[]).map((role) => (
                <motion.button
                  key={role}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateField('role', role)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    formData.role === role
                      ? 'border-accent bg-accent/10'
                      : 'border-forest-divider/30 hover:border-accent/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      role === 'researcher' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {role === 'researcher' ? <Microscope size={20} /> : <GraduationCap size={20} />}
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-semibold text-text-primary capitalize">
                        {role}
                      </div>
                      <div className="text-xs text-text-muted">
                        {role === 'researcher' ? 'Research and analysis' : 'Guidance and support'}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </Section>


        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-forest-divider/30">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setFormData(initialFormData);
              setErrors({});
            }}
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Save size={16} />
                </motion.div>
                Creating User...
              </>
            ) : (
              <>
                <UserPlus size={16} className="mr-2" />
                Create User
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
