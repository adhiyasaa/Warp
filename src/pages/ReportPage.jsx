// File: src/pages/ReportPage.jsx

import React, { useState } from 'react';

// Komponen pura-pura, Anda bisa ganti dengan komponen UI Anda dari Shadcn/UI
const Button = (props) => <button {...props} style={{ padding: '10px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }} />;
const Input = (props) => <input {...props} style={{ display: 'block', width: '95%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }} />;
const Textarea = (props) => <textarea {...props} style={{ display: 'block', width: '95%', height: '100px', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }} />;

const labelDictionary = {
  'Jalan': 'Jalan Rusak / Berlubang',
  'Halte': 'Halte Rusak',
  'Trotoar': 'Trotoar Rusak',
  'Lampu': 'Lampu Rusak / Mati',
  'Parit': 'Parit Tersumbat',
  'Rambu': 'Rambu Rusak'
};

export default function ReportPage() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [description, setDescription] = useState('');
  const [detections, setDetections] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = async (event) => {
    // ... (Fungsi ini tidak perlu diubah)
    const file = event.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setIsAnalyzing(true);
    setDetections([]);
    setDescription('');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analisis gagal');
      }
      const data = await response.json();
      setDescription(data.description);
      setDetections(data.detections);
    } catch (error) {
      console.error(error);
      alert('Error: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (event) => {
    // ... (Fungsi ini tidak perlu diubah)
    event.preventDefault();
    alert('Laporan berhasil dikirim! (Simulasi)');
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>Laporkan Kerusakan Fasilitas Umum</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Bagian Judul dan Tanggal tidak berubah */}
        <div>
          <h3>Judul Laporan</h3>
          <Input 
            type="text"
            placeholder="Contoh: Jalan Berlubang di Depan Balai Kota"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required 
          />
        </div>
        <div>
          <h3>Tanggal Laporan</h3>
          <Input 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Bagian Unggah Foto tidak berubah */}
        <div>
          <h3>Unggah Foto</h3>
          <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} />
          {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '300px', marginTop: '10px', borderRadius: '5px' }} />}
          {isAnalyzing && <p style={{ color: 'blue' }}>Menganalisis foto, mohon tunggu...</p>}
        </div>

        <div>
          <h3>Hasil Deteksi AI</h3>
          <p><strong>Objek Terdeteksi:</strong></p>
          {detections.length > 0 ? (
            <ul>
              {/* --- PERUBAHAN DI SINI --- */}
              {detections.map((item, index) => (
                <li key={index}>
                  {labelDictionary[item] || item}
                </li>
              ))}
              {/* ------------------------- */}
            </ul>
          ) : (
            <p>{!isAnalyzing && "Belum ada objek terdeteksi."}</p>
          )}
        </div>
        
        {/* Sisa form tidak berubah */}
        <div>
          <h3>Deskripsi Otomatis (dari Gen AI)</h3>
          <Textarea 
            placeholder="Deskripsi akan terisi otomatis setelah gambar diunggah..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <Button type="submit" disabled={isAnalyzing}>
          {isAnalyzing ? "Menganalisis..." : "Kirim Laporan"}
        </Button>
      </form>
    </div>
  );
}