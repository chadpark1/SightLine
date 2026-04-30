import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function VideoDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const videos = JSON.parse(localStorage.getItem("sightline_gallery") || "[]");
  const video = videos.find((v) => v.id === id);

  if (!video) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #FEEAF3 0%, #D1EEFE 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "'Hi Melody', cursive",
              fontSize: 24,
              color: "#452d2d",
              marginBottom: 16,
            }}
          >
            Video not found
          </p>
          <button
            onClick={() => navigate("/gallery")}
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
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

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
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8, gap: 12 }}>
          <button
            onClick={() => navigate("/gallery")}
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
              fontSize: 26,
              color: "#452d2d",
              margin: 0,
              flex: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {video.title}
          </h1>
        </div>

        <p style={{ color: "#aaa", fontSize: 12, margin: "0 0 18px 34px" }}>
          Saved on{" "}
          {new Date(video.savedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* Video player */}
        <video
          src={video.url}
          controls
          style={{
            width: "100%",
            borderRadius: 14,
            maxHeight: 300,
            background: "#000",
            display: "block",
            marginBottom: 16,
          }}
        />

        {/* Download button */}
        <a
          href={video.url}
          download="daily_recap.mp4"
          style={{
            display: "block",
            textAlign: "center",
            background: "linear-gradient(to right, #FEEAF3, #D1EEFE)",
            borderRadius: 999,
            padding: "12px 0",
            fontFamily: "'Hi Melody', cursive",
            color: "#452d2d",
            fontSize: 18,
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          Save to Computer / Phone
        </a>
      </div>
    </div>
  );
}
