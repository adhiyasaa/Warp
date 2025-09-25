// src/components/TutorialModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TutorialModal = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-slate-800 text-white rounded-2xl shadow-xl w-full max-w-lg border border-cyan-400/30"
                        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat diklik di dalam
                    >
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-cyan-300">Cara Melapor di WARP</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                        </div>
                        <div className="p-6 space-y-4 text-gray-300">
                            <div className="flex items-start gap-4">
                                <div className="bg-cyan-500/20 text-cyan-300 font-bold rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center">1</div>
                                <div>
                                    <h3 className="font-semibold text-white">Isi Judul & Tanggal</h3>
                                    <p className="text-sm">Tulis judul singkat yang jelas dan pilih tanggal kejadiannya.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-cyan-500/20 text-cyan-300 font-bold rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center">2</div>
                                <div>
                                    <h3 className="font-semibold text-white">Unggah Foto Kerusakan</h3>
                                    <p className="text-sm">Pilih foto terbaik yang menunjukkan kerusakan. AI kami akan langsung menganalisisnya.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-cyan-500/20 text-cyan-300 font-bold rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center">3</div>
                                <div>
                                    <h3 className="font-semibold text-white">Biarkan AI Bekerja</h3>
                                    <p className="text-sm">Sistem akan otomatis mendeteksi objek, menentukan tingkat kerusakan, dan membuatkan deskripsi untuk Anda.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="bg-cyan-500/20 text-cyan-300 font-bold rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center">4</div>
                                <div>
                                    <h3 className="font-semibold text-white">Tandai Lokasi di Peta</h3>
                                    <p className="text-sm">Pilih lokasi yang akurat di peta agar petugas dapat menemukannya dengan mudah.</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-900/50 rounded-b-2xl text-center">
                            <button 
                                onClick={onClose} 
                                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                            >
                                Saya Mengerti
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TutorialModal;
