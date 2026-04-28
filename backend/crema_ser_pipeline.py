"""
End-to-end CREMA-D speech emotion recognition pipeline.

This script rebuilds valid audio paths from metadata filenames, extracts cached
MFCC summary features, trains an actor-aware baseline classifier, and writes
evaluation/prediction artifacts.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import time
import warnings
from pathlib import Path
from typing import Any

os.environ.setdefault("MPLCONFIGDIR", str(Path("/tmp") / "matplotlib"))
os.environ.setdefault("NUMBA_CACHE_DIR", str(Path("/tmp") / "numba-cache"))
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("VECLIB_MAXIMUM_THREADS", "1")
os.environ.setdefault("NUMEXPR_NUM_THREADS", "1")
os.environ.setdefault("KMP_INIT_AT_FORK", "FALSE")

import joblib
import librosa
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    ConfusionMatrixDisplay,
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)
from sklearn.model_selection import GroupShuffleSplit
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


# Change these paths locally if your files live somewhere else.
METADATA_CSV = Path.home() / "Downloads" / "crema_metadata (1).csv"
AUDIO_DIR = Path.home() / "Downloads" / "archive" / "Crema"
OUTPUT_DIR = Path("artifacts")

EMOTION_CODE_TO_LABEL = {
    "ANG": "angry",
    "DIS": "disgust",
    "FEA": "fear",
    "HAP": "happy",
    "NEU": "neutral",
    "SAD": "sad",
}


def _path_arg(value: str) -> Path:
    return Path(value).expanduser().resolve()


def _metadata_fingerprint(df: pd.DataFrame, feature_params: dict[str, Any]) -> str:
    """Create a stable cache key for metadata rows and feature parameters."""
    cols = [
        "filename",
        "path",
        "emotion",
        "emo_code",
        "actor_id",
        "audio_size_bytes",
        "audio_mtime_ns",
    ]
    cache_df = df[[c for c in cols if c in df.columns]].copy()
    cache_df = cache_df.astype(str).sort_values("filename").reset_index(drop=True)
    payload = {
        "feature_params": feature_params,
        "rows_hash": hashlib.sha256(
            pd.util.hash_pandas_object(cache_df, index=True).values.tobytes()
        ).hexdigest(),
        "n_rows": int(len(cache_df)),
    }
    return hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()


def _add_audio_file_stats(df: pd.DataFrame) -> pd.DataFrame:
    """Add file stats used to invalidate stale feature caches."""
    df = df.copy()
    sizes: list[int | None] = []
    mtimes: list[int | None] = []
    for path_value in df["path"]:
        path = Path(str(path_value))
        try:
            stat = path.stat()
            sizes.append(int(stat.st_size))
            mtimes.append(int(stat.st_mtime_ns))
        except OSError:
            sizes.append(None)
            mtimes.append(None)
    df["audio_size_bytes"] = sizes
    df["audio_mtime_ns"] = mtimes
    return df


def build_or_clean_metadata(
    metadata_csv: Path,
    audio_dir: Path,
    output_dir: Path,
    recursive_search: bool = True,
) -> pd.DataFrame:
    """
    Load metadata, preserve useful labels, and rebuild audio paths from filename.

    The existing metadata `path` column is intentionally not trusted because it
    often points to another machine or hosted notebook environment.
    """
    metadata_csv = _path_arg(str(metadata_csv))
    audio_dir = _path_arg(str(audio_dir))
    output_dir.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(metadata_csv)
    if "filename" not in df.columns:
        if "path" not in df.columns:
            raise ValueError("Metadata must contain either a filename or path column.")
        df["filename"] = df["path"].map(lambda p: Path(str(p)).name)

    df["filename"] = df["filename"].astype(str)
    parts = df["filename"].str.split("_", expand=True)

    if "actor_id" not in df.columns:
        df["actor_id"] = parts[0]
    df["actor_id"] = pd.to_numeric(df["actor_id"], errors="coerce").astype("Int64")

    if "emo_code" not in df.columns:
        df["emo_code"] = parts[2]
    df["emo_code"] = df["emo_code"].astype(str).str.upper()

    if "emotion" not in df.columns:
        df["emotion"] = df["emo_code"].map(EMOTION_CODE_TO_LABEL)
    else:
        missing_emotion = df["emotion"].isna() | (df["emotion"].astype(str).str.len() == 0)
        df.loc[missing_emotion, "emotion"] = df.loc[missing_emotion, "emo_code"].map(
            EMOTION_CODE_TO_LABEL
        )

    # Rebuild paths from filename. Do not reuse the stale metadata path column.
    direct_paths = df["filename"].map(lambda name: audio_dir / name)
    resolved_paths = direct_paths.astype(str)

    if recursive_search and not direct_paths.map(Path.exists).all():
        wav_index: dict[str, Path] = {}
        for suffix in ("*.wav", "*.WAV"):
            for path in audio_dir.rglob(suffix):
                wav_index.setdefault(path.name.lower(), path)
        resolved_paths = df["filename"].map(
            lambda name: str(wav_index.get(name.lower(), audio_dir / name))
        )

    df["path"] = resolved_paths
    df = validate_paths(df)

    cleaned_path = output_dir / "crema_metadata_clean.csv"
    df.to_csv(cleaned_path, index=False)
    print(f"Saved cleaned metadata: {cleaned_path.resolve()}")
    print(
        f"Valid audio files: {int(df['path_exists'].sum())}/{len(df)} "
        f"under {audio_dir}"
    )
    return df


def validate_paths(df: pd.DataFrame) -> pd.DataFrame:
    """Mark rows whose rebuilt audio file path exists."""
    df = df.copy()
    df["path_exists"] = df["path"].map(lambda p: Path(str(p)).is_file())
    missing = df.loc[~df["path_exists"], ["filename", "path"]]
    if not missing.empty:
        print(f"Missing audio files: {len(missing)}")
        print(missing.head(20).to_string(index=False))
        if len(missing) > 20:
            print(f"... {len(missing) - 20} more missing files not shown")
    return df


def extract_features(
    audio_path: str | Path,
    sr: int = 16000,
    n_mfcc: int = 40,
    trim_top_db: int = 30,
) -> np.ndarray:
    """Extract MFCC mean/std summary features for one audio file."""
    y, _ = librosa.load(audio_path, sr=sr, mono=True, res_type="kaiser_fast")
    if y.size == 0:
        raise ValueError("Audio file decoded to an empty waveform.")

    y, _ = librosa.effects.trim(y, top_db=trim_top_db)
    if y.size == 0:
        raise ValueError("Audio file is empty after trimming silence.")

    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    return np.concatenate([mfcc.mean(axis=1), mfcc.std(axis=1)]).astype(np.float32)


def _extract_one(row: dict[str, Any], feature_params: dict[str, Any]) -> dict[str, Any]:
    try:
        features = extract_features(row["path"], **feature_params)
        return {"ok": True, "features": features, "row": row, "error": ""}
    except Exception as exc:  # corrupted/unreadable files should not kill the run
        return {"ok": False, "features": None, "row": row, "error": str(exc)}


def load_or_extract_features(
    metadata: pd.DataFrame,
    output_dir: Path,
    sr: int = 16000,
    n_mfcc: int = 40,
    trim_top_db: int = 30,
    n_jobs: int = -1,
    force_rebuild: bool = False,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, pd.DataFrame]:
    """
    Load cached features when valid; otherwise extract in parallel and cache.

    Cache validity depends on cleaned metadata rows and MFCC extraction settings,
    preventing silent mismatches between X, y, groups, and filenames.
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    feature_params = {"sr": sr, "n_mfcc": n_mfcc, "trim_top_db": trim_top_db}
    valid_meta = metadata.loc[metadata["path_exists"]].copy().reset_index(drop=True)
    if valid_meta.empty:
        raise ValueError(
            "No valid audio files found. Set AUDIO_DIR or pass --audio-dir to the "
            "folder containing CREMA-D .wav files."
        )
    valid_meta = _add_audio_file_stats(valid_meta)

    fingerprint = _metadata_fingerprint(valid_meta, feature_params)
    manifest_path = output_dir / "features_manifest.json"
    x_path = output_dir / "X_mfcc.npy"
    y_path = output_dir / "y_labels.npy"
    groups_path = output_dir / "groups_actor_id.npy"
    filenames_path = output_dir / "filenames.npy"
    feature_meta_path = output_dir / "feature_metadata.csv"

    cache_files = [manifest_path, x_path, y_path, groups_path, filenames_path, feature_meta_path]
    if not force_rebuild and all(path.exists() for path in cache_files):
        manifest = json.loads(manifest_path.read_text())
        if manifest.get("fingerprint") == fingerprint:
            print("Loaded cached MFCC features.")
            X = np.load(x_path)
            y = np.load(y_path, allow_pickle=True)
            groups = np.load(groups_path, allow_pickle=True)
            filenames = np.load(filenames_path, allow_pickle=True)
            feature_meta = pd.read_csv(feature_meta_path)
            return X, y, groups, filenames, feature_meta
        print("Feature cache is stale; rebuilding features.")

    start = time.time()
    rows = valid_meta.to_dict("records")
    print(f"Extracting MFCC features for {len(rows)} files with n_jobs={n_jobs}...")
    results = joblib.Parallel(n_jobs=n_jobs, prefer="threads", verbose=5)(
        joblib.delayed(_extract_one)(row, feature_params) for row in rows
    )

    good = [result for result in results if result["ok"]]
    bad = [result for result in results if not result["ok"]]
    if not good:
        raise ValueError("Feature extraction failed for every audio file.")

    X = np.vstack([result["features"] for result in good]).astype(np.float32)
    feature_meta = pd.DataFrame([result["row"] for result in good])
    y = feature_meta["emotion"].to_numpy()
    groups = feature_meta["actor_id"].to_numpy()
    filenames = feature_meta["filename"].to_numpy()

    if bad:
        failures = pd.DataFrame(
            [
                {
                    "filename": result["row"].get("filename"),
                    "path": result["row"].get("path"),
                    "error": result["error"],
                }
                for result in bad
            ]
        )
        failures_path = output_dir / "feature_failures.csv"
        failures.to_csv(failures_path, index=False)
        print(f"Feature extraction failures: {len(bad)}. Saved {failures_path.resolve()}")

    np.save(x_path, X)
    np.save(y_path, y)
    np.save(groups_path, groups)
    np.save(filenames_path, filenames)
    feature_meta.to_csv(feature_meta_path, index=False)
    manifest = {
        "fingerprint": fingerprint,
        "feature_params": feature_params,
        "n_features": int(X.shape[1]),
        "n_samples": int(X.shape[0]),
        "n_failures": int(len(bad)),
        "created_at_unix": time.time(),
    }
    manifest_path.write_text(json.dumps(manifest, indent=2, sort_keys=True))
    print(f"Saved features: {x_path.resolve()} ({X.shape[0]} samples, {X.shape[1]} dims)")
    print(f"Feature extraction time: {(time.time() - start) / 60:.2f} minutes")
    return X, y, groups, filenames, feature_meta


