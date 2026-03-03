from flask import Flask
from supabase import create_client, Client
import os
from flask import request, jsonify

SUPABASE_URL = "https://skaanrwiwfnhofzdchiz.supabase.co"
# Service Role Key (Private)
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrYWFucndpd2ZuaG9memRjaGl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU2MjEwNSwiZXhwIjoyMDg3MTM4MTA1fQ.paBiiQYmLmyaBrtd4K7uCc7O8klDNr4BTdi7EnLO_-k"
# Public Key
#SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrYWFucndpd2ZuaG9memRjaGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NjIxMDUsImV4cCI6MjA4NzEzODEwNX0.8lV_Mncr3JADxVTJPnuhgVJs1PYsJh1Dj6iDpGTx6JY"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)

def signup(email, password):
    response = supabase.auth.admin.create_user({
        "email": email,
        "password": password,
        "email_confirm": True
    })
    return response

def login(email, password):
    response = supabase.auth.sign_in_with_password({
        "email": email,
        "password": password
    })
    return response

@app.route("/signup", methods=["POST"])
def sign_up():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    username = data.get("username")
    full_name = data.get("full_name")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    try:
        response = signup(email, password)
        
        user_id = response.user.id

        supabase.table("profiles").insert({
            "id": user_id,
            "username": username,
            "full_name": full_name
        }).execute()

        return jsonify({
            "message": "Signup successful!",
            "user_id": user_id
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/login", methods=["POST"])
def log_in():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    try:
        auth_response = login(email, password)
        
        return jsonify({
            "message": "Login successful!",
            "session": {
                "access_token": auth_response.session.access_token,
                "refresh_token": auth_response.session.refresh_token,
                "user": str(auth_response.user)
            }
        }), 200
    except Exception as e:
        return jsonify({"error": "Invalid login credentials"}), 401

@app.route("/profile", methods=["PUT"])
def update_profile():
    data = request.get_json()

    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing Authorization header"}), 401
    token = auth_header.split(" ")[1]

    try:
        user = supabase.auth.get_user(token)
        user_id = user.user.id

        update_data = {}
        for field in ["username", "full_name", "avatar_url"]:
            if field in data:
                update_data[field] = data[field]

        if not update_data:
            return jsonify({"error": "No fields provided for update"}), 400

        supabase.table("profiles").update(update_data).eq("id", user_id).execute()

        return jsonify({"message": "Profile updated!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)