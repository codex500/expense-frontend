import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { Activity, CreditCard, LayoutDashboard, Menu, PieChart, Settings, Wallet, Bell, Search, X, Sparkles, Moon, Sun, LogOut, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/themeStore';
import { useAuth } from '@/context/AuthContext';
import { AddTransactionModal } from '@/pages/AddTransactionModal';
import { useQueryClient } from '@tanstack/react-query';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Activity },
  { name: 'Accounts', href: '/accounts', icon: Wallet },
  { name: 'Budgets', href: '/budgets', icon: CreditCard },
  { name: 'Analytics', href: '/analytics', icon: PieChart },
  { name: 'Advisor', href: '/advisor', icon: Sparkles },
];

const secondaryNav = [
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useThemeStore();
  const { user, logout } = useAuth();
  const [addTxnOpen, setAddTxnOpen] = useState(false);
  const queryClient = useQueryClient();

  // Smart notifications based on context
  const notifications = [
    { type: 'info', title: 'Welcome to Trackify!', message: 'Start by adding your first account and transactions.', time: 'Today' },
    { type: 'success', title: 'App Updated', message: 'New AI Advisor chat and analytics features available.', time: 'Today' },
  ];

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const userInitial = user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border/50 bg-card/80 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-glow-emerald">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Trackify</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col gap-1 px-4 py-4">
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Menu</p>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {item.name}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
        
        <div className="absolute bottom-6 w-full px-4 space-y-1">
           {secondaryNav.map((item) => (
             <Link
               key={item.name}
               to={item.href}
               className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
             >
               <item.icon className="h-5 w-5" />
               {item.name}
             </Link>
           ))}
           <button
             onClick={logout}
             className="w-full group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
           >
             <LogOut className="h-5 w-5" />
             Log out
           </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border/50 bg-background/70 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground lg:hidden hover:text-foreground transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 items-center gap-4">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions, accounts..."
                className="h-10 w-full rounded-xl border border-border/50 bg-muted/30 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted/50"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className="relative">
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted/50"
              >
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-background" />
                )}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 z-50 glass-card rounded-2xl shadow-xl border border-border/50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border/50">
                      <h3 className="font-semibold text-sm">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                          <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((n, i) => (
                          <div key={i} className="px-4 py-3 hover:bg-muted/30 transition-colors border-b border-border/20 last:border-0">
                            <div className="flex items-start gap-3">
                              <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${n.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : n.type === 'success' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                                {n.type === 'warning' ? '⚠️' : n.type === 'success' ? '✅' : '💡'}
                              </div>
                              <div>
                                <p className="text-sm font-medium leading-snug">{n.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                                <p className="text-[10px] text-muted-foreground/50 mt-1">{n.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <Link to="/settings">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-primary font-semibold cursor-pointer border border-primary/20 hover:border-primary/40 transition-colors text-sm">
                {userInitial}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 w-full border-t border-border/50 bg-background/80 backdrop-blur-xl z-30 pb-safe">
        <div className="flex justify-around items-center h-16">
          <Link to="/dashboard" className={cn("flex flex-col items-center gap-1 transition-colors", location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground')}>
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link to="/transactions" className={cn("flex flex-col items-center gap-1 transition-colors", location.pathname === '/transactions' ? 'text-primary' : 'text-muted-foreground')}>
            <Activity className="h-5 w-5" />
            <span className="text-[10px] font-medium">Activity</span>
          </Link>
          
          <div className="relative -top-5">
             <button onClick={() => setAddTxnOpen(true)} className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-glow-emerald flex items-center justify-center transform hover:scale-105 transition-transform">
               <Plus className="h-6 w-6" />
             </button>
          </div>

          <Link to="/budgets" className={cn("flex flex-col items-center gap-1 transition-colors", location.pathname === '/budgets' ? 'text-primary' : 'text-muted-foreground')}>
            <CreditCard className="h-5 w-5" />
            <span className="text-[10px] font-medium">Budgets</span>
          </Link>
          <Link to="/analytics" className={cn("flex flex-col items-center gap-1 transition-colors", location.pathname === '/analytics' ? 'text-primary' : 'text-muted-foreground')}>
            <PieChart className="h-5 w-5" />
            <span className="text-[10px] font-medium">Analytics</span>
          </Link>
        </div>
      </div>

      {/* Floating Add Transaction Button — Desktop only (mobile has it in bottom nav) */}
      <button
        onClick={() => setAddTxnOpen(true)}
        className="hidden lg:flex fixed bottom-8 right-8 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        title="Add Transaction"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        open={addTxnOpen}
        onClose={() => setAddTxnOpen(false)}
        onSuccess={() => {
          setAddTxnOpen(false);
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          queryClient.invalidateQueries({ queryKey: ['accounts'] });
          queryClient.invalidateQueries({ queryKey: ['analytics'] });
        }}
      />
    </div>
  );
}
