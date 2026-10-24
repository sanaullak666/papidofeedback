# 🚕 Papido Booking Opinion Survey Platform

[![License: ISC](https://img.shields.io/badge/License-ISC-amber.svg)](https://opensource.org/licenses/ISC)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)
[![Node](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://mysql.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan.svg)](https://tailwindcss.com/)

A standalone, production-ready opinion survey and analytics web application created for **Papido**.

> **Suggested Production Domain:** `feedback.papido.online`  
> **Platform Title:** Papido — Your Opinion Matters  
> **Core Mission:** *"We're planning the next step for Papido booking. Before we launch, we want to hear from you."*

---

## 1. Project Purpose

Papido currently accepts campus ride bookings primarily through **WhatsApp**. As Papido prepares to introduce a dedicated online ride-booking platform, this standalone feedback application provides an official, neutral channel to gather actionable intelligence:

1. **Current WhatsApp Experience**: Gauges real rider satisfaction, strengths (familiarity, direct contact), and bottlenecks (message delays, missing ride history).
2. **New Online Booking Preview**: Introduces the upcoming website with live links to test and evaluate the booking flow.
3. **Website Feedback**: Captures ease of use, design impressions, speed, and critical pre-launch fixes.
4. **WhatsApp vs. Website Comparison**: Directly answers whether riders prefer WhatsApp, the Website, or a hybrid of both.
5. **Key Strategic Decision**: Quantifies user sentiment on whether Papido should:
   - 🟢 Launch the new website alongside WhatsApp
   - 🔵 Move primarily to website booking
   - 🟡 Launch the website after making improvements
   - 🟣 Continue with WhatsApp booking
   - ⚪ Not sure
6. **Feature Prioritization**: Ranks demand for ride confirmations, ride history, status tracking, notifications, online payments, and cancellations.
7. **Executive Dashboard**: Provides real-time analytics charts, searchable response lists, status workflows, and CSV/Excel data exports for Papido leadership.

---

## 2. Technologies Used

### Frontend (`/client`)
- **React 18** with functional components and hooks
- **Vite 6** for fast compilation, HMR, and optimized chunk-split production builds
- **Tailwind CSS 3.4** custom-themed with Papido's amber palette and typography
- **Lucide React** for modern UI icons
- **Recharts** for interactive analytics charts (Bar, Pie, Line, and Area)
- **Canvas-Confetti** for celebratory submission animations
- **LocalStorage Auto-Save** to ensure accidental browser reloads never lose in-progress responses

### Backend (`/server`)
- **Node.js** & **Express.js** REST API
- **MySQL 8.0** with `mysql2/promise` connection pooling and prepared statements (SQL injection protection)
- **JWT (JSON Web Tokens)** for stateless admin authorization
- **Bcrypt.js** with 10 salt rounds for admin password hashing
- **Helmet** for HTTP security headers
- **CORS** configured for allowed development and production origins
- **Express-Rate-Limit** to prevent survey spam and brute-force login attempts
- **ExcelJS** for generating styled `.xlsx` reports
- **Morgan** for HTTP access logging

---

## 3. Directory Structure

```
papido-feed/
├── package.json               # Root scripts (dev, build, migrate, seed, test:e2e)
├── test-e2e.js                # Full 12-step end-to-end integration test runner
├── .gitignore
├── README.md
│
├── server/                    # Backend Node.js / Express / MySQL API
│   ├── .env                   # Local environment variables
│   ├── .env.example           # Example template
│   ├── package.json
│   └── src/
│       ├── config/            # Centralized environment configuration
│       ├── controllers/       # Survey and Admin controller logic
│       ├── db/
│       │   ├── connection.js  # MySQL connection pool & DB auto-creation
│       │   ├── migrate.js     # Schema DDL (admin_users, survey_responses, logs, settings)
│       │   └── seed.js        # Default admin seeder & realistic demo dataset
│       ├── middleware/        # JWT auth verification & rate limiters
│       ├── routes/            # REST API route definitions
│       ├── utils/             # Reference generator (PAP-FB-XXXXXX) & activity logger
│       └── server.js          # Express app entry point
│
└── client/                    # Frontend React + Vite + Tailwind SPA
    ├── .env                   # Frontend API and Preview URL configurations
    ├── .env.example
    ├── package.json
    ├── vite.config.js         # Proxy & manual chunk splitting
    ├── tailwind.config.js     # Papido brand colors & typography
    ├── vercel.json            # Vercel SPA rewrite routing rules
    ├── index.html             # SEO meta tags, OpenGraph, Favicon, fonts
    └── src/
        ├── components/
        │   ├── public/        # Header, Footer, StepIndicator, LandingHero, ThankYouPage, PrivacyModal
        │   │   ├── Step1WhatsApp.jsx
        │   │   ├── Step2IntroWebsite.jsx
        │   │   ├── Step3WebsiteOpinion.jsx
        │   │   ├── Step4WhatsAppVsWebsite.jsx
        │   │   └── Step5FeaturesAndDecision.jsx
        │   └── admin/         # AdminNavbar
        ├── pages/admin/       # AdminLogin, AdminDashboard, AdminFeedback, AdminLogs, AdminSettings
        ├── context/           # AuthContext (JWT session state & auto-expiry handler)
        ├── services/          # API client wrapper with download helpers
        ├── index.css          # Tailwind base & custom animations
        └── main.jsx
```

---

## 4. Environment Variables

### Backend (`server/.env`)

```ini
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MySQL Connection
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=papido_survey_db
DB_CONNECTION_LIMIT=10

# JWT Auth Secret
JWT_SECRET=papido_survey_jwt_secret_key_2026_super_secure_auth_991823
JWT_EXPIRES_IN=7d

# Rate Limiting
SUBMIT_RATE_LIMIT_WINDOW_MS=900000
SUBMIT_RATE_LIMIT_MAX=20

# Seeded Admin Credentials
ADMIN_DEFAULT_EMAIL=admin@papido.online
ADMIN_DEFAULT_PASSWORD=Admin@Papido2026!
ADMIN_DEFAULT_NAME=Papido Administrator

# Configurable Website Preview Link
NEW_BOOKING_WEBSITE_URL=https://www.papido.online
```

### Frontend (`client/.env`)

```ini
# In dev, Vite proxies /api to http://localhost:5000 automatically
VITE_API_URL=http://localhost:5000/api

# Default fallback URL for the new Papido booking website preview
VITE_NEW_BOOKING_URL=https://www.papido.online
```

---

## 5. Database Setup & Migrations

The application manages database schema creation and table initialization automatically upon starting.

To run migrations and seed manually:

```bash
cd server
npm run migrate   # Creates database and all required tables
npm run seed      # Seeds default admin and initial sample responses
```

### Database Tables Created:
- `admin_users`: Stores admin credentials with bcrypt password hashes.
- `survey_responses`: Normalized survey responses with indexed lookup columns (`feedback_ref`, `created_at`, `status`, `preferred_booking_method`, etc.).
- `admin_activity_logs`: Audit log for tracking admin sign-ins, status modifications, record deletions, and exports.
- `app_settings`: Dynamic key-value store for runtime configuration (e.g. `new_booking_website_url`).

---

## 6. Admin Setup & Credentials

On initial startup, the backend automatically seeds a default administrator account if none exists:

- **Email / Username:** `admin@papido.online` or `admin`
- **Password:** `Admin@Papido2026!`
- **Portal URL:** `http://localhost:5173/admin/login`

> **Note:** An **"Auto-fill Default Admin Credentials"** shortcut is available on the login page for development and testing.

---

## 7. Local Development Instructions

### Step 1: Install Dependencies
From the root directory:
```bash
cd server && npm install
cd ../client && npm install
cd ..
```

### Step 2: Start Backend Server
```bash
npm run dev:server
# Server will run at http://localhost:5000
```

### Step 3: Start Frontend Client
In a separate terminal:
```bash
npm run dev:client
# Client will run at http://localhost:5173
```

### Step 4: Run the Automated E2E Test Suite
To verify database persistence, JWT auth, validation, exports, and analytics:
```bash
npm run test:e2e
```

---

## 8. Production Deployment

### Frontend Deployment (Vercel)

The client is configured for zero-configuration Vercel deployment:

1. Push this repository to GitHub or GitLab.
2. In the Vercel dashboard, click **"New Project"** and select the repository.
3. Configure the project settings:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add the environment variable:
   - `VITE_API_URL`: Your live backend API URL (e.g. `https://api-survey.papido.online/api`)
   - `VITE_NEW_BOOKING_URL`: `https://www.papido.online`
5. Deploy. The included `client/vercel.json` ensures all deep routes (such as `/admin/dashboard`) route seamlessly to `index.html`.

### Backend Deployment (VPS / Ubuntu / Docker / Render / Railway)

1. Ensure Node.js 18+ and MySQL 8.0 are installed on your host.
2. Configure production environment variables in `server/.env`.
3. Start using PM2 for automated restarts:
   ```bash
   cd server
   npm install --production
   npm run seed
   pm2 start src/server.js --name "papido-survey-api"
   pm2 save
   ```
4. Set up an Nginx reverse proxy with SSL (Certbot) pointing to port `5000`.

### Custom Domain Configuration (`feedback.papido.online`)

1. Go to your DNS provider (Cloudflare, Namecheap, GoDaddy, or Route 53).
2. Add a `CNAME` record:
   - **Type:** `CNAME`
   - **Name:** `feedback`
   - **Value:** `cname.vercel-dns.com` (for Vercel frontend)
3. In your Vercel project settings under **Domains**, add `feedback.papido.online`.
4. Vercel will automatically provision a free SSL certificate.

---

## 9. Implemented Features Checklist

### Public Experience
- [x] **Branded Landing Page**: Official Papido theme (amber & charcoal), 2–3 min indicator, clear value propositions.
- [x] **5-Step Modern Wizard**: Step indicator, animated progress bar, responsive navigation.
- [x] **Step 1 (WhatsApp Experience)**: 1–5 satisfaction ratings with visual indicators, multi-select likes and difficulty checkpoints.
- [x] **Step 2 (System Introduction)**: Feature showcase card, configurable "Explore Website" button, and confirmation checkpoint.
- [x] **Step 3 (Website Opinion)**: Overall opinion, ease of use, likes, and improvement suggestions textarea.
- [x] **Step 4 (Comparison Cards)**: Visual comparison of 💬 WhatsApp vs 🌐 Website vs 🔄 Both, adoption intent, and continuation preferences.
- [x] **Step 5 (Features & Key Decision)**: Ranked feature selection, biggest improvement area, and prominently highlighted **"What do you think Papido should do?"** decision.
- [x] **Optional Contact Section**: Toggle reveals name, mobile, and email with strict privacy guarantee.
- [x] **Accidental Refresh Protection**: In-progress drafts saved automatically to `localStorage`.
- [x] **Rapid Duplicate Suppression**: Protects against double-clicks and rapid identical submissions.
- [x] **Thank You Page**: Confetti animation, unique reference `PAP-FB-XXXXXX` with 1-click clipboard copy, and reset flow.

### Admin Dashboard & Intelligence
- [x] **Secure JWT Authentication**: Bcrypt-hashed credentials with rate-limited login endpoint.
- [x] **Top Analytics Cards**: Total responses, average satisfaction, positive rating percentage, adoption intent, and launch support.
- [x] **Interactive Recharts Visualizations**:
  - Preferred booking method breakdown
  - WhatsApp 1–5 satisfaction distribution
  - Website opinion ratings
  - Website adoption intent distribution
  - Launch recommendation distribution
  - Ranked feature demand
  - 14-day submission timeline trend
- [x] **Feedback Management Table**: Search by name, email, mobile, ref, or text; filter by status, rating, recommendation, and date.
- [x] **Feedback Detail View**: Inspect every question, answer, and contact permission.
- [x] **Status Workflow**: Tag responses as `New`, `Reviewed`, `Important`, or `Archived`.
- [x] **One-Click Data Exports**:
  - Structured `.csv` export
  - Formatted `.xlsx` Excel export with styled headers
- [x] **Audit Logging**: Logs logins, status modifications, deletions, and exports.
- [x] **Dynamic Settings**: Update the preview website URL and toggle survey active status live from the UI.
