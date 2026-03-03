from flask import Flask
from supabase import create_client, Client
import os

SUPABASE_URL = "https://skaanrwiwfnhofzdchiz.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrYWFucndpd2ZuaG9memRjaGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NjIxMDUsImV4cCI6MjA4NzEzODEwNX0.8lV_Mncr3JADxVTJPnuhgVJs1PYsJh1Dj6iDpGTx6JY"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)

def signup(email, password):
    response = supabase.auth.sign_up({
        "email": email,
        "password": password
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

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })

        return jsonify(response.model_dump()), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/login", methods=["POST"])
def log_in():
    return "Hello, Flask!"

if __name__ == "__main__":
    app.run(debug=True)