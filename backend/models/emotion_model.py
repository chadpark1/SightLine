"""
Emotion detection — from the image-recognition-neural-networks notebook.
Loads the trained CNN (emotion_model.h5) and predicts the dominant facial
emotion from sampled frames of a clip.

Place emotion_model.h5 in the same directory as this file:
  backend/models/emotion_model.h5
"""
import os

import cv2
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), "emotion_model.h5")

# Order must match the training dataset label order (mh0386/facial-emotion on Kaggle)
EMOTIONS = ["angry", "contempt", "disgust", "fear", "happy", "neutral", "sad", "surprise"]

_face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


def load_model():
    """Load the Keras emotion model from disk."""
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"emotion_model.h5 not found at {MODEL_PATH}. "
            "Place the trained model file in backend/models/."
        )
    from tensorflow import keras
    return keras.models.load_model(MODEL_PATH)


def _predict_frame(frame, model) -> dict | None:
    """
    Detect faces in a frame and return emotion probabilities for the largest face.
    Returns None if no face is found.
    """
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = _face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    if len(faces) == 0:
        return None

    # Use the largest detected face
    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    face = gray[y:y + h, x:x + w]
    face = cv2.resize(face, (48, 48)).astype("float32") / 255.0
    face = face.reshape(1, 48, 48, 1)

    probs = model.predict(face, verbose=0)[0]
    return {EMOTIONS[i]: round(float(probs[i]), 3) for i in range(len(EMOTIONS))}


def predict_clip_emotion(frames: list, model) -> dict:
    """
    Run emotion prediction across sampled frames and return aggregated results:
    {dominant_emotion, confidence, per_emotion_avg}

    Returns {"dominant_emotion": None, ...} if no faces are detected.
    """
    per_emotion_sums = {e: 0.0 for e in EMOTIONS}
    face_frame_count = 0

    for frame in frames:
        result = _predict_frame(frame, model)
        if result is None:
            continue
        face_frame_count += 1
        for emotion, prob in result.items():
            per_emotion_sums[emotion] += prob

    if face_frame_count == 0:
        return {
            "dominant_emotion": None,
            "confidence": 0.0,
            "per_emotion_avg": {e: 0.0 for e in EMOTIONS},
        }

    per_emotion_avg = {e: round(per_emotion_sums[e] / face_frame_count, 3) for e in EMOTIONS}
    dominant_emotion = max(per_emotion_avg, key=per_emotion_avg.get)

    return {
        "dominant_emotion": dominant_emotion,
        "confidence": per_emotion_avg[dominant_emotion],
        "per_emotion_avg": per_emotion_avg,
    }
