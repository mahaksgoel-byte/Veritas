import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Search, 
  Mail, 
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { UserRole } from '../../lib/profileService';
import { Button, Input } from '../ui';
import { getAllUsers, deleteUser } from '../../lib/adminService';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export const UserManagementForm: React.FC = () => {
  const { mode } = useTheme();
  const [activeMode, setActiveMode] = useState<'create' | 'delete' | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (activeMode === 'delete') {
      loadUsers();
    }
  }, [activeMode]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userData = await getAllUsers();
      setUsers(userData || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      setDeleteStatus('deleting');
      await Promise.all(selectedUsers.map(userId => deleteUser(userId)));
      
      setDeleteStatus('success');
      setSelectedUsers([]);
      await loadUsers();
      
      setTimeout(() => setDeleteStatus('idle'), 2000);
    } catch (error) {
      console.error('Delete failed:', error);
      setDeleteStatus('error');
      setTimeout(() => setDeleteStatus('idle'), 3000);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'researcher': return 'text-blue-400 bg-blue-500/20';
      case 'mentor': return 'text-purple-400 bg-purple-500/20';
      case 'admin': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  if (activeMode === null) {
    return (
      <div className="min-h-screen p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className={`text-5xl font-bold mb-4 bg-gradient-to-r from-accent via-emerald-500 to-accent bg-clip-text text-transparent ${
              mode === 'dark' ? '' : 'text-gray-800'
            }`}>
              User Management
            </h1>
            <p className={`text-xl ${
              mode === 'dark' ? 'text-text-muted' : 'text-gray-600'
            }`}>
              Complete control over user accounts
            </p>
          </motion.div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create User Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveMode('create')}
              className={`relative overflow-hidden rounded-3xl p-8 cursor-pointer transition-all duration-500 ${
                mode === 'dark'
                  ? 'bg-gradient-to-br from-forest-800 via-forest-900 to-forest-800 border border-forest-divider/30 hover:border-accent/50'
                  : 'bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200 hover:border-accent/50'
              }`}
            >
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-emerald-500/20 rounded-full blur-2xl" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-emerald-500/20 flex items-center justify-center border border-accent/30`}>
                    <UserPlus size={32} className="text-accent" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm text-green-400 font-medium">Active</span>
                  </div>
                </div>
                
                <h2 className={`text-2xl font-bold mb-3 ${
                  mode === 'dark' ? 'text-text-primary' : 'text-gray-800'
                }`}>
                  Create User
                </h2>
                <p className={`mb-6 ${
                  mode === 'dark' ? 'text-text-muted' : 'text-gray-600'
                }`}>
                  Add new researcher or mentor accounts with full profile setup
                </p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-accent" />
                    <span className={mode === 'dark' ? 'text-text-muted' : 'text-gray-600'}>
                      2 Roles Available
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-accent" />
                    <span className={mode === 'dark' ? 'text-text-muted' : 'text-gray-600'}>
                      Full Profile Setup
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Delete User Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveMode('delete')}
              className={`relative overflow-hidden rounded-3xl p-8 cursor-pointer transition-all duration-500 ${
                mode === 'dark'
                  ? 'bg-gradient-to-br from-forest-800 via-forest-900 to-forest-800 border border-forest-divider/30 hover:border-red-500/50'
                  : 'bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200 hover:border-red-500/50'
              }`}
            >
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-500/20 to-orange-500/20 rounded-full blur-2xl" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border border-red-500/30`}>
                    <Trash2 size={32} className="text-red-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse" />
                    <span className="text-sm text-orange-400 font-medium">Secure</span>
                  </div>
                </div>
                
                <h2 className={`text-2xl font-bold mb-3 ${
                  mode === 'dark' ? 'text-text-primary' : 'text-gray-800'
                }`}>
                  Delete Users
                </h2>
                <p className={`mb-6 ${
                  mode === 'dark' ? 'text-text-muted' : 'text-gray-600'
                }`}>
                  Remove user accounts and clean up system data
                </p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-orange-400" />
                    <span className={mode === 'dark' ? 'text-text-muted' : 'text-gray-600'}>
                      Permanent Action
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-orange-400" />
                    <span className={mode === 'dark' ? 'text-text-muted' : 'text-gray-600'}>
                      Admin Only
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-text-muted hover:text-text-primary"
            >
              ← Back to Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (activeMode === 'delete') {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold ${
                mode === 'dark' ? 'text-text-primary' : 'text-gray-800'
              }`}>
                Delete Users
              </h1>
              <p className={mode === 'dark' ? 'text-text-muted' : 'text-gray-600'}>
                Select users to permanently remove from the system
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => setActiveMode(null)}
              className="text-text-muted hover:text-text-primary"
            >
              ← Back
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" size={20} />
              <Input
                id="search"
                label="Search users..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="pl-12"
              />
            </div>
          </div>

          {/* Status Messages */}
          <AnimatePresence>
            {deleteStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-3"
              >
                <CheckCircle size={20} className="text-green-400" />
                <span className="text-green-100">
                  {selectedUsers.length} user(s) deleted successfully
                </span>
              </motion.div>
            )}
            {deleteStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3"
              >
                <X size={20} className="text-red-400" />
                <span className="text-red-100">Failed to delete users</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User List */}
          <div className={`rounded-2xl border overflow-hidden ${
            mode === 'dark'
              ? 'bg-forest-800/50 border-forest-divider/30'
              : 'bg-white border-gray-200'
          }`}>
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center gap-3">
                  <div className="w-8 h-8 border-2 border-accent/30 border-t-transparent rounded-full animate-spin" />
                  <span className="text-text-muted">Loading users...</span>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <Users size={48} className="mx-auto mb-4 text-text-muted opacity-50" />
                <p className="text-text-muted">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b ${
                    mode === 'dark' ? 'border-forest-divider/30' : 'border-gray-200'
                  }`}>
                    <tr>
                      <th className="text-left p-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(filteredUsers.map(u => u.id));
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                          className="rounded border-accent/30 bg-transparent text-accent focus:ring-accent/50"
                        />
                      </th>
                      <th className="text-left p-4 font-medium text-text-primary">User</th>
                      <th className="text-left p-4 font-medium text-text-primary">Role</th>
                      <th className="text-left p-4 font-medium text-text-primary">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`border-b transition-colors hover:bg-accent/5 ${
                          mode === 'dark' ? 'border-forest-divider/20' : 'border-gray-100'
                        }`}
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className="rounded border-accent/30 bg-transparent text-accent focus:ring-accent/50"
                          />
                        </td>
                        <td className="p-4">
                          <div>
                            <div className={`font-medium ${
                              mode === 'dark' ? 'text-text-primary' : 'text-gray-800'
                            }`}>
                              {user.name}
                            </div>
                            <div className={`text-sm flex items-center gap-2 ${
                              mode === 'dark' ? 'text-text-muted' : 'text-gray-600'
                            }`}>
                              <Mail size={14} />
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                            <Shield size={14} />
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className={`text-sm ${
                            mode === 'dark' ? 'text-text-muted' : 'text-gray-600'
                          }`}>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              {formatDate(user.created_at)}
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Action Bar */}
          {selectedUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center justify-between p-4 rounded-2xl border bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-orange-400" />
                <span className="text-orange-100">
                  {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <Button
                onClick={handleDeleteUsers}
                disabled={deleteStatus === 'deleting'}
                className="bg-red-500 hover:bg-red-600 text-white border-red-600"
              >
                {deleteStatus === 'deleting' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-transparent rounded-full animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-2" />
                    Delete Selected
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Create mode - render the existing UserCreationForm
  return null;
};
