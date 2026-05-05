import { api } from './axios';

// The backend returns amounts in Paise (e.g., 50000 = ₹500.00)
// The response structure is usually `{ success: boolean, message: string, data: any }`

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (fullName: string, email: string, password: string, dob: string, gender?: string, mobileNumber?: string, panCard?: string) =>
    api.post('/auth/signup', { fullName, email, password, dob, gender, mobileNumber, panCard }),
  me: () => api.get('/auth/me'),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  logout: () => api.post('/auth/logout'),
  verifyOtp: (email: string, otp: string) =>
    api.post('/auth/verify-otp', { email, otp }),
  resendOtp: (email: string) =>
    api.post('/auth/resend-otp', { email }),
  updateProfile: (body: { fullName?: string; dob?: string; mobileNumber?: string; gender?: string }) =>
    api.patch('/users/update', body),
  deleteAccount: () => api.delete('/users/delete'),
};

export const settingsApi = {
  get: () => api.get('/settings'),
  update: (body: any) => api.patch('/settings', body),
};

export const accountsApi = {
  getAll: () => api.get('/accounts'),
  getSummary: () => api.get('/accounts/summary'),
  create: (body: any) => api.post('/accounts', body),
  update: (id: string, body: any) => api.patch(`/accounts/${id}`, body),
  delete: (id: string) => api.delete(`/accounts/${id}`),
  transfer: (body: any) => api.post('/accounts/transfer', body),
};

export const transactionsApi = {
  list: (params?: Record<string, any>) =>
    api.get('/transactions', { params }),
  create: (body: any) => api.post('/transactions', body),
  update: (id: string, body: any) => api.patch(`/transactions/${id}`, body),
  delete: (id: string) => api.delete(`/transactions/${id}`),
};

export const reportsApi = {
  exportPdf: (params?: Record<string, any>) => api.get('/reports/pdf', { params, responseType: 'blob' }),
  exportCsv: (params?: Record<string, any>) => api.get('/reports/csv', { params, responseType: 'blob' }),
};

export const budgetsApi = {
  current: () => api.get('/budgets/current'),
  create: (body: any) => api.post('/budgets', body),
  update: (id: string, body: any) => api.put(`/budgets/${id}`, body),
  delete: (id: string) => api.delete(`/budgets/${id}`),
};

export const analyticsApi = {
  dashboard: () => api.get('/analytics/summary'),
  expenseByCategory: (params?: Record<string, any>) => api.get('/analytics/category', { params }),
  expenseByAccount: () => api.get('/analytics/expense-by-account'), // Alias kept on backend
  monthly: (months = 6) => api.get('/analytics/monthly', { params: { months } }),
  weekly: () => api.get('/analytics/weekly'), // Alias kept
  spendingTrend: () => api.get('/analytics/trend'),
};

export const advisorApi = {
  insights: () => api.get('/advisor/insights'),
};

export const dashboardApi = {
  summary: () => api.get('/dashboard/summary'),
};

export const salaryApi = {
  check: () => api.get('/salary/check'),
  deposit: (body: any) => api.post('/salary/deposit', body),
  history: () => api.get('/salary/history'),
};

export const contactApi = {
  submit: (body: any) => api.post('/contact', body),
};
