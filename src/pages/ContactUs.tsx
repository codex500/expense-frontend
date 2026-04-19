import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

import { contactApi } from '@/api/endpoints';

export function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Support Question', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await contactApi.submit(formData);
      setStatus('sent');
      setFormData({ name: '', email: '', subject: 'General Support Question', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="animate-fade-in flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-indigo-500/[0.05] via-background to-background pointer-events-none -z-10" />
      <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[140px] -z-10" />

      <div className="pt-28 sm:pt-36 pb-20 sm:pb-24 px-4 max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-sm font-medium mb-6 w-max">
              <span className="text-gradient">Support</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Get in <span className="text-gradient">touch</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Have a question about your account, experiencing a bug, or just want to say hi? We'd love to hear from you.
            </p>

            <div className="space-y-6">
              {[
                { icon: Mail, title: 'Email us', info: 'support@trackify.ai' },
                { icon: Phone, title: 'Call us', info: '+91 98765 43210' },
                { icon: MapPin, title: 'Visit us', info: '100 Tech Park Way\nBangalore, India 560100' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 group">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <item.icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">{item.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-8 sm:p-10 glow-primary"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <input 
                  id="name"
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full h-12 rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <input 
                  id="email"
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="w-full h-12 rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <input 
                  id="subject"
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                  placeholder="How can we help?"
                  className="w-full h-12 rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea 
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                  placeholder="Please describe your issue or question..."
                  rows={5}
                  className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
              </div>

              {status === 'sent' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-emerald-500 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4" /> Message sent successfully! We'll get back to you soon.
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-red-500 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="h-4 w-4" /> Failed to send message. Please try again.
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={status === 'sending'}
                className="w-full h-12 rounded-xl btn-primary-glow text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {status === 'sending' ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Send Message <Send className="h-4 w-4" /></>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
