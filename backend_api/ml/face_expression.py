"""
AI Photobooth - Face Expression Detection
Calls the deployed YOLO model via Hugging Face Space API
(cuplis123/facial-emotion-cpls) instead of loading the model locally.
"""
import io
import requests
from PIL import Image
from config import settings

# Indonesian labels for display
# (must match the 3-class model deployed on the HF Space: happy, normal, sad)
EXPRESSION_LABELS = {
    "happy": "Senang",
    "normal": "Netral",
    "sad": "Sedih",
}


def detect_expression(image: Image.Image, confidence_threshold: float | None = None) -> list[dict]:
    """
    Detect face expressions in an image by calling the Face Emotion Detection API.

    Returns list of dicts (sorted by confidence descending), matching the
    previous local-inference return shape so callers don't need to change:
        [{"expression": "happy", "expression_label": "Senang",
          "confidence": 0.92, "bbox": [x1, y1, x2, y2]}]

    Returns an empty list on any failure (API down, no face detected, etc.)
    so callers can safely treat "no detection" as a non-fatal case.
    """
    api_url = (settings.face_expression_api_url or "").rstrip("/")
    if not api_url:
        print("Face expression API URL not configured")
        return []

    timeout = settings.face_expression_api_timeout_seconds

    try:
        # Encode the PIL image as JPEG bytes for upload
        buffer = io.BytesIO()
        image.convert("RGB").save(buffer, format="JPEG", quality=90)
        buffer.seek(0)

        files = {"file": ("photo.jpg", buffer, "image/jpeg")}
        response = requests.post(f"{api_url}/predict", files=files, timeout=timeout)
        response.raise_for_status()
        result = response.json()

    except Exception as e:
        print(f"Face expression API call failed: {e}")
        return []

    if not result.get("success"):
        # e.g. {"success": false, "error": "No face detected in image"}
        return []

    detections = []
    for det in result.get("detections", []):
        expr = det.get("emotion", "unknown")
        bbox = det.get("bbox", {})
        detections.append({
            "expression": expr,
            "expression_label": EXPRESSION_LABELS.get(expr, expr),
            "confidence": round(float(det.get("confidence", 0.0)), 4),
            "bbox": [
                int(bbox.get("x1", 0)),
                int(bbox.get("y1", 0)),
                int(bbox.get("x2", 0)),
                int(bbox.get("y2", 0)),
            ],
        })

    detections.sort(key=lambda d: d["confidence"], reverse=True)
    return detections