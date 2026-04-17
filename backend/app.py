import os
import uuid as uuid_lib
import requests
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from uuid import UUID
from datetime import datetime
from typing import Optional

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
# Service-role client used for storage uploads (bypasses RLS)
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY or SUPABASE_KEY)

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


# ──────────────────────────────────────────────
#  Daily Recap — Shotstack video generation
# ──────────────────────────────────────────────

SHOTSTACK_API_KEY = os.environ.get("SHOTSTACK_API_KEY")
SHOTSTACK_BASE = "https://api.shotstack.io/edit/stage"
SUPABASE_CLIPS_BUCKET = "video-clips"


class ClipInput(BaseModel):
    url: str
    classifier: str
    score: float


class GenerateRecapRequest(BaseModel):
    clips: list[ClipInput]


@app.post("/recap/upload")
async def upload_clips(files: list[UploadFile] = File(...)):
    """Upload video clips to Supabase Storage and return their public URLs."""
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    urls = []
    for file in files:
        content = await file.read()
        # Use a unique path so simultaneous uploads don't collide
        unique_name = f"{uuid_lib.uuid4()}_{file.filename}"
        path = f"clips/{unique_name}"

        supabase_admin.storage.from_(SUPABASE_CLIPS_BUCKET).upload(
            path,
            content,
            {"content-type": file.content_type or "video/mp4"},
        )
        public_url = supabase_admin.storage.from_(SUPABASE_CLIPS_BUCKET).get_public_url(path)
        urls.append({"filename": file.filename, "url": public_url})

    return {"urls": urls}


@app.post("/recap/generate")
def generate_recap(request: GenerateRecapRequest):
    """
    Sort clips by score, greedily pick up to ~60 s worth, and submit
    a Shotstack render job. Returns the render ID for polling.
    """
    if not request.clips:
        raise HTTPException(status_code=400, detail="No clips provided")

    if not SHOTSTACK_API_KEY:
        raise HTTPException(status_code=500, detail="SHOTSTACK_API_KEY not configured")

    # Sort highest score first
    sorted_clips = sorted(request.clips, key=lambda c: c.score, reverse=True)

    TARGET_DURATION = 60  # seconds
    DEFAULT_CLIP_LENGTH = 5  # fallback if we can't know duration ahead of time

    timeline_clips = []
    current_start = 0.0

    for clip in sorted_clips:
        if current_start >= TARGET_DURATION:
            break

        remaining = TARGET_DURATION - current_start
        clip_length = min(DEFAULT_CLIP_LENGTH, remaining)

        timeline_clips.append({
            "asset": {"type": "video", "src": clip.url},
            "start": current_start,
            "length": clip_length,
            "transition": {"in": "fade", "out": "fade"},
        })
        current_start += clip_length

    payload = {
        "timeline": {
            "tracks": [{"clips": timeline_clips}],
        },
        "output": {
            "format": "mp4",
            "resolution": "hd",
        },
    }

    resp = requests.post(
        f"{SHOTSTACK_BASE}/render",
        json=payload,
        headers={"x-api-key": SHOTSTACK_API_KEY},
        timeout=30,
    )

    if resp.status_code not in (200, 201):
        raise HTTPException(status_code=502, detail=f"Shotstack error: {resp.text}")

    render_id = resp.json()["response"]["id"]
    return {"render_id": render_id}


@app.get("/recap/status/{render_id}")
def get_render_status(render_id: str):
    """Poll Shotstack for the render status and final video URL."""
    if not SHOTSTACK_API_KEY:
        raise HTTPException(status_code=500, detail="SHOTSTACK_API_KEY not configured")

    resp = requests.get(
        f"{SHOTSTACK_BASE}/render/{render_id}",
        headers={"x-api-key": SHOTSTACK_API_KEY},
        timeout=15,
    )

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Shotstack error: {resp.text}")

    data = resp.json()["response"]
    return {
        "status": data["status"],   # "queued" | "fetching" | "rendering" | "saving" | "done" | "failed"
        "url": data.get("url"),     # only present when status == "done"
    }


# ──────────────────────────────────────────────
#  Video Uploads — glasses / device pipeline
# ──────────────────────────────────────────────

VIDEOS_BUCKET = "videos"


@app.post("/videos/upload")
async def upload_video(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None),
    device_id: Optional[str] = Form(None),
    captured_at: Optional[str] = Form(None),
    duration_seconds: Optional[float] = Form(None),
):
    """
    Upload a video file to Supabase Storage and record its metadata
    in the video_uploads table.

    Form fields:
      - file             required  the video file
      - user_id          optional  account that owns this video (used as storage folder)
      - device_id        optional  identifier for the glasses/device that recorded it
      - captured_at      optional  ISO-8601 timestamp of when the clip was recorded
      - duration_seconds optional  clip length in seconds
    """
    # Validate captured_at — ignore it if it's not a real ISO timestamp
    parsed_captured_at = None
    if captured_at:
        try:
            datetime.fromisoformat(captured_at.replace("Z", "+00:00"))
            parsed_captured_at = captured_at
        except ValueError:
            pass

    content = await file.read()
    # Folder is the user account; UUID prefix prevents filename collisions
    unique_name = f"{uuid_lib.uuid4()}_{file.filename}"
    storage_path = f"{user_id or 'unknown'}/{unique_name}"

    try:
        supabase_admin.storage.from_(VIDEOS_BUCKET).upload(
            storage_path,
            content,
            {"content-type": file.content_type or "video/mp4"},
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Storage upload failed: {e}")

    row = {
        "filename": file.filename,
        "storage_path": storage_path,
        "status": "uploaded",
    }
    if user_id:
        row["user_id"] = user_id
    if device_id:
        row["device_id"] = device_id
    if parsed_captured_at:
        row["captured_at"] = parsed_captured_at
    if duration_seconds is not None:
        row["duration_seconds"] = duration_seconds

    try:
        result = supabase_admin.table("video_uploads").insert(row).execute()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Database insert failed: {e}")

    public_url = supabase_admin.storage.from_(VIDEOS_BUCKET).get_public_url(storage_path)
    return {"video": result.data[0], "url": public_url}


@app.get("/videos")
def list_videos(user_id: Optional[str] = None, device_id: Optional[str] = None):
    """
    Return all video_uploads rows, newest first.
    Pass ?user_id=xyz to filter by account, or ?device_id=xyz to filter by device.
    """
    query = supabase_admin.table("video_uploads").select("*").order("created_at", desc=True)
    if user_id:
        query = query.eq("user_id", user_id)
    if device_id:
        query = query.eq("device_id", device_id)
    result = query.execute()
    return {"videos": result.data}


@app.get("/videos/{video_id}")
def get_video(video_id: int):
    """
    Return a single video record plus a 1-hour signed URL for playback.
    """
    result = supabase_admin.table("video_uploads").select("*").eq("id", video_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Video not found")

    video = result.data
    signed = supabase_admin.storage.from_(VIDEOS_BUCKET).create_signed_url(
        video["storage_path"], expires_in=3600
    )
    return {"video": video, "signed_url": signed["signedURL"]}
