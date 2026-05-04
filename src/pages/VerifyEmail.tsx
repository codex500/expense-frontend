import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Activity, CheckCircle2, AlertCircle, Loader2, RotateCw } from 'lucide-react';
import { authApi } from '@/api/endpoints';
import { toast } from 'sonner';

export function VerifyEmail() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [status, setStatus] = useState<'input' | 'verifying' | 'success' | 'error'>('input');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state (passed from Signup)
  const email = (location.state as any)?.email || '';

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Auto-focus first input and show initial success message
  useEffect(() => {
    inputRefs.current[0]?.focus();
    if (email) {
      toast.success('Verification code sent to your email');
    }
  }, [email]);

  const handleChange = (index: number, value: string) => {
    if (!/^[A-Za-z0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase();
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 filled
    if (value && index === 5 && newOtp.every(c => c !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      handleVerify(pasted);
    }
  };

  const handleVerify = async (code: string) => {
    if (!email) {
      setStatus('error');
      setMessage('Email address not found. Please sign up again.');
      return;
    }
    setStatus('verifying');
    try {
      await authApi.verifyOtp(email, code);
      setStatus('success');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.response?.data?.message || 'Invalid or expired code. Please try again.');
      // Reset to input after showing error
      setTimeout(() => { setStatus('input'); setOtp(Array(6).fill('')); }, 2000);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    setResending(true);
    try {
      await authApi.resendOtp(email);
      toast.success('New verification code sent!');
      setCooldown(60);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to resend code');
    }
    setResending(false);
  };

  return (
    <div className="min-h-screen w-full flex bg-background items-center justify-center p-6 sm:p-8">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-blue-500/5 z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md glass-card border border-white/10 dark:border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex justify-center mb-6">
           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-glow-emerald">
             <Activity className="h-7 w-7 text-white" />
           </div>
        </div>

        <div className="text-center space-y-4">
          {status === 'success' ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-center mt-6 mb-4">
                 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 shadow-glow-emerald">
                   <CheckCircle2 className="h-8 w-8 text-success" />
                 </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Email Verified!</h2>
              <p className="text-muted-foreground mt-2">Your account is now fully activated. Redirecting you to login...</p>
            </motion.div>
          ) : status === 'verifying' ? (
            <>
              <div className="flex justify-center mt-6">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight mt-4">Verifying...</h2>
              <p className="text-muted-foreground">Checking your verification code...</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold tracking-tight">Verify Your Email</h2>
              <p className="text-muted-foreground">
                We sent a 6-digit code to<br />
                <span className="font-semibold text-foreground">{email || 'your email'}</span>
              </p>

              {status === 'error' && message && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {message}
                </motion.div>
              )}

              {/* OTP Input */}
              <div className="flex justify-center gap-2.5 mt-6" onPaste={handlePaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-input bg-background/50 text-foreground uppercase transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                ))}
              </div>

              <button
                onClick={() => { const code = otp.join(''); if (code.length === 6) handleVerify(code); }}
                disabled={otp.some(c => !c)}
                className="w-full h-12 rounded-xl btn-primary-glow text-sm font-medium mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Verify Email →
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <span>Didn't receive a code?</span>
                <button
                  onClick={handleResend}
                  disabled={resending || cooldown > 0}
                  className="font-semibold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {resending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCw className="h-3 w-3" />}
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  ← Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
