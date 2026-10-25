# 💰 SpendWise - Money Management System

A full-stack financial management platform designed to track income, control expenses, manage bills with due date alerts, and maintain monthly category budgets with visual progress metrics.

- **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons *(Configured for Vercel)*
- **Backend**: Spring Boot 3.4 + Spring Security + JWT *(Configured for Render)*
- **Database**: MySQL 8.x *(Configured for Aiven Cloud MySQL with SSL)*

---

## 📁 Project Architecture

```
money-management-system/
├── backend/                  # Spring Boot REST API
│   ├── src/main/java/        # Entities, DTOs, Repositories, Services, Controllers
│   ├── src/main/resources/   # application.properties (MySQL & H2 profiles)
│   ├── Dockerfile            # Multi-stage production container build for Render
│   ├── render.yaml           # Render deployment blueprint
│   ├── schema.sql            # MySQL schema definition
│   ├── pom.xml               # Maven dependencies (Java 21)
│   └── README.md             # Backend setup & deployment guide
│
├── frontend/                 # React SPA (Vite)
│   ├── src/
│   │   ├── api/              # Axios HTTP client with JWT interceptors
│   │   ├── context/          # AuthContext (login, register, session)
│   │   ├── components/       # Badges, Modals, StatCards, Navbar, Sidebar
│   │   └── pages/            # Dashboard, Income, Expenses, Bills, Budgets, Auth
│   ├── vercel.json           # Vercel SPA rewrite rules
│   ├── vite.config.js        # Vite build & local dev proxy setup
│   ├── package.json          # Node dependencies
│   └── README.md             # Frontend setup & deployment guide
│
├── .gitignore
└── README.md                 # Full project documentation
```

---

## 🌟 Features Overview

| Feature | Description |
|---|---|
| **User Authentication** | Registration, Login, BCrypt hashing, stateless JWT authorization with token expiry handling. |
| **Income Tracking** | Categorized income streams (Salary, Freelance, Business, Investments, Rental), month/year filtering, search, and totals. |
| **Expense Tracking** | Itemized expenditures with payment methods (Cards, Cash, Bank Transfer), category categorization, and notes. |
| **Bill Management** | Bill reminders with due dates, pending/paid/overdue status, recurring frequencies, and remaining days indicator. |
| **Monthly Budget** | Set monthly budget limits per category, live budget usage progress bars (Green/Amber/Red), and over-budget warnings. |
| **Financial Dashboard** | Net balance, monthly income, expenses, savings rate, 6-month trends chart, category breakdown, and upcoming bill reminders. |

---

## 🚀 Quick Deployment Guide

### Step 1: Create Aiven MySQL Database

1. Go to [Aiven Console](https://console.aiven.io) and create a free MySQL service (e.g., `mysql-moneymanager`).
2. In the Service Overview, copy the **Service URI** or connection parameters:
   - **Host** (e.g., `mysql-37xxxx-user.aivencloud.com`)
   - **Port** (e.g., `15432`)
   - **User** (default: `avnadmin`)
   - **Password**
   - **Database Name** (default: `defaultdb`)
3. Format the JDBC connection URL for Spring Boot:
   ```
   jdbc:mysql://<HOST>:<PORT>/<DATABASE>?sslMode=REQUIRED&useSSL=true&allowPublicKeyRetrieval=true
   ```

---

### Step 2: Deploy Backend to Render

1. Push this repository to GitHub or GitLab.
2. Sign in to [Render](https://render.com) and click **New +** > **Web Service**.
3. Select your repository.
4. Set the following parameters:
   - **Name**: `money-management-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
   - **Plan**: Free
5. In **Environment Variables**, add:
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<HOST>:<PORT>/<DATABASE>?sslMode=REQUIRED&useSSL=true&allowPublicKeyRetrieval=true`
   - `SPRING_DATASOURCE_USERNAME`: `avnadmin`
   - `SPRING_DATASOURCE_PASSWORD`: `<your-aiven-password>`
   - `JWT_SECRET`: Any secure 64-character hex string (e.g. `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`)
   - `CORS_ALLOWED_ORIGINS`: `*` (or your future Vercel URL, e.g. `https://your-app.vercel.app`)
6. Click **Create Web Service**.
7. Once deployed, note your service URL (e.g. `https://money-management-backend.onrender.com`).
8. Verify health status at: `https://money-management-backend.onrender.com/api/health`.

---

### Step 3: Deploy Frontend to Vercel

1. Log in to [Vercel](https://vercel.com) and click **Add New...** > **Project**.
2. Select your repository.
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the **Environment Variable**:
   - `VITE_API_BASE_URL`: The URL of your Render backend (e.g. `https://money-management-backend.onrender.com`)
5. Click **Deploy**.
6. Once deployed, copy your Vercel URL (e.g. `https://money-management-system.vercel.app`).
7. *(Optional Best Practice)* Update `CORS_ALLOWED_ORIGINS` in your Render backend settings with your actual Vercel domain.

---

## 💻 Running the Full Stack Locally

### 1. Run Backend
```bash
cd backend

# Option A: Connect to your Aiven MySQL database:
$env:SPRING_DATASOURCE_URL="jdbc:mysql://<host>:<port>/<dbname>?sslMode=REQUIRED"
$env:SPRING_DATASOURCE_USERNAME="avnadmin"
$env:SPRING_DATASOURCE_PASSWORD="<password>"
mvn spring-boot:run

# Option B: Run in offline/testing mode using the built-in H2 profile:
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```
Backend runs at `http://localhost:8080`.

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.
Local API calls are automatically proxied to `http://localhost:8080`.

