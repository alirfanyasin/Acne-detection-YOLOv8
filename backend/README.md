## 🧠 Backend Acne Detection
Repository ini adalah bagian backend dari proyek Acne Detection System yang menggunakan model YOLOv8 untuk mendeteksi jenis dan tingkat keparahan jerawat dari gambar wajah.
Backend ini bertugas untuk:
- Menerima gambar dari frontend (via HTTP request)
- Melakukan prediksi menggunakan model YOLOv8
- Menyimpan hasil deteksi ke database MySQL
- Menghasilkan laporan hasil deteksi dalam format PDF
- Mengizinkan akses lintas domain (CORS) agar frontend dapat berkomunikasi dengan API

## 🧰 Teknologi yang Digunakan
Proyek ini dibangun menggunakan Python dan beberapa library utama berikut:
- Flask (Framework web untuk membuat REST API)
- Flask-CORS (Mengaktifkan akses lintas domain agar frontend bisa mengakses API)
- Ultralytics YOLO	(Model deep learning YOLOv8 untuk deteksi jerawat)
- Pillow  (Pengolahan gambar membaca & menyimpan gambar)
- ReportLab	(Membuat file PDF laporan hasil deteksi)
- MySQL Connector	(Menyimpan hasil prediksi ke database MySQL)
- OS, UUID, Pathlib, Shutil, IO	(Pengelolaan file dan direktori di sistem)
- VENV (Virtual Environment)	(Isolasi lingkungan Python agar dependency tidak bentrok)

## 🗂️ Struktur Direktori (Ringkasan)
```bash
├── app.py                  # File utama
├── runs/
    └── detect/..           # Hasil detect before and after
├── best.pt                 # Model YOLOv8 terlatih
├── requirements.txt        # Daftar dependensi Python
├── venv/
├── results/
│   ├── images/             # Folder hasil prediksi (gambar)
│   └── pdf/                # Folder laporan hasil prediksi (PDF)
└── ...
```

## ✅ Prasyarat
Sebelum menjalankan proyek, pastikan kamu sudah menginstal:
- Python 3.10+
- pip (biasanya sudah terpasang bersama Python)
- MySQL Server atau XAMPP/Laragon (buat database dengan nama `db_acne_detection` lalu import file database ini [download](https://drive.google.com/drive/folders/1YBlyuIki6a8mgSnFQeVPAq54SjDlzP-V?usp=sharing)) 
- File model best.pt (model YOLOv8 hasil training)
- OS mendukung environment Python (Windows / macOS / Linux)

## 🚀 Cara Menjalankan Project
Buat Virtual Environment
```bash
python -m venv venv
```

Aktifkan Virtual Environment
- Untuk Windows
```bash
venv\Scripts\activate
```

- Untuk Linux / macOS
```bash
source venv/bin/activate
```

Buat file bernama `requirements.txt` <br>

Install Dependencies
```bash
pip install -r requirements.txt
```

Buat database di phpMyAdmin atau sejenisnya
```bash
# config.py
def database_connection():
connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="db_acne_detection" # nama databasenya sesuaikan dengan yg di buat di phpMyAdmin
)
return connection
```

Akses url ini untuk generate tabel di dalam database tersebut
```bash
http://127.0.0.1:5000/generate

# atau

http://localhost:5000/generate
```


Jalankan Server
```bash
python app.py
```

Jika berhasil, server akan berjalan di: `http://localhost:5000` namun tidak perlu di buka di browser, hanya server dari frontend saja yang di buka di browser `http://localhost:5173`


## Dataset
[Lihat dataset](https://www.kaggle.com/datasets/osmankagankurnaz/acne-dataset-in-yolov8-format)