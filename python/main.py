import subprocess
import numpy as np
import time
import requests
import cv2
from ultralytics import YOLO

INPUT_RTSP = "rtsp://localhost:8554/test"
OUTPUT_RTSP = "rtsp://localhost:8554/annotated1"
NODE_API = "http://localhost:3000/api/analytics"
FRAME_WIDTH = 640
FRAME_HEIGHT = 480
FRAME_SIZE = (FRAME_WIDTH, FRAME_HEIGHT)
FPS = 25

model = YOLO("yolov8n.pt")
print("[INFO] YOLO model loaded")

ffmpeg_input_cmd = [
    "ffmpeg",
    "-i", INPUT_RTSP,
    "-f", "rawvideo",
    "-pix_fmt", "bgr24",
    "-s", f"{FRAME_WIDTH}x{FRAME_HEIGHT}",
    "-"
]
ffmpeg_in = subprocess.Popen(ffmpeg_input_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
print(f"[INFO] FFmpeg input started: {INPUT_RTSP}")

ffmpeg_output_cmd = [
    "ffmpeg",
    "-y",
    "-f", "rawvideo",
    "-pix_fmt", "bgr24",
    "-s", f"{FRAME_WIDTH}x{FRAME_HEIGHT}",
    "-r", str(FPS),
    "-i", "-",
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-f", "rtsp",
    OUTPUT_RTSP
]
ffmpeg_out = subprocess.Popen(ffmpeg_output_cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
print(f"[INFO] FFmpeg output started: {OUTPUT_RTSP}")

frame_count = 0
last_log_time = time.time()

try:
    while True:
        raw_frame = ffmpeg_in.stdout.read(FRAME_WIDTH * FRAME_HEIGHT * 3)
        if len(raw_frame) != FRAME_WIDTH * FRAME_HEIGHT * 3:
            print("[WARN] Stream ended or incomplete frame")
            break

        try:
            frame = np.frombuffer(raw_frame, np.uint8).reshape((FRAME_HEIGHT, FRAME_WIDTH, 3))
        except ValueError as e:
            print(f"[ERROR] Cannot reshape frame: {e}")
            break

        results = model(frame)

        annotated = results[0].plot().astype(np.uint8)

        try:
            ffmpeg_out.stdin.write(annotated.tobytes())
        except (BrokenPipeError, OSError) as e:
            print(f"[ERROR] Cannot write frame to FFmpeg: {e}")
            break

        obj_count = len(results[0].boxes)

        payload = {"camera_id": "camera1", "timestamp": time.time(), "object_count": obj_count}
        try:
            requests.post(NODE_API, json=payload, timeout=1)
        except requests.RequestException:
            print("[WARN] Cannot send metadata to Node backend")

        cv2.imshow("Annotated", annotated)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("[INFO] Quitting by user")
            break

        frame_count += 1
        if frame_count % 50 == 0 or time.time() - last_log_time > 2:
            print(f"[INFO] Processed {frame_count} frames | Objects detected: {obj_count}")
            last_log_time = time.time()

except KeyboardInterrupt:
    print("[INFO] Stopping worker...")

finally:
    ffmpeg_in.terminate()
    if ffmpeg_out.stdin:
        ffmpeg_out.stdin.close()
    ffmpeg_out.terminate()
    cv2.destroyAllWindows()
    print("[INFO] Worker stopped")
