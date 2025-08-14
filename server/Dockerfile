# Menggunakan gambar Node.js versi 18 yang ringan
FROM node:18-alpine

# Menentukan direktori kerja di dalam kontainer
WORKDIR /app

# Salin file package.json untuk menginstal dependensi terlebih dahulu
# Tanda bintang (*) memastikan ia juga menyalin package-lock.json jika ada
COPY package*.json ./
RUN npm install

# Salin sisa kode aplikasi
COPY . .

# Memberi tahu Docker bahwa aplikasi berjalan di port 8000
EXPOSE 8000

# Perintah untuk menjalankan server saat kontainer dimulai
CMD ["node", "server.js"]