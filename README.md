# Cara Menjalankan Proyek Lapor Cepat

Panduan ini berisi langkah-langkah untuk menyiapkan dan menjalankan seluruh aplikasi (Frontend, Backend Utama, dan Backend AI) di komputer lokal Anda.

---

## Prasyarat (Yang Harus Terinstal)

Pastikan perangkat lunak berikut sudah terinstal di komputer Anda:
* [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
* [Python](https://www.python.org/) (versi 3.11 atau lebih baru)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Langkah-langkah Menjalankan

1.  **Dapatkan Kode Proyek**
    Buka terminal dan jalankan perintah berikut untuk mengunduh dan masuk ke folder proyek:
    ```bash
    git clone [https://github.com/adhiyasaa/lapor.git](https://github.com/adhiyasaa/lapor.git)
    cd lapor
    ```

2.  **Siapkan Kunci API**
    Buat sebuah file baru bernama `.env` di folder utama proyek. Isi file tersebut dengan kunci API Anda dari Google AI Studio:
    ```
    GEMINI_API_KEY="AIzaSy...salin_kunci_rahasia_anda_di_sini"
    ```

3.  **Jalankan Server Backend (Node.js + Python)**
    Buka satu terminal (disarankan sebagai Administrator) di folder utama proyek. Jalankan perintah di bawah ini untuk membangun dan menyalakan kedua server backend secara bersamaan menggunakan Docker.
    ```bash
    docker-compose up --build
    ```
    **Biarkan terminal ini tetap berjalan.** Ini adalah "mesin" untuk seluruh backend Anda.

4.  **Jalankan Aplikasi Frontend**
    Buka terminal **kedua** di folder utama proyek. Jalankan perintah-perintah berikut untuk menginstal dependensi dan menyalakan server frontend.
    ```bash
    # Instal semua library yang dibutuhkan frontend
    npm install

    # Jalankan server pengembangan
    npm run dev
    ```

5.  **Buka Aplikasi di Browser**
    Buka browser Anda dan navigasi ke alamat yang ditampilkan di terminal kedua (biasanya **`http://localhost:5173`**). Aplikasi Anda sekarang sudah siap digunakan untuk development.