import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
// Gunakan port dari Railway, atau 8000 untuk lokal
const port = process.env.PORT || 8000;

app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("✅ Klien Gemini siap.");

// (BARU) Endpoint untuk Health Check Railway
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

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
        const formData = new FormData();
        const imageBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
        formData.append('image', imageBlob, req.file.originalname);

        const yoloUrl = `${process.env.YOLO_SERVER_PRIVATE_URL}/predict`;
        
        console.log(`Mengirim gambar ke server YOLO di: ${yoloUrl}`);
        const yoloResponse = await fetch(yoloUrl, {
            method: 'POST',
            body: formData,
        });

        if (!yoloResponse.ok) {
            const yoloErrorText = await yoloResponse.text();
            console.error("Error dari server YOLO:", yoloErrorText);
            throw new Error('Server YOLO gagal merespons atau error.');
        }

        const yoloData = await yoloResponse.json();
        const detectedLabels = yoloData.detections || [];
        console.log("Hasil deteksi dari YOLO:", detectedLabels);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const imagePart = await fileToGenerativePart(req.file);
        const prompt = "Anda adalah AI yang membantu melaporkan kerusakan fasilitas umum. Jelaskan kerusakan yang terlihat di gambar ini dalam satu kalimat singkat dan jelas.";
        const result = await model.generateContent([prompt, imagePart]);
        const description = result.response.text();
        console.log("Deskripsi dari Gemini:", description);

        res.json({ detections: detectedLabels, description: description });

    } catch (error) {
        console.error("Error pada /api/analyze:", error);
        res.status(500).json({ error: "Gagal menganalisis gambar." });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server backend utama berjalan di port ${port}`);
});