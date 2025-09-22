import cv2
import requests
import json
import time
import threading
import numpy as np
from collections import deque
from flask import Flask, Response
import base64

class VehicleDetectionPipeline:
    def __init__(self, backend_url, camera_id=0):
        self.backend_url = backend_url
        self.camera_id = camera_id
        self.cap = cv2.VideoCapture(camera_id)
        
        self.bg_subtractor = cv2.createBackgroundSubtractorMOG2(detectShadows=True)
        
        self.vehicle_count = 0
        self.detection_history = deque(maxlen=10)
        
        self.data_queue = deque()
        self.latest_frame = None  
        
        self.backend_thread = threading.Thread(target=self.send_data_worker, daemon=True)
        self.backend_thread.start()
        
        self.app = Flask(__name__)
        self.setup_routes()

    def detect_vehicles(self, frame):
        """Detect vehicles using background subtraction"""
        fg_mask = self.bg_subtractor.apply(frame)
        
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_OPEN, kernel)
        fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, kernel)
        
        contours, _ = cv2.findContours(fg_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        vehicle_count = 0
        for contour in contours:
            area = cv2.contourArea(contour)
            if area > 500:
                x, y, w, h = cv2.boundingRect(contour)
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                vehicle_count += 1
        
        return vehicle_count, frame

    def send_data_worker(self):
        """Background worker to send data to backend"""
        while True:
            if self.data_queue:
                data = self.data_queue.popleft()
                try:
                    response = requests.post(
                        f"{self.backend_url}/traffic-data",
                        json=data,
                        timeout=2
                    )
                    print(f"Data sent: {response.status_code}")
                except requests.exceptions.RequestException as e:
                    print(f"Backend error: {e}")
            time.sleep(0.1)

    def queue_data(self, vehicle_count, timestamp):
        """Queue data for backend transmission"""
        data = {
            "camera_id": self.camera_id,
            "vehicle_count": vehicle_count,
            "timestamp": timestamp,
            "avg_count": sum(self.detection_history) / len(self.detection_history) if self.detection_history else 0
        }
        self.data_queue.append(data)

    def generate_frames(self):
        """Generator for streaming frames"""
        while True:
            if self.latest_frame is not None:
                ret, buffer = cv2.imencode('.jpg', self.latest_frame)
                if ret:
                    frame = buffer.tobytes()
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            time.sleep(0.033)  

    def setup_routes(self):
        """Setup Flask routes"""
        @self.app.route('/video_feed')
        def video_feed():
            return Response(self.generate_frames(),
                          mimetype='multipart/x-mixed-replace; boundary=frame')

    def run(self):
        """Main detection loop"""
        print("Starting vehicle detection pipeline...")
        
        flask_thread = threading.Thread(
            target=lambda: self.app.run(host='0.0.0.0', port=5000, debug=False),
            daemon=True
        )
        flask_thread.start()
        cv2.namedWindow("Vehicle Detection", cv2.WINDOW_NORMAL)
        cv2.setWindowProperty("Vehicle Detection",
                            cv2.WND_PROP_FULLSCREEN,
                            cv2.WINDOW_FULLSCREEN)
        while True:
            ret, frame = self.cap.read()
            if not ret:
                break
            
            vehicle_count, annotated_frame = self.detect_vehicles(frame)
            
            self.detection_history.append(vehicle_count)
            
            timestamp = time.time()
            self.queue_data(vehicle_count, timestamp)
            
            self.latest_frame = annotated_frame.copy()
            cv2.putText(annotated_frame, f"Vehicles: {vehicle_count}", 
                        (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.imshow("Vehicle Detection", annotated_frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        self.cleanup()

    def cleanup(self):
        """Cleanup resources"""
        self.cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    BACKEND_URL = "http://localhost:3000"
    
    pipeline = VehicleDetectionPipeline(BACKEND_URL, "../test.mp4")
    pipeline.run()