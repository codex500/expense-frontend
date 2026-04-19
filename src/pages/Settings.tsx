import { useState, useEffect } from 'react';
import { User, Mail, Palette, Bell, LogOut, Moon, Sun, Monitor, Check, ChevronRight, Save, Phone, Calendar, Shield, Lock, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useThemeStore } from '@/store/themeStore';
import { authApi } from '@/api/endpoints';
import { CountryCodeSelect } from '@/components/ui/CountryCodeSelect';

export function Settings() {
  const { user, logout, refreshUser } = useAuth();
  const { theme, setTheme } = useThemeStore();
  const [activeSection, setActiveSection] = useState<string>('profile');

  // Profile edit state
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Load user data on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await authApi.me();
        const p = data.data;
        setFullName(p.fullName || '');
        setDob(p.dob ? p.dob.split('T')[0] : '');
        const rawMobile = p.mobileNumber || '';
        const match = rawMobile.match(/^(\+\d{1,4})\s+(.+)$/);
        if (match) {
          setCountryCode(match[1]);
          setMobileNumber(match[2]);
        } else {
          setMobileNumber(rawMobile);
        }
      } catch {}
    };
    loadProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(''); setProfileSuccess('');
    setProfileLoading(true);
    try {
      const fullMobile = `${countryCode} ${mobileNumber.replace(/^\+?\d+\s*/, '')}`;
      await authApi.updateProfile({ fullName, dob, mobileNumber: fullMobile });
      setProfileSuccess('Profile updated successfully!');
      refreshUser();
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err: any) {
      setProfileError(err?.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Notification toggles
  const [notifExpense, setNotifExpense] = useState(true);
  const [notifBudget, setNotifBudget] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);

  const themes = [
    { value: 'dark' as const, label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { value: 'light' as const, label: 'Light', icon: Sun, description: 'Classic bright look' },
    { value: 'system' as const, label: 'System', icon: Monitor, description: 'Follow device settings' },
  ];

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security Info', icon: Shield },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-3 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeSection === s.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <s.icon className="h-4 w-4" />
                {s.label}
                <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${activeSection === s.id ? 'rotate-90' : ''}`} />
              </button>
            ))}
            <div className="pt-2 border-t border-border mt-2">
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Profile Information</h3>
                <p className="text-sm text-muted-foreground mt-1">Update your personal details. Email cannot be changed.</p>
              </div>

              {profileSuccess && (
                <div className="p-3 rounded-xl bg-success/10 border border-success/20 text-sm text-success flex items-center gap-2">
                  <Check className="h-4 w-4" /> {profileSuccess}
                </div>
              )}
              {profileError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                  {profileError}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Full Name - Editable */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> Full Name</label>
                  <input
                    type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Email - Read Only */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> Email <span className="text-xs text-muted-foreground font-normal">(Cannot be changed)</span></label>
                  <input
                    type="email" value={user?.email || ''} readOnly
                    className="h-12 w-full rounded-xl border border-input bg-muted/30 px-4 text-sm text-muted-foreground cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* DOB - Editable */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> Date of Birth</label>
                    <input
                      type="date" value={dob} onChange={(e) => setDob(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 [color-scheme:dark]"
                    />
                  </div>

                  {/* Mobile - Editable */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> Mobile Number</label>
                    <div className="flex rounded-xl border border-input bg-background/50 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary overflow-visible">
                      <CountryCodeSelect 
                        value={countryCode} 
                        onChange={setCountryCode} 
                      />
                      <input
                        type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="flex-1 h-12 bg-transparent px-4 text-sm focus:outline-none placeholder:text-muted-foreground w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Gender & PAN - Read Only */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground" /> Gender <span className="text-xs text-muted-foreground font-normal">(Read only)</span></label>
                    <input
                      type="text" value={(user as any)?.gender || 'Not set'} readOnly
                      className="h-12 w-full rounded-xl border border-input bg-muted/30 px-4 text-sm text-muted-foreground cursor-not-allowed capitalize"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2"><Lock className="h-4 w-4 text-muted-foreground" /> PAN Card <span className="text-xs text-muted-foreground font-normal">(Encrypted)</span></label>
                    <input
                      type="text" value="••••••••••" readOnly
                      className="h-12 w-full rounded-xl border border-input bg-muted/30 px-4 text-sm text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                </div>

                <button
                  type="submit" disabled={profileLoading}
                  className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl btn-primary-glow text-sm font-medium transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {profileLoading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="h-4 w-4" /> Save Changes</>}
                </button>
              </form>
            </motion.div>
          )}

          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Appearance</h3>
                <p className="text-sm text-muted-foreground mt-1">Choose your preferred theme.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                      theme === t.value ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-border hover:border-primary/40 hover:bg-muted/30'
                    }`}
                  >
                    {theme === t.value && (
                      <div className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <t.icon className={`h-6 w-6 ${theme === t.value ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="text-center">
                      <p className="font-semibold text-sm">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Notifications</h3>
                <p className="text-sm text-muted-foreground mt-1">Control when and how you get notified.</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Expense Alerts', desc: 'Get notified when a large expense is recorded', value: notifExpense, setter: setNotifExpense },
                  { label: 'Budget Warnings', desc: 'Alert when approaching budget limits', value: notifBudget, setter: setNotifBudget },
                  { label: 'Weekly Summary', desc: 'Receive a weekly spending summary email', value: notifWeekly, setter: setNotifWeekly },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors">
                    <div>
                      <p className="font-medium text-sm">{n.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                    </div>
                    <button
                      onClick={() => n.setter(!n.value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${n.value ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${n.value ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Security Info Section */}
          {activeSection === 'security' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Security Information</h3>
                <p className="text-sm text-muted-foreground mt-1">Your account security overview.</p>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                        <Check className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Email Verified</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${user?.emailVerified ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-500'}`}>
                      {user?.emailVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">PAN Card</p>
                      <p className="text-xs text-muted-foreground">AES-256 encrypted and stored securely</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Password</p>
                      <p className="text-xs text-muted-foreground">Use 'Forgot Password' on the login page to change your password</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-6 border-t border-border mt-8">
                <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
                <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-destructive">Delete Account</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      if (window.confirm('Are you absolutely sure you want to delete your account? All your data will be permanently wiped. This action cannot be undone.')) {
                        try {
                          await authApi.deleteAccount();
                          logout();
                        } catch (err: any) {
                          alert(err?.response?.data?.message || 'Failed to delete account.');
                        }
                      }
                    }}
                    className="shrink-0 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
