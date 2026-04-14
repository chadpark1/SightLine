import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:8000";

const CLASSIFIERS = ["eating", "transit", "exercise", "social", "work", "other"];

export default function VideoRecapPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [clips, setClips] = useState([]);
  const [status, setStatus] = useState(null); // null | "uploading" | "generating" | "polling" | "done" | "error"
  const [statusMessage, setStatusMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);

  function handleFileChange(e) {
    const newFiles = Array.from(e.target.files);
    const newClips = newFiles.map((file) => ({
      file,
      classifier: "other",
      score: 0.5,
      previewUrl: URL.createObjectURL(file),
    }));
    setClips((prev) => [...prev, ...newClips]);
    e.target.value = "";
  }

  function updateClip(index, field, value) {
    setClips((prev) =>
      prev.map((clip, i) => (i === index ? { ...clip, [field]: value } : clip))
    );
  }

  function removeClip(index) {
    setClips((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleGenerate() {
    if (clips.length === 0) {
      setStatus("error");
      setStatusMessage("Please upload at least one video clip.");
      return;
    }

    try {
      // Step 1: Upload clips to backend
      setStatus("uploading");
      setStatusMessage("Uploading clips...");

      const formData = new FormData();
      clips.forEach((clip) => formData.append("files", clip.file));

      const uploadRes = await fetch(`${BACKEND_URL}/recap/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.detail || "Upload failed");
      }

      const { urls } = await uploadRes.json();

      // Step 2: Combine uploaded URLs with user-provided metadata
      const clipData = urls.map((item, i) => ({
        url: item.url,
        filename: item.filename,
        classifier: clips[i]?.classifier || "other",
        score: parseFloat(clips[i]?.score) || 0.5,
      }));

      // Step 3: Submit Shotstack render job
      setStatus("generating");
      setStatusMessage("Submitting to Shotstack for rendering...");

      const generateRes = await fetch(`${BACKEND_URL}/recap/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clips: clipData }),
      });

      if (!generateRes.ok) {
        const err = await generateRes.json();
        throw new Error(err.detail || "Render submission failed");
      }

      const { render_id } = await generateRes.json();

      // Step 4: Poll for completion
      setStatus("polling");
      setStatusMessage("Rendering your recap video...");
      await pollStatus(render_id);
    } catch (err) {
      setStatus("error");
      setStatusMessage(err.message || "Something went wrong.");
    }
  }

  async function pollStatus(renderId) {
    const maxAttempts = 60;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 5000));

      const res = await fetch(`${BACKEND_URL}/recap/status/${renderId}`);
      if (!res.ok) continue;

      const data = await res.json();

      if (data.status === "done") {
        setVideoUrl(data.url);
        setStatus("done");
        setStatusMessage("Your recap is ready!");
        return;
      } else if (data.status === "failed") {
        throw new Error("Shotstack render failed.");
      }

      const progress = Math.min(Math.round(((i + 1) / maxAttempts) * 100), 95);
      setStatusMessage(`Rendering your recap video... ${progress}%`);
    }
    throw new Error("Render timed out. Try again.");
  }

  const isProcessing = ["uploading", "generating", "polling"].includes(status);

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
            Daily Recap Generator
          </h1>
        </div>

        {/* Upload area */}
        <div
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          style={{
            border: "2px dashed #D1EEFE",
            borderRadius: 16,
            padding: "24px 16px",
            textAlign: "center",
            cursor: isProcessing ? "not-allowed" : "pointer",
            marginBottom: 20,
            background: "#FAFEFF",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => !isProcessing && (e.currentTarget.style.borderColor = "#FEEAF3")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#D1EEFE")}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>🎬</div>
          <p style={{ fontFamily: "'Hi Melody', cursive", color: "#452d2d", margin: 0, fontSize: 18 }}>
            Click to add video clips
          </p>
          <p style={{ color: "#aaa", fontSize: 13, margin: "4px 0 0" }}>MP4, MOV, AVI supported</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Clip list */}
        {clips.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Hi Melody', cursive", color: "#452d2d", fontSize: 20, marginBottom: 12 }}>
              Your Clips ({clips.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {clips.map((clip, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #EEE1D0",
                    borderRadius: 14,
                    padding: "12px 14px",
                    background: "#FFFCE9",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  {/* Video preview thumbnail */}
                  <video
                    src={clip.previewUrl}
                    style={{ width: 72, height: 52, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                    muted
                    preload="metadata"
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: 13,
                        color: "#452d2d",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {clip.file.name}
                    </p>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {/* Classifier select */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <label style={{ fontSize: 11, color: "#888" }}>Classifier</label>
                        <select
                          value={clip.classifier}
                          onChange={(e) => updateClip(i, "classifier", e.target.value)}
                          disabled={isProcessing}
                          style={{
                            border: "1px solid #EEE1D0",
                            borderRadius: 8,
                            padding: "4px 8px",
                            fontSize: 13,
                            background: "white",
                            color: "#452d2d",
                          }}
                        >
                          {CLASSIFIERS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Score input */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <label style={{ fontSize: 11, color: "#888" }}>Score (0–1)</label>
                        <input
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          value={clip.score}
                          onChange={(e) => updateClip(i, "score", e.target.value)}
                          disabled={isProcessing}
                          style={{
                            width: 70,
                            border: "1px solid #EEE1D0",
                            borderRadius: 8,
                            padding: "4px 8px",
                            fontSize: 13,
                            color: "#452d2d",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => !isProcessing && removeClip(i)}
                    disabled={isProcessing}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 18,
                      cursor: isProcessing ? "not-allowed" : "pointer",
                      color: "#aaa",
                      padding: 0,
                      flexShrink: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status / progress */}
        {status && status !== "done" && (
          <div
            style={{
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 16,
              background: status === "error" ? "#FFF0F0" : "#F0F8FF",
              border: `1px solid ${status === "error" ? "#FFB3B3" : "#D1EEFE"}`,
              color: status === "error" ? "#c0392b" : "#2980b9",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {isProcessing && (
              <span
                style={{
                  display: "inline-block",
                  width: 16,
                  height: 16,
                  border: "2px solid #D1EEFE",
                  borderTopColor: "#2980b9",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  flexShrink: 0,
                }}
              />
            )}
            {statusMessage}
          </div>
        )}

        {/* Result video */}
        {status === "done" && videoUrl && (
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Hi Melody', cursive", color: "#452d2d", fontSize: 20, marginBottom: 12 }}>
              Your Recap is Ready!
            </h2>
            <video
              src={videoUrl}
              controls
              style={{ width: "100%", borderRadius: 14, maxHeight: 280, background: "#000" }}
            />
            <a
              href={videoUrl}
              download="daily_recap.mp4"
              style={{
                display: "block",
                marginTop: 10,
                textAlign: "center",
                background: "linear-gradient(to right, #FEEAF3, #D1EEFE)",
                borderRadius: 999,
                padding: "10px 0",
                fontFamily: "'Hi Melody', cursive",
                color: "#452d2d",
                fontSize: 18,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              Download Video
            </a>
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={isProcessing || clips.length === 0}
          style={{
            width: "100%",
            padding: "14px 0",
            background:
              isProcessing || clips.length === 0
                ? "#e0e0e0"
                : "linear-gradient(to right, #FEEAF3, #D1EEFE)",
            border: "none",
            borderRadius: 999,
            fontFamily: "'Hi Melody', cursive",
            fontSize: 22,
            color: isProcessing || clips.length === 0 ? "#aaa" : "#452d2d",
            cursor: isProcessing || clips.length === 0 ? "not-allowed" : "pointer",
            boxShadow: isProcessing || clips.length === 0 ? "none" : "0 4px 12px rgba(0,0,0,0.1)",
            transition: "all 0.2s",
          }}
        >
          {isProcessing ? "Processing..." : "Generate Recap ✨"}
        </button>

        <p style={{ textAlign: "center", color: "#aaa", fontSize: 12, marginTop: 12 }}>
          Clips are ranked by score and trimmed to fit ~60 seconds
        </p>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
