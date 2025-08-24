# 1. Gunakan image dasar yang ringan
FROM python:3.11-slim

# 2. Set direktori kerja
WORKDIR /app

# 3. Salin HANYA file requirements.txt terlebih dahulu
COPY requirements.txt .

# 4. Jalankan instalasi. Langkah ini akan di-cache jika requirements.txt tidak berubah
RUN pip install --no-cache-dir -r requirements.txt

# 5. Salin sisa file proyek Anda
COPY . .

# 6. Perintah untuk menjalankan aplikasi
CMD gunicorn --bind 0.0.0.0:$PORT app:app --timeout 300