def predict_with_confidence(
    model: Pipeline,
    X: np.ndarray,
    filenames: np.ndarray,
    y_true: np.ndarray | None = None,
) -> pd.DataFrame:
    """Predict labels and ranked class probabilities for each sample."""
    probabilities = model.predict_proba(X)
    classes = np.asarray(model.classes_)
    pred_idx = probabilities.argmax(axis=1)

    output = pd.DataFrame(
        {
            "filename": filenames,
            "true_label": y_true if y_true is not None else None,
            "predicted_label": classes[pred_idx],
            "confidence": probabilities.max(axis=1),
        }
    )

    for class_name in classes:
        output[f"prob_{class_name}"] = probabilities[:, np.where(classes == class_name)[0][0]]

    ranked = []
    for probs in probabilities:
        order = np.argsort(probs)[::-1]
        ranked.append(
            json.dumps(
                [
                    {"class": str(classes[i]), "probability": float(probs[i])}
                    for i in order
                ]
            )
        )
    output["ranked_class_probabilities"] = ranked
    return output


def train_and_evaluate(
    X: np.ndarray,
    y: np.ndarray,
    groups: np.ndarray,
    filenames: np.ndarray,
    output_dir: Path,
    test_size: float = 0.2,
    random_state: int = 42,
) -> tuple[Pipeline, pd.DataFrame, dict[str, Any]]:
    """Train a fast baseline classifier and evaluate with actor-aware splitting."""
    output_dir.mkdir(parents=True, exist_ok=True)
    splitter = GroupShuffleSplit(
        n_splits=1, test_size=test_size, random_state=random_state
    )
    train_idx, test_idx = next(splitter.split(X, y, groups=groups))

    model = Pipeline(
        [
            ("scaler", StandardScaler()),
            (
                "classifier",
                LogisticRegression(
                    max_iter=2000,
                    class_weight="balanced",
                    solver="liblinear",
                    n_jobs=1,
                    random_state=random_state,
                ),
            ),
        ]
    )

    model.fit(X[train_idx], y[train_idx])
    y_pred = model.predict(X[test_idx])

    labels = list(model.classes_)
    accuracy = accuracy_score(y[test_idx], y_pred)
    macro_f1 = f1_score(y[test_idx], y_pred, average="macro")
    report_dict = classification_report(
        y[test_idx], y_pred, labels=labels, output_dict=True, zero_division=0
    )
    report_text = classification_report(
        y[test_idx], y_pred, labels=labels, digits=3, zero_division=0
    )
    cm = confusion_matrix(y[test_idx], y_pred, labels=labels)

    predictions = predict_with_confidence(
        model, X[test_idx], filenames[test_idx], y_true=y[test_idx]
    )
    predictions_path = output_dir / "predictions_test.csv"
    predictions.to_csv(predictions_path, index=False)

    metrics = {
        "accuracy": float(accuracy),
        "macro_f1": float(macro_f1),
        "classification_report": report_dict,
        "labels": labels,
        "n_train": int(len(train_idx)),
        "n_test": int(len(test_idx)),
        "train_actor_count": int(pd.Series(groups[train_idx]).nunique()),
        "test_actor_count": int(pd.Series(groups[test_idx]).nunique()),
    }
    (output_dir / "metrics.json").write_text(json.dumps(metrics, indent=2))
    (output_dir / "classification_report.txt").write_text(report_text)
    np.save(output_dir / "confusion_matrix.npy", cm)

    fig, ax = plt.subplots(figsize=(8, 7))
    ConfusionMatrixDisplay(cm, display_labels=labels).plot(
        ax=ax, cmap="Blues", values_format="d", colorbar=False
    )
    ax.set_title("CREMA-D Emotion Confusion Matrix")
    fig.tight_layout()
    fig.savefig(output_dir / "confusion_matrix.png", dpi=160)
    plt.close(fig)

    print(f"Accuracy: {accuracy:.3f}")
    print(f"Macro F1: {macro_f1:.3f}")
    print(report_text)
    print(f"Saved predictions: {predictions_path.resolve()}")
    return model, predictions, metrics


