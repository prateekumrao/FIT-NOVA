# FitNova AI

**Your Fitness. Your Intelligence.**

A premium, responsive frontend for an AI-powered fitness and wellness platform. Deep black surfaces, charcoal cards and soft sage-green accents. No neon colours anywhere.

> **Status: frontend only.** Authentication, AI replies, nutrition values and activity data are **clearly labelled demo data** stored in your browser. The `src/services` folder is already prepared for a Python FastAPI + PostgreSQL backend and a cloud AI API.

---

## 1. Pages (18)

| # | Page | Route |
|---|------|-------|
| 1 | Home / Landing | `/` |
| 2 | Login (with forgot password) | `/login` |
| 3 | Register | `/register` |
| 4 | Onboarding | `/onboarding` |
| 5 | Dashboard | `/app/dashboard` |
| 6 | AI Fitness Coach | `/app/coach` |
| 7 | Workout Library | `/app/workouts` |
| 8 | Nutrition and Food Library | `/app/nutrition` |
| 9 | Activity Tracker | `/app/activity` |
| 10 | Habit Tracker | `/app/habits` |
| 11 | Progress Reports | `/app/reports` |
| 12 | Pricing and Subscription | `/pricing` |
| 13 | Profile | `/app/profile` |
| 14 | Settings | `/app/settings` |
| 15 | About Us | `/about` |
| 16 | Contact Us | `/contact` |
| 17 | Privacy Policy | `/privacy` |
| 18 | Terms and Conditions | `/terms` |

Quick start: open the app, press **Log in**, then **Use demo account**.

---

## 2. Dependencies

**Runtime**

| Package | Purpose |
|---------|---------|
| `react`, `react-dom` | UI library |
| `react-router-dom` | Page routing |
| `motion` | Animations (`import { motion } from 'motion/react'`) |
| `recharts` | Charts |
| `lucide-react` | Icons |

**Development**

| Package | Purpose |
|---------|---------|
| `vite`, `@vitejs/plugin-react` | Dev server and build tool |
| `typescript`, `@types/react`, `@types/react-dom` | Type checking |
| `tailwindcss` (v3), `postcss`, `autoprefixer` | Styling |

---

## 3. Run it on Windows (PowerShell + VS Code)

### Prerequisites
1. Install **Node.js LTS** (version 18 or newer) from https://nodejs.org
2. Install **VS Code** from https://code.visualstudio.com
3. Check Node in PowerShell:

```powershell
node -v
npm -v
```

### Install and start

1. Unzip `FitNova-AI.zip`.
2. In VS Code choose **File > Open Folder** and select the `FitNova-AI` folder.
3. Open the terminal with **Ctrl + `** (make sure it is PowerShell) and run:

```powershell
npm install
npm run dev
```

4. Open http://localhost:5173 (it usually opens automatically).

Or from any PowerShell window:

```powershell
cd C:\path\to\FitNova-AI
npm install
npm run dev
```

### Other commands

```powershell
npm run build       # production build into the dist/ folder
npm run preview     # preview the production build locally
npm run typecheck   # run the TypeScript checker (no files written)
```

### Troubleshooting (Windows)

- **"running scripts is disabled on this system"** when running `npm`: run this once, then reopen the terminal:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```
  (or use `npm.cmd install` and `npm.cmd run dev` instead).
- **Port already in use:** stop the other app, or run `npm run dev -- --port 3000`.
- **Blank page after changing data:** open the browser console (F12), then run `localStorage.clear()` and refresh. This resets the demo.
- **Build or type errors:** run `npm run typecheck` and read the first error. Each file has a purpose comment at the top to help you find your way.

---

## 4. Design system

| Token | Hex | Tailwind class |
|-------|-----|----------------|
| Main background | `#0B0F0C` | `bg-bg` |
| Card | `#121A15` | `bg-card` |
| Secondary background | `#19221C` | `bg-panel` |
| Elevated card | `#202B23` | `bg-raised` |
| Primary accent | `#B7D8B8` | `text-accent`, `bg-accent` |
| Secondary accent | `#98BE9C` | `bg-accent-2` |
| Muted sage | `#78977C` | `bg-accent-muted` |
| Primary text | `#F2F5F1` | `text-ink` |
| Secondary text | `#A6B0A6` | `text-soft` |
| Border | `#29352D` | `border-line` |

Font: **Manrope** (Google Fonts). Colours are defined once in `tailwind.config.js`; chart colours are in `src/components/charts/ActivityCharts.tsx`.

