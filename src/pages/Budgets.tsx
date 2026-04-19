import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, AlertTriangle, CheckCircle2, Plus, X } from 'lucide-react';
import { useBudgets } from '@/hooks/useQueries';
import { budgetsApi } from '@/api/endpoints';
import { useQueryClient } from '@tanstack/react-query';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { toast } from 'sonner';

function formatPaise(paise: number): string {
  return (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Rent', 'Education', 'Other'];

export function Budgets() {
  const { data: budgets, isLoading, refetch } = useBudgets();
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);

  const budgetList = Array.isArray(budgets) ? budgets : budgets?.budgets || [];

  const [deleteBudgetId, setDeleteBudgetId] = useState<string | null>(null);

  const handleDeleteBudget = async (id: string) => {
    try {
      await budgetsApi.delete(id);
      toast.success('Budget deleted successfully!');
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete budget.');
    } finally {
      setDeleteBudgetId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const totalBudget = budgetList.reduce((sum: number, b: any) => sum + (b.amountPaise || b.amount_paise || 0), 0);
  const totalSpent = budgetList.reduce((sum: number, b: any) => sum + (b.spentPaise || b.spent_paise || 0), 0);
  const overallPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <ConfirmDialog
        isOpen={!!deleteBudgetId}
        onClose={() => setDeleteBudgetId(null)}
        onConfirm={() => {
          if (deleteBudgetId) handleDeleteBudget(deleteBudgetId);
        }}
        title="Delete Budget"
        message="Are you sure you want to delete this budget?"
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Budgets</h2>
          <p className="text-muted-foreground mt-1">Set limits, track spending, and stay on target.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="w-full sm:w-auto inline-flex items-center justify-center btn-primary-glow rounded-xl px-5 py-2.5 text-sm transition-all hover:scale-[1.02] active:scale-[0.99]">
          <Plus className="mr-2 h-4 w-4" /> Set Budget
        </button>
      </div>

      {/* Overview */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-primary/10 to-violet-500/5">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-start sm:items-center">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Monthly Budget Overview</p>
            <div className="text-3xl font-extrabold">
              ₹{formatPaise(totalSpent)} <span className="text-muted-foreground text-lg font-normal">/ ₹{formatPaise(totalBudget)}</span>
            </div>
            <div className="mt-4 h-3 rounded-full bg-muted/30 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(overallPercent, 100)}%` }} transition={{ duration: 1 }}
                className={`h-full rounded-full ${overallPercent > 90 ? 'bg-gradient-to-r from-red-500 to-red-400' : overallPercent > 70 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-primary to-violet-500'}`} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{overallPercent}% used</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${overallPercent > 90 ? 'bg-destructive/10' : 'bg-success/10'}`}>
              {overallPercent > 90 ? <AlertTriangle className="h-7 w-7 text-destructive" /> : <CheckCircle2 className="h-7 w-7 text-success" />}
            </div>
            <div>
              <p className="font-semibold text-sm">{overallPercent > 90 ? 'Over Budget!' : 'On Track'}</p>
              <p className="text-xs text-muted-foreground">{totalBudget > 0 ? `₹${formatPaise(Math.max(totalBudget - totalSpent, 0))} remaining` : 'No budgets set'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Budget Cards */}
      {budgetList.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} 
          className="glass-card rounded-2xl p-12 text-center">
          <CreditCard className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No budgets set</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">Create your first budget to start tracking spending limits.</p>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgetList.map((budget: any, idx: number) => {
            const amountPaise = budget.amountPaise || budget.amount_paise || 0;
            const spentPaise = budget.spentPaise || budget.spent_paise || 0;
            const percentUsed = budget.percentUsed || budget.percent_used || (amountPaise > 0 ? Math.round((spentPaise / amountPaise) * 100) : 0);
            const remaining = Math.max(amountPaise - spentPaise, 0);
            const status = budget.status || (percentUsed > 100 ? 'exceeded' : percentUsed > 80 ? 'warning' : 'ok');
            return (
              <motion.div key={budget.id || idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} 
                className="glass-card rounded-2xl p-6 hover:glow-primary transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${status === 'exceeded' ? 'bg-destructive/10' : status === 'warning' ? 'bg-warning/10' : 'bg-primary/10'}`}>
                      <CreditCard className={`h-5 w-5 ${status === 'exceeded' ? 'text-destructive' : status === 'warning' ? 'text-warning' : 'text-primary'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm capitalize">{budget.scope === 'overall' ? 'Overall' : (budget.category || budget.scope || 'Budget')}</h3>
                      <p className="text-xs text-muted-foreground">{percentUsed}% used</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingBudget(budget)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    </button>
                    <button onClick={() => setDeleteBudgetId(budget.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent</span>
                    <span className="font-semibold">₹{formatPaise(spentPaise)} / ₹{formatPaise(amountPaise)}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted/30 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(percentUsed, 100)}%` }} transition={{ duration: 0.8, delay: 0.2 + idx * 0.05 }}
                      className={`h-full rounded-full ${status === 'exceeded' ? 'bg-gradient-to-r from-red-500 to-red-400' : status === 'warning' ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-primary to-violet-500'}`} />
                  </div>
                  <p className="text-xs text-muted-foreground">₹{formatPaise(remaining)} remaining</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AddBudgetModal open={showModal} onClose={() => setShowModal(false)} onSuccess={() => { refetch(); setShowModal(false); }} />
      {editingBudget && (
        <EditBudgetModal 
          budget={editingBudget} 
          open={true} 
          onClose={() => setEditingBudget(null)} 
          onSuccess={() => { refetch(); setEditingBudget(null); }} 
        />
      )}
    </div>
  );
}

/* ── Add Budget Modal ── */
function AddBudgetModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [scope, setScope] = useState<'overall' | 'category'>('overall');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const currentMonth = new Date().toISOString().slice(0, 7) + '-01';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!amount || Number(amount) <= 0) { setError('Enter a valid amount.'); return; }
    if (scope === 'category' && !category) { setError('Select a category.'); return; }
    setLoading(true);
    try {
      await budgetsApi.create({
        scope,
        category: scope === 'category' ? category : undefined,
        amountPaise: Math.round(Number(amount) * 100),
        month: currentMonth,
      });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setAmount(''); setCategory(''); setScope('overall');
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create budget.');
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
            <h2 className="text-xl font-bold">Set Budget</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground"><X className="h-5 w-5" /></button>
          </div>
          {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Scope</label>
              <div className="flex gap-2">
                {(['overall', 'category'] as const).map((s) => (
                  <button key={s} type="button" onClick={() => setScope(s)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border-2 capitalize ${scope === s ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 text-muted-foreground hover:border-border'}`}
                  >{s}</button>
                ))}
              </div>
            </div>
            {scope === 'category' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                <select required value={category} onChange={(e) => setCategory(e.target.value)}
                  className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none">
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Budget Amount (₹)</label>
              <input type="number" step="0.01" min="1" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 10000"
                className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <p className="text-xs text-muted-foreground">Budget for: <strong>{new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}</strong></p>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl border border-border/50 text-sm font-medium hover:bg-muted/50 transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 h-12 rounded-xl btn-primary-glow text-sm disabled:opacity-50 flex items-center justify-center">
                {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Budget'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ── Edit Budget Modal ── */
function EditBudgetModal({ budget, open, onClose, onSuccess }: { budget: any; open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [amount, setAmount] = useState((budget.amountPaise / 100).toString());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!amount || Number(amount) <= 0) { setError('Enter a valid amount.'); return; }
    setLoading(true);
    try {
      await budgetsApi.update(budget.id, {
        amountPaise: Math.round(Number(amount) * 100),
      });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update budget.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, y: '100%', scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: '100%', scale: 0.95 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="glass-card relative w-full max-w-md overflow-y-auto rounded-t-2xl sm:rounded-2xl p-6 shadow-xl z-[60]" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Edit Budget</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground"><X className="h-5 w-5" /></button>
          </div>
          {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Scope</label>
              <div className="h-12 w-full rounded-xl border border-input bg-muted/20 px-4 text-sm flex items-center capitalize text-muted-foreground cursor-not-allowed">
                {budget.scope === 'overall' ? 'Overall' : budget.category}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Budget Amount (₹)</label>
              <input type="number" step="0.01" min="1" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 10000"
                className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
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
