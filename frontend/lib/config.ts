// Backend base URL for the daily-recap video pipeline (FastAPI).
// On a physical device, localhost refers to the device itself, so set this
// to your dev machine's LAN IP via an EXPO_PUBLIC_API_URL env var
// (put it in a .env file at frontend/.env and restart `expo start`).
export const API_URL =
  (process.env.EXPO_PUBLIC_API_URL as string | undefined) ??
  'http://127.0.0.1:8000';