def save_artifacts(model: Pipeline, output_dir: Path) -> None:
    """Save trained model for later inference."""
    model_path = output_dir / "crema_ser_model.joblib"
    joblib.dump(model, model_path)
    print(f"Saved model: {model_path.resolve()}")


def run_pipeline(args: argparse.Namespace) -> None:
    warnings.filterwarnings("ignore", category=UserWarning)
    output_dir = args.output_dir

    metadata = build_or_clean_metadata(
        metadata_csv=args.metadata_csv,
        audio_dir=args.audio_dir,
        output_dir=output_dir,
        recursive_search=not args.no_recursive_search,
    )
    if args.max_samples is not None:
        metadata = metadata.loc[metadata["path_exists"]].head(args.max_samples).copy()
        print(f"Using first {len(metadata)} valid rows because --max-samples was set.")

    X, y, groups, filenames, _ = load_or_extract_features(
        metadata,
        output_dir=output_dir,
        sr=args.sr,
        n_mfcc=args.n_mfcc,
        trim_top_db=args.trim_top_db,
        n_jobs=args.n_jobs,
        force_rebuild=args.force_rebuild_features,
    )
    model, _, _ = train_and_evaluate(
        X,
        y,
        groups,
        filenames,
        output_dir=output_dir,
        test_size=args.test_size,
        random_state=args.random_state,
    )
    save_artifacts(model, output_dir)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--metadata-csv", type=_path_arg, default=METADATA_CSV)
    parser.add_argument("--audio-dir", type=_path_arg, default=AUDIO_DIR)
    parser.add_argument("--output-dir", type=_path_arg, default=OUTPUT_DIR)
    parser.add_argument("--sr", type=int, default=16000)
    parser.add_argument("--n-mfcc", type=int, default=40)
    parser.add_argument("--trim-top-db", type=int, default=30)
    parser.add_argument("--n-jobs", type=int, default=-1)
    parser.add_argument("--test-size", type=float, default=0.2)
    parser.add_argument("--random-state", type=int, default=42)
    parser.add_argument("--force-rebuild-features", action="store_true")
    parser.add_argument("--no-recursive-search", action="store_true")
    parser.add_argument(
        "--max-samples",
        type=int,
        default=None,
        help="Optional smoke-test limit. Omit this argument for the full dataset.",
    )
    return parser.parse_args()


if __name__ == "__main__":
    run_pipeline(parse_args())
