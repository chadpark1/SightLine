# SightLine

Cross-platform mobile app (iOS + Android) built with **Expo (React Native)**
and a Python **FastAPI** backend.

- `frontend/` — Expo app (TypeScript, Expo Router, react-native-svg, Supabase).
- `backend/` — FastAPI server for auth + daily-recap video rendering.

## Setup

1. Frontend deps:
   - `npm install --prefix frontend`
2. Backend deps:
   - `pip install -r backend/requirements.txt`

> If you have the old Vite `node_modules/` left in `frontend/` from a prior
> install and see lock errors, close any running dev servers / editor
> extensions holding binaries and delete `frontend/node_modules` before
> running `npm install` again.

## Run

From the project root:

- `npm start` — launches the Expo dev server. Press **i** for iOS simulator,
  **a** for Android, or scan the QR code with the **Expo Go** app on a
  physical device.
- `npm run android` / `npm run ios` / `npm run web` — shortcuts.
- `npm run backend` — starts the FastAPI backend (default
  `http://127.0.0.1:8000`).

### Connecting the mobile app to the backend

The Recap screen talks to the FastAPI backend via the `EXPO_PUBLIC_API_URL`
env var. Copy `frontend/.env.example` to `frontend/.env` and set it to your
computer's LAN IP when running on a physical device, e.g.:

```
EXPO_PUBLIC_API_URL=http://192.168.1.42:8000
```

Restart `expo start` after changing the file.

## Screens

Routes mirror the original web app (all under `frontend/app/`):

- `/signin` — login screen
- `/signup` — create account (Supabase)
- `/app`    — main home with "Connect Glasses", Daily Recap, Gallery
- `/recap`  — upload clips and generate a Shotstack recap video

