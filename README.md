# StadiumFlow AI 🏟️

A real-time smart stadium experience and crowd management platform. Built exclusively for the **Hack2Skill PromptWars Challenge: Build with AI**.

## 🚀 Live Demo & Deployment Note to Judges

**Live Frontend (Vercel):** [https://stadiumflow-frontend.vercel.app/]
**Live Backend (Render):** [https://stadiumflow-backend.onrender.com]

> **⚠️ Important Note regarding Google Cloud Run Deployment:**
> Due to strict RBI (Reserve Bank of India) regulations concerning automatic recurring internet payments, establishing a new Google Cloud Platform billing account currently requires an upfront verification deposit of ₹1000 on an authorizing credit/debit card. Because of this banking limitation, I encountered a hard barrier deploying to Cloud Run. However, the project's architecture is fully cloud-ready, and I have successfully deployed the exact identical production build to Vercel (Frontend) and Render (Backend). Thank you for understanding, and I hope you enjoy the live project!

---

## 🧠 Built with AI (Antigravity)
This entire full-stack application was built from the ground up in collaboration with **Antigravity** (Google DeepMind's agentic AI coding assistant). The AI was instrumental in taking this project from idea to production at incredible speed:
- Architected the full React + Vite + Node.js + Socket.io monorepo.
- Engineered complex 1D random-walk math logic for the live simulation engine.
- Debugged Content Security Policies (CSP) and solved timezone desynchronization issues.
- Designed a sleek, modern UI utilizing a cohesive Tailwind CSS design system.

## ✨ Key Features

**📱 Attendee "Fan" View:**
- **Live Social "Snap Map":** An interactive, dynamic map view showing the user's location along with friends, and current wait-times for surrounding areas.
- **AI Smart Routing:** A navigation system that actively monitors congestion across the stadium and routes fans away from bottlenecks (e.g. dynamically changing route times based on restroom line density).
- **In-Seat Concessions Engine:** Fully operational interface for ordering stadium food with dynamic wait time updates based on surrounding kitchen flows.
- **Push Notification & AI Alerts:** Receives live broadcasted warnings straight from the backend intelligence system when congestion reaches critical levels.

**💻 Command Center (Admin View):**
- **Live Diagnostic Engine:** Real-time visual monitoring of Ingress Rates vs. Total Capacity.
- **Predictive Analytics:** Continuously evaluates incoming socket stream data to predict "future hotspots" before they occur and suggests push-notification re-routes.

## 🛠️ Tech Stack
- **Frontend Core:** React 18, Vite
- **Styling & UI:** Tailwind CSS, Lucide-React (Icons), Recharts (Admin Dashboards)
- **Backend Core:** Node.js, Express
- **Real-Time Layer:** Socket.io (Bi-directional low-latency events)

## 📦 How to Run Locally

1. **Install Dependencies**
```bash
npm install
```

2. **Start the Real-time Backend (Terminal 1)**
```bash
node server.js
```

3. **Start the Frontend Application (Terminal 2)**
```bash
npm run dev
```
