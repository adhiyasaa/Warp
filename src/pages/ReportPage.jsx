// src/pages/ReportPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import MapPicker from '../components/MapPicker';

const labelDictionary = {
  Jalan: 'Jalan Rusak / Berlubang',
  Halte: 'Halte Rusak',
  Trotoar: 'Trotoar Rusak',
  Lampu: 'Lampu Rusak / Mati',
  Parit: 'Parit Tersumbat',
  Rambu: 'Rambu Rusak',
};

// Parse "Tingkat kerusakan: X" dari deskripsi bila field damage_level tidak ada
const parseDamageFromText = (text = '') => {
  const m = String(text).match(
    /tingkat\s*kerusakan\s*[:\-]\s*(tidak ada kerusakan|ringan|sedang|berat)/i
  );
  if (m && m[1]) {
    const val = m[1].toLowerCase();
    if (val === 'tidak ada kerusakan') return 'Tidak ada kerusakan';
    return val.charAt(0).toUpperCase() + val.slice(1);
  }
  const t = String(text).toLowerCase();
  if (t.includes('tidak ada kerusakan') || t.includes('no damage')) return 'Tidak ada kerusakan';
  if (t.includes('berat') || t.includes('parah')) return 'Berat';
  if (t.includes('sedang') || t.includes('moderate')) return 'Sedang';
  if (t.includes('ringan') || t.includes('minor')) return 'Ringan';
  return 'Tidak diketahui';
};