---

## 5. Folder structure

```text
FitNova-AI/
├── public/                 favicon.svg, logo/, images/
├── src/
│   ├── assets/             future local images and fonts
│   ├── components/         reusable pieces (ui/ = buttons, cards, fields; charts/)
│   ├── context/            Auth, Tracker, Toast, Notifications providers
│   ├── data/               DEMO data only (exercises, foods, plans, mock AI replies)
│   ├── hooks/              useLocalStorage, useDocumentTitle
│   ├── layouts/            MarketingLayout, AuthLayout, AppLayout, ProtectedRoute
│   ├── pages/              one file per page
│   ├── services/           API layer (demo today, FastAPI later)
│   ├── styles/             Tailwind + global CSS
│   ├── types/              shared TypeScript interfaces
│   ├── utils/              dates, stats, cn, download helpers
│   ├── App.tsx             route table
│   └── main.tsx            entry point and providers
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 6. How the code is organised

- **Pages** (`src/pages`) assemble the screen. They contain no raw `fetch` calls.
- **Components** (`src/components`) are reusable and know nothing about routes.
- **Services** (`src/services`) are the only place that talks to a backend.
- **Context** shares state: `AuthContext` (user), `TrackerContext` (activity, habits, water, sleep, meals), `ToastContext`, `NotificationsContext`.
- **Data** (`src/data`) is demo content, kept separate from real API data.
- Large files use numbered section headers (imports, types, state, handlers, rendering) so a beginner can find things quickly.

---

## 7. Connecting the backend later

Everything is controlled by two variables (copy `.env.example` to `.env`):

```text
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_DEMO=false
```

With `VITE_USE_DEMO=false`, each service calls your API through `src/services/api.ts`.

| Service file | Suggested FastAPI endpoints |
|--------------|-----------------------------|
| `authService.ts` | `POST /auth/login`, `POST /auth/register`, `POST /auth/forgot-password` |
| `coachService.ts` | `POST /coach/chat` (server calls the cloud AI API) |
| `workoutService.ts` | `GET /workouts` |
| `nutritionService.ts` | `GET /nutrition/foods` |
| `activityService.ts` | `GET /activity/summary`, `PUT /activity/sync` |
| `subscriptionService.ts` | `GET /subscriptions/plans`, `POST /subscriptions/change` |
| `contactService.ts` | `POST /contact`, `POST /feedback` |

The demo login does not issue a token. When you build real auth, store the token returned by `/auth/login` under `fitnova.token`, which `api.ts` already sends as a Bearer header. Prefer secure HTTP-only cookies if you can.

### Security rules
- **Never put API keys in this project.** Anything `VITE_*` is visible to every visitor. Cloud AI keys belong on the FastAPI server only.
- Validate all input again on the server. Frontend validation is only for convenience.
- Payments must go through a certified provider on the backend. None is implemented here.

---

## 8. Demo behaviour to know about

- **Login:** any valid email and a password of 6+ characters. Data is saved only in your browser (`localStorage`).
- **AI Coach:** answers come from keyword rules in `src/data/coachReplies.ts`. They are educational examples, not real AI. The microphone button opens a placeholder for future voice features.
- **Nutrition:** values are rough estimates. Verify against a trusted source and use a registered dietitian for personal advice.
- **Pricing:** Free, Pro (₹199/month) and Premium (₹299/month) are illustrative. Choosing a plan only changes the demo account.
- **Testimonials:** labelled sample content, not real customers.
- **Privacy Policy and Terms:** development templates. Have a lawyer review them before launch.
- **Reports:** download builds a `.txt` or `.csv` in the browser.
- **Favicon:** supplied as `public/favicon.svg`. If you need a `.ico` file, convert it with any online converter and place it in `public/`.

---

## 9. Responsive behaviour

| Screen | Behaviour |
|--------|-----------|
| Desktop and laptop | Full top navigation, expanded sidebar |
| Tablet | Sidebar starts collapsed to icons and can be expanded |
| Phone (Android and iPhone) | Bottom navigation bar with a "More" menu, stacked cards, scrollable filter chips, chat history drawer |

Animations respect the system "reduce motion" setting.

---

## 10. Accessibility notes

Keyboard focus rings, labelled form fields with error messages, `aria-pressed` on toggles and chips, `aria-live` on chat and toasts, and charts with text labels.
#   F I T - N O V A  
 