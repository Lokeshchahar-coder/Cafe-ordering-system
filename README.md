# Tap2Order

Monorepo with:
- `backend` (Express + MongoDB)
- `tap2order` (React + Vite)

## Quick start (new machine)

### 1) Backend
1. `cd backend`
2. `npm install`
3. `cp .env.example .env`
4. Set `MONGO_URI` in `.env`
5. `npm run dev`

Backend runs on: `http://localhost:8001`

### 2) Frontend
1. Open new terminal
2. `cd tap2order`
3. `npm install`
4. `cp .env.example .env` (optional)
5. `npm run dev`

Frontend runs on: `http://localhost:5173`

## Verify
- Health endpoint: `http://localhost:8001/api/health`
- Frontend should load and API calls should work through Vite proxy.

## Free deployment (production)

This repo is prepared for a free setup:
- Backend: Render (free web service)
- Frontend: Netlify or Vercel (free static hosting)
- Database: MongoDB Atlas free tier

### 1) Deploy backend to Render
1. Push this repo to GitHub.
2. In Render, create a **Web Service** from the repo.
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables from `backend/.env.production.example`
	- Required: `MONGO_URI`
	- Required: `FRONTEND_URL` (your deployed frontend URL)
7. After deploy, confirm health check:
	- `https://<your-render-service>.onrender.com/api/health`

`render.yaml` is included in repo root for Render blueprint setup.

### 2) Deploy frontend

#### Option A: Netlify
1. Import repo in Netlify.
2. Build settings (already in `netlify.toml`):
	- Base directory: `tap2order`
	- Build command: `npm run build`
	- Publish directory: `dist`
3. Add env var:
	- `VITE_API_URL=https://<your-render-service>.onrender.com`
4. Deploy site.

#### Option B: Vercel
1. Import repo in Vercel.
2. `vercel.json` is included for build/output config.
3. Add env var:
	- `VITE_API_URL=https://<your-render-service>.onrender.com`
4. Deploy site.

### 3) Final production check
- Open frontend URL.
- Test login/order flow.
- Ensure backend CORS `FRONTEND_URL` exactly matches deployed frontend domain.
