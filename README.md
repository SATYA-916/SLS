# SLS Consultants Portal

A world-class engineering portal developed for **SLS Consultants** to showcase advanced civil, structural, and mechanical engineering solutions. Featuring interactive WebGL 3D structural models, technical drawings transmittals, and design code directories.

---

## 🚀 Key Features

* **Interactive WebGL 3D Model Engine**: Custom-built Three.js viewer with support for structural explode/assemble animations, real-time lighting, camera settings, and FEA stress heatmap colors mapped recursively using world coordinates.
* **Codes & Design Standards Directory**: Searchable, categorized index of international and regional design standards (ASME Section VIII, API 560, API 530, IS 800, EIL specs) conforming to strict industrial safety clearances.
* **Case Studies & Technical Transmittals**: In-depth case studies for proprietary projects containing scopes, design challenges, custom SVG elevation profiles, and detailed drawing transmittals registers (134+ drawing sheets mapped).
* **Drawing Revision Tracker**: Administrative interface for logging engineering codes, updating revision levels (e.g. Rev 0, Rev 1), managing review status, and exporting transmittals logs as CSV.
* **Secure Admin Dashboard**: Route-level server-side session checks protecting client inquiries logs and internal note tracking.

---

## 🛠️ Tech Stack

### Frontend
* **React.js** (Vite-powered, dynamic route lazy-loading)
* **Three.js** (WebGL 3D rendering pipeline)
* **Tailwind CSS & Vanilla CSS** (Responsive layouts, premium micro-animations)
* **Wouter** (Lightweight client-side routing switcher)

### Backend
* **Node.js & Express.js** (API routing)
* **MongoDB Atlas** (Contact inquiries database)
* **Brevo Email API** (Auto-acknowledgment and notifications)

---

## 📁 Project Structure

```text
SLS/
├── frontend/
│   ├── src/
│   │   ├── components/      # Common UI parts & WebGL ThreeViewer
│   │   ├── data/            # Local project & services datasets
│   │   ├── pages/           # Page-level components
│   │   ├── App.jsx          # Wouter switch routing
│   │   └── index.css        # Core layout and styling
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/          # API endpoints (admin, contacts, projects)
│   │   └── lib/             # Database and email helpers
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

To run the application locally, define the following variables:

### Backend (`backend/.env`)
```env
PORT=3001
MONGODB_URL=your_mongodb_atlas_connection_string
SESSION_SECRET=your_secure_session_secret
ADMIN_PASSWORD=your_admin_dashboard_password
OWNER_EMAIL=your_inbox_recipient_email

BREVO_API_KEY=your_brevo_smtp_api_key
BREVO_SENDER_EMAIL=your_brevo_verified_sender_email
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3001
```

---

## 🚀 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SATYA-916/SLS.git
   cd SLS
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 🔒 Security & Performance
* Server-side authentication check via session cookies (`isAdmin`) protects database transactions and drawing logs.
* Assets and page routes are dynamically code-split to optimize Initial Page Load speed. WebGL components load on-demand.
