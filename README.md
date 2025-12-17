# Feedback Collector

Small full-stack app to collect customer feedback and give a single admin a dashboard to review stats.

## Install & Run
- Backend: `cd feedback-backend && npm install && npm run dev`
- Frontend: `cd feedback-collector-frontend && npm install && npm run dev`
- Environment:
  - Backend: copy `feedback-backend/.env.example` to `.env` and set `MONGO_URI`, `JWT_SECRET`, optional `PORT` (default 5000), `NODE_ENV`
  - Frontend: copy `feedback-collector-frontend/.env.example` to `.env` and set `VITE_API_URL` (default http://localhost:5000/api)

## How to Give Feedback
1) Start both servers.
2) Open the frontend (Vite dev server URL).
3) Use the home/feedback form page to submit feedback.

## Admin Registration (single admin)
- Visit `/admin/register` once to create the first admin. Further registrations are blocked.
- Then sign in at `/admin/login`; token is stored locally and used for protected routes.

## Admin API Endpoints (base: /api/admin)
- `POST /register` — create the first admin only.
- `POST /login` — returns JWT.
- `GET /profile` — get admin profile (auth).
- `GET /stats/dashboard` — aggregated stats (auth).
- `GET /stats/product/:productName` — stats per product (auth).

## Feedback API (base: /api/feedback)
- `POST /` — submit feedback.
- `GET /` — list feedback (auth).
- `GET /:id` — fetch one (auth).
- `DELETE /:id` — delete (auth).
- `GET /filter` — query by product/rating/date/keyword (auth).


