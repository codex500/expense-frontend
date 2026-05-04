export interface User {
  id: string;
  email: string;
  fullName: string;
  dob?: string;
  gender?: string;
  phone?: string;
  pan?: string;
  emailVerified?: boolean;
  defaultCurrency?: string;
  themePreference?: string;
  onboardingCompleted?: boolean;
  accountCount?: number;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginResponse {
  user: User;
  session: Session;
  onboardingCompleted: boolean;
  salaryPendingForMonth: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  type: 'income' | 'expense' | 'transfer';
  amountPaise: number;
  category: string;
  note: string | null;
  transactionDate: string;
  createdAt: string;
}

export interface Account {
  id: string;
  accountName: string;
  type: 'cash' | 'upi' | 'bank_account' | 'credit_card' | 'wallet';
  currentBalancePaise: number;
  icon?: string;
  color?: string;
  isDefault?: boolean;
}

export interface AccountSummary {
  totalAccounts: number;
  totalBalancePaise: number;
  byType: Record<string, number>;
}

export interface DashboardSummary {
  currentMonth: {
    incomePaise: number;
    expensePaise: number;
    savingsPaise: number;
  };
  trends: {
    expenseChange: number;
  };
}

export interface BudgetStatus {
  scope: string;
  category?: string;
  amountPaise: number;
  spentPaise: number;
  percentUsed: number;
  status: string;
  alert90Sent?: boolean;
}

export interface CategoryExpense {
  category: string;
  amountPaise: number;
}

export interface AdvisorInsights {
  insights: string[];
  warnings: string[];
  suggestions: string[];
}

export interface AddTransactionInput {
  type: 'income' | 'expense';
  amountPaise: number;
  category: string;
  accountId: string;
  note?: string;
  transactionDate: string;
}
