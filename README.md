# Trackify – Expense Tracker Frontend

Production-ready React (Vite + TypeScript) frontend for the Trackify expense tracker. Connects to your deployed backend API.

## Stack

- React 18, Vite 5, TypeScript
- Tailwind CSS, Recharts, React Router, React Hook Form
- Axios (JWT interceptor), jsPDF + jspdf-autotable (PDF report), custom CSV export
- Context API (Auth, Theme, Toast)

## Setup

```bash
cd trackify
npm install
cp .env.example .env
# Edit .env and set VITE_API_URL to your backend API base URL (e.g. https://your-backend.onrender.com/api)
npm run dev
```

Open `http://localhost:5173`. Use **Register** or **Login** to access the app.

## Build

```bash
npm run build
```

Output is in `dist/`.

## Deploy on Vercel

1. Push the `trackify` folder to a Git repo (or use the monorepo root and set root to `trackify`).
2. Go to [Vercel](https://vercel.com) → **Add New** → **Project** → import the repo.
3. **Root Directory:** set to `trackify` if the repo root is the parent folder.
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Environment Variables (required):** In Project Settings → Environment Variables, add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend.onrender.com/api` (your backend API base URL including `/api`)
   - Apply to Production, Preview, Development.
7. Redeploy after adding the variable (Vite embeds env vars at build time).

> **If you get 404 on login/register:** The API URL is missing. Add `VITE_API_URL` in Vercel and trigger a new deployment.

## File structure

```
trackify/
  public/
    favicon.svg
  src/
    api/          axios instance, endpoints
    components/   ui (Button, Card, Input, Logo), layout (Sidebar, Navbar), common (Loader, EmptyState, Toast), TransactionTable, ChartCard, ProtectedRoute
    context/      AuthContext, ThemeContext, ToastContext
    hooks/        useToast
    pages/        Login, Register, ForgotPassword, Dashboard, Transactions, Analytics, Advisor, Profile, AddTransactionModal
    types/        index (models), toast
    utils/        reportPdf, reportCsv, advisorLogic
    App.tsx, main.tsx, index.css
  .env.example
  vite.config.ts
  tailwind.config.js
```

## Backend API

Ensure the backend exposes:

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/dashboard`
- `GET /api/transactions`, `POST /api/transactions`, `DELETE /api/transactions/:id`
- `GET /api/budget/status`, `PUT /api/budget`
- `GET /api/analytics/category-expense`, `GET /api/analytics/monthly-spending`, `GET /api/analytics/last-7-days`

JWT is sent as `Authorization: Bearer <token>` and stored in `localStorage`.
