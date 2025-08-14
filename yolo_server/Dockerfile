# Menggunakan gambar Python 3.11 yang ringan
FROM python:3.11-slim
WORKDIR /app

# Menginstal dependensi sistem yang dibutuhkan oleh OpenCV
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0
# =======================================================

# Salin file daftar belanja (requirements.txt)
COPY requirements.txt .

# Jalankan pip untuk menginstal semua library dari daftar
RUN pip install --no-cache-dir -r requirements.txt

# Salin semua file dari folder yolo_server ke dalam kontainer
# (ini termasuk app.py dan model .pt Anda)
COPY . .

# Perintah untuk menjalankan server dengan Gunicorn saat kontainer dimulai
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]