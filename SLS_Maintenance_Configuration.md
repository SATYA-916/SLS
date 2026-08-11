# SLS Website — Maintenance & Configuration Guide

> **Project:** SLS Structomech Consultants — Official Website
> **Live URL:** https://www.slsnexus.com
> **Purpose:** Final handover documentation for running, deploying, maintaining, and managing the SLS website.
> **Audience:** Developer(s) / client-side technical maintainer taking over the project.

---

## 1. Project Overview

### SLS Website Purpose
The SLS website is the official digital presence of **SLS Structomech Consultants** (Visakhapatnam, India) — a GVMC-registered engineering consultancy established in 2002. The site:

- Showcases the firm's **engineering services** (civil, structural, mechanical, architecture, building plan approval / GVMC–VMRDA, RLA studies, industrial fired heaters, etc.)
- Presents a **project portfolio** of 50+ industrial, refinery, and building projects delivered since 2002
- Hosts a **Technical Drawing Layouts gallery** with engineering drawing sheets
- Captures **client inquiries** via a contact form (with optional file attachment)
- Provides a **Calendly-powered consultation booking** flow
- Includes a **password-protected admin dashboard** to manage inquiries (view, status, notes, CSV export)

### Frontend Technology
| Item | Technology |
|---|---|
| Framework | **React 18** (function components + hooks) |
| Build tool | **Vite 5** |
| Routing | **Wouter** (lightweight client-side router) |
| Styling | **Tailwind CSS 3** + **Vanilla CSS** (`src/index.css`) |
| Animations | **Framer Motion** |
| Forms / validation | **react-hook-form** + **zod** + **@hookform/resolvers** |
| Server state | **@tanstack/react-query** |
| Icons | **lucide-react** |
| Utilities | **clsx**, **tailwind-merge** |
| Hosting | **Vercel** |

### Backend Technology
| Item | Technology |
|---|---|
| Runtime | **Node.js** (ES Modules, `"type": "module"`) |
| Framework | **Express 4** |
| Database | **MongoDB Atlas** (via Mongoose 8) |
| Email | **Brevo (formerly Sendinblue) SMTP API** |
| Session | **express-session** (admin auth) |
| File upload | **multer** (in-memory storage, 15 MB limit) |
| Logging | **pino** + **pino-http** (+ pino-pretty in dev) |
| Validation | **zod** |
| Hosting | **Render** |

