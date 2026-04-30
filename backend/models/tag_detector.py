"""
Activity tag detection — from the TagDetect notebook.
Samples frames from a clip, runs YOLOv8 object detection,
maps detected objects to 8 human-readable activity tags,
and returns a ranked probability distribution.
"""
from collections import Counter, defaultdict

import cv2
from ultralytics import YOLO

# ── Constants ─────────────────────────────────────────────────────────────────

YOLO_MODEL_NAME = "yolov8n.pt"
FRAME_INTERVAL_SEC = 1.0
CONF_THRESHOLD = 0.25

TAGS = [
    "eating / drinking",
    "social / conversation",
    "transit / moving",
    "focused work / study",
    "outdoor / exercise",
    "entertainment / leisure",
    "event / gathering",
    "unclear / other",
]

TAG_INTEREST_WEIGHT = {
    "eating / drinking": 0.8,
    "social / conversation": 0.9,
    "transit / moving": 0.5,
    "focused work / study": 0.4,
    "outdoor / exercise": 1.0,
    "entertainment / leisure": 0.7,
    "event / gathering": 1.0,
    "unclear / other": 0.1,
}


# ── Model loader ───────────────────────────────────────────────────────────────

def load_model(model_name: str = YOLO_MODEL_NAME) -> YOLO:
    return YOLO(model_name)


# ── Internal helpers ───────────────────────────────────────────────────────────

def sample_frames(video_path: str, interval_sec: float = FRAME_INTERVAL_SEC) -> list:
    """Sample one frame every interval_sec seconds. Exported so pipeline can reuse frames."""
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    step = max(1, int(round(fps * interval_sec)))
    frames, idx = [], 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        if idx % step == 0:
            frames.append(frame)
        idx += 1
    cap.release()
    return frames


def _run_yolo(model: YOLO, frames: list, conf: float) -> list[dict]:
    results = []
    for frame in frames:
        r = model.predict(frame, conf=conf, verbose=False)[0]
        counts = Counter()
        if r.boxes is not None:
            for cls_id in r.boxes.cls.tolist():
                counts[r.names[int(cls_id)]] += 1
        results.append(dict(counts))
    return results


def _aggregate(frame_detections: list[dict]) -> dict:
    total, frames_with, max_in_frame = Counter(), Counter(), Counter()
    n = len(frame_detections)
    for det in frame_detections:
        for cls, cnt in det.items():
            total[cls] += cnt
            frames_with[cls] += 1
            max_in_frame[cls] = max(max_in_frame[cls], cnt)
    presence = {cls: frames_with[cls] / max(1, n) for cls in total}
    return {
        "total": dict(total),
        "presence": presence,
        "max_in_frame": dict(max_in_frame),
        "n_frames": n,
    }


def _build_features(agg: dict) -> dict:
    pr = lambda name: agg["presence"].get(name, 0.0)
    mx = lambda name: float(agg["max_in_frame"].get(name, 0))
    return {
        "people_presence": pr("person"),
        "max_people": mx("person"),
        "crowd_like": 1.0 if mx("person") >= 5 else (0.5 if mx("person") >= 3 else 0.0),
        "eating_objects": max(
            pr("cup"), pr("bottle"), pr("bowl"), pr("wine glass"),
            pr("fork"), pr("knife"), pr("spoon"), pr("dining table"),
        ),
        "work_objects": max(pr("laptop"), pr("book"), pr("keyboard"), pr("mouse"), pr("cell phone")),
        "media_objects": max(pr("tv"), pr("tvmonitor"), pr("cell phone"), pr("laptop")),
        "transit_visual_hint": max(pr("car"), pr("bus"), pr("train"), pr("bicycle"), pr("motorcycle")),
        "exercise_visual_hint": max(pr("sports ball"), pr("tennis racket"), pr("baseball bat"), pr("frisbee")),
        "event_context": max(1.0 if mx("person") >= 5 else (0.5 if mx("person") >= 3 else 0.0), pr("chair")),
    }


