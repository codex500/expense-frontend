import fs from 'fs';

const filePath = './src/pages/Advisor.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const newFunction = `
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

  // Helper for word boundary regex matching
  const matches = (words: string[]) => new RegExp(\`\\\\b(\${words.join('|')})\\\\b\`, 'i').test(msg);

  // --- 1. Greetings & Small Talk ---
  if (matches(['hello', 'hi', 'hey']) || msg.length < 5) {
    return \`👋 Hey there! I'm your AI financial advisor. Ask me about:\\n\\n• "How am I doing?" — Monthly overview\\n• "Analyze my spending" — Expense breakdown\\n• "Show my budgets" — Budget status\\n• "Can I afford X?" — Spending guidance\\n• "Give me tips" — Financial advice\\n• "Check my accounts" — Balance overview\`;
  }
  if (msg.includes('how are you') || msg.includes('how do you do')) {
    return \`I'm functioning perfectly, thanks for asking! Ready to help you crush your financial goals. How can I assist you today? 🚀\`;
  }
  if (matches(['who are you', 'what are you', 'your name'])) {
    return \`I am Trackify's AI Financial Advisor! I'm designed to analyze your expenses, monitor your budgets, and provide you with personalized financial insights. Think of me as your pocket-sized CFO! 👔\`;
  }
  if (matches(['thanks', 'thank you', 'appreciate'])) {
    return \`You're very welcome! Let me know if you need any more financial advice or data analysis. I'm always here to help! 💙\`;
  }
  if (matches(['joke', 'funny'])) {
    const jokes = [
      "Why did the banker break up with his girlfriend? He lost interest! 😂",
      "Why is money called dough? Because we all knead it! 🍞",
      "I'm on a seafood diet... I see food, and I buy it! (That ruins the budget, though!) 🍔",
      "What's a budget? It's a mathematical confirmation of your suspicions. 📊"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // --- 2. Technical / Support ---
  if (matches(['error', 'not working', 'wrong', 'missing', 'fetch', 'bug', 'support'])) {
    if (msg.includes('data')) {
      let res = \`🔧 **Data Status Check:**\\n\\n\`;
      res += \`• Accounts: \${accounts.length > 0 ? \`✅ \${accounts.length} found\` : '❌ None — add an account first'}\\n\`;
      res += \`• Income: \${income > 0 ? \`✅ ₹\${formatPaise(income)}\` : '⚠️ No income recorded'}\\n\`;
      res += \`• Expenses: \${expense > 0 ? \`✅ ₹\${formatPaise(expense)}\` : '⚠️ No expenses recorded'}\\n\`;
      res += \`• Budgets: \${budgets.length > 0 ? \`✅ \${budgets.length} active\` : '⚠️ None set'}\\n\`;
      res += \`• Categories: \${categories.length > 0 ? \`✅ \${categories.length} tracked\` : '⚠️ No category data yet'}\\n\`;
      res += \`\\n💡 If data appears missing, make sure you've:\\n1. Added at least one account\\n2. Recorded transactions for this month\\n3. Set budgets for tracking\`;
      return res;
    }
    return \`I'm sorry you are experiencing issues! Our team is automatically logging connectivity metrics. \\n\\n**Quick checks:**\\n• Refresh the page or log out and log back in to clear stale sessions.\\n• Data fetch errors usually mean a network disruption or the backend API might be momentarily down.\\n\\nSince this might be related to your data, let's verify:\\nAccounts: \${accounts.length > 0 ? "✅ Synced" : "❌ No Data"}\\nBudgets: \${budgets.length > 0 ? "✅ Synced" : "❌ No Data"}\\n\\nIf the problem persists, please check the 'Settings' -> 'App Info' or contact support@trackifyapp.space.\`;
  }

  // --- 3. Holiday / "Can I spend" questions ---
  if (matches(['holiday', 'afford']) || msg.includes('can i spend') || msg.includes('left to spend')) {
    const remaining = income - expense;
    if (income === 0) return \`📭 No income data yet. Add your salary first!\`;
    const suggestedHoliday = Math.max(0, Math.round(remaining * 0.3));
    return \`🏖️ Based on your current month:\\n\\n• Income: ₹\${formatPaise(income)}\\n• Already spent: ₹\${formatPaise(expense)}\\n• Remaining: ₹\${formatPaise(remaining)}\\n\\n💡 I'd suggest spending at most **₹\${formatPaise(suggestedHoliday)}** on discretionary items (30% of remaining) to stay financially healthy.\`;
  }

  // --- 4. Specific Category Checks (High Priority) ---
  const catKeywords: Record<string, string[]> = {
    'Food': ['food', 'dining', 'restaurant', 'grocery', 'groceries', 'eating'],
    'Travel': ['travel', 'trip', 'flight', 'train', 'bus', 'fuel', 'petrol', 'transport'],
    'Shopping': ['shopping', 'clothes', 'shoes', 'amazon', 'flipkart', 'buy'],
    'Rent': ['rent', 'lease', 'housing', 'apartment'],
    'Bills': ['bill', 'bills', 'electricity', 'water', 'internet', 'wifi', 'utility'],
    'Entertainment': ['entertainment', 'movie', 'movies', 'netflix', 'game', 'gaming', 'concert'],
    'Health': ['health', 'hospital', 'medicine', 'doctor', 'pharmacy', 'medical'],
    'Education': ['education', 'school', 'college', 'course', 'books', 'tuition'],
  };

  for (const [catName, keywords] of Object.entries(catKeywords)) {
    if (matches(keywords)) {
      const cat = categories.find((c: any) => c.category?.toLowerCase() === catName.toLowerCase());
      if (!cat) return \`🔍 No expenses recorded for **\${catName}** this month.\`;
      return \`🏷️ **\${catName} spending:** ₹\${formatPaise(cat.totalPaise || cat.total_paise || 0)} (\${cat.percentage}% of total expenses)\\n\\n\${cat.percentage > 30 ? \`⚠️ That's quite high for \${catName}! Consider cutting back if possible.\` : \`✅ Looks reasonable for your overall budget.\`}\`;
    }
  }

  // --- 5. Tips / Suggestions ---
  if (matches(['tip', 'tips', 'suggest', 'suggestion', 'advice', 'help', 'recommend'])) {
    let res = \`💡 **Smart Tips for You:**\\n\\n\`;
    if (suggestions.length > 0) {
      suggestions.forEach((s: string, i: number) => { res += \`\${i + 1}. \${s}\\n\`; });
    } else {
      res += \`1. Track every expense — even small ones add up.\\n\`;
      res += \`2. Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings.\\n\`;
      res += \`3. Set category budgets to catch overspending early.\\n\`;
      res += \`4. Review your spending weekly, not just monthly.\\n\`;
    }
    if (warnings.length > 0) res += \`\\n⚠️ **Current warnings:** \${warnings.join(' | ')}\`;
    return res;
  }

  // --- 6. Generic Overviews (Lower Priority) ---
  if (matches(['analys', 'analysis', 'analyze', 'overview', 'summary', 'status', 'report']) || msg.includes('how am i doing')) {
    let res = \`📊 **Monthly Financial Summary:**\\n\\n\`;
    res += \`• **Income:** ₹\${formatPaise(income)}\\n\`;
    res += \`• **Expenses:** ₹\${formatPaise(expense)}\\n\`;
    res += \`• **Net Savings:** ₹\${formatPaise(savings)} \${savings >= 0 ? '✅' : '⚠️'}\\n\`;
    if (trends) {
      res += \`\\n📈 **Trends vs last month:**\\n\`;
      res += \`• Income: \${trends.incomeChange > 0 ? '+' : ''}\${trends.incomeChange}%\\n\`;
      res += \`• Expenses: \${trends.expenseChange > 0 ? '+' : ''}\${trends.expenseChange}%\\n\`;
    }
    if (categories.length > 0) {
      res += \`\\n🏷️ **Top spending categories:**\\n\`;
      categories.slice(0, 3).forEach((c: any) => {
        res += \`• \${c.category}: ₹\${formatPaise(c.totalPaise || c.total_paise || 0)} (\${c.percentage}%)\\n\`;
      });
    }
    if (warnings.length > 0) res += \`\\n⚠️ \${warnings[0]}\`;
    return res;
  }

  if (matches(['save', 'saving', 'savings'])) {
    if (income === 0 && expense === 0) return \`📭 No financial data recorded yet. Start tracking to get savings insights!\`;
    let res = \`🏦 **Savings this month:** ₹\${formatPaise(savings)}\\n\`;
    res += savings >= 0 ? 
      \`✅ Great job! You're saving \${income > 0 ? Math.round((savings / income) * 100) : 0}% of your income.\` :
      \`⚠️ You're overspending by ₹\${formatPaise(Math.abs(savings))}. Consider cutting non-essential expenses.\`;
    return res;
  }

  if (matches(['income', 'earn', 'salary'])) {
    if (income === 0) return \`📭 No income recorded this month yet. Record your salary or income transactions to get insights.\`;
    let res = \`💰 **Income this month:** ₹\${formatPaise(income)}\\n\`;
    if (trends?.incomeChange) {
      res += \`\${trends.incomeChange >= 0 ? '📈' : '📉'} That's **\${Math.abs(trends.incomeChange)}% \${trends.incomeChange >= 0 ? 'more' : 'less'}** than last month.\\n\`;
    }
    res += \`\\n**Savings rate:** \${income > 0 ? Math.round((savings / income) * 100) : 0}%\`;
    return res;
  }

  if (matches(['budget', 'budgets'])) {
    if (budgets.length === 0) return \`📋 You haven't set any budgets yet. Go to the **Budgets** page to set up monthly spending limits for better control.\`;
    let res = \`📋 **Active Budgets:**\\n\\n\`;
    budgets.forEach((b: any) => {
      const amt = b.amountPaise || b.amount_paise || 0;
      const spent = b.spentPaise || b.spent_paise || 0;
      const pct = b.percentUsed || b.percent_used || (amt > 0 ? Math.round((spent / amt) * 100) : 0);
      const scope = b.scope === 'overall' ? 'Overall' : (b.category || b.scope || 'Budget');
      res += \`• **\${scope}:** ₹\${formatPaise(spent)} / ₹\${formatPaise(amt)} (\${pct}% used) \${pct > 90 ? '🔴' : pct > 70 ? '🟡' : '🟢'}\\n\`;
    });
    return res;
  }

  if (matches(['account', 'accounts', 'balance', 'net worth', 'wallet', 'money'])) {
    if (accounts.length === 0) return \`🏦 No accounts found. Go to the **Accounts** page to add your first account.\`;
    let res = \`🏦 **Your Accounts:**\\n\\n\`;
    accounts.forEach((a: any) => {
      const bal = a.currentBalancePaise || a.current_balance_paise || 0;
      const name = a.accountName || a.account_name;
      res += \`• **\${name}** (\${a.type?.replace('_', ' ')}): ₹\${formatPaise(bal)}\\n\`;
    });
    res += \`\\n💎 **Total Net Worth:** ₹\${formatPaise(totalBalance)}\`;
    return res;
  }

  if (matches(['expense', 'expenses', 'spending', 'spend', 'spent'])) {
    if (expense === 0) return \`📭 You haven't recorded any expenses this month yet. Start adding transactions to track your spending!\`;
    let res = \`💸 **Your expenses this month:** ₹\${formatPaise(expense)}\\n\\n\`;
    if (categories.length > 0) {
      res += \`**Breakdown by category:**\\n\`;
      categories.forEach((c: any) => {
        const bar = '█'.repeat(Math.max(1, Math.round((c.percentage || 0) / 5)));
        res += \`• \${c.category}: ₹\${formatPaise(c.totalPaise || c.total_paise || 0)} \${bar} \${c.percentage}%\\n\`;
      });
    }
    if (trends?.expenseChange) {
      res += \`\\n\${trends.expenseChange > 0 ? '📈' : '📉'} Your expenses are **\${Math.abs(trends.expenseChange)}% \${trends.expenseChange > 0 ? 'higher' : 'lower'}** than last month.\`;
    }
    return res;
  }

  // --- Default fallback ---
  return \`🤔 I can help with your finances! Try asking me about specific topics like:\\n\\n• **Specific Categories** — "How much did I spend on food or travel?"\\n• **Spending analysis** — "How much did I spend?"\\n• **Income/savings** — "What are my savings?"\\n• **Budgets** — "How are my budgets?"\\n• **Accounts** — "Show my balances"\\n• **Tips** — "Give me financial advice"\\n\\nWhat would you like to know? 💡\`;
}
`;

// Replace the old function
const startIndex = content.indexOf('// Smart response engine that uses real data');
const endIndex = content.indexOf('const QUICK_PROMPTS = [');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.slice(0, startIndex) + newFunction + content.slice(endIndex);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated Advisor.tsx');
} else {
  console.error('Could not find start or end index for replacement.');
}
