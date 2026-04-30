import os
from typing import Optional

from models.scene_splitter import split_into_scenes, extract_clip
from models.tag_detector import (
    load_model as load_yolo,
    sample_frames,
    tag_clip_from_frames,
    TAG_INTEREST_WEIGHT,
)
from models.emotion_model import load_model as load_emotion_model, predict_clip_emotion

# Emotions that signal a high-energy / memorable moment — small rank boost
_POSITIVE_EMOTIONS = {"happy", "surprise"}
_EMOTION_BOOST = 0.05


def _load_emotion_model_safe():
    """Load the emotion model, returning None if the .h5 file isn't present yet."""
    try:
        model = load_emotion_model()
        print("Emotion model loaded.")
        return model
    except FileNotFoundError as e:
        print(f"[warning] {e} — skipping emotion detection.")
        return None


def run_pipeline(
    video_path: str,
    output_dir: Optional[str] = None,
    yolo_model_name: str = "yolov8n.pt",
    max_scenes: int = 20,
) -> list[dict]:
    """
    Full video-to-ranked-clips pipeline.

    Steps per scene:
      1. scene_splitter  — detect scene boundaries, extract clip
      2. tag_detector    — sample frames once, run YOLOv8, assign activity tag
      3. emotion_model   — run CNN on same frames, detect dominant face emotion
      4. rank            — rank_score = (primary_score + emotion_boost) × TAG_INTEREST_WEIGHT

    Returns a sorted list of clip dicts with all model results merged in.
    """
    print(f"Loading YOLO: {yolo_model_name}")
    yolo = load_yolo(yolo_model_name)
    emotion_model = _load_emotion_model_safe()

    print("Detecting scenes...")
    scenes = split_into_scenes(video_path)
    if len(scenes) > max_scenes:
        print(f"Found {len(scenes)} scenes, capping at {max_scenes}")
        # Spread evenly across the video so we sample from throughout, not just the start
        step = len(scenes) / max_scenes
        scenes = [scenes[int(i * step)] for i in range(max_scenes)]
    else:
        print(f"Found {len(scenes)} scene(s)")

    video_stem = os.path.splitext(os.path.basename(video_path))[0]
    clips = []

    for i, (start, end) in enumerate(scenes):
        duration = end - start
        if duration < 1.5:
            continue

        print(f"  Scene {i + 1}/{len(scenes)} ({start:.1f}s – {end:.1f}s)")

        # Extract clip (to disk if output_dir given, else a temp file)
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)
            clip_path = os.path.join(output_dir, f"{video_stem}_scene_{i + 1:03d}.mp4")
        else:
            clip_path = f"_tmp_scene_{i}.mp4"

        extract_clip(video_path, start, end, clip_path)

        # Sample frames once — reused by both models
        frames = sample_frames(clip_path)

        # Tag detector
        tag_result = tag_clip_from_frames(frames, yolo)

        # Emotion model (optional)
        if emotion_model is not None:
            emotion_result = predict_clip_emotion(frames, emotion_model)
        else:
            emotion_result = {"dominant_emotion": None, "confidence": 0.0, "per_emotion_avg": {}}

        # Clean up temp clip after tagging
        if not output_dir and os.path.exists(clip_path):
            os.remove(clip_path)
            clip_path = None

        # Rank score — YOLO drives it, emotion adds a small lift for memorable moments
        emotion_boost = 0.0
        if (
            emotion_result["dominant_emotion"] in _POSITIVE_EMOTIONS
            and emotion_result["confidence"] >= 0.5
        ):
            emotion_boost = _EMOTION_BOOST

        rank_score = (
            (tag_result["primary_score"] + emotion_boost)
            * TAG_INTEREST_WEIGHT.get(tag_result["primary_tag"], 0.5)
        )

        clips.append({
            "start": round(start, 2),
            "end": round(end, 2),
            "duration": round(duration, 2),
            "clip_path": clip_path,
            **tag_result,
            "emotion": emotion_result,
            "rank_score": round(rank_score, 4),
        })

    clips.sort(key=lambda c: c["rank_score"], reverse=True)
    for i, clip in enumerate(clips):
        clip["rank"] = i + 1

    return clips


if __name__ == "__main__":
    import sys
    import json

    if len(sys.argv) < 2:
        print("Usage: python pipeline.py <video_path> [output_dir]")
        sys.exit(1)

    results = run_pipeline(sys.argv[1], output_dir=sys.argv[2] if len(sys.argv) > 2 else None)
    print(json.dumps(results, indent=2))
