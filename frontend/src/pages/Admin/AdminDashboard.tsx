import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, Users, Trash2, ArrowLeft, Search,
  Shield, ChevronRight, Mail, Calendar,
  AlertTriangle, UserCheck, GraduationCap,
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { UserCreationForm } from '../../components/admin/UserCreationForm';
import { getAllUsers, deleteUser, getAdminStats } from '../../lib/adminService';

// ─── Types ────────────────────────────────────────────────────────────────────

type Operation = 'create' | 'delete' | null;

interface AdminStats {
  mentorCount: number;
  researcherCount: number;
  totalUsers: number;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    created_at: string;
  }>;
}

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: 'researcher' | 'mentor';
  created_by: string;
  created_at: string;
}


// ─── Operation Card ───────────────────────────────────────────────────────────

const OperationCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  badge?: string;
  badgeColor?: string;
  onClick: () => void;
  mode: 'dark' | 'light';
  danger?: boolean;
}> = ({ icon, title, description, cta, badge, badgeColor, onClick, mode, danger }) => (
  <motion.button
    onClick={onClick}
    className={`group relative w-full text-left rounded-xl border overflow-hidden transition-all duration-200 cursor-pointer
      ${mode === 'dark'
        ? `bg-forest-800/50 border-forest-divider/25 hover:bg-forest-800 ${danger ? 'hover:border-red-500/30' : 'hover:border-accent/35'}`
        : `bg-white border-light-divider/35 ${danger ? 'hover:border-red-400/35' : 'hover:border-accent/35'}`
      }`}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.99 }}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
  >
    {/* Top shimmer */}
    <div className={`absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400
      ${danger
        ? 'bg-gradient-to-r from-transparent via-red-500/60 to-transparent'
        : 'bg-gradient-to-r from-transparent via-accent/60 to-transparent'
      }`}
    />

    <div className="p-6 flex items-start gap-5">
      {/* Icon */}
      <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-200
        ${mode === 'dark'
          ? `bg-forest-700/50 border-forest-divider/25 ${danger ? 'group-hover:border-red-500/35 group-hover:bg-red-500/8' : 'group-hover:border-accent/35 group-hover:bg-accent/8'}`
          : `bg-light-100 border-light-divider/35 ${danger ? 'group-hover:border-red-300/60 group-hover:bg-red-50' : 'group-hover:border-accent/30 group-hover:bg-accent/5'}`
        }`}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          {badge && (
            <span className={`shrink-0 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-text-muted leading-relaxed mb-4">{description}</p>
        <div className={`flex items-center gap-1.5 text-xs font-semibold transition-all duration-200
          ${danger ? 'text-red-400 group-hover:gap-2' : 'text-accent group-hover:gap-2'}`}
        >
          <span>{cta}</span>
          <ChevronRight size={13} />
        </div>
      </div>
    </div>
  </motion.button>
);

// ─── Delete User Row ──────────────────────────────────────────────────────────

