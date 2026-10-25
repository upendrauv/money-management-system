# Money Management System - Backend API

Production-grade Spring Boot 3.4 REST API with Spring Security, JWT authentication, and MySQL (Aiven) integration.

## 🚀 Features

- **Authentication & Authorization**: Registration, login, JWT token issuance & validation, BCrypt password hashing.
- **Income Tracking**: Record income sources, category classification, date filtering, monthly aggregations.
- **Expense Tracking**: Record expenditures, payment methods (Credit Card, Debit Card, Cash, etc.), category tagging.
- **Bill Management**: Track upcoming & overdue bills, frequency (monthly, yearly, one-time), mark paid/pending, status updates.
- **Monthly Budgeting**: Budget limits per category, real-time spent vs. allocated tracking, percentage used, over-budget warnings.
- **Financial Analytics & Dashboard**: Monthly savings rate, total balance, 6-month historical trends, category breakdown.
- **Aiven MySQL Compatible**: Full SSL support (`sslMode=REQUIRED` / `useSSL=true`).
- **Render Deployment Ready**: Built-in `Dockerfile`, `render.yaml`, dynamic `$PORT` binding, and health check endpoint at `/api/health`.

---

## ⚙️ Environment Variables

| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | Web port (Render injects automatically) | `8080` |
| `SPRING_DATASOURCE_URL` | MySQL JDBC URL (Aiven or local) | `jdbc:mysql://<host>:<port>/<dbname>?sslMode=REQUIRED` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `avnadmin` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `<your-aiven-password>` |
| `JWT_SECRET` | 256-bit secret key for signing tokens | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
| `JWT_EXPIRATION_MS` | Token expiry time in milliseconds | `86400000` (24 hours) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed frontend origins | `https://your-frontend.vercel.app,http://localhost:5173` |

---

## ☁️ Deploying Backend on Render

### Method 1: Using the Render Web Dashboard (Recommended)

1. Push your project repository to GitHub / GitLab.
2. Log in to [Render](https://render.com).
3. Click **New +** > **Web Service**.
4. Connect your Git repository.
5. Configure the service:
   - **Name**: `money-management-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `Dockerfile`
   - **Docker Context**: `.` (or `backend` if deploying from repo root)
6. Add the following **Environment Variables** in the Render settings:
   - `SPRING_DATASOURCE_URL`: your Aiven MySQL URI (e.g. `jdbc:mysql://mysql-xxxxx.aivencloud.com:15432/defaultdb?sslMode=REQUIRED`)
   - `SPRING_DATASOURCE_USERNAME`: your Aiven MySQL username (e.g. `avnadmin`)
   - `SPRING_DATASOURCE_PASSWORD`: your Aiven MySQL password
   - `JWT_SECRET`: any secure 32+ character random string
   - `CORS_ALLOWED_ORIGINS`: your Vercel frontend URL (e.g. `https://money-management-app.vercel.app`)
7. Click **Create Web Service**. Render will automatically build the Docker container and start your service!
8. Your health check endpoint will be live at: `https://<your-service-name>.onrender.com/api/health`

---

## 🛠️ Local Development

### Prerequisites
- JDK 21+
- Maven 3.9+
- MySQL or run with H2 fallback

### Run locally:
```bash
# Using default MySQL configuration:
mvn spring-boot:run

# Or run with the in-memory H2 profile for instant testing:
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

The API will be available at: `http://localhost:8080`
H2 Console (when on h2 profile): `http://localhost:8080/h2-console`

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate & receive JWT token
- `GET /api/auth/me` - Get current user profile (requires Bearer token)

### 💵 Incomes (`/api/incomes`)
- `GET /api/incomes?month=X&year=Y` - Get all incomes (optional filter by month & year)
- `POST /api/incomes` - Add an income entry
- `GET /api/incomes/{id}` - Get income by ID
- `PUT /api/incomes/{id}` - Update income entry
- `DELETE /api/incomes/{id}` - Delete income entry

### 💳 Expenses (`/api/expenses`)
- `GET /api/expenses?month=X&year=Y` - Get all expenses (optional filter by month & year)
- `POST /api/expenses` - Record an expense
- `GET /api/expenses/{id}` - Get expense by ID
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### 🧾 Bills (`/api/bills`)
- `GET /api/bills?status=PENDING` - List bills (optional status filter: PENDING, PAID, OVERDUE)
- `POST /api/bills` - Create a new bill reminder
- `GET /api/bills/{id}` - Get bill by ID
- `PUT /api/bills/{id}` - Update bill
- `PATCH /api/bills/{id}/pay` - Mark bill as paid
- `PATCH /api/bills/{id}/pending` - Mark bill as pending
- `DELETE /api/bills/{id}` - Delete bill

### 📊 Budgets (`/api/budgets`)
- `GET /api/budgets?month=X&year=Y` - Get monthly budgets with actual spending & progress %
- `POST /api/budgets` - Set or update budget for a category
- `DELETE /api/budgets/{id}` - Delete budget

### 📈 Dashboard (`/api/dashboard`)
- `GET /api/dashboard/summary?month=X&year=Y` - Complete financial overview (income, expenses, savings rate, budget usage, pending bills, charts data)

### 🩺 Health (`/api/health`)
- `GET /api/health` - Health check status

