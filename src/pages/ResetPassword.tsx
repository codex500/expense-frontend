import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '@/api/axios';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate();

  // Extract access_token from URL hash
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const type = params.get('type');

    if (type !== 'recovery' || !token) {
      setError('Invalid or expired reset link. Please request a new one.');
    } else {
      setAccessToken(token);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        accessToken,
        password: password,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex">
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-500/10 via-background to-violet-500/5 items-center justify-center p-12">
          <div className="max-w-lg">
            <Link to="/" className="flex items-center gap-2.5 mb-12">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Trackify</span>
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              Password <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">updated!</span>
            </h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
            <div className="h-16 w-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Password Reset Successfully!</h2>
            <p className="text-muted-foreground mb-8">Your new password is ready. You can now sign in with it.</p>
            <Link to="/login" className="inline-flex items-center justify-center w-full h-12 btn-primary-glow rounded-xl font-medium text-sm">
              Go to Sign In →
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-500/10 via-background to-violet-500/5 items-center justify-center p-12">
        <div className="max-w-lg">
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Trackify</span>
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Choose a new <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">password.</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">Enter your new password below to complete the reset.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
          <p className="text-muted-foreground mb-8">Enter your new password below.</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {!accessToken ? (
            <div className="text-center">
              <Link to="/forgot-password" className="text-primary font-medium text-sm hover:underline">
                Request a new reset link →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-input bg-background/50 pl-11 pr-11 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-input bg-background/50 pl-11 pr-11 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full h-12 btn-primary-glow rounded-xl font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Reset Password →'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
