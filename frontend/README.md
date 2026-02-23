# BiteX Main Web

Marketing site, registration, and profile portal for the BiteX restaurant POS platform by Shyara.

## Setup

```bash
npm install
cp .env.example .env   # then edit with your values
npm run dev             # starts on http://localhost:5173
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API URL (e.g. `http://localhost:8080`) |
| `VITE_POS_URL` | POS website URL for cross-site links |

## Build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```
