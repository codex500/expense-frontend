import { api } from './axios';

// The backend returns amounts in Paise (e.g., 50000 = ₹500.00)
// The response structure is usually `{ success: boolean, message: string, data: any }`

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (fullName: string, email: string, password: string, dob: string, gender?: string, mobileNumber?: string, panCard?: string) =>
    api.post('/auth/signup', { fullName, email, password, dob, gender, mobileNumber, panCard }),
  me: () => api.get('/auth/session'),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  logout: () => api.post('/auth/logout'),
  verifyOtp: (email: string, otp: string) =>
    api.post('/auth/verify-otp', { email, otp }),
  resendOtp: (email: string) =>
    api.post('/auth/resend-otp', { email }),
  updateProfile: (body: { fullName?: string; dob?: string; mobileNumber?: string }) =>
    api.put('/auth/profile', body),
};

export const accountsApi = {
  getAll: () => api.get('/accounts'),
  getSummary: () => api.get('/accounts/summary'),
  create: (body: any) => api.post('/accounts', body),
  update: (id: string, body: any) => api.put(`/accounts/${id}`, body),
  delete: (id: string) => api.delete(`/accounts/${id}`),
  transfer: (body: any) => api.post('/accounts/transfer', body),
};

export const transactionsApi = {
  list: (params?: Record<string, any>) =>
    api.get('/transactions', { params }),
  create: (body: any) => api.post('/transactions', body),
  update: (id: string, body: any) => api.put(`/transactions/${id}`, body),
  delete: (id: string) => api.delete(`/transactions/${id}`),
  exportPdf: () => api.get('/transactions/export/pdf', { responseType: 'blob' }),
};

export const budgetsApi = {
  current: () => api.get('/budgets/current'),
  create: (body: any) => api.post('/budgets', body),
  update: (id: string, body: any) => api.put(`/budgets/${id}`, body),
  delete: (id: string) => api.delete(`/budgets/${id}`),
};

export const analyticsApi = {
  dashboard: () => api.get('/analytics/dashboard'),
  expenseByCategory: (params?: Record<string, any>) => api.get('/analytics/expense-by-category', { params }),
  expenseByAccount: () => api.get('/analytics/expense-by-account'),
  monthly: (months = 6) => api.get('/analytics/monthly', { params: { months } }),
  weekly: () => api.get('/analytics/weekly'),
  spendingTrend: () => api.get('/analytics/spending-trend'),
};

export const advisorApi = {
  insights: () => api.get('/advisor/insights'),
};

export const salaryApi = {
  check: () => api.get('/salary/check'),
  deposit: (body: any) => api.post('/salary/deposit', body),
  history: () => api.get('/salary/history'),
};

export const contactApi = {
  submit: (body: any) => api.post('/contact', body),
};
