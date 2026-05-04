import { useState } from 'react';
import { Search, Filter, Plus, ArrowUpRight, ArrowDownRight, Calendar, CreditCard, Wallet2, X, Download, Trash2, Lock, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions, useAccounts } from '@/hooks/useQueries';
import { useDebounce } from '@/hooks/useDebounce';
import { transactionsApi } from '@/api/endpoints';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

function formatPaise(paise: number): string {
  return (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Salary', 'Rent', 'Education', 'Other'];

export function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data, isLoading, refetch } = useTransactions({ limit: 100 });
  const queryClient = useQueryClient();
  
  const transactions = data?.transactions || [];
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredTxns = debouncedSearchTerm 
    ? transactions.filter((t: any) => 
        t.category?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
        t.note?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    : transactions;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await transactionsApi.exportPdf();
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions_history.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('History exported successfully!');
    } catch (err: any) {
      toast.error('Failed to export PDF: ' + (err?.response?.data?.message || 'Server error'));
    } finally {
      setIsExporting(false);
    }
  };

  const [deleteTxnId, setDeleteTxnId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await transactionsApi.delete(id);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Transaction deleted successfully!');
    } catch (err: any) {
      toast.error('Failed to delete transaction: ' + (err?.response?.data?.message || 'Server error'));
    } finally {
      setDeletingId(null);
      setDeleteTxnId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <ConfirmDialog
        isOpen={!!deleteTxnId}
        onClose={() => setDeleteTxnId(null)}
        onConfirm={() => {
          if (deleteTxnId) handleDelete(deleteTxnId);
        }}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction?"
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground mt-1">Review and manage your financial activity.</p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-3">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl border border-border/50 px-5 py-2.5 text-sm transition-all hover:bg-muted/50 active:scale-[0.99] disabled:opacity-50"
          >
            {isExporting ? <div className="h-4 w-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin mr-2" /> : <Download className="mr-2 h-4 w-4" />}
            Export PDF
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center btn-primary-glow rounded-xl px-5 py-2.5 text-sm transition-all hover:scale-[1.02] active:scale-[0.99]"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-sm text-muted-foreground">
          <div className="flex items-start md:items-center gap-3">
            <div className="min-w-fit rounded-full bg-indigo-500/10 p-2">
              <Lock className="h-4 w-4 text-indigo-500" />
            </div>
            <p>
              <strong className="text-foreground">PDFs are encrypted for security.</strong> To unlock your exported file, use your Date of Birth (<strong className="text-indigo-500">DDMMYYYY</strong>) followed by the first 4 letters of your name (in uppercase). Example: <code className="px-1.5 py-0.5 rounded bg-muted">01012000JOHN</code>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background/50 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4 py-4 w-full animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center gap-4 py-3 sm:py-0 border-b border-border/10 last:border-0">
                 <div className="h-10 w-10 rounded-xl bg-muted/40 shrink-0" />
                 <div className="flex flex-col gap-2 flex-grow w-full">
                    <div className="h-4 w-1/3 bg-muted/40 rounded" />
                    <div className="h-3 w-1/4 bg-muted/40 rounded" />
                 </div>
                 <div className="hidden sm:block h-6 w-24 bg-muted/40 rounded-lg shrink-0" />
                 <div className="h-5 w-20 bg-muted/40 rounded shrink-0 ml-auto" />
                 <div className="h-8 w-8 bg-muted/40 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        ) : filteredTxns.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <Wallet2 className="h-12 w-12 mb-4 opacity-30" />
            <p className="font-medium">No transactions found.</p>
            <p className="text-sm mt-1">{searchTerm ? 'Try adjusting your search.' : 'Click "Add Transaction" to get started.'}</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase">
                  <tr className="bg-muted/20">
                    <th className="px-4 py-3.5 font-medium rounded-tl-xl">Transaction</th>
                    <th className="px-4 py-3.5 font-medium">Account</th>
                    <th className="px-4 py-3.5 font-medium">Date</th>
                    <th className="px-4 py-3.5 font-medium">Note</th>
                    <th className="px-4 py-3.5 font-medium text-right">Amount</th>
                    <th className="px-4 py-3.5 font-medium text-center rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTxns.map((txn: any, idx: number) => {
                    const amountPaise = txn.amountPaise || txn.amount_paise || 0;
                    const date = txn.transactionDate || txn.transaction_date;
                    return (
                      <motion.tr 
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} 
                        key={txn.id} className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 ${
                              txn.type === 'expense' ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'
                            }`}>
                              {txn.type === 'expense' ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                            </div>
                            <span className="font-medium capitalize">{txn.category}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4"><span className="inline-flex items-center rounded-lg bg-muted/40 px-2.5 py-1 text-xs font-medium capitalize">{txn.accountName || '-'}</span></td>
                        <td className="px-4 py-4 text-muted-foreground text-sm">{new Date(date).toLocaleDateString('en-IN')}</td>
                        <td className="px-4 py-4 text-muted-foreground max-w-[200px] truncate text-sm">{txn.note || '-'}</td>
                        <td className={`px-4 py-4 text-right font-semibold ${txn.type === 'expense' ? 'text-destructive' : 'text-success'}`}>
                          {txn.type === 'expense' ? '-' : '+'}₹{formatPaise(amountPaise)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => handleDelete(txn.id)}
                            disabled={deletingId === txn.id}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-50"
                            title="Delete transaction"
                          >
                            {deletingId === txn.id ? <div className="h-4 w-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-1">
               {filteredTxns.map((txn: any) => {
                 const amountPaise = txn.amountPaise || txn.amount_paise || 0;
                 const date = txn.transactionDate || txn.transaction_date;
                 return (
                   <div key={txn.id} className="flex items-center justify-between py-3 hover:bg-muted/20 -mx-2 px-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 ${
                        txn.type === 'expense' ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'
                      }`}>
                        {txn.type === 'expense' ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm capitalize">{txn.note || txn.category}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{txn.category} • {txn.accountName || 'Account'} • {new Date(date).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`font-semibold text-sm ${txn.type === 'expense' ? 'text-destructive' : 'text-success'}`}>
                        {txn.type === 'expense' ? '-' : '+'}₹{formatPaise(amountPaise)}
                      </div>
                      <button
                        onClick={() => setDeleteTxnId(txn.id)}
                        disabled={deletingId === txn.id}
                        className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex items-center justify-center disabled:opacity-50"
                      >
                        {deletingId === txn.id ? <div className="h-3 w-3 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                 );
               })}
            </div>
            
            <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground border-t border-border/50 pt-4">
              <p>Showing {filteredTxns.length} results</p>
            </div>
          </>
        )}
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal open={showModal} onClose={() => setShowModal(false)} onSuccess={() => { refetch(); setShowModal(false); }} />
    </div>
  );
}

