# Smart Object Detection RTSP Pipeline

Detect objects from a video source, annotate frames, stream via RTSP/RTMP using **MediaMTX**, and send analytics to a Node.js backend.

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- FFmpeg installed and added to PATH
- MediaMTX server ([GitHub](https://github.com/bluenviron/mediamtx))
- Git

Optional: Python virtual environment (`venv` or `conda`)

Python requirements include:

ultralytics (YOLOv8)

opencv-python

numpy

requests

---

## 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/yourproject.git
cd yourproject
```

# Set Up pyhton service

```
cd backend-python
python -m venv venv
# Activate virtual environment
# Linux/macOS
source venv/bin/activate
# Windows
venv\Scripts\activate

pip install --upgrade pip
pip install -r requirements.txt
```

# Set Up Node Backend

```
cd ../backend
npm install
```

# Set Up Node Frontend

```
cd ../frontend
npm install
```

- read the env file and get the necessary credentials




# Boot Services


* notes: make sure you have installed node modules and aslo installed ffmpeg and mediamtx. Recommended you have activated virtual venv.

1) Node Server
```
npm run dev
```
2) Frontend Server
```
npm run dev
```
3) MediaMTX Relay
```
./mediamtx.exe
```
4) Start Dummy video Stream (replace test_vid.mkv with your demo video filename)

```
ffmpeg -re -stream_loop -1 -i test_vid.mkv -c copy -f rtsp rtsp://localhost:8554/test
```
5) Python Service
```
python main.py
```
# Architecture Overview

```
+-----------+          +-----------+         +-----------+
| Python    |  push    | MediaMTX  |  pull   | Clients   |
| YOLO      | -------->| RTSP/RTMP | ------> | (VLC, ffplay, OBS)
| Annotator |          | Server    |         |           |
+-----------+          +-----------+         +-----------+
       |
       | POST metadata
       v
+-----------+
| Node.js   |
| Backend   |
+-----------+
```

Currently WIP