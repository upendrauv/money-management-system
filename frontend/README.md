# Money Management System - Frontend (React + Vite + Tailwind CSS)

Modern, ultra-responsive money management dashboard built with React 18, Vite, and Tailwind CSS.

## 🌟 Key Features

- **Auth & Session Management**: Clean Login & Registration interfaces, JWT persistence in localStorage, automatic 401 token expiration handling.
- **Financial Dashboard**:
  - Net lifetime savings, monthly income, expenses, and savings rate.
  - Interactive 6-month historical income vs. expense chart.
  - Category spending breakdown progress bars.
  - Active bills notification banner with urgent overdue alerts.
  - Quick-action shortcuts to log transactions and budgets with a single click.
- **Income Tracker**:
  - Filter by month, year, or search query.
  - Tag sources by category (Salary, Freelance, Investments, Rental, Business, etc.).
  - Add, edit, and delete income entries.
- **Expense Tracker**:
  - Real-time expense categorization (Housing, Dining, Groceries, Utilities, Subscriptions, etc.).
  - Track payment methods (Credit Card, Debit Card, Cash, Bank Transfer, Online).
  - Search, month/year filters, and category filters.
- **Bills & Subscriptions Manager**:
  - Tabbed views: *All*, *Pending*, *Overdue*, and *Paid*.
  - Overdue badges with live countdown of days remaining.
  - One-click *Mark as Paid* / *Mark as Pending*.
  - Recurring frequency options (Monthly, Weekly, Yearly, One-time).
- **Monthly Budget Planner**:
  - Category-based budget limits.
  - Visual color-coded progress bars (Green < 70%, Amber 70-90%, Red > 90% or Exceeded).
  - Live calculation of spent vs. allocated amounts.

---

## ⚙️ Environment Variables

| Variable | Description | Example / Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of your deployed Spring Boot API on Render | `https://your-backend.onrender.com` (leave empty for local dev proxy) |

---

## ☁️ Deploying Frontend on Vercel

### Option 1: Via Vercel Web Dashboard (Recommended)

1. Push your repository to GitHub or GitLab.
2. Log in to [Vercel](https://vercel.com).
3. Click **Add New...** > **Project**.
4. Import your Git repository.
5. In the project configuration:
   - **Framework Preset**: Vite
   - **Root Directory**: Click *Edit* and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Expand **Environment Variables** and add:
   - `VITE_API_BASE_URL`: The URL of your Render backend (e.g., `https://money-management-backend.onrender.com`)
7. Click **Deploy**. Vercel will build the frontend and provide your live production URL (e.g. `https://money-management-frontend.vercel.app`).

> **Note on Routing**: The included `vercel.json` ensures that client-side SPA routing redirects correctly without 404 errors when pages are reloaded.

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```

The app will start on `http://localhost:5173`.
API calls to `/api` are automatically proxied to `http://localhost:8080`.

### 3. Build for Production
```bash
npm run build
```
Build files will be generated in `dist/`.

