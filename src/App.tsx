import { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Transactions = lazy(() => import('@/pages/Transactions').then(module => ({ default: module.Transactions })));
const Accounts = lazy(() => import('@/pages/Accounts').then(module => ({ default: module.Accounts })));
const Budgets = lazy(() => import('@/pages/Budgets').then(module => ({ default: module.Budgets })));
const Advisor = lazy(() => import('@/pages/Advisor').then(module => ({ default: module.Advisor })));
const Analytics = lazy(() => import('@/pages/Analytics').then(module => ({ default: module.Analytics })));
const Home = lazy(() => import('@/pages/Home').then(module => ({ default: module.Home })));
const About = lazy(() => import('@/pages/About').then(module => ({ default: module.About })));
const ContactUs = lazy(() => import('@/pages/ContactUs').then(module => ({ default: module.ContactUs })));
const Login = lazy(() => import('@/pages/Login').then(module => ({ default: module.Login })));
const Signup = lazy(() => import('@/pages/Signup').then(module => ({ default: module.Signup })));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword').then(module => ({ default: module.ForgotPassword })));
const ResetPassword = lazy(() => import('@/pages/ResetPassword').then(module => ({ default: module.ResetPassword })));
const VerifyEmail = lazy(() => import('@/pages/VerifyEmail').then(module => ({ default: module.VerifyEmail })));
const Settings = lazy(() => import('@/pages/Settings').then(module => ({ default: module.Settings })));
const Support = lazy(() => import('@/pages/Support').then(module => ({ default: module.Support })));
import { useAuth } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import { Activity } from 'lucide-react';

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
  const { token, loading } = useAuth();
  
  if (loading) {
    return <GlobalLoader />;
  }
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children?: React.ReactNode }) {
  const { token, loading } = useAuth();
  
  if (loading) {
    return <GlobalLoader />;
  }
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children ? <>{children}</> : <Outlet />;
}

function App() {
  return (
    <Suspense fallback={<GlobalLoader />}>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

// Wrapper to catch Supabase hash links at root
function AppWrapper() {
  useState(() => {
    // Intercept Supabase default recovery links
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      if (params.get('type') === 'recovery' && params.get('access_token')) {
        window.location.href = `/reset-password#${hash}`;
      } else if (params.get('type') === 'signup' && params.get('access_token')) {
        window.location.href = `/verify-email#${hash}`;
      }
    }
  });
  
  return (
    <>
      <Toaster position="top-right" richColors theme="system" />
      <App />
    </>
  );
}

export default AppWrapper;
