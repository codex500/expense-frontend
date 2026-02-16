import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-dark dark:via-slate-900 dark:to-primary/10 p-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 shadow-xl">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>
          <h1 className="mb-2 text-center text-2xl font-bold text-slate-800 dark:text-white">Forgot password</h1>
          <p className="mb-6 text-center text-slate-500 dark:text-slate-400">
            Enter your email and we’ll send you a reset link. (UI only – backend not configured.)
          </p>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
          <p className="mt-6 text-center text-sm">
            <Link to="/login" className="text-primary hover:underline">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
