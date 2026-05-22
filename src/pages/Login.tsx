import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Fingerprint } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { SEO } from '@/components/ui/SEO';
import { authService } from '@/services/endpoints';
import { toast } from 'sonner';
import { startAuthentication } from '@simplewebauthn/browser';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { data } = await authService.login(email, password);
      const result = data.data;
      setAuth(result.user, result.session.accessToken);
      navigate('/dashboard');
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    if (!email) {
      setError('Please enter your email first to use passkey.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const { data: optionsData } = await authService.generatePasskeyAuth(email);
      const asseResp = await startAuthentication({ optionsJSON: optionsData.data });
      
      const { data: verifyData } = await authService.verifyPasskeyAuth(email, asseResp);
      
      // verifyData returns { data: { verified: true, user: {...}, token: '...' } }
      const user = verifyData.data.user;
      const token = verifyData.data.token;
      
      localStorage.setItem('auth_token', token);
      setAuth(user, token);
      navigate('/dashboard');
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Passkey login failed.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full flex bg-background">
      <SEO 
        title="Login" 
        description="Log into your Trackify account to view your expenses, manage your budgets, and monitor your personalized financial analytics." 
      />
      {/* Left side - Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-blue-500/10 z-0" />
        
        {/* Animated background orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] animate-float" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-glow-emerald">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Trackify</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1]">
            Master your money with <span className="text-gradient">clarity.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Premium financial tracking that puts you in control. Deep analytics, AI-powered insights, and beautiful visualizations.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="glass-card p-5 rounded-xl">
              <div className="text-gradient font-bold text-2xl">100%</div>
              <div className="text-sm text-muted-foreground mt-1">Data Encrypted</div>
            </div>
            <div className="glass-card p-5 rounded-xl">
              <div className="text-gradient font-bold text-2xl">Smart</div>
              <div className="text-sm text-muted-foreground mt-1">AI Insights</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Trackify Inc. All rights reserved.
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:hidden mb-6">
               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-glow-emerald">
                 <Activity className="h-7 w-7 text-white" />
               </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Enter your credentials to access your account</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" 
                    required
                    className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 pl-11 text-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Password</label>
                  <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    required
                    className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 pl-11 pr-11 text-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-xl btn-primary-glow text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>

          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 mt-6">
            <a
              href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/oauth/google`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border/50 bg-background hover:bg-muted/30 transition-all font-medium text-sm disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </a>
            
            <button
              type="button"
              onClick={handlePasskeyLogin}
              disabled={isLoading}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border/50 bg-background hover:bg-muted/30 transition-all font-medium text-sm disabled:opacity-50"
            >
              <Fingerprint className="w-5 h-5 mr-2" />
              Sign in with Passkey
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
