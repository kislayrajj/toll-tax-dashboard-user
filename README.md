# Smart Toll Tax System — Vehicle Owner Dashboard

> React portal for vehicle owners to monitor wallet balance, view toll history, and raise disputes — without calling a helpline. Part of a published research project replacing India's FASTag with a BLE-based toll system.

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

**[Live Demo →](https://toll-tax-dashboard-user.vercel.app)**

---

## The Problem This Solves

FASTag — India's national highway toll system — has no in-app dispute resolution. 63% of user complaints are about incorrect or duplicate charges, and the average resolution time through phone helplines is **18 days** (Bhaskar et al., 2021).

This dashboard gives vehicle owners a direct, traceable channel to view charges, verify accuracy, and raise disputes — entirely within the platform.

---

## Screens

### Home
- Current wallet balance
- BLE device status (active / inactive)
- Last 5 toll events at a glance

### Transactions
- Full toll history with gate name, amount, timestamp, and result
- Each transaction shows status: `Paid` / `Exempt` / `Flagged` / `Pending Review`
- **Report Issue** button on any transaction — opens a dispute form with reason selection (duplicate charge / not present at gate)
- Dispute submission immediately changes transaction status to `Pending Review` and notifies the admin

### Recharge History
- Complete wallet top-up log with amount, payment method, and date

### Device
- BLE tag details and current activation status
- Direct wallet top-up from the browser

---

## How Dispute Resolution Works

```
Owner clicks "Report Issue" on a transaction
        ↓
Selects reason → confirms submission
        ↓
Transaction status → "Pending Review"
        ↓
Dispute appears in Admin dashboard queue
        ↓
Admin reviews original transaction → Resolves or Denies with notes
        ↓
Owner sees decision + admin notes on next visit
```

No phone call. No 18-day wait. Fully digital and traceable.

---

## Tech Stack

| | |
|---|---|
| Framework | React.js (Vite) |
| Styling | Tailwind CSS |
| Data Fetching | TanStack React Query |
| Auth | Plate number lookup (no login required for owners) |
| Deployment | Vercel |
| API | [toll-tax-server](https://github.com/kislayrajj/toll-tax-server) |

---

## Local Setup

```bash
git clone https://github.com/kislayrajj/toll-tax-dashboard-user.git
cd toll-tax-dashboard-user
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

```bash
npm run dev
```

> Requires the [backend server](https://github.com/kislayrajj/toll-tax-server) to be running.

---

## System Overview

```
[ESP32 BLE Scanner] → [Node.js Server] → [Admin Dashboard]
                                        → [User Dashboard]  ← you are here
```

## Related Repositories

| Repo | Description |
|------|-------------|
| [toll-tax-server](https://github.com/kislayrajj/toll-tax-server) | Node.js / Express / MongoDB backend |
| [toll-tax-dashboard-admin](https://github.com/kislayrajj/toll-tax-dashboard-admin) | Operator portal — vehicle management, dispute resolution |

## Research

**"Smart Toll Tax System Using Bluetooth Low Energy and a Cloud-Based Web Application"**
— Kislay Raj, Chandigarh University · 94.3% lane accuracy · Zero duplicate charges

---

## Author

**Kislay Raj** — [LinkedIn](https://www.linkedin.com/in/kislay-raj-b462502a6/) · [Portfolio](https://portfolio-w-react.vercel.app/) · [GitHub](https://github.com/kislayrajj)
