# 🧬 QuantumCare AI — Precision Medicine & Quantum Treatment Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Database](https://img.shields.io/badge/Database-Neon_PostgreSQL-brightgreen)](https://neon.tech/)
[![Deploy with Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://ai-treatement.vercel.app)

**QuantumCare AI** is an advanced enterprise-grade precision oncology dashboard that integrates artificial intelligence stratification with Variational Quantum Eigensolver (VQE) and QAOA quantum computing algorithms to generate personalized cancer treatment recommendations.

---

## 🌐 Live Application Link

- 🚀 **Live Demo on Vercel**: **`https://ai-treatement.vercel.app`**
- 📦 **GitHub Repository**: **[https://github.com/Napa-Guna-Sai-Sujith/ai-treatement](https://github.com/Napa-Guna-Sai-Sujith/ai-treatement)**

---

## ✨ Key Features

- **🤖 AI Patient Stratification**: Real-time cohort clustering based on biomarker expression profiles (CRP, IL-6, VEGF, WBC, Troponin, Creatinine).
- **⚛️ Quantum Optimization Engine**: Simulated VQE/QAOA quantum annealing with adjustable ansatz circuit depth (p-layers), shot sampling (512 - 8192), and noise models.
- **☁️ Cloud Neon PostgreSQL Database**: Connected directly to cloud PostgreSQL storing patient profiles, drug efficacy datasets, and cluster stratifications.
- **🛡️ Role-Based Authentication & Admin Console**:
  - Secure Login & Registration.
  - Dedicated **Admin Profile & Approval Management Console** for administrator `napagunasaisujith@gmail.com`.
  - Admin inline user profile editing & access revocation.
- **📁 CSV Dataset Manager**: Drag-and-drop file uploader and raw CSV parser to import custom patient cohorts instantly.
- **🧬 Genomics & HEOR Economics**: Interactive biomarker radar plots, genomic gene expression heatmaps, and Health Economics & Outcomes Research (HEOR) analytics.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Database**: Neon PostgreSQL (`pg` node client)
- **State Management & Routing**: React Hooks & Component View Router

---

## 🚀 Quick Start & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Napa-Guna-Sai-Sujith/ai-treatement.git
cd ai-treatement
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

---

## 🔒 Admin Credentials

- **Email**: `napagunasaisujith@gmail.com`
- **Password**: `123456`
- **Role**: `System Administrator`

---

## 🗄️ Database Setup & Queries

To seed or reset the Neon PostgreSQL cloud database with initial schema and mock cohorts:
```bash
node seed_db.js
node seed_users.js
```

To fetch full JSON outputs of all database tables:
```bash
node fetch_all_data.js
```

---

## 📜 License

Distributed under the MIT License.
