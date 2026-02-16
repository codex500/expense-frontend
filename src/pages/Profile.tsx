import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { budgetApi, dashboardApi, transactionsApi } from '@/api/endpoints';
import { downloadPdf } from '@/utils/reportPdf';
import { downloadCsv } from '@/utils/reportCsv';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/hooks/useToast';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [budget, setBudget] = useState(String(user?.monthly_budget ?? 0));
  const [saving, setSaving] = useState(false);
  const { show } = useToast();

  const handleDownloadPdf = async () => {
    try {
      const [d, t] = await Promise.all([dashboardApi.summary(), transactionsApi.list()]);
      const s = d.data.data;
      downloadPdf(user?.name || 'User', s.total_income, s.total_expense, s.total_balance, t.data.data.transactions || []);
      show('PDF downloaded', 'success');
    } catch {
      show('Download failed', 'error');
    }
  };

  const handleDownloadCsv = async () => {
    try {
      const { data } = await transactionsApi.list();
      downloadCsv(data.data.transactions || []);
      show('CSV downloaded', 'success');
    } catch {
      show('Download failed', 'error');
    }
  };

  const handleSaveBudget = async () => {
    const num = Number(budget);
    if (!Number.isFinite(num) || num < 0) {
      show('Enter a valid budget', 'error');
      return;
    }
    setSaving(true);
    try {
      await budgetApi.update(num);
      await refreshUser();
      show('Budget updated', 'success');
    } catch {
      show('Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Profile</h1>
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">Account</h2>
        <p className="text-slate-600 dark:text-slate-400"><span className="font-medium">Name:</span> {user?.name}</p>
        <p className="mt-2 text-slate-600 dark:text-slate-400"><span className="font-medium">Email:</span> {user?.email}</p>
      </Card>
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">Monthly budget</h2>
        <div className="flex flex-wrap items-end gap-4">
          <Input label="Budget (₹)" type="number" step="0.01" value={budget} onChange={(e) => setBudget(e.target.value)} className="max-w-xs" />
          <Button onClick={handleSaveBudget} loading={saving}>Update</Button>
        </div>
      </Card>
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">Download report</h2>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={handleDownloadPdf}>PDF</Button>
          <Button variant="accent" onClick={handleDownloadCsv}>CSV</Button>
        </div>
      </Card>
    </div>
  );
}