const ReportPage = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const [location, setLocation] = useState(null);
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [description, setDescription] = useState('');
  const [detections, setDetections] = useState([]);
  const [damageLevel, setDamageLevel] = useState('');
  const [damageBasis, setDamageBasis] = useState('');

  const { currentUser } = useAuth();
  const { profile } = useProfile(currentUser?.id);
  const navigate = useNavigate();

  // ---- Helpers untuk area bbox ----
  const boxAreaFromDetection = (det) => {
    // Mendukung beberapa bentuk struktur bbox yang umum
    if (det?.bbox && Array.isArray(det.bbox) && det.bbox.length === 4) {
      const [x, y, w, h] = det.bbox;
      return Math.max(0, w) * Math.max(0, h);
    }
    if (det && typeof det === 'object') {
      const { x, y, width, height, xmin, ymin, xmax, ymax } = det;
      if (
        (typeof x === 'number' && typeof y === 'number' &&
          typeof width === 'number' && typeof height === 'number')
      ) {
        return Math.max(0, width) * Math.max(0, height);
      }
      if (
        typeof xmin === 'number' && typeof ymin === 'number' &&
        typeof xmax === 'number' && typeof ymax === 'number'
      ) {
        return Math.max(0, xmax - xmin) * Math.max(0, ymax - ymin);
      }
    }
    // Tidak ada info bbox yang bisa dihitung
    return null;
  };

  const computeDamageLevel = (dets, imgW, imgH) => {
    if (!Array.isArray(dets)) dets = [];
    const totalBoxes = dets.length;

    // Coba hitung berbasis area
    const areas = dets
      .map(boxAreaFromDetection)
      .filter(a => typeof a === 'number' && isFinite(a) && a > 0);

    if (imgW > 0 && imgH > 0 && areas.length > 0) {
      const imageArea = imgW * imgH;
      const totalBoxArea = areas.reduce((s, a) => s + a, 0);
      const pct = (totalBoxArea / imageArea) * 100;

      // Threshold berbasis % area tertutup bbox
      let level = 'Tidak ada kerusakan';
      if (pct > 0 && pct <= 3) level = 'Ringan';
      else if (pct > 3 && pct <= 10) level = 'Sedang';
      else if (pct > 10) level = 'Berat';

      return {
        level,
        basis: `Berdasarkan persentase luas area terdeteksi ≈ ${pct.toFixed(2)}% dari foto`
      };
    }

    // Fallback: berbasis jumlah bbox
    let level = 'Tidak ada kerusakan';
    if (totalBoxes === 0) level = 'Tidak ada kerusakan';
    else if (totalBoxes <= 2) level = 'Ringan';
    else if (totalBoxes <= 5) level = 'Sedang';
    else level = 'Berat';

    return {
      level,
      basis: `Berdasarkan jumlah objek terdeteksi (${totalBoxes} bounding box)`
    };
  };
  // ---------------------------------

  const loadImageDimension = (objectUrl) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 0, height: 0 });
      img.src = objectUrl;
    });

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // (opsional) validasi ukuran file
    const FIVE_MB = 5 * 1024 * 1024;
    if (file.size > FIVE_MB) {
      setError('Ukuran file maksimal 5MB.');
      return;
    }

    setImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    const dims = await loadImageDimension(previewUrl);
    setImageSize(dims);

    setIsAnalyzing(true);
    setDetections([]);
    setDescription('');
    setError('');
    setDamageLevel('');
    setDamageBasis('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let msg = 'Analisis gagal, pastikan backend AI berjalan.';
        try {
          const errData = await response.json();
          msg = errData?.error || msg;
        } catch (_) {}
        throw new Error(msg);
      }

      const data = await response.json();

      // YOLO detections (array bebas: string atau object)
      setDetections(Array.isArray(data.detections) ? data.detections : []);

      // Gemini result
      const aiDescription = data.description || '';
      const aiLevel = data.damage_level || parseDamageFromText(aiDescription) || 'Tidak diketahui';

      setDescription(aiDescription);
      setDamageLevel(aiLevel);
      setDamageBasis(`AI mengategorikan sebagai ${aiLevel}.`);

      if (aiLevel === 'Tidak ada kerusakan') {
        setDetections([]);
      }
    } catch (err) {
      console.error(err);
      setError('Error: ' + err.message);
      setDamageLevel('');
      setDamageBasis('');
      // biarkan preview tetap ada agar user tak perlu reupload
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !image || !location) {
      setError('Judul, dokumentasi, dan lokasi di peta wajib diisi.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const filePath = `public/${currentUser.id}_${Date.now()}_${image.name}`;
      const { error: uploadError } = await supabase.storage.from('reports').upload(filePath, image);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('reports').getPublicUrl(filePath);

      const { error: insertError } = await supabase.from('reports').insert({
        title,
        description, // deskripsi sudah memuat "Tingkat kerusakan: ..."
        event_date: eventDate,
        image_url: urlData.publicUrl,
        user_id: currentUser.id,
        username: profile.username,
        latitude: location.lat,
        longitude: location.lng,
        damage_level: damageLevel,
      });
      if (insertError) throw insertError;

      navigate('/laporan-saya');
    } catch (err) {
      setError('Gagal mengirim laporan. Pastikan semua data benar.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDetLabel = (det) => {
    let raw = det;
    if (typeof det === 'object' && det) {
      raw = det.label || det.class || det.name || det.type || JSON.stringify(det);
    }
    return labelDictionary[raw] || String(raw);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: "url('/images/background.png')" }}
    >
      <div className="min-h-screen bg-black/50 backdrop-blur-sm">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Laporkan Kerusakan Fasilitas Umum
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto">
              Unggah foto, dan biarkan AI kami membantu mengisi detailnya untuk Anda.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto bg-slate-900/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-cyan-400/20 relative"
          >
            {isLoading && (
              <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20">
                <p>Mengirim laporan...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">
                  {error}
                </div>
              )}

              {/* Judul & Tanggal */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2" htmlFor="title">
                    Judul Laporan <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Lampu Jalan Mati"
                    className="form-input w-full p-3 bg-slate-800/50 text-cyan-300 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" htmlFor="eventDate">
                    Tanggal Kejadian <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="eventDate"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="form-input w-full p-3 bg-slate-800/50 text-cyan-300 border border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              {/* Upload Foto */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Unggah Foto <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-white/30 border-dashed rounded-md relative">
                  <input
                    id="file-upload"
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-md">
                      <p>Menganalisis foto...</p>
                    </div>
                  )}

                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-48 rounded-md" />
                  ) : (
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-white/50"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-white/70">Klik untuk upload atau drag and drop</p>
                    </div>
                  )}
                </div>
                {imageSize.width > 0 && (
                  <p className="text-white/40 text-xs mt-2">
                    Dimensi gambar: {imageSize.width}×{imageSize.height}px
                  </p>
                )}
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Pilih Lokasi di Peta <span className="text-red-500">*</span>
                </label>
                <MapPicker onLocationChange={setLocation} />
              </div>

              {/* Hasil AI */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Hasil Deteksi AI</label>
                  <div className="p-3 bg-black/30 rounded-lg min-h-[120px] space-y-2">
                    <p className="text-cyan-300">
                      Tingkat Kerusakan:{' '}
                      <span className="font-bold">
                        {damageLevel || (isAnalyzing ? 'Menunggu analisis...' : '—')}
                      </span>
                    </p>
                    {damageBasis && (
                      <p className="text-white/60 text-xs italic">{damageBasis}</p>
                    )}
                    <div className="h-px bg-white/10 my-2" />
                    {detections.length > 0 ? (
                      <ul className="list-disc list-inside text-cyan-300">
                        {detections.map((item, index) => (
                          <li key={index}>{renderDetLabel(item)}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-white/50 text-sm">Belum ada objek terdeteksi.</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Deskripsi Otomatis (AI)</label>
                  <textarea
                    placeholder="Deskripsi akan terisi otomatis..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="6"
                    className="form-textarea w-full p-3 bg-slate-800/50 text-cyan-300 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={isLoading || isAnalyzing}
                className="w-full p-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-bold hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Mengirim...' : isAnalyzing ? 'Menunggu Analisis AI...' : 'Kirim Laporan'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
