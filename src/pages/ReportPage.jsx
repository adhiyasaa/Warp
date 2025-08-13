import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const LoadingSpinner = () => (
  <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center rounded-xl z-50">
    <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-4 text-gray-700 font-medium"
    >
      Mengirim laporan Anda...
    </motion.p>
  </div>
);

const ReportPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const { profile } = useProfile(currentUser?.id);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !eventDate || !image) {
      setError("Semua field wajib diisi, termasuk dokumentasi.");
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const filePath = `public/${currentUser.id}_${Date.now()}_${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from('reports')
        .upload(filePath, image);
      
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('reports')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('reports')
        .insert({
          title,
          description,
          event_date: eventDate,
          image_url: urlData.publicUrl,
          user_id: currentUser.id,
          username: profile.username
        });

      if (insertError) throw insertError;

      navigate('/laporan-saya');

    } catch (err) {
      setError("Gagal mengirim laporan. Silakan coba lagi.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Laporkan Kerusakan Fasilitas Umum</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Bantu kami menjadikan Malang lebih baik dengan melaporkan masalah yang Anda temui.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-xl shadow-2xl relative"
        >
          {isLoading && <LoadingSpinner />}
          
          <form onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg mb-6"
              >
                {error}
              </motion.div>
            )}
            
            <div className="mb-8">
              <label className="block text-lg font-semibold mb-3" htmlFor="title">
                Judul Laporan
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input 
                id="title" 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Contoh: Jalan Berlubang di Jl. A. Yani" 
                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="mb-8">
              <label className="block text-lg font-semibold mb-3" htmlFor="description">
                Deskripsi Lengkap
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Jelaskan masalah yang Anda temui dengan detail (lokasi spesifik, ukuran, bahaya yang mungkin ditimbulkan, dll)" 
                rows="6" 
                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              ></textarea>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-lg font-semibold mb-3" htmlFor="eventDate">
                  Tanggal Kejadian
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input 
                  id="eventDate" 
                  type="date" 
                  value={eventDate} 
                  onChange={(e) => setEventDate(e.target.value)} 
                  className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold mb-3">
                  Dokumentasi
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={handleImageChange} 
                    accept="image/*" 
                  />
                  {image ? (
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm text-gray-300">{image.name}</p>
                      <button 
                        type="button" 
                        onClick={() => setImage(null)} 
                        className="mt-2 text-xs text-red-400 hover:text-red-300"
                      >
                        Ganti Gambar
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-400">
                        <span className="font-medium text-blue-400">Upload foto</span> atau drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF hingga 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-10">
              <label className="block text-lg font-semibold mb-3">
                Lokasi
                <span className="text-gray-500 text-sm font-normal ml-2">(Fitur akan datang)</span>
              </label>
              <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p>Fitur pemetaan lokasi akan segera hadir</p>
                </div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isLoading}
              className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-70"
            >
              {isLoading ? 'Mengirim...' : 'Kirim Laporan'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportPage;