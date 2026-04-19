import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword';
import { VerifyEmail } from '@/pages/VerifyEmail';
import { Transactions } from '@/pages/Transactions';
import { Accounts } from '@/pages/Accounts';
import { Budgets } from '@/pages/Budgets';
import { Advisor } from '@/pages/Advisor';
import { Analytics } from '@/pages/Analytics';
import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { ContactUs } from '@/pages/ContactUs';
import { useAuth } from '@/context/AuthContext';
import { Settings } from '@/pages/Settings';
import { Support } from '@/pages/Support';
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
