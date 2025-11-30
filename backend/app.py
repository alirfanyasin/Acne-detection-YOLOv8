from flask import Flask, request, jsonify, send_from_directory, session
from ultralytics import YOLO
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
import io
import os
import uuid
import shutil
from pathlib import Path

# Moduls
from config import create_app, folder_setup, database_connection, model_setup
from generate_table import create_users_table, create_predict_result_table
from auth import login, register, logout, current_user  
from my_profile import get_my_profile, update_my_profile


app = Flask(__name__)


# Calling config functions
app = create_app()
UPLOAD_FOLDER, PDF_FOLDER = folder_setup()
db = database_connection();
model_acne_detection, model_skin_type = model_setup()


# Generate table
def generate_all_tables():
    create_users_table()
    create_predict_result_table()



def hitung_keparahan(jumlah):
    if jumlah <= 5:
        return "Ringan"
    elif jumlah <= 13:
        return "Sedang"
    else:
        return "Berat"


def prediksi_tipe_kulit(image_path: str):
    """
    Jalankan model skin-type dan kembalikan nama kelas + confidence.
    Kalau gagal, balikin (None, None) supaya tidak bikin error 500.
    """
    try:
        results = model_skin_type.predict(source=image_path, save=False, conf=0.2)
        if not results:
            return None, None

        r = results[0]

        # Model klasifikasi YOLO (probs)
        if hasattr(r, "probs") and r.probs is not None:
            class_id = int(r.probs.top1)
            class_name = r.names[class_id]
            confidence = float(r.probs.top1conf)
            return class_name, confidence

        # Fallback kalau bukan klasifikasi
        return None, None
    except Exception as e:
        print("Error prediksi tipe kulit:", e)
        return None, None


def generate_pdf(pdf_path, image_path, jumlah, keparahan, analisa, tipe_kulit=None):
    c = canvas.Canvas(pdf_path, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "Laporan Deteksi Jerawat")

    # Gambar
    if os.path.exists(image_path):
        try:
            img_width = 400
            img_height = 400
            c.drawImage(
                image_path,
                50,
                height - 100 - img_height,
                width=img_width,
                height=img_height,
                preserveAspectRatio=True,
            )
        except Exception as e:
            print(f"Error menggambar gambar ke PDF: {e}")
            c.setFont("Helvetica", 10)
            c.drawString(50, height - 320, "Gambar tidak dapat dimuat di PDF.")

    c.setFont("Helvetica", 12)
    y = height - 100 - 400 - 30
    c.drawString(50, y, f"Jumlah Jerawat: {jumlah}")
    c.drawString(50, y - 20, f"Tingkat Keparahan: {keparahan}")
    c.drawString(50, y - 40, f"Analisa: {analisa}")
    if tipe_kulit:
        c.drawString(50, y - 60, f"Tipe Kulit: {tipe_kulit}")

    c.showPage()
    c.save()


