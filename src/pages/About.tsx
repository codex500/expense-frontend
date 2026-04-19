import { motion } from 'framer-motion';
import { Target, Users, Zap, Shield, TrendingUp, Globe } from 'lucide-react';
import { SEO } from '@/components/ui/SEO';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export function About() {
  return (
    <div className="flex flex-col animate-fade-in">
      <SEO 
        title="About Us" 
        description="Learn more about Trackify's mission to democratize financial literacy and provide the best expense tracking experience." 
      />
      {/* Hero */}
      <div className="relative pt-28 sm:pt-36 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.06] via-background to-background -z-10" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-sm font-medium mb-6"
          >
            <span className="text-gradient">Our Mission</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            About <span className="text-gradient">Trackify</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
          >
            We are on a mission to democratize financial literacy and give everyone the tools they need to achieve financial independence — beautifully and effortlessly.
          </motion.p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 sm:py-24 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div {...fadeUp} className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Trackify started with a simple observation: existing personal finance apps are either too complex for everyday use or too simple to provide real value. Most look like spreadsheets from the 90s.
          </p>
          <p className="text-muted-foreground leading-relaxed text-lg">
            We built Trackify to bridge this gap. By combining enterprise-grade analytics with premium, SaaS-level design aesthetics, we've created a tool that people actually want to use every day to manage their wealth.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <div className="text-3xl font-extrabold text-gradient">10K+</div>
              <div className="text-sm text-muted-foreground mt-1">Happy users</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-gradient">₹50Cr+</div>
              <div className="text-sm text-muted-foreground mt-1">Tracked monthly</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-gradient">4.9★</div>
              <div className="text-sm text-muted-foreground mt-1">App rating</div>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl glass-card p-10 h-80 flex items-center justify-center relative overflow-hidden glow-primary"
        >
           <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-violet-500/10" />
           <p className="text-2xl sm:text-3xl font-extrabold italic text-center z-10 max-w-sm leading-snug">
             "Financial freedom begins with knowing exactly <span className="text-gradient">where your money goes.</span>"
           </p>
        </motion.div>
      </div>

      {/* Values Section */}
      <div className="py-20 sm:py-24 border-t border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Our <span className="text-gradient">Values</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The principles that guide every decision we make.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { icon: Target, title: 'Clarity', desc: 'Financial data should be clear, actionable, and visually satisfying to review.', gradient: 'from-indigo-500/20 to-indigo-500/5', iconColor: 'text-indigo-400' },
              { icon: Zap, title: 'Empowerment', desc: 'We utilize AI not to replace human decision-making, but to augment and empower it.', gradient: 'from-purple-500/20 to-purple-500/5', iconColor: 'text-purple-400' },
              { icon: Shield, title: 'Privacy First', desc: 'Your financial data belongs exclusively to you. We never sell your personal information.', gradient: 'from-violet-500/20 to-violet-500/5', iconColor: 'text-violet-400' },
            ].map((v, idx) => (
              <motion.div 
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="glass-card p-8 sm:p-10 rounded-2xl text-center hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${v.gradient} flex items-center justify-center mx-auto mb-6`}>
                  <v.icon className={`h-7 w-7 ${v.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team/Tech section */}
      <div className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Built with <span className="text-gradient">modern tech</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {[
              { name: 'React + TypeScript', desc: 'Modern frontend' },
              { name: 'Node.js + Express', desc: 'Robust backend' },
              { name: 'Supabase', desc: 'Auth & Database' },
              { name: 'AI-Powered', desc: 'Smart insights' },
            ].map((t) => (
              <div key={t.name} className="glass-card p-6 rounded-2xl text-center hover:-translate-y-1 transition-all">
                <div className="font-bold text-lg mb-1">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
