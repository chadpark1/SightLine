# SightLine (Bare Bones)

Minimal stack only:
- Flask backend
- Vite + React frontend

## Setup

1. Frontend deps:
   - `npm install --prefix frontend`
2. Backend deps:
   - `pip install -r backend/requirements.txt`

## Run

From project root:
- `npm run dev` → frontend at `http://localhost:5173`
- `python -m uvicorn app:app --reload` → backend at `http://127.0.0.1:5000`

Frontend proxies `/api/*` to Flask.
