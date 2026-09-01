# Prayaas Frontend

React + Vite screening app. Same structure and interaction design as the ECG web app — three themes, five languages, sidebar dashboard layout — recoloured to the Prayaas palette (cyan on deep navy, taken from the logo) instead of the ECG app's blue.

## Layout

```
frontend/
├── index.html
├── vite.config.js          @ alias -> src/, dev proxy /api -> 127.0.0.1:8000
├── .env                    VITE_API_BASE_URL (gitignored)
├── public/
│   ├── assets/             team photos for the About page
│   └── cropped-cropped-IIHMR-Logo-03.png
└── src/
    ├── main.jsx            entry point
    ├── App.jsx             providers + routes
    ├── assets/logo.jpg
    ├── context/
    │   ├── ThemeContext.jsx     THEMES: light | dark | neon
    │   ├── LanguageContext.jsx  TRANSLATIONS: English, Hindi, Telugu, Tamil, Kannada
    │   └── UserContext.jsx      signed-in user, persisted to localStorage
    ├── hooks/useResponsive.js
    ├── layouts/DashboardLayout.jsx   sidebar, mobile drawer, logout modal
    ├── pages/
    │   ├── LoginSignup.jsx      two-panel login/signup
    │   ├── ScreeningPage.jsx    patient form + image upload + result
    │   ├── Settings.jsx         theme picker, language, account modals
    │   └── AboutUs.jsx          institute, leadership, team, papers
    ├── services/apiClient.js    all backend calls
    └── styles/index.css         reset only — the palette lives in ThemeContext
```

## Routes

| Path         | Page                       | Auth     |
| ------------ | -------------------------- | -------- |
| `/`          | Login / signup             | public   |
| `/screening` | Screening                  | required |
| `/settings`  | Settings                   | required |
| `/about`     | About us                   | required |

`DashboardLayout` redirects to `/` when there is no signed-in user.

## Theming

`ThemeContext` holds three palettes and injects the active one as CSS variables, plus passing the raw object to components as `T` for inline styles. Light is the default. The choice persists in `localStorage` under `prayaas-theme`.

To recolour the app, edit the `accent` / `accentHover` values in `src/context/ThemeContext.jsx` — everything else derives from them.

## Languages

`LanguageContext` exposes `t('key')` and `changeLanguage(lang)`, backed by a flat dictionary per language. Missing keys fall back to English, so a partially translated language still renders. The choice persists under `prayaas-language`. Add a language by adding one entry to `TRANSLATIONS` and its name to `LANGUAGES`.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Opens on http://localhost:5173. Start the backend (`python main.py serve`) alongside it — login and screening both need it.

The proxy targets `127.0.0.1`, not `localhost`, because Node resolves `localhost` to IPv6 `::1` while uvicorn binds IPv4 — every call 502s otherwise. It forwards `/api/*` unrewritten, because the backend serves those same paths under `/api`.

## Scripts

| Command           | Purpose                     |
| ----------------- | --------------------------- |
| `npm run dev`     | Dev server with HMR         |
| `npm run build`   | Production build to `dist/` |
| `npm run preview` | Serve the built output      |
| `npm run lint`    | Lint with oxlint            |
