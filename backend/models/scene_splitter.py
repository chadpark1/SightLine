"""
Scene splitting — from the Splitting Video Slips notebook.
Uses PySceneDetect ContentDetector to find scene boundaries,
then ffmpeg to extract individual clips.
"""
import os
import subprocess

import cv2
from scenedetect import open_video, SceneManager
from scenedetect.detectors import ContentDetector


def split_into_scenes(video_path: str) -> list[tuple[float, float]]:
    """Return (start_sec, end_sec) pairs for every detected scene."""
    video = open_video(video_path)
    scene_manager = SceneManager()
    scene_manager.add_detector(ContentDetector())
    scene_manager.detect_scenes(video)
    scenes = scene_manager.get_scene_list()

    if not scenes:
        # No cuts detected — treat the whole video as one scene
        cap = cv2.VideoCapture(video_path)
        duration = cap.get(cv2.CAP_PROP_FRAME_COUNT) / max(cap.get(cv2.CAP_PROP_FPS), 1)
        cap.release()
        return [(0.0, duration)]

    return [(s.get_seconds(), e.get_seconds()) for s, e in scenes]


def extract_clip(video_path: str, start: float, end: float, out_path: str) -> str:
    """Extract a segment from video_path using ffmpeg. Returns out_path."""
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-ss", str(start),         # fast seek before -i
            "-i", video_path,
            "-t", str(end - start),
            "-c:v", "libx264",         # re-encode so every clip starts on a keyframe
            "-preset", "fast",
            "-crf", "23",
            "-c:a", "aac",
            "-movflags", "+faststart",  # metadata at front for smooth streaming
            "-loglevel", "error",
            out_path,
        ],
        check=True,
    )
    return out_path
