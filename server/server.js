import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import FormData from 'form-data';            // ⬅️ penting
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Saat awal uji, izinkan semua origin dulu
app.use(cors({ origin: true, credentials: true }));

const upload = multer({ storage: multer.memoryStorage() });
const port = process.env.PORT || 8000;

// ... inisialisasi Gemini tetap

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File gambar dibutuhkan.' });

  try {
    // Kirim ke YOLO server (antar-container)
    const fd = new FormData();
    fd.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const yoloResponse = await fetch(process.env.YOLO_API_ENDPOINT, {
      method: 'POST',
      body: fd
    });

    if (!yoloResponse.ok) {
      const yoloErr = await yoloResponse.text();
      console.error('YOLO error:', yoloErr);
      throw new Error('YOLO server error');
    }

    const yoloData = await yoloResponse.json();
    const detectedLabels = yoloData.detections || yoloData.results || [];

    // ... panggil Gemini seperti sebelumnya

    res.json({
      detections: detectedLabels,
      description: parsed.description,
      damage_level: parsed.damage_level,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Gagal menganalisis gambar.' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server backend utama berjalan di port ${port}`);
});
