from flask import Flask
from flask_cors import CORS
import os
import mysql.connector
from ultralytics import YOLO



def create_app():
    app = Flask(__name__)
    
    # secret key untuk session
    app.config['SECRET_KEY'] = 'AfXu2qIFHSlppKXy6SZMG9b3fX6kJ5Qz'
    
    # konfigurasi CORS
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://127.0.0.1:5000", "http://localhost:5000"],
            "supports_credentials": True,
        }
    })

    return app
  
  
def folder_setup():
    UPLOAD_FOLDER = 'results/images'
    PDF_FOLDER = 'results/pdf'
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(PDF_FOLDER, exist_ok=True)
    return UPLOAD_FOLDER, PDF_FOLDER


def database_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="db_acne_detection"
    )
    return connection

def model_setup():
    model_acne_detection = YOLO("model/acne-detection-best.pt")
    model_skin_type = YOLO("model/skin-type-best.pt")
    return model_acne_detection, model_skin_type