import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GalleryPage() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sightline_gallery") || "[]");
    setVideos(saved);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FEEAF3 0%, #D1EEFE 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "white",
          borderRadius: 24,
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
          padding: 28,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24, gap: 12 }}>
          <button
            onClick={() => navigate("/app")}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              color: "#452d2d",
              padding: 0,
            }}
          >
            ←
          </button>
          <h1
            style={{
              fontFamily: "'Hi Melody', cursive",
              fontSize: 28,
              color: "#452d2d",
              margin: 0,
            }}
          >
            My Gallery
          </h1>
        </div>

        {videos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎬</div>
            <p
              style={{
                fontFamily: "'Hi Melody', cursive",
                fontSize: 22,
                color: "#452d2d",
                margin: "0 0 8px",
              }}
            >
              No videos saved yet
            </p>
            <p style={{ color: "#aaa", fontSize: 14, margin: "0 0 20px" }}>
              Generate a recap and save it to see it here
            </p>
            <button
              onClick={() => navigate("/recap")}
              style={{
                background: "linear-gradient(to right, #FEEAF3, #D1EEFE)",
                border: "none",
                borderRadius: 999,
                padding: "10px 28px",
                fontFamily: "'Hi Melody', cursive",
                fontSize: 18,
                color: "#452d2d",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              Generate Recap ✨
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => navigate(`/gallery/${video.id}`)}
                style={{
                  border: "1px solid #EEE1D0",
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "#FFFCE9",
                  cursor: "pointer",
                  transition: "box-shadow 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.12)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <video
                  src={video.url}
                  style={{
                    width: "100%",
                    height: 170,
                    objectFit: "cover",
                    background: "#000",
                    display: "block",
                  }}
                  muted
                  preload="metadata"
                />
                <div style={{ padding: "10px 14px" }}>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "'Hi Melody', cursive",
                      color: "#452d2d",
                      fontSize: 18,
                    }}
                  >
                    {video.title}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#aaa" }}>
                    {new Date(video.savedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
