# Tap2Order Backend

## Run locally
1. Copy `.env.example` to `.env`
2. Fill MongoDB and other keys
3. Install deps: `npm install`
4. Start server: `npm run dev`

## API base
- `GET /api/health`

## Folders
- `src/config` - env and db setup
- `src/models` - mongoose models
- `src/controllers` - handlers
- `src/routes` - route maps
- `src/middleware` - auth/admin/error middleware
- `src/utils` - helper clients/utilities