/* ── Add Transaction Modal ── */
function AddTransactionModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [accountId, setAccountId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: accountsData } = useAccounts();
  const accounts = accountsData || [];
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!amount || !category || !accountId) {
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      await transactionsApi.create({
        type,
        amountPaise: Math.round(Number(amount) * 100),
        category,
        accountId,
        note: note || undefined,
        transactionDate: date,
      });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['accountSummary'] });
      setAmount(''); setCategory(''); setNote(''); setAccountId('');
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to add transaction.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40 }}
          className="glass-card relative w-full max-h-[90vh] max-w-md overflow-y-auto rounded-t-2xl sm:rounded-2xl p-6 shadow-xl z-[60]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Add Transaction</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground"><X className="h-5 w-5" /></button>
          </div>

          {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              {(['expense', 'income'] as const).map((t) => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border-2 capitalize ${type === t ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 text-muted-foreground hover:border-border'}`}
                >{t}</button>
              ))}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Amount (₹)</label>
              <input type="number" step="0.01" min="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
                className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category</label>
              <select required value={category} onChange={(e) => setCategory(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none">
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Account</label>
              <select required value={accountId} onChange={(e) => setAccountId(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none">
                <option value="">Select account</option>
                {accounts.map((a: any) => <option key={a.id} value={a.id}>{a.accountName || a.account_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Date</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Note <span className="text-muted-foreground">(optional)</span></label>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Lunch at office"
                className="h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl border border-border/50 text-sm font-medium hover:bg-muted/50 transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 h-12 rounded-xl btn-primary-glow text-sm disabled:opacity-50 flex items-center justify-center">
                {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Add'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
