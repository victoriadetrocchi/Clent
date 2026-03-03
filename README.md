# CLENT CRM – Financial Management Dashboard

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwind-css&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Data%20Visualization-FF6384)
![jsPDF](https://img.shields.io/badge/jsPDF-PDF%20Generator-FF5722)
![License](https://img.shields.io/badge/License-MIT-22C55E)

A modern, minimalist CRM built as a premium dark-mode Single Page Application (SPA).  
Designed to manage clients, track invoices, and visualize financial performance with real-time dashboard metrics and downloadable PDF reporting.

Built entirely with React, focused on UI excellence, performance, and scalable frontend architecture.

---

## 🚀 Live Demo

🌐 **Live Version**  
https://clent.netlify.app  

---

## ✨ Core Features

### 📊 Financial Dashboard

- **Dynamic KPI Metrics**
  - Total Income
  - Pending Debt
  - Active Clients
  Automatically recalculated based on invoice state changes.

- **Interactive Data Visualization**
  Area and Bar charts powered by Recharts to monitor financial evolution and balance distribution.

- **Instant PDF Reporting**
  Generates downloadable financial reports on demand using jsPDF and autoTable — fully client-side.

---

### 👥 Client Management

- **Smart Client Directory (CRUD)**
  Create, edit, delete, and search clients with instant UI updates.

- **Real-Time Search Filtering**
  Dynamic filtering without page reload.

- **Automated Avatars**
  UI-generated initials for consistent branding.

- **Individual Client Profiles**
  - Invoice history
  - Outstanding balance
  - Payment status tracking

---

### 💳 Billing & Invoicing System

- **Invoice Assignment**
  Attach invoices to specific clients with:
  - Dynamic amounts
  - Due dates
  - Status tracking

- **State Toggle System**
  Change invoice status (Pending / Paid) with visual feedback and LED-style pulse indicators.

- **Automated Dashboard Sync**
  Every invoice update instantly recalculates charts and financial KPIs.

---

## 🧠 Architecture

Built as a performance-optimized SPA focused on UX precision and frontend scalability.

- **Frontend:** React (Functional Components + Hooks)
- **State Management:** useState + useEffect relational logic (Clients ↔ Invoices)
- **Styling:** Tailwind CSS v4
- **Data Persistence:** Browser localStorage API
- **Notifications:** React Hot Toast
- **Icons:** Lucide React

Architecture prioritizes modular components, reactive UI updates, and seamless state synchronization without backend dependency.

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Recharts
- Lucide React
- React Hot Toast

### Client-Side Processing
- jsPDF & autoTable
- localStorage API


---

## ⚙️ Local Setup

### 1️⃣ Clone repository

git clone https://github.com/victoriadetrocchi/clent.git
2️⃣ Install dependencies
cd crm
npm install
3️⃣ Run development server
npm run dev

⚠️ No backend or database setup required — this version uses LocalStorage for data persistence.

📈 Technical Highlights

Advanced relational state management (Clients ↔ Invoices) entirely on the frontend.

Real-time financial KPI recalculation.

Client-side document generation with structured PDF tables.

Custom micro-interactions and gradient animations for SaaS-level UX.

Strict dark-mode design system implementation.

Clean component architecture with separation of logic and presentation.

🔮 Future Improvements

Node.js + Express REST API integration

Migration to PostgreSQL / MySQL

JWT Authentication & Role-Based Access Control

Multi-user support

CSV / Excel export

Stripe payment integration

Cloud deployment with CI/CD pipeline

👩‍💻 Author

Victoria De Trocchi

🔗 LinkedIn: https://linkedin.com/victoria-de-trocchi

💼 Portfolio: https://victoriadetrocchi-portfolio.netlify.app

📧 Email: mvictoriadetrocchi@gmail.com
