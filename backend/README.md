# Tap2Order Backend

## Local setup
1. Go to this folder.
2. Install dependencies:
	- `npm install`
3. Create env file:
	- `cp .env.example .env`
4. Update at least `MONGO_URI` in `.env`.
5. Start server:
	- `npm run dev`

Default local URL: `http://localhost:8001`

## Health check
- `GET /api/health`

If this returns `{ ok: true }`, backend is running correctly.

## Notes for collaboration
- Frontend Vite proxy points to backend port `8001`.
- If you change backend `PORT`, also update frontend proxy in `tap2order/vite.config.js`.

## Folders
- `src/config` - env and db setup
- `src/models` - mongoose models
- `src/controllers` - handlers
- `src/routes` - route maps
- `src/middleware` - auth/admin/error middleware
- `src/utils` - helper clients/utilities
