import os
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from supabase import create_client, Client
from uuid import UUID
from datetime import datetime
from typing import Optional

load_dotenv()

app = FastAPI()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class Profile(BaseModel):
    id: UUID
    username: str
    full_name: str
    avatar_url: Optional[str] = None
    created_at: datetime

@app.post("/signup")
def sign_up(email: str, password: str, username: str = None, full_name: str = None):
    try:
        response = supabase.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True
        })
        user_id = response.user.id
        supabase.table("profiles").insert({
            "id": user_id,
            "username": username,
            "full_name": full_name
        }).execute()
        return {"message": "Signup successful!", "user_id": user_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/login")
def log_in(email: str, password: str):
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return {
            "message": "Login successful!",
            "session": {
                "access_token": auth_response.session.access_token,
                "refresh_token": auth_response.session.refresh_token,
                "user": str(auth_response.user)
            }
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid login credentials")

@app.get("/auth/google")
def login_with_google():
    response = supabase.auth.sign_in_with_oauth({
        "provider": "google",
        "options": {
            "redirect_to": f"{FRONTEND_URL}/auth/callback"
        }
    })
    return RedirectResponse(response.url)

@app.get("/auth/callback")
def auth_callback(code: str):
    session = supabase.auth.exchange_code_for_session({"auth_code": code})
    return {"access_token": session.session.access_token, "user": session.user.email}

@app.get("/profiles/{username}", response_model=Profile)
def get_profile(username: str):
    response = supabase.table("profiles").select("*").eq("username", username).single().execute()
    if response.data is None:
        raise HTTPException(status_code=404, detail="User not found")
    return response.data
