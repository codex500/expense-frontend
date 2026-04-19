import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, ArrowRight, TrendingDown, AlertCircle, Lightbulb, Bot, User, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdvisorInsights, useDashboardAnalytics, useCategoryExpenseAnalytics, useBudgets, useAccounts } from '@/hooks/useQueries';

interface ChatMessage {
  id: string;
  role: 'user' | 'advisor';
  text: string;
  timestamp: Date;
}

function formatPaise(paise: number): string {
  return (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Smart response engine that uses real data
function generateSmartResponse(
  userMsg: string,
  dashData: any,
  catData: any,
  budgetData: any,
  accountData: any,
  advisorData: any,
): string {
  const msg = userMsg.toLowerCase();
  const cm = dashData?.currentMonth;
  const income = cm?.incomePaise ?? 0;
  const expense = cm?.expensePaise ?? 0;
  const savings = income - expense;
  const trends = dashData?.trends;

  const categories = Array.isArray(catData) ? catData : [];
  const budgets = Array.isArray(budgetData) ? budgetData : budgetData?.budgets || [];
  const accounts = Array.isArray(accountData) ? accountData : [];
  const totalBalance = accounts.reduce((s: number, a: any) => s + (a.currentBalancePaise || a.current_balance_paise || 0), 0);

  const warnings = advisorData?.warnings || [];
  const suggestions = advisorData?.suggestions || [];

  // --- Analysis / overview questions ---
  if (msg.includes('analys') || msg.includes('overview') || msg.includes('summary') || msg.includes('how am i doing') || msg.includes('status') || msg.includes('report')) {
    let res = `📊 **Monthly Financial Summary:**\n\n`;
    res += `• **Income:** ₹${formatPaise(income)}\n`;
    res += `• **Expenses:** ₹${formatPaise(expense)}\n`;
    res += `• **Net Savings:** ₹${formatPaise(savings)} ${savings >= 0 ? '✅' : '⚠️'}\n`;
    if (trends) {
      res += `\n📈 **Trends vs last month:**\n`;
      res += `• Income: ${trends.incomeChange > 0 ? '+' : ''}${trends.incomeChange}%\n`;
      res += `• Expenses: ${trends.expenseChange > 0 ? '+' : ''}${trends.expenseChange}%\n`;
    }
    if (categories.length > 0) {
      res += `\n🏷️ **Top spending categories:**\n`;
      categories.slice(0, 3).forEach((c: any) => {
        res += `• ${c.category}: ₹${formatPaise(c.totalPaise || c.total_paise || 0)} (${c.percentage}%)\n`;
      });
    }
    if (warnings.length > 0) res += `\n⚠️ ${warnings[0]}`;
    return res;
  }

  // --- Expense questions ---
  if (msg.includes('expense') || msg.includes('spending') || msg.includes('spend') || msg.includes('spent')) {
    if (expense === 0) return `📭 You haven't recorded any expenses this month yet. Start adding transactions to track your spending!`;
    let res = `💸 **Your expenses this month:** ₹${formatPaise(expense)}\n\n`;
    if (categories.length > 0) {
      res += `**Breakdown by category:**\n`;
      categories.forEach((c: any) => {
        const bar = '█'.repeat(Math.max(1, Math.round((c.percentage || 0) / 5)));
        res += `• ${c.category}: ₹${formatPaise(c.totalPaise || c.total_paise || 0)} ${bar} ${c.percentage}%\n`;
      });
    }
    if (trends?.expenseChange) {
      res += `\n${trends.expenseChange > 0 ? '📈' : '📉'} Your expenses are **${Math.abs(trends.expenseChange)}% ${trends.expenseChange > 0 ? 'higher' : 'lower'}** than last month.`;
    }
    return res;
  }

  // --- Income questions ---
  if (msg.includes('income') || msg.includes('earn') || msg.includes('salary')) {
    if (income === 0) return `📭 No income recorded this month yet. Record your salary or income transactions to get insights.`;
    let res = `💰 **Income this month:** ₹${formatPaise(income)}\n`;
    if (trends?.incomeChange) {
      res += `${trends.incomeChange >= 0 ? '📈' : '📉'} That's **${Math.abs(trends.incomeChange)}% ${trends.incomeChange >= 0 ? 'more' : 'less'}** than last month.\n`;
    }
    res += `\n**Savings rate:** ${income > 0 ? Math.round((savings / income) * 100) : 0}%`;
    return res;
  }

  // --- Savings questions ---
  if (msg.includes('save') || msg.includes('saving')) {
    if (income === 0 && expense === 0) return `📭 No financial data recorded yet. Start tracking to get savings insights!`;
    let res = `🏦 **Savings this month:** ₹${formatPaise(savings)}\n`;
    res += savings >= 0 ? 
      `✅ Great job! You're saving ${income > 0 ? Math.round((savings / income) * 100) : 0}% of your income.` :
      `⚠️ You're overspending by ₹${formatPaise(Math.abs(savings))}. Consider cutting non-essential expenses.`;
    return res;
  }

  // --- Budget questions ---
  if (msg.includes('budget')) {
    if (budgets.length === 0) return `📋 You haven't set any budgets yet. Go to the **Budgets** page to set up monthly spending limits for better control.`;
    let res = `📋 **Active Budgets:**\n\n`;
    budgets.forEach((b: any) => {
      const amt = b.amountPaise || b.amount_paise || 0;
      const spent = b.spentPaise || b.spent_paise || 0;
      const pct = b.percentUsed || b.percent_used || (amt > 0 ? Math.round((spent / amt) * 100) : 0);
      const scope = b.scope === 'overall' ? 'Overall' : (b.category || b.scope || 'Budget');
      res += `• **${scope}:** ₹${formatPaise(spent)} / ₹${formatPaise(amt)} (${pct}% used) ${pct > 90 ? '🔴' : pct > 70 ? '🟡' : '🟢'}\n`;
    });
    return res;
  }

  // --- Account/balance questions ---
  if (msg.includes('account') || msg.includes('balance') || msg.includes('net worth') || msg.includes('wallet') || msg.includes('money')) {
    if (accounts.length === 0) return `🏦 No accounts found. Go to the **Accounts** page to add your first account.`;
    let res = `🏦 **Your Accounts:**\n\n`;
    accounts.forEach((a: any) => {
      const bal = a.currentBalancePaise || a.current_balance_paise || 0;
      const name = a.accountName || a.account_name;
      res += `• **${name}** (${a.type?.replace('_', ' ')}): ₹${formatPaise(bal)}\n`;
    });
    res += `\n💎 **Total Net Worth:** ₹${formatPaise(totalBalance)}`;
    return res;
  }

  // --- Support / Error / Technical questions ---
  if (msg.includes('error') || msg.includes('miss') || msg.includes('fetch') || msg.includes('bug') || msg.includes('support')) {
    let res = `I'm sorry you are experiencing issues! Our team is automatically logging connectivity metrics. \n\n**Quick checks:**\n• Refresh the page or log out and log back in to clear stale sessions.\n• Data fetch errors usually mean a network disruption or the backend API might be momentarily down.\n\nSince this might be related to your data, let's verify:\nAccounts: ${accounts.length > 0 ? "✅ Synced" : "❌ No Data"}\nBudgets: ${budgets.length > 0 ? "✅ Synced" : "❌ No Data"}\n\nIf the problem persists, please check the 'Settings' -> 'App Info' or contact support@trackifyapp.space.`;
    return res;
  }

  // --- Holiday / can I spend questions ---
  if (msg.includes('holiday') || msg.includes('can i spend') || msg.includes('afford') || msg.includes('left to spend')) {
    const remaining = income - expense;
    if (income === 0) return `📭 No income data yet. Add your salary first!`;
    const suggestedHoliday = Math.max(0, Math.round(remaining * 0.3));
    return `🏖️ Based on your current month:\n\n• Income: ₹${formatPaise(income)}\n• Already spent: ₹${formatPaise(expense)}\n• Remaining: ₹${formatPaise(remaining)}\n\n💡 I'd suggest spending at most **₹${formatPaise(suggestedHoliday)}** on discretionary items (30% of remaining) to stay financially healthy.`;
  }

  // --- Food questions ---
  if (msg.includes('food') || msg.includes('dining') || msg.includes('restaurant') || msg.includes('grocery')) {
    const foodCat = categories.find((c: any) => c.category?.toLowerCase() === 'food');
    if (!foodCat) return `🍔 No food expenses recorded this month. Add food transactions to track your dining habits.`;
    return `🍔 **Food spending:** ₹${formatPaise(foodCat.totalPaise || foodCat.total_paise || 0)} (${foodCat.percentage}% of total expenses)\n\n${foodCat.percentage > 30 ? '⚠️ That\'s quite high! Consider meal prepping to save money.' : '✅ Looks reasonable for your overall budget.'}`;
  }

  // --- Tips / suggestions ---
  if (msg.includes('tip') || msg.includes('suggest') || msg.includes('advice') || msg.includes('help') || msg.includes('recommend')) {
    let res = `💡 **Smart Tips for You:**\n\n`;
    if (suggestions.length > 0) {
      suggestions.forEach((s: string, i: number) => { res += `${i + 1}. ${s}\n`; });
    } else {
      res += `1. Track every expense — even small ones add up.\n`;
      res += `2. Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings.\n`;
      res += `3. Set category budgets to catch overspending early.\n`;
      res += `4. Review your spending weekly, not just monthly.\n`;
    }
    if (warnings.length > 0) res += `\n⚠️ **Current warnings:** ${warnings.join(' | ')}`;
    return res;
  }

  // --- Error / data issues ---
  if (msg.includes('error') || msg.includes('not working') || msg.includes('wrong') || msg.includes('missing') || msg.includes('fetch') || msg.includes('data')) {
    let res = `🔧 **Data Status Check:**\n\n`;
    res += `• Accounts: ${accounts.length > 0 ? `✅ ${accounts.length} found` : '❌ None — add an account first'}\n`;
    res += `• Income: ${income > 0 ? `✅ ₹${formatPaise(income)}` : '⚠️ No income recorded'}\n`;
    res += `• Expenses: ${expense > 0 ? `✅ ₹${formatPaise(expense)}` : '⚠️ No expenses recorded'}\n`;
    res += `• Budgets: ${budgets.length > 0 ? `✅ ${budgets.length} active` : '⚠️ None set'}\n`;
    res += `• Categories: ${categories.length > 0 ? `✅ ${categories.length} tracked` : '⚠️ No category data yet'}\n`;
    res += `\n💡 If data appears missing, make sure you've:\n1. Added at least one account\n2. Recorded transactions for this month\n3. Set budgets for tracking`;
    return res;
  }

  // --- Greeting ---
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.length < 5) {
    return `👋 Hey there! I'm your AI financial advisor. Ask me about:\n\n• "How am I doing?" — Monthly overview\n• "Analyze my spending" — Expense breakdown\n• "Show my budgets" — Budget status\n• "Can I afford X?" — Spending guidance\n• "Give me tips" — Financial advice\n• "Check my accounts" — Balance overview`;
  }

  // --- Small talk ---
  if (msg.includes('how are you') || msg.includes('how do you do')) {
    return `I'm functioning perfectly, thanks for asking! Ready to help you crush your financial goals. How can I assist you today? 🚀`;
  }

  if (msg.includes('who are you') || msg.includes('what are you') || msg.includes('your name')) {
    return `I am Trackify's AI Financial Advisor! I'm designed to analyze your expenses, monitor your budgets, and provide you with personalized financial insights. Think of me as your pocket-sized CFO! 👔`;
  }

  if (msg.includes('thanks') || msg.includes('thank you') || msg.includes('appreciate')) {
    return `You're very welcome! Let me know if you need any more financial advice or data analysis. I'm always here to help! 💙`;
  }

  if (msg.includes('joke') || msg.includes('funny')) {
    const jokes = [
      "Why did the banker break up with his girlfriend? He lost interest! 😂",
      "Why is money called dough? Because we all knead it! 🍞",
      "I'm on a seafood diet... I see food, and I buy it! (That ruins the budget, though!) 🍔",
      "What's a budget? It's a mathematical confirmation of your suspicions. 📊"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // --- Default fallback ---
  return `🤔 I can help with your finances! Here's what I can answer:\n\n• **Spending analysis** — "How much did I spend?"\n• **Income/savings** — "What are my savings?"\n• **Budgets** — "How are my budgets?"\n• **Accounts** — "Show my balances"\n• **Tips** — "Give me financial advice"\n• **Data check** — "Is my data correct?"\n\nTry asking one of these! 💡`;
}

const QUICK_PROMPTS = [
  "How am I doing this month?",
  "Analyze my expenses",
  "Show my budgets",
  "Give me savings tips",
  "Check my account balances",
  "Is my data correct?",
];

export function Advisor() {
  const { data: advisorData, isLoading: advisorLoading } = useAdvisorInsights();
  const { data: dashData } = useDashboardAnalytics();
  const { data: catData } = useCategoryExpenseAnalytics();
  const { data: budgetData } = useBudgets();
  const { data: accountData } = useAccounts();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Welcome message
  useEffect(() => {
    if (!advisorLoading && messages.length === 0) {
      const welcome: ChatMessage = {
        id: generateId(),
        role: 'advisor',
        text: `👋 Welcome to your AI Financial Advisor!\n\nI analyze your real financial data to give personalized insights. Ask me anything about your spending, savings, budgets, or accounts.\n\n${advisorData?.warnings?.length ? `⚠️ **Heads up:** ${advisorData.warnings[0]}` : '✅ Your finances look healthy right now!'}`,
        timestamp: new Date(),
      };
      setMessages([welcome]);
    }
  }, [advisorLoading]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: generateId(), role: 'user', text: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate brief "thinking" delay
    setTimeout(() => {
      const response = generateSmartResponse(text, dashData, catData, budgetData, accountData, advisorData);
      const advisorMsg: ChatMessage = { id: generateId(), role: 'advisor', text: response, timestamp: new Date() };
      setMessages(prev => [...prev, advisorMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (advisorLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Sparkles className="h-10 w-10 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground text-sm">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">AI Advisor</h2>
            <p className="text-xs text-muted-foreground">Powered by your real financial data</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])} 
          className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground transition-colors" 
          title="Reset chat"
        >
          <RefreshCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'advisor' ? 'bg-gradient-to-br from-indigo-500/20 to-violet-500/20' : 'bg-primary/10'
              }`}>
                {msg.role === 'advisor' ? <Bot className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-primary" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground ml-auto' 
                  : 'glass-card'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text.split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
                )}</div>
                <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-primary-foreground/50' : 'text-muted-foreground/50'}`}>
                  {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="glass-card rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts (show when chat is empty or short) */}
      {messages.length <= 1 && (
        <div className="py-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="glass-card rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="pt-3 border-t border-border/50">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your finances..."
            disabled={isTyping}
            className="flex-1 h-12 rounded-xl border border-input bg-background/50 px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="h-12 w-12 rounded-xl btn-primary-glow flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
