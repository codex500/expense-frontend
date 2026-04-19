import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, ShieldCheck, Zap, Sparkles, TrendingUp, Wallet, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export function Home() {
  return (
    <div className="flex flex-col animate-fade-in relative overflow-hidden">
      {/* Background Ambient Orbs */}
      <div className="absolute top-0 inset-x-0 h-[900px] w-full bg-gradient-to-b from-indigo-500/[0.07] via-background to-background pointer-events-none -z-10" />
      <div className="absolute top-20 right-[-200px] w-[700px] h-[700px] bg-indigo-500/15 rounded-full blur-[160px] pointer-events-none -z-10 opacity-50" />
      <div className="absolute top-60 left-[-100px] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[140px] pointer-events-none -z-10 opacity-40" />
      <div className="absolute top-[600px] right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10 opacity-30" />

      {/* Hero Section */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-sm font-medium mb-8 backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 text-indigo-400 mr-2" />
          <span className="text-gradient">Introducing Trackify AI</span>
          <span className="mx-2.5 text-border">|</span>
          <span className="text-muted-foreground">The future of personal finance</span>
        </motion.div>

        <motion.h1 
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 max-w-5xl leading-[1.05]"
        >
          Master your money.<br/>
          <span className="text-gradient-hero">Effortlessly.</span>
        </motion.h1>

        <motion.p 
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed"
        >
          Trackify is the premium financial OS that brings order to your spending. Deep insights, beautiful aesthetics, and intelligent automated budgeting.
        </motion.p>

        <motion.div 
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto"
        >
          <Link 
            to="/login"
            className="inline-flex items-center justify-center rounded-full btn-primary-glow px-8 py-4 text-base transition-all hover:scale-105 active:scale-[0.98]"
          >
            Start for free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link 
            to="/about"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card/50 backdrop-blur-md hover:bg-muted px-8 py-4 text-base font-semibold transition-all hover:scale-105"
          >
            Learn more
          </Link>
        </motion.div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pb-24 sm:pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="relative rounded-2xl glass-card p-1.5 glow-primary overflow-hidden"
        >
           <div className="w-full aspect-[16/9] rounded-xl bg-background overflow-hidden relative flex flex-col">
             <div className="h-11 border-b border-border/30 flex items-center px-4 gap-2">
               <div className="flex gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                 <div className="w-3 h-3 rounded-full bg-indigo-400/80"></div>
               </div>
               <div className="flex-1 flex justify-center">
                 <div className="h-5 w-48 bg-muted/60 rounded-full" />
               </div>
             </div>
             <div className="flex-1 p-4 sm:p-6 grid grid-cols-4 gap-4">
               {/* Sidebar mockup */}
               <div className="hidden sm:block col-span-1 space-y-3 pr-4 border-r border-border/30">
                 <div className="h-6 w-24 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-md" />
                 <div className="space-y-2 mt-6">
                   {['Dashboard', 'Transactions', 'Accounts', 'Budgets'].map((n, i) => (
                     <div key={n} className={`h-8 rounded-lg flex items-center px-3 gap-2 text-xs ${i === 0 ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'}`}>
                       <div className={`w-4 h-4 rounded ${i === 0 ? 'bg-primary/30' : 'bg-muted/60'}`} />{n}
                     </div>
                   ))}
                 </div>
               </div>
               {/* Main content mockup */}
               <div className="col-span-4 sm:col-span-3 space-y-4">
                 <div className="grid grid-cols-3 gap-3">
                   {[
                     { label: 'Balance', value: '₹85,240', color: 'from-indigo-500/20 to-indigo-500/5' },
                     { label: 'Income', value: '₹1,20,000', color: 'from-violet-500/20 to-violet-500/5' },
                     { label: 'Expenses', value: '₹34,760', color: 'from-purple-500/20 to-purple-500/5' },
                   ].map(c => (
                     <div key={c.label} className={`rounded-xl bg-gradient-to-br ${c.color} p-3 sm:p-4`}>
                       <div className="text-[10px] sm:text-xs text-muted-foreground">{c.label}</div>
                       <div className="text-sm sm:text-lg font-bold mt-1">{c.value}</div>
                     </div>
                   ))}
                 </div>
                 <div className="flex-1 rounded-xl bg-muted/20 border border-border/30 p-4 min-h-[120px] sm:min-h-[160px] relative overflow-hidden">
                   <div className="text-xs text-muted-foreground mb-3">Weekly Overview</div>
                   <div className="flex items-end gap-2 sm:gap-3 h-[80px] sm:h-[120px]">
                     {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                       <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-500/40 to-indigo-500/10 transition-all" style={{ height: `${h}%` }} />
                     ))}
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 border-t border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Active Users', icon: TrendingUp },
              { value: '₹50Cr+', label: 'Tracked Monthly', icon: Wallet },
              { value: '99.9%', label: 'Uptime', icon: ShieldCheck },
              { value: '4.9★', label: 'User Rating', icon: Sparkles },
            ].map((stat) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5"
            >
              Everything you need to <span className="text-gradient">thrive</span>
            </motion.h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stop guessing where your money goes. Trackify provides deep analytics, gorgeous visualizations, and AI to grow your wealth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Deep Analytics',
                desc: 'Instantly understand your financial trajectory with beautifully crafted charts, category breakdowns, and weekly spending trends.',
                gradient: 'from-indigo-500/20 to-indigo-500/5',
                iconColor: 'text-indigo-400',
              },
              {
                icon: Sparkles,
                title: 'AI Advisor',
                desc: 'Let our intelligent AI analyze your spending patterns to suggest savings opportunities and flag overspending automatically.',
                gradient: 'from-purple-500/20 to-purple-500/5',
                iconColor: 'text-purple-400',
              },
              {
                icon: ShieldCheck,
                title: 'Bank-grade Security',
                desc: 'Your financial data is encrypted end-to-end with Supabase. We ensure rigorous standards so you can track with peace of mind.',
                gradient: 'from-violet-500/20 to-violet-500/5',
                iconColor: 'text-violet-400',
              },
            ].map((f, idx) => (
              <motion.div 
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="glass-card p-8 sm:p-10 rounded-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`h-7 w-7 ${f.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 sm:py-32 bg-muted/20 border-t border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
              Get started in <span className="text-gradient">3 simple steps</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up for free in under 30 seconds. No credit card required.', icon: Sparkles },
              { step: '02', title: 'Add Your Accounts', desc: 'Link your bank accounts, wallets, and credit cards in one place.', icon: PieChart },
              { step: '03', title: 'Track & Grow', desc: 'Get real-time insights, budget alerts, and AI-powered suggestions.', icon: TrendingUp },
            ].map((s, idx) => (
              <motion.div 
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 mb-6">
                  <span className="text-2xl font-extrabold text-gradient">{s.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] to-violet-500/[0.05] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[160px] -z-10" />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            Ready to take <span className="text-gradient">control</span>?
          </motion.h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join thousands of users who have revolutionized their financial lives using Trackify.
          </p>
          <Link 
            to="/login"
            className="inline-flex items-center justify-center rounded-full btn-primary-glow px-12 py-5 text-lg font-bold transition-all hover:scale-105 active:scale-[0.98]"
          >
            Create your free account <ArrowRight className="ml-3 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
