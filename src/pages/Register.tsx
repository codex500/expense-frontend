import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Form = { name: string; email: string; password: string; monthly_budget?: string };

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, register: doRegister } = useAuth();

  if (user) return <Navigate to="/" replace />;

  const { register, handleSubmit, formState: { errors } } = useForm<Form>();

  const onSubmit = async (data: Form) => {
    setError('');
    setLoading(true);
    try {
      const budgetVal = data.monthly_budget?.trim() ? Number(data.monthly_budget) : undefined;
      const budget = budgetVal !== undefined && !Number.isNaN(budgetVal) && budgetVal >= 0 ? budgetVal : undefined;
      await doRegister(
        data.name.trim(),
        data.email.trim().toLowerCase(),
        data.password,
        budget
      );
      window.location.replace('/');
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
      if (ax?.response?.status === 404) {
        setError('API not reachable. Ensure VITE_API_URL is set in your deployment (Vercel → Project Settings → Environment Variables).');
      } else {
        setError(ax?.response?.data?.message || ax?.message || 'Registration failed. Check your connection.');
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
          <h1 className="mb-2 text-center text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Create account</h1>
          <p className="mb-6 text-center text-slate-500 dark:text-slate-400">Start tracking with Trackify</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Name" placeholder="Your name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
            <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
            <Input label="Monthly budget (optional)" type="number" step="0.01" placeholder="0" {...register('monthly_budget')} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" loading={loading}>Sign up</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
