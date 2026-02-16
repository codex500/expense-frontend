import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-64">
        <Navbar />
        <main className="flex-1 p-6">
          <React.Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Loading...</div>}>
            <Outlet context={{ refreshKey }} />
          </React.Suspense>
        </main>
      </div>
      <button type="button" onClick={() => setAddOpen(true)} className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 transition hover:scale-110" aria-label="Add transaction">+</button>
      <AddTransactionModal open={addOpen} onClose={() => setAddOpen(false)} onSuccess={() => setRefreshKey((k) => k + 1)} />
    </div>
  );
}

export default function App() {
  return (
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
  );
}
