import { useState, lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { authService } from '@/services/endpoints';
import { Toaster } from 'sonner';
import { Activity, AlertTriangle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Transactions = lazy(() => import('@/pages/Transactions').then(m => ({ default: m.Transactions })));
const Accounts = lazy(() => import('@/pages/Accounts').then(m => ({ default: m.Accounts })));
const Budgets = lazy(() => import('@/pages/Budgets').then(m => ({ default: m.Budgets })));
const Advisor = lazy(() => import('@/pages/Advisor').then(m => ({ default: m.Advisor })));
const Analytics = lazy(() => import('@/pages/Analytics').then(m => ({ default: m.Analytics })));
const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('@/pages/About').then(m => ({ default: m.About })));
const ContactUs = lazy(() => import('@/pages/ContactUs').then(m => ({ default: m.ContactUs })));
const Login = lazy(() => import('@/pages/Login').then(m => ({ default: m.Login })));
const Signup = lazy(() => import('@/pages/Signup').then(m => ({ default: m.Signup })));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('@/pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const VerifyEmail = lazy(() => import('@/pages/VerifyEmail').then(m => ({ default: m.VerifyEmail })));
const Settings = lazy(() => import('@/pages/Settings').then(m => ({ default: m.Settings })));
const Support = lazy(() => import('@/pages/Support').then(m => ({ default: m.Support })));

function GlobalLoader() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-indigo-500/20 blur-[40px] rounded-full animate-pulse" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-xl shadow-indigo-500/20 isolate">
          <Activity className="h-8 w-8 text-white animate-pulse" />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children?: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children ? <>{children}</> : <Outlet />;
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="inline-flex items-center justify-center h-12 px-6 btn-primary-glow rounded-xl font-medium text-sm transition-all hover:scale-[1.02]">
        Return Home
      </Link>
    </div>
  );
}

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const { setAuth, logout } = useAuthStore();
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Initial auth check
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await authService.me();
          setAuth(data.data, token);
        } catch {
          logout();
        }
      } else {
        logout();
      }
      setIsInitializing(false);
    };
    initAuth();
  }, [setAuth, logout]);

  useEffect(() => {
    // Intercept Supabase default recovery links and OAuth redirects
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const type = params.get('type');
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        if (type === 'recovery') {
          window.location.href = `/reset-password#${hash}`;
        } else if (type === 'signup') {
          window.location.href = `/verify-email#${hash}`;
        } else {
          // OAuth login callback
          localStorage.setItem('token', accessToken);
          const refreshToken = params.get('refresh_token');
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }
          window.location.href = '/dashboard';
        }
      }
    }
  }, []);

  if (isInitializing) {
    return <GlobalLoader />;
  }

  return (
    <Suspense fallback={<GlobalLoader />}>
      <Helmet>
        <title>Trackify - Smart Expense Tracker</title>
        <meta name="description" content="Track your expenses, manage budget, and analyze spending with Trackify." />
        <link rel="canonical" href="https://trackifyapp.space" />
      </Helmet>
      <Toaster position="top-right" richColors theme={theme} />
      <Routes>
        {/* Public Marketing Routes */}
        <Route element={<PublicRoute><PublicLayout /></PublicRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
        </Route>
        
        {/* Auth Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>
        
        {/* Protected Routes inside AppLayout */}
        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><AppLayout><Transactions /></AppLayout></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute><AppLayout><Accounts /></AppLayout></ProtectedRoute>} />
        <Route path="/budgets" element={<ProtectedRoute><AppLayout><Budgets /></AppLayout></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AppLayout><Analytics /></AppLayout></ProtectedRoute>} />
        <Route path="/advisor" element={<ProtectedRoute><AppLayout><Advisor /></AppLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><AppLayout><Support /></AppLayout></ProtectedRoute>} />
        
        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
