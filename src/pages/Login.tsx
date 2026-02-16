import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Form = { email: string; password: string };

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, login } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  if (user) return <Navigate to={from || '/'} replace />;

  const { register, handleSubmit, formState: { errors } } = useForm<Form>();

  const onSubmit = async (data: Form) => {
    setError('');
    setLoading(true);
    try {
      await login(data.email, data.password);
      window.location.replace(from || '/');
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { message?: string } } };
      if (e?.response?.status === 404) {
        setError('API not reachable. Ensure VITE_API_URL is set in your deployment (Vercel → Project Settings → Environment Variables).');
      } else {
        setError(e?.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-dark dark:via-slate-900 dark:to-primary/10 p-4 sm:p-6">
      <div className="w-full max-w-md min-w-0">
        <div className="glass rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6 sm:mb-8 flex justify-center">
            <Logo />
          </div>
          <h1 className="mb-2 text-center text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Welcome back</h1>
          <p className="mb-6 text-center text-slate-500 dark:text-slate-400">Sign in to Trackify</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password', { required: 'Password is required' })} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" loading={loading}>Sign in</Button>
          </form>
          <div className="mt-6 flex justify-between text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
            <Link to="/register" className="text-slate-600 dark:text-slate-400 hover:text-primary">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
