import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageLoader } from '@/components/common/Loader';
import { LayoutProvider } from '@/context/LayoutContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { AddTransactionModal } from '@/pages/AddTransactionModal';

const Login = React.lazy(() => import('@/pages/Login'));
const Register = React.lazy(() => import('@/pages/Register'));
const ForgotPassword = React.lazy(() => import('@/pages/ForgotPassword'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Transactions = React.lazy(() => import('@/pages/Transactions'));
const Analytics = React.lazy(() => import('@/pages/Analytics'));
const Advisor = React.lazy(() => import('@/pages/Advisor'));
const Profile = React.lazy(() => import('@/pages/Profile'));

function AppLayout() {
  const [addOpen, setAddOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <LayoutProvider>
      <div className="flex min-h-screen min-w-0 overflow-x-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0 lg:pl-64">
          <Navbar />
          <main className="flex-1 p-4 sm:p-6 pb-24 sm:pb-8">
            <React.Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Loading...</div>}>
              <Outlet context={{ refreshKey }} />
            </React.Suspense>
          </main>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 flex h-14 w-14 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-primary text-white text-2xl font-light shadow-lg shadow-primary/40 transition hover:scale-105 active:scale-95"
          aria-label="Add transaction"
        >
          +
        </button>
        <AddTransactionModal open={addOpen} onClose={() => setAddOpen(false)} onSuccess={() => setRefreshKey((k) => k + 1)} />
      </div>
    </LayoutProvider>
  );
}

export default function App() {
  return (
    <React.Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-light dark:bg-dark"><PageLoader /></div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="advisor" element={<Advisor />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
    </React.Suspense>
  );
}
