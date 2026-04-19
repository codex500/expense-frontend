import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet2, Landmark, CreditCard, Smartphone, Plus, X, TrendingUp, Edit3, Trash2 } from 'lucide-react';
import { useAccounts } from '@/hooks/useQueries';
import { accountsApi } from '@/api/endpoints';
import { useQueryClient } from '@tanstack/react-query';

function formatPaise(paise: number): string {
  return (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const ACCOUNT_ICONS: Record<string, any> = {
  cash: Wallet2, upi: Smartphone, bank_account: Landmark, credit_card: CreditCard, wallet: Wallet2,
};
const ACCOUNT_GRADIENTS: Record<string, string> = {
  cash: 'from-indigo-500/20 to-blue-500/10',
  upi: 'from-purple-500/20 to-indigo-500/10',
  bank_account: 'from-blue-500/20 to-violet-500/10',
  credit_card: 'from-amber-500/20 to-orange-500/10',
  wallet: 'from-pink-500/20 to-rose-500/10',
};
const ACCOUNT_TYPES = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_account', label: 'Bank Account' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'wallet', label: 'Wallet' },
];

export function Accounts() {
  const { data: accounts, isLoading, refetch } = useAccounts();
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const queryClient = useQueryClient();

  const handleDeleteAccount = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete account "${name}"? This will also delete all associated transactions. This action cannot be undone.`)) {
      try {
        await accountsApi.delete(id);
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        queryClient.invalidateQueries({ queryKey: ['accountSummary'] });
        refetch();
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Failed to delete account.');
      }
    }
  };

  const accountList = Array.isArray(accounts) ? accounts : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const totalBalance = accountList.reduce((sum: number, a: any) => sum + (a.currentBalancePaise || a.current_balance_paise || a.balancePaise || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Accounts</h2>
          <p className="text-muted-foreground mt-1">Manage all your financial accounts in one place.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="w-full sm:w-auto inline-flex items-center justify-center btn-primary-glow rounded-xl px-5 py-2.5 text-sm transition-all hover:scale-[1.02] active:scale-[0.99]">
          <Plus className="mr-2 h-4 w-4" /> Add Account
        </button>
      </div>

      {/* Net Worth */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-primary/10 to-violet-500/5">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Net Worth</p>
            <p className="text-3xl font-extrabold tracking-tight">₹{formatPaise(totalBalance)}</p>
          </div>
        </div>
      </motion.div>

      {/* Account Cards */}
      {accountList.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-12 text-center">
          <Wallet2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No accounts yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">Add your first account to start tracking your finances.</p>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accountList.map((account: any, idx: number) => {
            const type = account.type || 'wallet';
            const Icon = ACCOUNT_ICONS[type] || Wallet2;
            const balance = account.currentBalancePaise || account.current_balance_paise || account.balancePaise || 0;
            const name = account.accountName || account.account_name;
            const bank = account.bankName || account.bank_name;
            return (
              <motion.div key={account.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden hover:glow-primary transition-all group">
                <div className={`h-2 bg-gradient-to-r ${ACCOUNT_GRADIENTS[type] || 'from-primary/20 to-violet-500/10'}`} />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${ACCOUNT_GRADIENTS[type] || 'from-primary/20 to-violet-500/10'}`}>
                      <Icon className="h-5 w-5 text-foreground/70" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{name}</h3>
                      {bank && <p className="text-xs text-muted-foreground">{bank}</p>}
                    </div>
                    {account.isDefault ? (
                      <span className="ml-auto flex items-center justify-center text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">DEFAULT</span>
                    ) : <div className="ml-auto" />}
                  </div>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Balance</p>
                      <p className="text-xl font-bold tracking-tight mt-0.5">₹{formatPaise(balance)}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium bg-muted/40 px-2 py-1 rounded-lg">{type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-border/50">
                    <button onClick={() => setEditingAccount(account)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Edit3 className="h-4 w-4" /></button>
                    <button onClick={() => handleDeleteAccount(account.id, name)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AddAccountModal open={showModal} onClose={() => setShowModal(false)} onSuccess={() => { refetch(); setShowModal(false); }} />
      <EditAccountModal account={editingAccount} onClose={() => setEditingAccount(null)} onSuccess={() => { refetch(); setEditingAccount(null); }} />
    </div>
  );
}

/* ── Add Account Modal ── */
function AddAccountModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [type, setType] = useState('cash');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!accountName) { setError('Account name is required.'); return; }
    setLoading(true);
    try {
      await accountsApi.create({
        accountName,
        bankName: bankName || undefined,
        type,
        initialBalancePaise: Math.round(Number(balance || 0) * 100),
      });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['accountSummary'] });
      setAccountName(''); setBankName(''); setBalance(''); setType('cash');
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          className="glass-card relative w-full max-w-md overflow-y-auto rounded-t-2xl sm:rounded-2xl p-6 shadow-xl z-[60]" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Add Account</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground"><X className="h-5 w-5" /></button>
          </div>
          {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Account Name</label>
              <input type="text" required value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="e.g. Main Savings"
                className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Bank Name <span className="text-muted-foreground">(optional)</span></label>
              <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. SBI, HDFC"
                className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Account Type</label>
              <div className="grid grid-cols-3 gap-2">
                {ACCOUNT_TYPES.map((t) => (
                  <button key={t.value} type="button" onClick={() => setType(t.value)}
                    className={`py-2.5 rounded-xl text-xs font-medium transition-all border-2 ${type === t.value ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 text-muted-foreground hover:border-border'}`}
                  >{t.label}</button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Initial Balance (₹)</label>
              <input type="number" step="0.01" min="0" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="0.00"
                className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl border border-border/50 text-sm font-medium hover:bg-muted/50 transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 h-12 rounded-xl btn-primary-glow text-sm disabled:opacity-50 flex items-center justify-center">
                {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Add Account'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ── Edit Account Modal ── */
function EditAccountModal({ account, onClose, onSuccess }: { account: any; onClose: () => void; onSuccess: () => void }) {
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [type, setType] = useState('cash');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (account) {
      setAccountName(account.accountName || account.account_name);
      setBankName(account.bankName || account.bank_name || '');
      setType(account.type || 'cash');
    }
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!accountName) { setError('Account name is required.'); return; }
    setLoading(true);
    try {
      await accountsApi.update(account.id, {
        accountName,
        bankName: bankName || undefined,
        type,
      });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['accountSummary'] });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update account.');
    } finally {
      setLoading(false);
    }
  };

  if (!account) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          className="glass-card relative w-full max-w-md overflow-y-auto rounded-t-2xl sm:rounded-2xl p-6 shadow-xl z-[60]" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Edit Account</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground"><X className="h-5 w-5" /></button>
          </div>
          {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Account Name</label>
              <input type="text" required value={accountName} onChange={(e) => setAccountName(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Bank Name <span className="text-muted-foreground">(optional)</span></label>
              <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Account Type</label>
              <div className="grid grid-cols-3 gap-2">
                {ACCOUNT_TYPES.map((t) => (
                  <button key={t.value} type="button" onClick={() => setType(t.value)}
                    className={`py-2.5 rounded-xl text-xs font-medium transition-all border-2 ${type === t.value ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 text-muted-foreground hover:border-border'}`}
                  >{t.label}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl border border-border/50 text-sm font-medium hover:bg-muted/50 transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 h-12 rounded-xl btn-primary-glow text-sm disabled:opacity-50 flex items-center justify-center">
                {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
