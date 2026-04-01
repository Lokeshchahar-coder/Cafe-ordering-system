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