const DeleteUserRow: React.FC<{
  user: ManagedUser;
  index: number;
  mode: 'dark' | 'light';
  onDelete: (id: string) => void;
  confirmId: string | null;
  setConfirmId: (id: string | null) => void;
}> = ({ user, index, mode, onDelete, confirmId, setConfirmId }) => {
  const isConfirming = confirmId === user.id;
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className={`group transition-colors duration-100
        ${isConfirming
          ? mode === 'dark' ? 'bg-red-500/6' : 'bg-red-50/70'
          : mode === 'dark' ? 'hover:bg-forest-700/20' : 'hover:bg-light-50'
        }`}
    >
      <td className="px-6 py-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 select-none
            ${user.role === 'mentor' ? 'bg-emerald-500/12 text-emerald-500' : 'bg-accent/12 text-accent'}`}
          >
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{user.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Mail size={10} className="text-text-muted" />
              <span className="text-xs text-text-muted">{user.email}</span>
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-3">
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full
          ${user.role === 'mentor' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-accent/10 text-accent'}`}
        >
          {user.role === 'mentor' ? <GraduationCap size={10} /> : <UserCheck size={10} />}
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      </td>

      <td className="px-6 py-3">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <Calendar size={12} />
          {new Date(user.created_by).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </td>

      <td className="px-6 py-3 text-right">
        <AnimatePresence mode="wait">
          {isConfirming ? (
            <motion.div key="c" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-end gap-2"
            >
              <span className="text-[11px] text-text-muted">Sure?</span>
              <button onClick={() => onDelete(user.id)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >Delete</button>
              <button onClick={() => setConfirmId(null)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors
                  ${mode === 'dark' ? 'bg-forest-600 text-text-muted hover:text-text-primary' : 'bg-light-200 text-text-muted hover:text-text-primary'}`}
              >Cancel</button>
            </motion.div>
          ) : (
            <motion.button key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmId(user.id)}
              className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg
                opacity-0 group-hover:opacity-100 transition-all duration-150
                text-text-muted hover:text-red-500 border
                ${mode === 'dark'
                  ? 'border-forest-divider/20 hover:border-red-500/25 hover:bg-red-500/6'
                  : 'border-light-divider/35 hover:border-red-300 hover:bg-red-50'
                }`}
            >
              <Trash2 size={12} /> Remove
            </motion.button>
          )}
        </AnimatePresence>
      </td>
    </motion.tr>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export const AdminDashboard: React.FC = () => {
  const { mode } = useTheme();
  const [operation, setOperation] = useState<Operation>(null);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);

  // Fetch users and stats on component mount and after user creation/deletion
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const fetchedUsers = await getAllUsers();
      const formattedUsers = fetchedUsers.map((user: any) => ({
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        role: user.role as 'researcher' | 'mentor',
        created_by: user.created_by,
        created_at: user.created_at
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    console.log('🔍 fetchStats called');
    try {
      const stats = await getAdminStats();
      console.log('📊 Stats received:', stats);
      setAdminStats(stats);
    } catch (error) {
      console.error('❌ Failed to fetch admin stats:', error);
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers(p => p.filter(u => u.id !== id));
      setConfirmId(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const goBack = () => { setOperation(null); setSearch(''); setConfirmId(null); fetchUsers(); fetchStats(); };

  const dk = mode === 'dark';

  // ── Compact Header — hidden on create (form has its own) ─────────────────

  const Header = () => (
    <div className={`relative overflow-hidden rounded-xl border mb-5
      ${dk
        ? 'bg-gradient-to-r from-forest-800 via-forest-900 to-forest-800 border-forest-divider/25'
        : 'bg-gradient-to-r from-light-100 via-white to-light-50 border-light-divider/30'
      }`}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-8 -left-8 w-48 h-48 bg-accent/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -right-8 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-7 py-5 flex items-center justify-between gap-4 flex-wrap">
        {/* Left */}
        <div className="flex items-center gap-4">
          {operation && (
            <motion.button
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              onClick={goBack}
              className={`p-2 rounded-lg border transition-all
                ${dk
                  ? 'border-forest-divider/30 hover:border-accent/35 text-text-muted hover:text-text-primary bg-forest-700/40'
                  : 'border-light-divider/35 hover:border-accent/35 text-text-muted hover:text-text-primary bg-white/70'
                }`}
            >
              <ArrowLeft size={15} />
            </motion.button>
          )}

          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border
            ${operation === 'delete'
              ? 'bg-red-500/10 border-red-500/20'
              : 'bg-accent/10 border-accent/20'
            }`}
          >
            {operation === 'delete' ? <Trash2 size={18} className="text-red-400" /> : <Shield size={18} className="text-accent" />}
          </div>

          <div>
            <h1 className="text-xl font-bold text-text-primary leading-tight">
              {!operation && 'Admin Panel'}
              {operation === 'delete' && 'Manage Users'}
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              {!operation && 'Select an operation'}
              {operation === 'delete' && `${users.length} users under your administration`}
            </p>
          </div>
        </div>

        {/* Right — stat chips on home, breadcrumb always */}
        <div className="flex items-center gap-3">
          {!operation && (
            <div className="flex items-center gap-2">
              {adminStats ? [
                { label: 'Total',      val: adminStats.totalUsers,                                   cls: 'text-text-primary' },
                { label: 'Researchers',val: adminStats.researcherCount,   cls: 'text-accent' },
                { label: 'Mentors',    val: adminStats.mentorCount,       cls: 'text-emerald-500' },
              ].map(c => (
                <div key={c.label} className={`flex items-baseline gap-1.5 px-3 py-1.5 rounded-lg border text-xs
                  ${dk ? 'bg-forest-700/35 border-forest-divider/20' : 'bg-white/70 border-light-divider/35'}`}
                >
                  <span className={`text-base font-bold ${c.cls}`}>{c.val}</span>
                  <span className="text-text-muted">{c.label}</span>
                </div>
              )) : (
                <div className="flex items-center gap-2">
                  <div className="text-xs text-text-muted">Loading stats...</div>
                </div>
              )}
            </div>
          )}

          <div className={`hidden sm:flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-full border font-medium
            ${dk ? 'bg-forest-700/35 border-forest-divider/25 text-text-muted' : 'bg-white/70 border-light-divider/35 text-text-muted'}`}
          >
            <span>Admin</span>
            {operation && (
              <>
                <ChevronRight size={11} />
                <span className={operation === 'delete' ? 'text-red-400' : 'text-accent'}>
                  {operation === 'delete' ? 'Manage Users' : 'Create User'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ── Selection ─────────────────────────────────────────────────────────────

  const SelectionView = () => (
    <motion.div key="sel" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
      {/* Operation cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <OperationCard
          mode={mode} danger={false}
          icon={<UserPlus size={20} className="text-accent" />}
          title="Create User"
          description="Onboard a new researcher or mentor — assign their role, set credentials, and grant platform access instantly."
          cta="Create new user"
          badge="Action"
          badgeColor={`bg-accent/10 text-accent border-accent/20`}
          onClick={() => setOperation('create')}
        />
        <OperationCard
          mode={mode} danger
          icon={<Trash2 size={20} className="text-red-400" />}
          title="Delete User"
          description="Permanently remove an account. All access and data will be revoked immediately and cannot be recovered."
          cta="Manage users"
          badge={`${users.length} accounts`}
          badgeColor={dk ? 'bg-forest-700/50 text-text-muted border-forest-divider/25' : 'bg-light-100 text-text-muted border-light-divider/40'}
          onClick={() => setOperation('delete')}
        />
      </div>

      {/* Scrollable recent users panel */}
      <div className={`rounded-xl border overflow-hidden
        ${dk ? 'border-forest-divider/25 bg-forest-800/35' : 'border-light-divider/30 bg-white'}`}
      >
        {/* Panel header */}
        <div className={`flex items-center justify-between px-5 py-3 border-b
          ${dk ? 'border-forest-divider/20 bg-forest-800/50' : 'border-light-divider/25 bg-light-50/80'}`}
        >
          <div className="flex items-center gap-2">
            <Users size={13} className="text-text-muted" />
            <span className="text-xs font-semibold text-text-primary">Recently Added</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold
              ${dk ? 'bg-forest-700 text-text-muted' : 'bg-light-100 text-text-muted'}`}
            >
              {adminStats ? adminStats.totalUsers : 0}
            </span>
          </div>
          <button onClick={() => setOperation('delete')} className="text-[11px] text-accent font-medium hover:underline underline-offset-2">
            Manage all →
          </button>
        </div>

        {/* Scrollable list — max ~4 rows visible */}
        <div className="overflow-y-auto max-h-[220px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-text-muted text-xs">Loading users...</div>
            </div>
          ) : adminStats?.recentUsers && adminStats.recentUsers.length > 0 ? (
            <div className={`divide-y ${dk ? 'divide-forest-divider/15' : 'divide-light-divider/20'}`}>
              {adminStats.recentUsers.map((user, i) => {
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-3 px-5 py-2.5 transition-colors
                      ${dk ? 'hover:bg-forest-700/20' : 'hover:bg-light-50'}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0
                      ${user.email.includes('mentor') ? 'bg-emerald-500/12 text-emerald-500' : 'bg-accent/12 text-accent'}`}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-primary truncate">{user.name}</p>
                      <p className="text-[11px] text-text-muted truncate">{user.email}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0
                      ${user.email.includes('mentor') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-accent/10 text-accent'}`}
                    >
                      {user.email.includes('mentor') ? 'mentor' : 'researcher'}
                    </span>
                    <span className="text-[11px] text-text-muted shrink-0 w-20 text-right hidden sm:block">
                      {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-text-muted text-xs">No recent users created</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  // ── Delete ────────────────────────────────────────────────────────────────

  const DeleteView = () => (
    <motion.div key="del" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className={`flex items-center gap-2 flex-1 min-w-56 px-3.5 py-2.5 rounded-xl border transition-colors
          ${dk
            ? 'bg-forest-800/50 border-forest-divider/25 focus-within:border-accent/35'
            : 'bg-white border-light-divider/35 focus-within:border-accent/35'
          }`}
        >
          <Search size={14} className="text-text-muted shrink-0" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email or role…"
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-text-muted hover:text-text-primary text-base leading-none">×</button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {[
            { l: 'Total',      v: users.length,                                  c: 'text-text-primary', bg: dk ? 'bg-forest-700/40 border-forest-divider/20' : 'bg-white border-light-divider/35' },
            { l: 'Researchers',v: users.filter(u=>u.role==='researcher').length,  c: 'text-accent',       bg: 'bg-accent/8 border-accent/20' },
            { l: 'Mentors',    v: users.filter(u=>u.role==='mentor').length,      c: 'text-emerald-500',  bg: 'bg-emerald-500/8 border-emerald-500/20' },
          ].map(chip => (
            <div key={chip.l} className={`flex items-baseline gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${chip.bg}`}>
              <span className={`text-sm font-bold ${chip.c}`}>{chip.v}</span>
              <span className="text-text-muted">{chip.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs
        ${dk ? 'bg-amber-500/5 border-amber-500/18 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'}`}
      >
        <AlertTriangle size={13} className="shrink-0" />
        <p>Deletions are <strong>permanent</strong> — all user data and access will be immediately revoked.</p>
      </div>

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden
        ${dk ? 'border-forest-divider/25 bg-forest-800/35' : 'border-light-divider/30 bg-white'}`}
      >
        {/* Column headers */}
        <div className={`grid border-b text-[11px] font-semibold uppercase tracking-wider text-text-muted
          ${dk ? 'border-forest-divider/20 bg-forest-800/60' : 'border-light-divider/25 bg-light-50'}
        `} style={{ gridTemplateColumns: '2fr 1fr 1fr auto' }}>
          <div className="px-6 py-3">User</div>
          <div className="px-6 py-3">Role</div>
          <div className="px-6 py-3">Joined</div>
          <div className="px-6 py-3 text-right">Action</div>
        </div>

        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="text-text-muted text-xs">Loading users...</div>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <Users size={32} className="text-text-muted mb-2.5 opacity-20" />
              <p className="text-text-muted text-xs">No users match your search</p>
              <button onClick={() => setSearch('')} className="text-accent text-[11px] mt-1.5 hover:underline">Clear</button>
            </motion.div>
          ) : (
            <table className="w-full">
              <tbody className={`divide-y ${dk ? 'divide-forest-divider/15' : 'divide-light-divider/20'}`}>
                {filtered.map((user, i) => (
                  <DeleteUserRow key={user.id} user={user} index={i} mode={mode}
                    onDelete={handleDelete} confirmId={confirmId} setConfirmId={setConfirmId}
                  />
                ))}
              </tbody>
            </table>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  // ── Create — no wrapper, form speaks for itself ───────────────────────────

  const CreateView = () => (
    <motion.div key="cre" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
      {/* Minimal back row only — no duplicate title */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={goBack}
          className={`flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors
            px-3 py-1.5 rounded-lg border
            ${dk ? 'border-forest-divider/25 hover:border-forest-divider/40 bg-forest-800/40' : 'border-light-divider/35 hover:border-light-divider/60 bg-white'}`}
        >
          <ArrowLeft size={13} /> Back
        </button>
        <div className={`h-px flex-1 ${dk ? 'bg-forest-divider/20' : 'bg-light-divider/30'}`} />
        <span className={`text-[11px] px-2 py-1 rounded-md
          ${dk ? 'bg-forest-700/40 text-text-muted' : 'bg-light-100 text-text-muted'}`}
        >
          Admin → Create User
        </span>
      </div>
      <UserCreationForm 
        onUserCreated={() => {
          setOperation(null);
          fetchUsers();
          fetchStats();
        }}
      />
    </motion.div>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <div className="w-full">
        {/* Header is hidden on create view — form has its own title */}
        {operation !== 'create' && <Header />}

        <AnimatePresence mode="wait">
          {!operation        && <SelectionView />}
          {operation === 'delete' && <DeleteView />}
          {operation === 'create' && <CreateView />}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};