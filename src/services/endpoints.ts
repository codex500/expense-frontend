import { api } from './api';

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (fullName: string, email: string, password: string, dob: string, gender?: string, mobileNumber?: string) =>
    api.post('/auth/signup', { fullName, email, password, dob, gender, mobileNumber }),
  verifyEmail: (email: string, token: string) =>
    api.post('/auth/verify-email', { email, token }),
  resendVerification: (email: string) =>
    api.post('/auth/resend-verification', { email }),
  me: () => api.get('/auth/me'),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (accessToken: string, newPassword: string) =>
    api.post('/auth/reset-password', { accessToken, newPassword }),
  logout: () => api.post('/auth/logout'),
  onboarding: (body: any) => api.post('/auth/onboarding', body),
  updateProfile: (body: { fullName?: string; dob?: string; mobileNumber?: string; gender?: string }) =>
    api.put('/auth/profile', body),
  deleteAccount: () => api.delete('/auth/account'),
  getOAuthUrl: (provider: 'google') => api.get(`/auth/oauth/${provider}`),
  generatePasskeyRegistration: () => api.get('/auth/passkey/register/options'),
  verifyPasskeyRegistration: (response: any) => api.post('/auth/passkey/register/verify', response),
  generatePasskeyAuth: (email: string) => api.post('/auth/passkey/authenticate/options', { email }),
  verifyPasskeyAuth: (email: string, response: any) => api.post('/auth/passkey/authenticate/verify', { email, response }),
};

export const accountsService = {
  getAll: () => api.get('/accounts'),
  getById: (id: string) => api.get(`/accounts/${id}`),
  create: (body: any) => api.post('/accounts', body),
  update: (id: string, body: any) => api.put(`/accounts/${id}`, body),
  delete: (id: string) => api.delete(`/accounts/${id}`),
};

export const categoriesService = {
  getAll: () => api.get('/categories'),
  create: (body: any) => api.post('/categories', body),
  update: (id: string, body: any) => api.put(`/categories/${id}`, body),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const transactionsService = {
  list: (params?: Record<string, any>) =>
    api.get('/transactions', { params }),
  getById: (id: string) => api.get(`/transactions/${id}`),
  create: (body: any) => api.post('/transactions', body),
  update: (id: string, body: any) => api.put(`/transactions/${id}`, body),
  delete: (id: string) => api.delete(`/transactions/${id}`),
};

export const budgetsService = {
  list: (params?: { month?: string }) => api.get('/budgets', { params }),
  upsert: (body: any) => api.post('/budgets', body),
  create: (body: any) => api.post('/budgets', body),
  update: (id: string, body: any) => api.patch(`/budgets/${id}`, body),
  delete: (id: string) => api.delete(`/budgets/${id}`),
};

export const dashboardService = {
  summary: () => api.get('/dashboard'),
};

export const analyticsService = {
  dashboard: (params?: { months?: number }) => api.get('/analytics', { params }),
};

export const notificationsService = {
  list: (params?: { limit?: number }) => api.get('/notifications', { params }),
  unreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const contactApi = {
  submit: (data: any) => api.post('/contact', data),
};

export const reportsService = {
  downloadPdf: (params?: Record<string, any>) => api.get('/reports/pdf', { params, responseType: 'blob' }),
  downloadCsv: (params?: Record<string, any>) => api.get('/reports/csv', { params, responseType: 'blob' }),
};