def _score_tags(f: dict) -> tuple[dict, dict]:
    scores = {tag: 0.0 for tag in TAGS}
    notes: dict = defaultdict(list)

    if f["eating_objects"] > 0.30:
        scores["eating / drinking"] += 2.5 * f["eating_objects"]
        notes["eating / drinking"].append("food/drink objects present")
    if f["people_presence"] > 0.40:
        scores["social / conversation"] += 1.2 * f["people_presence"]
        notes["social / conversation"].append("people visible throughout")
    if f["work_objects"] > 0.30:
        scores["focused work / study"] += 2.0 * f["work_objects"]
        notes["focused work / study"].append("work/study objects present")
    if f["media_objects"] > 0.30:
        scores["entertainment / leisure"] += 1.3 * f["media_objects"]
        notes["entertainment / leisure"].append("media objects present")
    if f["crowd_like"] > 0.0:
        scores["event / gathering"] += 2.0 * f["crowd_like"]
        notes["event / gathering"].append("multiple people in frame")
    if f["event_context"] > 0.40:
        scores["event / gathering"] += 0.8 * f["event_context"]
    if f["transit_visual_hint"] > 0.30:
        scores["transit / moving"] += 1.0 * f["transit_visual_hint"]
        notes["transit / moving"].append("vehicle objects visible")
    if f["exercise_visual_hint"] > 0.30:
        scores["outdoor / exercise"] += 1.0 * f["exercise_visual_hint"]
        notes["outdoor / exercise"].append("sports objects visible")

    # tie-breaks
    if scores["eating / drinking"] > 0 and scores["social / conversation"] > 0:
        scores["eating / drinking"] += 0.5
    if scores["focused work / study"] > 0 and scores["entertainment / leisure"] > 0:
        if f["work_objects"] >= f["media_objects"]:
            scores["focused work / study"] += 0.4
            scores["entertainment / leisure"] -= 0.2
        else:
            scores["entertainment / leisure"] += 0.4
            scores["focused work / study"] -= 0.2

    if max((v for k, v in scores.items() if k != "unclear / other"), default=0) < 0.8:
        scores["unclear / other"] += 1.5
        notes["unclear / other"].append("weak evidence across all tags")

    return scores, notes


def _normalize(raw: dict) -> dict:
    clipped = {k: max(v, 0.0) for k, v in raw.items()}
    total = sum(clipped.values())
    if total <= 1e-9:
        return {k: (1.0 if k == "unclear / other" else 0.0) for k in clipped}
    return {k: clipped[k] / total for k in clipped}


# ── Public API ─────────────────────────────────────────────────────────────────

def tag_clip_from_frames(frames: list, model: YOLO) -> dict:
    """
    Run YOLO tagging on pre-sampled frames.
    Separated so pipeline.py can reuse the same frames for both models.
    """
    if not frames:
        return {
            "primary_tag": "unclear / other",
            "primary_score": 1.0,
            "secondary_tags": [],
            "all_tag_scores": {t: (1.0 if t == "unclear / other" else 0.0) for t in TAGS},
            "decision_notes": [],
        }

    detections = _run_yolo(model, frames, CONF_THRESHOLD)
    agg = _aggregate(detections)
    features = _build_features(agg)
    raw_scores, notes = _score_tags(features)
    probs = _normalize(raw_scores)
    ranked = sorted(probs.items(), key=lambda kv: kv[1], reverse=True)

    primary_tag, primary_score = ranked[0]
    if primary_score < 0.35:
        primary_tag = "unclear / other"
        primary_score = max(primary_score, probs.get("unclear / other", 0.0))

    secondary = [
        {"tag": tag, "score": round(score, 3)}
        for tag, score in ranked
        if tag not in (primary_tag, "unclear / other") and score >= 0.20
    ][:2]

    return {
        "primary_tag": primary_tag,
        "primary_score": round(primary_score, 3),
        "secondary_tags": secondary,
        "all_tag_scores": {k: round(v, 3) for k, v in probs.items()},
        "decision_notes": notes.get(primary_tag, []),
    }


def tag_clip(video_path: str, model: YOLO) -> dict:
    """Convenience wrapper: sample frames then tag. Use tag_clip_from_frames if you already have frames."""
    return tag_clip_from_frames(sample_frames(video_path), model)
