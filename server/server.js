import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();

// Tingkatkan batas ukuran payload menjadi 50mb
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: "https://warp1.up.railway.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const upload = multer({ storage: multer.memoryStorage() });

let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("✅ Klien Gemini siap.");
} catch (e) {
  console.error("❌ Gagal inisialisasi Klien Gemini:", e.message);
}

// Endpoint untuk Health Check Railway
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// Konversi file ke format untuk Gemini
async function fileToGenerativePart(file) {
  return {
    inlineData: { data: file.buffer.toString("base64"), mimeType: file.mimetype },
  };
}

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File gambar dibutuhkan." });
  }

  try {
    console.log('[SERVER LOG] Menerima permintaan /api/analyze.');

    // --- Panggil YOLO ---
    const formData = new FormData();
    const imageBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append('image', imageBlob, req.file.originalname);

    const yoloUrl = process.env.YOLO_API_ENDPOINT;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    console.log(`[SERVER LOG] Mengirim permintaan ke YOLO di: ${yoloUrl}`);
    const yoloResponse = await fetch(yoloUrl, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!yoloResponse.ok) {
      const yoloErrorText = await yoloResponse.text();
      console.error("[SERVER LOG] Error dari server YOLO:", yoloErrorText);
      throw new Error('Server YOLO gagal merespons atau error.');
    }

    const yoloData = await yoloResponse.json();
    const detectedLabels = yoloData.detections || [];
    console.log("[SERVER LOG] Hasil deteksi dari YOLO:", detectedLabels);

    // --- Panggil Gemini ---
    if (!genAI) throw new Error("Klien Gemini tidak terinisialisasi.");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const imagePart = await fileToGenerativePart(req.file);

    const prompt = `
Anda adalah AI yang membantu melaporkan kerusakan fasilitas umum.
Input: hasil deteksi YOLO berupa: ${JSON.stringify(detectedLabels)}.
Tugas:
1. Buat deskripsi singkat mengenai kerusakan pada gambar.
2. Tambahkan kalimat di akhir deskripsi dalam format: "Tingkat kerusakan: [Ringan/Sedang/Berat/Tidak ada kerusakan]".
3. Kembalikan jawaban dalam JSON dengan struktur:
{
  "description": "teks deskripsi dengan tingkat kerusakan",
  "damage_level": "Ringan/Sedang/Berat/Tidak ada kerusakan"
}
`;

    const result = await model.generateContent([prompt, imagePart]);
    const rawText = result.response.text();
    console.log("[SERVER LOG] Respon mentah Gemini:", rawText);

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      console.warn("[SERVER LOG] Gagal parse JSON, fallback ke teks.");
      parsed = {
        description: rawText,
        damage_level: "Tidak diketahui",
      };
    }

    res.json({
      detections: detectedLabels,
      description: parsed.description,
      damage_level: parsed.damage_level,
    });

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("[SERVER LOG] Error: Permintaan ke YOLO timeout.");
      return res.status(504).json({ error: "Gagal menganalisis gambar: Server AI timeout." });
    }
    console.error("[SERVER LOG] Error pada /api/analyze:", error);
    res.status(500).json({ error: "Gagal menganalisis gambar." });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server backend utama berjalan di port ${port}`);
});
