import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const port = 8000;

app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("✅ Klien Gemini siap.");

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
        // ================== PERUBAHAN DI SINI ==================
        // Kita gunakan FormData dan Blob bawaan Node.js yang lebih modern
        const formData = new FormData();
        const imageBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
        formData.append('image', imageBlob, req.file.originalname);
        // =======================================================

        console.log("Mengirim gambar ke server YOLO di port 5000...");
        const yoloResponse = await fetch('http://server_yolo:5000/predict', {
            method: 'POST',
            body: formData,
        });

        if (!yoloResponse.ok) {
            // Coba baca pesan error dari server yolo untuk debugging
            const yoloErrorText = await yoloResponse.text();
            console.error("Error dari server YOLO:", yoloErrorText);
            throw new Error('Server YOLO gagal merespons atau error.');
        }

        const yoloData = await yoloResponse.json();
        const detectedLabels = yoloData.detections || [];
        console.log("Hasil deteksi dari YOLO:", detectedLabels);

        // Minta deskripsi dari Gemini
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

app.listen(port, () => {
    console.log(`🚀 Server backend utama berjalan di http://localhost:${port}`);
});     