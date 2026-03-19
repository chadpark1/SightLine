import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from uuid import UUID
from datetime import datetime
from typing import Optional

app = FastAPI()

SUPABASE_URL = "https://skaanrwiwfnhofzdchiz.supabase.co"
SUPABASE_KEY = "anon-key"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class Profile(BaseModel):
    id: UUID
    username: str
    full_name: str
    avatar_url: Optional[str] = None
    created_at: datetime

@app.get("/profiles/{username}", response_model=Profile)
def get_profile(username: str):
    response = supabase.table("profiles").select("*").eq("username", username).single().execute()
    if response.data is None:
        raise HTTPException(status_code=404, detail="User not found")
    return response.data
