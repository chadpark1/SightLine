import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:8000";

const TAG_COLORS = {
  "eating / drinking":     { bg: "#FFF3E0", text: "#E65100" },
  "social / conversation": { bg: "#F3E5F5", text: "#6A1B9A" },
  "transit / moving":      { bg: "#E8F5E9", text: "#2E7D32" },
  "focused work / study":  { bg: "#E3F2FD", text: "#1565C0" },
  "outdoor / exercise":    { bg: "#E8F5E9", text: "#1B5E20" },
  "entertainment / leisure":{ bg: "#FCE4EC", text: "#880E4F" },
  "event / gathering":     { bg: "#FFF8E1", text: "#F57F17" },
  "unclear / other":       { bg: "#F5F5F5", text: "#757575" },
};

export default function VideoRecapPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [clips, setClips] = useState([]);
  // analyzedScenes: null until analysis runs, then [{url, primary_tag, score, duration, ...}]
  const [analyzedScenes, setAnalyzedScenes] = useState(null);
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [previewScene, setPreviewScene] = useState(null);

  function handleFileChange(e) {
    const newFiles = Array.from(e.target.files);
    const newClips = newFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setClips((prev) => [...prev, ...newClips]);
    setAnalyzedScenes(null); // reset if new files added
    e.target.value = "";
  }

  function removeClip(index) {
    setClips((prev) => prev.filter((_, i) => i !== index));
    setAnalyzedScenes(null);
  }

  async function handleGenerate() {
    if (clips.length === 0) {
      setStatus("error");
      setStatusMessage("Please upload at least one video clip.");
      return;
    }

    try {
      // Step 1: Analyze — uploads videos, runs pipeline, returns ranked scenes
      setStatus("analyzing");
      setStatusMessage("Analyzing clips with AI...");

      const formData = new FormData();
      clips.forEach((clip) => formData.append("files", clip.file));

      const analyzeRes = await fetch(`${BACKEND_URL}/recap/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!analyzeRes.ok) {
        const err = await analyzeRes.json();
        throw new Error(err.detail || "Analysis failed");
      }

      const { clips: scenes } = await analyzeRes.json();

      if (!scenes || scenes.length === 0) {
        throw new Error("No scenes could be detected in the uploaded videos.");
      }

      setAnalyzedScenes(scenes);

      // Step 2: Submit Shotstack render job with auto-ranked clips
      setStatus("generating");
      setStatusMessage(
        `Found ${scenes.length} scene${scenes.length !== 1 ? "s" : ""}. Submitting to Shotstack...`
      );

      const generateRes = await fetch(`${BACKEND_URL}/recap/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clips: scenes }),
      });

      if (!generateRes.ok) {
        const err = await generateRes.json();
        throw new Error(err.detail || "Render submission failed");
      }

      const { render_id } = await generateRes.json();

      // Step 3: Poll for completion
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

  const isProcessing = ["analyzing", "generating", "polling"].includes(status);

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

        {/* Uploaded file list */}
        {clips.length > 0 && !analyzedScenes && (
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Hi Melody', cursive", color: "#452d2d", fontSize: 20, marginBottom: 12 }}>
              Your Videos ({clips.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {clips.map((clip, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #EEE1D0",
                    borderRadius: 14,
                    padding: "10px 12px",
                    background: "#FFFCE9",
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <video
                    src={clip.previewUrl}
                    style={{ width: 64, height: 46, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                    muted
                    preload="metadata"
                  />
                  <p
                    style={{
                      flex: 1,
                      margin: 0,
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
                  <button
                    onClick={() => !isProcessing && removeClip(i)}
                    disabled={isProcessing}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 16,
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

        {/* Analyzed scenes list */}
        {analyzedScenes && (
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Hi Melody', cursive", color: "#452d2d", fontSize: 20, marginBottom: 4 }}>
              Detected Scenes ({analyzedScenes.length})
            </h2>
            <p style={{ color: "#aaa", fontSize: 12, margin: "0 0 12px" }}>
              Ranked by AI interest score
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {analyzedScenes.map((scene, i) => {
                const colors = TAG_COLORS[scene.primary_tag] || TAG_COLORS["unclear / other"];
                return (
                  <div
                    key={i}
                    onClick={() => setPreviewScene(scene)}
                    style={{
                      border: "1px solid #EEE1D0",
                      borderRadius: 14,
                      padding: "10px 14px",
                      background: "#FFFCE9",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      cursor: "pointer",
                      transition: "box-shadow 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.12)")}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                  >
                    {/* Rank badge */}
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #FEEAF3, #D1EEFE)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#452d2d",
                        flexShrink: 0,
                      }}
                    >
                      #{i + 1}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Tag badge */}
                      <span
                        style={{
                          display: "inline-block",
                          background: colors.bg,
                          color: colors.text,
                          borderRadius: 999,
                          padding: "2px 10px",
                          fontSize: 12,
                          fontWeight: 600,
                          marginBottom: 3,
                        }}
                      >
                        {scene.primary_tag}
                      </span>
                      {/* Meta */}
                      <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>
                        {scene.source_video} · {scene.duration.toFixed(1)}s · score {scene.score.toFixed(2)}
                      </p>
                    </div>
                    {/* Play icon */}
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #FEEAF3, #D1EEFE)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 12,
                      }}
                    >
                      ▶
                    </div>
                  </div>
                );
              })}
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
            <button
              onClick={() => {
                const gallery = JSON.parse(localStorage.getItem("sightline_gallery") || "[]");
                const id = Date.now().toString();
                gallery.push({
                  id,
                  url: videoUrl,
                  title: "Daily Recap",
                  savedAt: new Date().toISOString(),
                });
                localStorage.setItem("sightline_gallery", JSON.stringify(gallery));
                navigate("/gallery");
              }}
              style={{
                display: "block",
                width: "100%",
                marginTop: 10,
                textAlign: "center",
                background: "linear-gradient(to right, #FEEAF3, #D1EEFE)",
                borderRadius: 999,
                padding: "10px 0",
                fontFamily: "'Hi Melody', cursive",
                color: "#452d2d",
                fontSize: 18,
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
            >
              Save to Gallery
            </button>
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
          AI detects scenes and ranks them automatically
        </p>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Clip preview modal */}
      {previewScene && (
        <div
          onClick={() => setPreviewScene(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 20,
              padding: 20,
              width: "100%",
              maxWidth: 440,
              boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
            }}
          >
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    background: (TAG_COLORS[previewScene.primary_tag] || TAG_COLORS["unclear / other"]).bg,
                    color: (TAG_COLORS[previewScene.primary_tag] || TAG_COLORS["unclear / other"]).text,
                    borderRadius: 999,
                    padding: "3px 12px",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {previewScene.primary_tag}
                </span>
                <span style={{ fontSize: 12, color: "#aaa" }}>
                  #{previewScene.rank} · {previewScene.duration.toFixed(1)}s · score {previewScene.score.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => setPreviewScene(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "#aaa",
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ✕
              </button>
            </div>

            {/* Video player */}
            <video
              key={previewScene.url}
              src={previewScene.url}
              controls
              autoPlay
              style={{
                width: "100%",
                borderRadius: 12,
                maxHeight: 300,
                background: "#000",
                display: "block",
              }}
            />

            <p style={{ margin: "10px 0 0", fontSize: 12, color: "#aaa", textAlign: "center" }}>
              {previewScene.source_video} · {previewScene.start.toFixed(1)}s – {previewScene.end.toFixed(1)}s
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
