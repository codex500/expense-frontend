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
      const s = d?.data?.data ?? {};
      const txList = t?.data?.data?.transactions ?? [];
      try {
        downloadPdf(
          user?.name || 'User',
          user?.email || '',
          s.total_income ?? 0,
          s.total_expense ?? 0,
          s.total_balance ?? 0,
          txList
        );
        show('PDF downloaded', 'success');
      } catch (pdfErr) {
        console.error('PDF generation error:', pdfErr);
        show('PDF generation failed', 'error');
      }
    } catch (apiErr) {
      console.error('API error:', apiErr);
      show('Could not load data for PDF', 'error');
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
    <div className="space-y-6 sm:space-y-8 min-w-0">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Profile</h1>
      <Card className="min-w-0">
        <h2 className="mb-4 text-base sm:text-lg font-semibold text-slate-800 dark:text-white">Account</h2>
        <p className="text-slate-600 dark:text-slate-400 break-words"><span className="font-medium">Name:</span> {user?.name}</p>
        <p className="mt-2 text-slate-600 dark:text-slate-400 break-all"><span className="font-medium">Email:</span> {user?.email}</p>
      </Card>
      <Card className="min-w-0">
        <h2 className="mb-4 text-base sm:text-lg font-semibold text-slate-800 dark:text-white">Monthly budget</h2>
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-end gap-3 sm:gap-4">
          <Input label="Budget (₹)" type="number" step="0.01" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full sm:max-w-xs min-w-0" />
          <Button onClick={handleSaveBudget} loading={saving} className="sm:shrink-0 min-h-[44px]">Update</Button>
        </div>
      </Card>
      <Card className="min-w-0">
        <h2 className="mb-4 text-base sm:text-lg font-semibold text-slate-800 dark:text-white">Download report</h2>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <Button variant="secondary" onClick={handleDownloadPdf} className="min-h-[44px] flex-1 sm:flex-initial">PDF</Button>
          <Button variant="accent" onClick={handleDownloadCsv} className="min-h-[44px] flex-1 sm:flex-initial">CSV</Button>
        </div>
      </Card>
    </div>
  );
}
