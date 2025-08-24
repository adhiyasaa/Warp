# 1. Gunakan image dasar yang ringan
FROM python:3.11-slim

# 2. (DIPERBARUI) Install dependency sistem yang dibutuhkan oleh OpenCV
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0 --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 3. Set direktori kerja
WORKDIR /app

# 4. Salin HANYA file requirements.txt terlebih dahulu
COPY requirements.txt .

# 5. Jalankan instalasi
RUN pip install --no-cache-dir -r requirements.txt

# 6. Salin sisa file proyek Anda
COPY . .

# 7. Perintah untuk menjalankan aplikasi
CMD gunicorn --bind 0.0.0.0:$PORT app:app --timeout 300