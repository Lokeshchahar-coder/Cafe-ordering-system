# Tap2Order Frontend

## Local setup
1. Go to this folder.
2. Install dependencies:
	- `npm install`
3. (Optional) create env file:
	- `cp .env.example .env`
4. Start dev server:
	- `npm run dev`

Default frontend URL: `http://localhost:5173`

## Backend connection
- In development, frontend uses Vite proxy:
  - `/api/*` -> `http://localhost:8001`
- Keep backend running on port `8001` (or update `vite.config.js` proxy target).

## Common issue on teammate systems
If UI loads but API calls fail:
1. Check backend is running (`GET http://localhost:8001/api/health`).
2. Check backend `.env` has valid `MONGO_URI`.
3. Restart both frontend and backend after env changes.