### Database
**MongoDB Atlas** — a single free-tier (M0) cluster stores one collection: `contacts` (contact form submissions, including embedded file data for uploaded attachments and internal admin notes). There are **no separate databases** for services or projects — those are served as static arrays from the backend code (see [Section 3](#3-project-structure)).

---

## 2. Deployment & Live URLs

| Component | Platform | URL |
|---|---|---|
| Frontend (public site) | Vercel | **https://www.slsnexus.com** |
| Frontend (Vercel default) | Vercel | https://sls-frontend.vercel.app (auto-generated) |
| Backend (API) | Render | **https://sls-ddub.onrender.com** |
| Backend health check | Render | https://sls-ddub.onrender.com/api/healthz → `{"status":"ok"}` |
| Git repository | GitHub | https://github.com/SATYA-916/SLS |

**Verified live on 2026-08-11:** backend health endpoint returns `{"status":"ok"}` and the frontend serves `https://www.slsnexus.com`.

### How the frontend connects to the backend
In production there are **two layers** that connect the Vercel frontend to the Render backend:

1. **`frontend/vercel.json`** — rewrites every incoming request to `/api/*` to the Render backend:
   ```json
   {
     "rewrites": [
       { "source": "/api/:path*", "destination": "https://sls-ddub.onrender.com/api/:path*" },
       { "source": "/((?!api/).*)", "destination": "/index.html" }
     ]
   }
   ```
2. **`frontend/src/lib/api.js`** — the API client builds URLs from `VITE_API_URL` if set; when empty (default in production), all calls go to relative paths `/api/...` which Vercel rewrites to Render. `credentials: 'include'` is used so the admin session cookie is sent with requests.

> **Local development:** `VITE_API_URL=http://localhost:3001` and the Vite dev server proxies `/api` → `http://localhost:3001` (see `frontend/vite.config.js`).

---

## 3. Project Structure

```text
SLS/
├── .gitignore                    # Ignores .env, node_modules, dist, uploads, proprietary client/
├── README.md                     # Original dev README (some sections describe removed 3D features)
├── frontend/                     # React + Vite application (deployed to Vercel)
│   ├── .env.example              # VITE_API_URL sample
│   ├── index.html                # SEO meta tags, JSON-LD, fonts, favicons
│   ├── vercel.json               # Rewrites /api/* → Render backend + SPA fallback
│   ├── vite.config.js            # Dev server port 5173, /api proxy, @ alias
│   ├── tailwind.config.js        # Tailwind theme
│   ├── postcss.config.js         # PostCSS config
│   ├── package.json              # Frontend deps & scripts (dev / build / preview)
│   ├── public/
│   │   ├── sitemap.xml           # 9 URLs for SEO
│   │   ├── robots.txt            # Allows all, blocks /admin, points to sitemap
│   │   ├── llms.txt              # LLM-readable site summary
│   │   ├── favicon.svg / .png    # Brand icons
│   │   ├── hero_industrial_plant.png, world_map.png, founder_portrait.png, logo_bhel.png, logo_lnt.png
│   │   ├── SLSPROFILE.pdf        # Corporate profile download
│   │   ├── gallery/              # 75+ technical drawing images (referenced by gallery.jsx)
│   │   ├── projects/             # Project images (proj1..proj18)
│   │   └── illustrations/        # Legacy illustration assets
│   └── src/
│       ├── main.jsx              # React entry
│       ├── App.jsx               # Wouter routes + ErrorBoundary + QueryClient
│       ├── index.css             # Core design tokens & global styles
│       ├── lib/
│       │   ├── api.js            # All backend API calls (fetch wrappers)
│       │   └── ...               # Shared utilities
│       ├── hooks/
│       │   ├── use-calendly.js   # Calendly widget loader + CALENDLY_URL constant
│       │   └── use-toast.js      # Toast notifications
│       ├── components/
│       │   ├── layout/           # Layout, Navbar (Calendly CTA), Footer
│       │   ├── ui/               # Reusable UI primitives
│       │   ├── CookieBanner.jsx  # Cookie consent banner
│       │   ├── PageMeta.jsx      # Per-page SEO metadata
│       │   └── ServiceConfirmationPanel.jsx  # Service booking panel (uses getServices/getProjects)
│       ├── data/                 # Static local datasets (fallbacks)
│       └── pages/
│           ├── home.jsx          # Landing page (stats, projects, services)
│           ├── about.jsx         # Company profile / founder
│           ├── expertise.jsx     # Services page
│           ├── projects.jsx      # Project registry
│           ├── case-study.jsx    # Project detail / case studies + drawing registers
│           ├── gallery.jsx       # Technical Drawing Layouts gallery (65+ drawings)
│           ├── contact.jsx       # Contact form + Calendly booking
│           ├── software.jsx      # Software & tools page
│           ├── legal.jsx         # Privacy / Terms / Cookies / Disclaimer
│           ├── admin-login.jsx   # Admin authentication
│           ├── admin-dashboard.jsx # Inquiries management (CRUD, notes, CSV export)
│           └── not-found.jsx     # 404 page
│
└── backend/                      # Node/Express API (deployed to Render)
    ├── package.json              # Backend deps & scripts (start / dev)
    ├── .env                      # LOCAL env vars (git-ignored — NOT in repo)
    ├── uploads/                  # Legacy local file storage (git-ignored)
    └── src/
        ├── index.js              # Entry point — loads dotenv, starts server (PORT or 3001)
        ├── app.js                # Express app: CORS, sessions, pino logging, /api router
        ├── lib/
        │   ├── mongodb.js        # Mongoose connection (MONGODB_URL) + Contact schema
        │   ├── email.js          # Brevo SMTP API client (sendBrevo)
        │   └── logger.js         # pino logger (redacts cookies/authorization)
        └── routes/
            ├── index.js          # Mounts all routers under /api
            ├── health.js         # GET /api/healthz
            ├── contact.js        # POST /api/contact (save + email notifications)
            ├── projects.js       # GET /api/projects (static array, 54 projects)
            ├── services.js       # GET /api/services (static array, 5 services)
            ├── stats.js          # GET /api/stats (static stats)
            └── admin.js          # Admin auth + contacts CRUD + CSV export
```

### Important files & their purposes
| File | Purpose |
|---|---|
| `frontend/vercel.json` | **Critical**: rewrites `/api/*` to the Render backend; SPA fallback to `index.html` |
| `frontend/src/lib/api.js` | Single API client used by every page — defines all endpoints |
| `frontend/src/hooks/use-calendly.js` | Centralized Calendly URL + widget loader |
| `frontend/index.html` | SEO meta tags, JSON-LD structured data, `google-site-verification` meta (see note in §8) |
| `frontend/public/sitemap.xml` | SEO sitemap (9 URLs) |
| `frontend/public/robots.txt` | Crawl rules + sitemap pointer; blocks `/admin` |
| `backend/src/lib/mongodb.js` | MongoDB connection (reads `MONGODB_URL`) + Contact schema |
| `backend/src/lib/email.js` | Brevo email sender (reads `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`) |
| `backend/src/routes/contact.js` | Contact submission: saves to MongoDB, sends owner + developer + alt-copy + customer emails |
| `backend/src/routes/admin.js` | Admin login/logout, contacts listing, status updates, notes, CSV export, password recovery email |
| `backend/src/routes/projects.js` | **Static array of 54 projects** served via `GET /api/projects` |
| `backend/src/routes/services.js` | **Static array of 5 services** served via `GET /api/services` |

---

## 4. Environment Variables / Configuration

> **⚠️ IMPORTANT:** Values below are placeholders only. Actual secrets must be obtained from the account owner (see [Section 11](#11-important-handover-notes)). **Never commit `.env` files or real keys to Git.**

### Backend (`backend/.env` — also set as Environment Variables in Render)

| Variable | Required | Used for |
|---|---|---|
| `PORT` | Optional | Server port; defaults to `3001`. Render injects its own `PORT` automatically. |
| `MONGODB_URL` | ✅ | MongoDB Atlas connection string (Mongoose `mongoose.connect`). Example: `MONGODB_URL=<MongoDB Atlas connection string>` |
| `SESSION_SECRET` | ✅ | Secret for `express-session` (admin login cookie signing). Example: `SESSION_SECRET=<random 32+ char string>` |
| `ADMIN_PASSWORD` | ✅ | Password for the admin dashboard (`/admin`). Also emailed to the owner via the "forgot password" flow. Example: `ADMIN_PASSWORD=<strong admin password>` |
| `OWNER_EMAIL` | ✅ | Recipient of contact-form owner notifications and admin password recovery. Example: `OWNER_EMAIL=slsvizag@gmail.com` |
| `BREVO_API_KEY` | ✅ | Brevo SMTP API key for all outbound email. Example: `BREVO_API_KEY=<Brevo API key>` |
| `BREVO_SENDER_EMAIL` | ✅ | Verified Brevo sender address used as the email "From". Example: `BREVO_SENDER_EMAIL=<verified sender address>` |
| `NODE_ENV` | Optional | `production` enables secure cookies (`secure`, `sameSite=none`) and `trust proxy`. Set to `production` on Render. |
| `LOG_LEVEL` | Optional | pino log level, defaults to `info`. |
| `DEV_COPY_EMAIL` | Optional | Developer copy recipient for enquiries. Defaults to `zywu801@gmail.com`. |
| `ALT_COPY_EMAIL` | Optional | Secondary copy recipient. Defaults to `slsind@gmail.com`. |

### Frontend (`frontend/.env` — also set as Environment Variables in Vercel)

| Variable | Required | Used for |
|---|---|---|
| `VITE_API_URL` | Optional | Base URL for API calls. **Leave empty in production** so Vercel's `vercel.json` rewrite handles `/api/*` → Render. Set to `http://localhost:3001` for local dev. Example: `VITE_API_URL=http://localhost:3001` |

---

## 5. Local Development Setup

### Prerequisites
- **Node.js ≥ 18** (project was developed and tested on Node 20+; Vite 5 requires Node 18+)
- **npm** (bundled with Node)
- A **MongoDB Atlas** cluster (free tier is sufficient) with network access allowed for your IP
- A **Brevo** account with an SMTP API key and a verified sender address (to test emails)
- **Git** (to clone the repository)

### Installation & startup

```bash
# 1. Clone the repository
git clone https://github.com/SATYA-916/SLS.git
cd SLS

# 2. Backend
cd backend
npm install
# Create backend/.env with the variables from Section 4 (copy the placeholder names)
npm run dev          # starts API on http://localhost:3001 (with auto-reload)

# 3. Frontend (in a second terminal)
cd ../frontend
npm install
# Create frontend/.env with: VITE_API_URL=http://localhost:3001
npm run dev          # starts dev server on http://localhost:5173
```

Then open **http://localhost:5173**. The Vite dev server proxies `/api` → `http://localhost:3001` automatically (see `frontend/vite.config.js`), so the site works end-to-end against the local backend.

### Verification after startup
- `http://localhost:3001/api/healthz` → `{"status":"ok"}`
- `http://localhost:3001/api/services` → JSON array of 5 services
- `http://localhost:3001/api/projects` → JSON array of 54 projects
- Submit a test contact form → should save to MongoDB and fire Brevo emails

---

## 6. Deployment Information

### Frontend — Vercel
- **Platform:** Vercel (git-connected to the GitHub repo)
- **Deployment:** Every push to `origin/main` triggers an automatic build + deploy (auto-deploy on the default branch).
- **Build settings:** Vercel auto-detects Vite. Build command `npm run build` (outputs to `dist/`). Framework preset: Vite.
- **Environment variables on Vercel:** none required (leave `VITE_API_URL` empty).
- **`vercel.json`** is committed and drives the `/api/*` rewrite to Render + SPA fallback.

### Backend — Render
- **Platform:** Render (Web Service)
- **Deployment:** Connect the GitHub repo with **root directory set to `backend`**. Render builds with `npm install` and starts with `npm start` (`node src/index.js`).
- **⚠️ Render does NOT auto-deploy on every push by default** — check that "Auto-Deploy" is enabled on the Render service, or manually trigger a deploy from the Render dashboard after backend changes. (Several backend commits were made without confirming an auto-deploy; always verify via the health endpoint after pushing backend changes.)
- **Environment variables on Render:** all backend variables from Section 4 (including `NODE_ENV=production`).
- **Free-tier caveat:** Render free services **spin down after ~15 min of inactivity**; the first request after idle can take 10–60 s to wake up. This can make the site feel slow on first visit — consider a paid tier or an uptime pinger if this matters.

### How the frontend connects to the backend (recap)
1. Browser → `https://www.slsnexus.com/api/...` (Vercel)
2. `vercel.json` rewrites `/api/:path*` → `https://sls-ddub.onrender.com/api/:path*` (Render)
3. Render Express app serves the API, talks to MongoDB Atlas + Brevo

### Azure deployment attempt (documented blocker)
- An attempt was made to deploy the backend to **Azure App Service** during the project.
- **Azure App Service could not be created** because the **Microsoft.Web resource provider was not registered** for the Azure subscription being used, and **the current Azure account did not have permission to register the resource provider**.
- **Impact:** Azure hosting is not currently in use; the backend remains on Render.
- **Next step when desired:** Have an Azure account owner/administrator register the `Microsoft.Web` resource provider (or grant Contributor/Role-Based Access to do so), then create an App Service (Node.js runtime) pointing to the `backend/` folder. The backend code is platform-agnostic and will run on Azure App Service as-is — only environment variables need to be recreated in the Azure App Service "Configuration" blade.

---

## 7. Domain & Cloudflare

### Cloudflare – SLS Domain Details
- **Domain:** `slsnexus.com`
- **Cloudflare Account:** `Slsvizag@gmail.com`
- **DNS Plan:** Free
- **DNS Setup:** Full
- **Current Website Hosting:** Vercel

### DNS Records

| Type | Name | Target / Value | Proxy Status |
|---|---|---|---|
| CNAME | `slsnexus.com` | `813ce86a24bb245a.vercel-dns-017.com` | DNS Only |
| CNAME | `www.slsnexus.com` | `813ce86a24bb245a.vercel-dns-017.com` | DNS Only |
| TXT | `slsnexus.com` | `google-site-verification=JLRxZ00Q9UJ6SYnSkD_T25H7RPPbg61BP7Eh9-wpZm4` | DNS Only |

### Purpose
- The **CNAME records** point `slsnexus.com` and `www.slsnexus.com` to the Vercel-hosted frontend (`813ce86a24bb245a.vercel-dns-017.com`).
- The **TXT record** is used for Google Search Console domain verification.

### Authoritative Nameservers
- `sureena.ns.cloudflare.com`
- `grant.ns.cloudflare.com`

### Relationship between Cloudflare, Vercel, and the website
```
User → slsnexus.com → Cloudflare (DNS)
                            ↓
                      Vercel (frontend hosting, edge network)
                            ↓ (/api/* rewrite via vercel.json)
                      Render (backend API)
                            ↓
                      MongoDB Atlas + Brevo
```
- **Cloudflare** is the DNS provider for `slsnexus.com` under account `Slsvizag@gmail.com`. Changing records is done in the Cloudflare dashboard → DNS.
- **Vercel** hosts the frontend build; Vercel's own SSL certificate serves HTTPS for `www.slsnexus.com` and the apex.
- **Website content** is generated by the React app on Vercel; dynamic data (projects/services/contact) flows through the Render API.

> **Do not** expose Cloudflare account passwords or API tokens. Access DNS management through the Cloudflare dashboard using `Slsvizag@gmail.com`.

---

## 8. Calendly

### How booking is integrated
The website uses **Calendly's popup widget** to let visitors book a free 30-minute consultation. The flow:

1. User clicks a **"Book a Consultation"** / schedule button (in the navbar, contact page, or case-study page).
2. `useCalendly()` (in `frontend/src/hooks/use-calendly.js`) lazily loads Calendly's CSS + JS from `assets.calendly.com` once, then calls `window.Calendly.initPopupWidget({ url: CALENDLY_URL })`.
3. Calendly opens its popup; the visitor picks a slot; Calendly handles the booking, confirmations, and calendar integration on Calendly's side.

### Where the Calendly link/configuration lives
| Location | What it does |
|---|---|
| `frontend/src/hooks/use-calendly.js` | **Single source of truth**: `export const CALENDLY_URL = 'https://calendly.com/slsvizag/30min'` + widget loader |
| `frontend/src/components/layout/Navbar.jsx` | Duplicate copy of the widget loader + same `CALENDLY_URL` for the navbar "Book" CTA |
| `frontend/src/pages/contact.jsx` | "Schedule a consultation" button (id `calendly-book-btn`) + auto-open after form submission |
| `frontend/src/pages/case-study.jsx` | "Book a consultation" CTAs on case-study pages |

> **Maintenance tip:** If the Calendly link ever changes, update **both** `use-calendly.js` **and** `Navbar.jsx` — they each define `CALENDLY_URL`.

### Google Calendar / email configuration for Calendly
- Calendly bookings sync to the **Calendly owner's connected calendar** (typically Google Calendar). This is configured **inside the Calendly account** (Settings → Calendar connection), **not** in this codebase.
- Booking confirmation emails are sent **by Calendly** automatically — no SMTP configuration is required in the project for Calendly.
- The site's own contact-form emails use **Brevo** (Section 9), which is separate from Calendly's email.

> No login credentials for Calendly or Google Calendar are stored in the repository.

---

## 9. Email Configuration

### Email service: Brevo (backend)
- The backend sends all transactional email through the **Brevo SMTP API** (`https://api.brevo.com/v3/smtp/email`) — implemented in `backend/src/lib/email.js` (`sendBrevo`).
- **Used for:**
  1. **Owner notification** — every contact-form submission is emailed to `OWNER_EMAIL` (with `replyTo` set to the customer).
  2. **Developer copy** — same content to `DEV_COPY_EMAIL` (default `zywu801@gmail.com`).
  3. **Secondary copy** — same content to `ALT_COPY_EMAIL` (default `slsind@gmail.com`).
  4. **Customer auto-reply** — an acknowledgment to the person who submitted the form.
  5. **Admin password recovery** — sends the admin password to `OWNER_EMAIL` when requested from the login page.
- All emails are sent from sender **"SLS Structomech"** using `BREVO_SENDER_EMAIL`.

### Required environment variables
- `BREVO_API_KEY` — Brevo SMTP API key (secret).
- `BREVO_SENDER_EMAIL` — a **verified sender address** in the Brevo account (must be validated in Brevo → Senders & IPs; otherwise Brevo rejects sends).
- `OWNER_EMAIL`, `DEV_COPY_EMAIL`, `ALT_COPY_EMAIL` — recipient addresses (Section 4).

### Sender/domain configuration
- The sender email must be **verified in the Brevo dashboard** (either a verified email address or a verified sending domain). If a custom domain is used for sending (e.g., `mail.slsnexus.com`), its **SPF/DKIM DNS records must be added in Cloudflare** per Brevo's instructions — the records shown in Section 7 are the current site records and do not yet include Brevo SPF/DKIM (Brevo sends currently use the verified sender address at Brevo's defaults).
- Brevo's free tier allows up to **300 emails/day** — adequate for a contact form.

> No API keys are included here; obtain them from the Brevo account owner.

---

## 10. MongoDB Atlas

- **Database:** MongoDB Atlas (cloud-hosted MongoDB). The free M0 cluster is used.
- **Database name / collection:** the `Contact` model stores documents in the **`contacts`** collection. Services and projects are NOT in MongoDB (they are static arrays in `backend/src/routes/services.js` and `projects.js`).
- **Environment variable:** `MONGODB_URL` (connection string). Read by `backend/src/lib/mongodb.js`:
  ```js
  const uri = process.env.MONGODB_URL;
  await mongoose.connect(uri);
  ```
- **Connection is lazy:** `connectMongo()` is called only when a route needs the database (contact submit, admin contact operations) — the server can start even if MongoDB is temporarily unreachable.

### Network / IP access configuration
- MongoDB Atlas clusters allow connections only from whitelisted IPs (Atlas → Network Access).
- **For Render:** the connection is made **from Render's servers**, so the Atlas IP allow-list must include Render's egress IP(s) — or, more simply, **allow access from anywhere (`0.0.0.0/0`)** if the connection string uses strong credentials (common for demo/free-tier setups). Check the current Atlas Network Access list before changing anything.
- **For local development:** your local machine's public IP must be added to the Atlas allow-list (or the cluster must permit `0.0.0.0/0`).

> The actual connection string contains the database user's password — **never** include it in documentation, screenshots, or commits. It lives only in `backend/.env` (local) and Render's environment variables.

---

## 11. Maintenance Guide

### How to update frontend code
1. Pull latest: `git pull origin main`
2. Edit files under `frontend/` (e.g., `frontend/src/pages/home.jsx`, `frontend/src/pages/gallery.jsx`).
3. Test locally: `cd frontend && npm run dev`
4. Build check: `npm run build` (must complete with no errors)
5. Commit & push: `git add -A; git commit -m "description"; git push origin main`
6. **Vercel auto-deploys** on push to `main`. Verify at https://www.slsnexus.com.

### How to update backend code
1. Pull latest: `git pull origin main`
2. Edit files under `backend/` (e.g., `backend/src/routes/services.js` to change services, `contact.js` for email behavior).
3. Test locally: `cd backend && npm run dev` (needs local `.env`).
4. Commit & push: `git add -A; git commit -m "description"; git push origin main`
5. **Render does NOT reliably auto-deploy** — go to the Render dashboard → your service → Manual Deploy → Deploy latest commit, or confirm "Auto-Deploy" is ON.
6. Verify: `https://sls-ddub.onrender.com/api/healthz` → `{"status":"ok"}`, and test changed endpoints.

### How to redeploy (full stack)
- **Frontend:** push to `main` (Vercel auto-builds).
- **Backend:** manual deploy on Render (or enable auto-deploy).
- **Order matters:** deploy backend first, then frontend, if the change is API-related.

### Where environment variables need to be updated
- **Local:** `backend/.env` and `frontend/.env`.
- **Production backend:** Render dashboard → Service → Environment (add/edit vars, then redeploy/restart).
- **Production frontend:** Vercel dashboard → Project → Settings → Environment Variables (then redeploy).
- After changing env vars on Render, **restart the service** — `dotenv` is read at startup.

### What to check if the website/API stops working
1. **Backend up?** → `https://sls-ddub.onrender.com/api/healthz`. If it hangs, the free instance is cold-starting (wait 30–60 s and retry). If it errors, check Render logs.
2. **Frontend up?** → load `https://www.slsnexus.com`; check Vercel deployment status/logs in the Vercel dashboard.
3. **DNS?** → `nslookup www.slsnexus.com` should return the Vercel CNAME (`*.vercel-dns-*.com`); check Cloudflare dashboard for proxied records (don't change if unsure).
4. **API rewrite?** → `https://www.slsnexus.com/api/healthz` should proxy to Render. If it 404s/50x, check `vercel.json` and the Render service URL.
5. **MongoDB?** → check Atlas status (Atlas dashboard → cluster health), Network Access allow-list, and that `MONGODB_URL` in Render is still valid. Contact-form submissions fail if MongoDB is down (the API returns 500 for the POST, though the server itself stays up).
6. **Email?** → if no notifications arrive, check Brevo dashboard (daily quota, sender verification status, API key validity, delivery logs). Verify `BREVO_API_KEY`/`BREVO_SENDER_EMAIL` in Render.
7. **Logs:** Render logs (service → Logs) and Vercel function/runtime logs are the first place to look; backend logs are pino JSON with request/response serialized and cookies redacted.
8. **Session/admin login issues?** → check `SESSION_SECRET` and that cookies work with `NODE_ENV=production` (secure + sameSite=none is required for cross-site admin from Vercel origin; CORS is already `origin: true, credentials: true`).

---

## 12. Third-Party Services

| Service | Purpose in this project | Account needed by | Notes |
|---|---|---|---|
| **Vercel** | Hosts the frontend (React/Vite build); serves https://www.slsnexus.com; rewrites `/api/*` to Render | Frontend host owner | Auto-deploys from GitHub `main` |
| **Render** | Hosts the backend API (Express) at https://sls-ddub.onrender.com | Backend host owner | Free tier cold-starts; manual deploy needed unless auto-deploy enabled |
| **MongoDB Atlas** | Cloud database for contact inquiries (`contacts` collection) | DB admin | Network Access allow-list controls who can connect |
| **Cloudflare** | DNS hosting for `slsnexus.com` + proxy/CDN/SSL in front of the site | Domain/DNS owner | Nameservers `sureena`/`grant.ns.cloudflare.com` |
| **Calendly** | Consultation booking widget (30-min meeting, `https://calendly.com/slsvizag/30min`) | SLS Vizag Calendly owner | Calendar connection (Google Calendar) set inside Calendly account |
| **Brevo** | Transactional email (contact notifications, auto-reply, admin password recovery) | Email account owner | Free tier ~300 emails/day; sender must be verified |
| **GitHub** | Source repository (`SATYA-916/SLS`) | Repo owner | Push to `main` triggers frontend deploy |
| **Google Search Console** | Site indexing verification (`google-site-verification` TXT record exists) | Site owner | Sitemap: `https://www.slsnexus.com/sitemap.xml` |
| **Google/Gemini** | **Not currently used in the codebase** — no Gemini API key or AI integration exists in the deployed code. (Any earlier AI references were removed from the live site.) | — | Do not add unless explicitly requested |

---

## 13. Important Handover Notes

> [!IMPORTANT]
> **Configuration vs. credentials — read carefully.**

1. **This document contains configuration information only.** All values shown for keys are **placeholders** (e.g., `<MongoDB Atlas connection string>`, `<Brevo API key>`).

2. **Actual credentials/API keys must be obtained separately from the appropriate account owner:**
   - `MONGODB_URL` → MongoDB Atlas account owner (Database Access user + connection string)
   - `BREVO_API_KEY`, `BREVO_SENDER_EMAIL` → Brevo account owner
   - `ADMIN_PASSWORD`, `SESSION_SECRET` → SLS project owner / current admin
   - `OWNER_EMAIL`, `DEV_COPY_EMAIL`, `ALT_COPY_EMAIL` → SLS management
   - Vercel, Render, Cloudflare, Calendly, GitHub access → respective account owners
   - Do **not** ask for or store these in shared/unencrypted files; use each platform's secrets manager (Render env vars, Vercel env vars, Atlas secrets) and a password manager for local copies.

3. **Azure deployment blocker (clear statement):** The backend **could not be deployed to Azure App Service** because the **`Microsoft.Web` resource provider was not registered** for the Azure subscription and the account in use **lacked permission to register it**. Azure is therefore **not** the backend host — **Render** is. Once a subscription owner registers `Microsoft.Web` (or grants the required RBAC permission), the backend can be migrated to Azure App Service; the code requires no changes, only re-creation of environment variables in the Azure App Service configuration.

4. **Render auto-deploy caveat:** Backend changes pushed to GitHub may not appear on the live API unless auto-deploy is enabled or a manual deploy is triggered on Render. **Always verify** via `https://sls-ddub.onrender.com/api/healthz` after backend changes.

5. **"3D CAD Models" were removed** from the site in a prior maintenance pass. The README.md still describes the old Three.js 3D viewer and related flows — treat those README sections as **outdated**. The live site has no 3D viewer.

6. **Services and Projects are code-defined, not DB-driven:** to add/change a service or project, edit `backend/src/routes/services.js` / `projects.js` and redeploy the backend (frontend fetches them at runtime with static-data fallbacks in `frontend/src/data/`).

7. **Calendly URL is duplicated** in `use-calendly.js` and `Navbar.jsx` — update both if the link changes.

8. **Google site verification:** the domain is verified via the TXT record shown in Section 7; the empty `google-site-verification` meta tag in `index.html` can be completed with the same token or removed. The sitemap is ready at `https://www.slsnexus.com/sitemap.xml` and can be submitted in Google Search Console.

9. **Sensitive data in repo:** `backend/.env`, `frontend/.env`, `backend/uploads/`, and the `proprietary client/` folder are git-ignored. Do **not** force-add them.

---

*Prepared for final project handover. For any ambiguity, contact the project owner to obtain access and credentials through official channels.*