@app.route('/predict', methods=['POST'])
def predict():
    try:
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({
                "success": False,
                "message": "Unauthorized. Please login first."
            }), 401
            
        file = request.files['image']
        image = Image.open(io.BytesIO(file.read()))

        # Simpan gambar input sementara
        image_filename = f"{uuid.uuid4().hex}.jpg"
        input_path = os.path.join(UPLOAD_FOLDER, image_filename)
        image.save(input_path)

        # ===== 1. Prediksi jerawat =====
        results = model_acne_detection.predict(source=input_path, save=True, conf=0.2)

        jumlah_jerawat = len(results[0].boxes) if results and results[0].boxes is not None else 0
        tingkat_keparahan = hitung_keparahan(jumlah_jerawat)
        analisa_text = f"Terdeteksi {jumlah_jerawat} jerawat. Tingkat keparahan dikategorikan sebagai '{tingkat_keparahan}'."

        # Folder hasil YOLO
        result_dir = Path(results[0].save_dir)
        result_img_path = result_dir / image_filename

        # Pindahkan hasil ke folder results/images
        final_filename = f"pred_{image_filename}"
        final_path = os.path.join(UPLOAD_FOLDER, final_filename)
        shutil.copy(result_img_path, final_path)

        # Prediksi tipe kulit 
        tipe_kulit, skin_conf = prediksi_tipe_kulit(input_path)
        if tipe_kulit is None:
            tipe_kulit = "Tidak terdeteksi"
            skin_conf = 0.0

        cursor = db.cursor()
        sql = """
            INSERT INTO predict_result 
                (user_id, file_name, acne_count, severity, skin_type, skin_confidence)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        val = (
            user_id,
            final_filename,
            jumlah_jerawat,
            tingkat_keparahan,
            tipe_kulit,
            skin_conf,
        )
        cursor.execute(sql, val)
        db.commit()

        pdf_filename = final_filename.replace(".jpg", ".pdf")
        pdf_path = os.path.join(PDF_FOLDER, pdf_filename)
        generate_pdf(pdf_path, final_path, jumlah_jerawat, tingkat_keparahan, analisa_text, tipe_kulit)

        return jsonify({
            "image_url": f"http://localhost:5000/results/images/{final_filename}",
            "jumlah_jerawat": jumlah_jerawat,
            "tingkat_keparahan": tingkat_keparahan,
            "analisa": analisa_text,
            "tipe_kulit": tipe_kulit,
            "skin_confidence": skin_conf,
            "pdf_url": f"http://localhost:5000/download-pdf/{pdf_filename}",
        }), 200

    except Exception as e:
        print("Error di /predict:", e)
        return jsonify({"error": str(e)}), 500


@app.route('/download-pdf/<filename>', methods=['GET'])
def download_pdf(filename):
    return send_from_directory(PDF_FOLDER, filename, as_attachment=True)


@app.route('/results/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


@app.route("/register", methods=["POST"])
def register_route():
    return register(db)


@app.route("/login", methods=["POST"])
def login_route():
    return login(db)


@app.route("/logout", methods=["POST"])
def logout_route():
    return logout()

@app.route("/profile", methods=["GET"])
def my_profile_route():
    return get_my_profile(db)


@app.route("/profile", methods=["PUT", "PATCH"])
def update_profile_route():
    return update_my_profile(db)


@app.route("/history", methods=["GET"])
def history_route():
    # pastikan user sudah login
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({
            "success": False,
            "message": "Unauthorized. Please login first."
        }), 401

    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, file_name, acne_count, severity, created_at
        FROM predict_result
        WHERE user_id = %s
        ORDER BY created_at DESC
    """, (user_id,))
    rows = cursor.fetchall()

    history = []
    for row in rows:
        file_name = row["file_name"]

        # bikin nama file PDF dari nama file gambar
        if "." in file_name:
            base = file_name.rsplit(".", 1)[0]
        else:
            base = file_name
        pdf_filename = f"{base}.pdf"

        # analisa sama seperti di /predict
        analisa_text = (
            f"Terdeteksi {row['acne_count']} jerawat. "
            f"Tingkat keparahan dikategorikan sebagai '{row['severity']}'."
        )

        history.append({
            "id": row["id"],
            "waktu": row["created_at"].strftime("%Y-%m-%d %H:%M"),
            "jumlah_jerawat": row["acne_count"],
            "tingkat_keparahan": row["severity"],
            "analisa": analisa_text,
            "pdf_url": f"http://localhost:5000/download-pdf/{pdf_filename}",
        })

    return jsonify(history), 200


@app.route("/me", methods=["GET"])
def me_route():
    return current_user(db)


# Generate tables
@app.route("/generate", methods=["GET"])
def generate():
    try:
        generate_all_tables()
        return jsonify({
            "success": True,
            "message": "Tabel users dan predict_result berhasil dibuat (atau sudah ada)."
        }), 200
    except Exception as e:
        print("Error generate table:", e)
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/debug-session")
def debug_session():
    print("session sekarang:", dict(session))
    return jsonify({
        "session": dict(session)
    })

# Test API
@app.route('/test', methods=['GET'])
def test():
    return "API is working!"


if __name__ == '__main__':
    app.run(debug=True)
