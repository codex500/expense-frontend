import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { contactApi } from '@/api/endpoints';
import { useAuth } from '@/context/AuthContext';

export function Support() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Dashboard Support Question', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        name: user.fullName || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await contactApi.submit(formData);
      setStatus('sent');
      setFormData(prev => ({ ...prev, subject: 'Dashboard Support Question', message: '' }));
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] relative overflow-hidden p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-sm font-medium mb-4 w-max">
            <span className="text-indigo-500">Support Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            How can we help?
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Describe your issue or ask us a question directly from your dashboard. We'll send a reply to your email address.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 sm:p-8 border border-border/50"
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <input 
                  id="name"
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full h-11 rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
              
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <input 
                  id="email"
                  type="email" 
                  required
                  value={formData.email}
                  disabled={!!user?.email} // Disable if already logged in with email
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder="john@example.com"
                  className={`w-full h-11 rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all ${user?.email ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <input 
                id="subject"
                type="text" 
                required
                value={formData.subject}
                onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                placeholder="What is this regarding?"
                className="w-full h-11 rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea 
                id="message"
                required
                value={formData.message}
                onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                placeholder="Please describe your issue in detail..."
                rows={6}
                className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
              />
            </div>

            {status === 'sent' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-emerald-500 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" /> Message sent successfully! We'll email you soon.
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-red-500 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="h-4 w-4" /> Failed to send message. Please try again later.
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={status === 'sending'}
              className="w-full h-11 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {status === 'sending' ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Send to Support <Send className="h-4 w-4" /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
