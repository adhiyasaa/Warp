import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import MapPicker from '../components/MapPicker';

const labelDictionary = {
  'Jalan': 'Jalan Rusak / Berlubang',
  'Halte': 'Halte Rusak',
  'Trotoar': 'Trotoar Rusak',
  'Lampu': 'Lampu Rusak / Mati',
  'Parit': 'Parit Tersumbat',
  'Rambu': 'Rambu Rusak'
};

// --- Fungsi untuk generate deskripsi panjang + tingkat kerusakan ---
const generateFinalDescription = (description) => {
  if (!description) {
    return {
      description: 'Tidak ada deskripsi yang dihasilkan.',
      level: 'Tidak diketahui',
      basis: 'Deskripsi kosong.'
    };
  }

  const desc = description.toLowerCase();

  // Tidak ada kerusakan
  if (desc.includes('tidak ada kerusakan') || desc.includes('no damage')) {
    const finalDesc =
      "Berdasarkan analisis gambar, tidak ditemukan adanya tanda-tanda kerusakan pada fasilitas umum. Seluruh struktur terlihat dalam kondisi baik dan masih dapat digunakan sebagaimana mestinya tanpa hambatan. Dengan kondisi ini, dapat dipastikan bahwa fasilitas dalam keadaan aman, sehingga tingkat kerusakan dikategorikan sebagai: Tidak ada kerusakan.";
    return { description: finalDesc, level: 'Tidak ada kerusakan', basis: 'AI menyatakan tidak ada kerusakan.' };
  }

  // Lampu mati
  if (desc.includes('lampu') && (desc.includes('mati') || desc.includes('tidak berfungsi'))) {
    const level = 'Ringan';
    const finalDesc =
      "Hasil analisis menunjukkan bahwa lampu jalan pada lokasi ini tidak berfungsi dengan baik. Kondisi lampu yang mati dapat mengurangi kualitas penerangan jalan pada malam hari, sehingga berpotensi membahayakan pengguna jalan dan pejalan kaki. Meskipun demikian, kerusakan ini hanya berdampak pada fungsi penerangan tanpa merusak struktur fisik di sekitarnya. Oleh karena itu, tingkat kerusakan dikategorikan sebagai kerusakan " +
      level + ".";
    return { description: finalDesc, level, basis: 'Lampu mati dikategorikan kerusakan ringan.' };
  }

  // Halte rusak
  if (desc.includes('halte') && (desc.includes('rusak') || desc.includes('atap') || desc.includes('runtuh') || desc.includes('hilang'))) {
    const level = 'Sedang';
    const finalDesc =
      "Berdasarkan hasil analisis pada gambar, struktur halte bus mengalami kerusakan yang cukup jelas. Atap halte terlihat rusak dengan beberapa bagian runtuh atau hilang, sehingga mengurangi kenyamanan dan perlindungan penumpang dari hujan maupun panas. Kondisi ini dapat mengganggu fungsi halte sebagai tempat tunggu yang aman dan layak digunakan. Dengan memperhatikan dampak kerusakan pada fungsi utama halte, tingkat kerusakan dikategorikan sebagai kerusakan " +
      level + ".";
    return { description: finalDesc, level, basis: 'Kerusakan struktural halte dikategorikan sedang.' };
  }

  // Jalan rusak
  if (desc.includes('jalan') && (desc.includes('rusak') || desc.includes('berlubang'))) {
    let level = 'Sedang';
    let severity = 'Kerusakan terlihat berupa lubang-lubang kecil hingga sedang pada permukaan jalan.';
    if (desc.includes('besar') || desc.includes('parah')) {
      level = 'Berat';
      severity = 'Kerusakan jalan tergolong parah, dengan lubang besar dan area yang rusak meluas di sepanjang jalur.';
    }
    const finalDesc =
      `Analisis pada gambar memperlihatkan bahwa kondisi jalan di lokasi ini mengalami kerusakan. ${severity} Situasi ini berpotensi menurunkan kenyamanan berkendara, meningkatkan risiko kecelakaan, serta mempercepat kerusakan kendaraan pengguna jalan. Dengan mempertimbangkan dampak dan tingkat keparahan kerusakan, kondisi ini dikategorikan sebagai kerusakan ${level}.`;
    return { description: finalDesc, level, basis: `Kerusakan jalan dikategorikan ${level}.` };
  }

  // fallback
  const finalDesc =
    description +
    " Berdasarkan informasi yang tersedia, kerusakan terdeteksi namun tingkat kerusakan tidak dapat dipastikan. Untuk sementara, kondisi ini dikategorikan sebagai kerusakan tingkat Tidak diketahui.";
  return { description: finalDesc, level: 'Tidak diketahui', basis: 'AI tidak memberikan indikasi kerusakan yang jelas.' };
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
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

      // deteksi YOLO
      setDetections(Array.isArray(data.detections) ? data.detections : []);

      // deskripsi AI → generate final paragraf
      const aiDescription = data.description || data.ai_description || '';
      const final = generateFinalDescription(aiDescription);

      setDescription(final.description);
      setDamageLevel(final.level);
      setDamageBasis(final.basis);

      if (final.level === 'Tidak ada kerusakan') {
        setDetections([]);
      }

    } catch (err) {
      console.error(err);
      setError('Error: ' + err.message);
      setImage(null);
      setImagePreview(null);
      setDamageLevel('');
      setDamageBasis('');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !image || !location) {
      setError("Judul, dokumentasi, dan lokasi di peta wajib diisi.");
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
        description,
        event_date: eventDate,
        image_url: urlData.publicUrl,
        user_id: currentUser.id,
        username: profile.username,
        latitude: location.lat,
        longitude: location.lng,
        // damage_level: damageLevel, // aktifkan kalau tabel sudah punya kolom ini
      });
      if (insertError) throw insertError;

      navigate('/laporan-saya');
    } catch (err) {
      setError("Gagal mengirim laporan. Pastikan semua data benar.");
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

              <div>
                <label className="block text-sm font-bold mb-2">
                  Pilih Lokasi di Peta <span className="text-red-500">*</span>
                </label>
                <MapPicker onLocationChange={setLocation} />
              </div>

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
