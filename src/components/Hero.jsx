// src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';

const Hero = () => {
    // 1. Tambahkan state untuk menyimpan data statistik dan status loading
    const [stats, setStats] = useState({
        processed: 0,
        completedPercentage: 0,
        thisMonth: 0,
    });
    const [loading, setLoading] = useState(true);

    // 2. Gunakan useEffect untuk mengambil data dari Supabase saat komponen dimuat
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Ambil tanggal awal bulan ini
                const now = new Date();
                const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

                // 3. Jalankan semua query secara bersamaan untuk efisiensi
                const [
                    totalCountResponse, 
                    completedCountResponse, 
                    processedCountResponse,
                    thisMonthCountResponse
                ] = await Promise.all([
                    supabase.from('reports').select('*', { count: 'exact', head: true }),
                    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'Selesai'),
                    supabase.from('reports').select('*', { count: 'exact', head: true }).neq('status', 'Menunggu Verifikasi'),
                    supabase.from('reports').select('*', { count: 'exact', head: true }).gte('created_at', firstDayOfMonth)
                ]);

                // 4. Hitung statistik
                const totalCount = totalCountResponse.count || 0;
                const completedCount = completedCountResponse.count || 0;
                
                const completedPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                
                // 5. Update state dengan data baru
                setStats({
                    processed: processedCountResponse.count || 0,
                    completedPercentage: completedPercentage,
                    thisMonth: thisMonthCountResponse.count || 0,
                });

            } catch (error) {
                console.error("Gagal mengambil data statistik:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []); // Array kosong berarti efek ini hanya berjalan sekali

    return (
        <div 
            className="relative bg-cover bg-center h-screen flex items-center justify-center text-white text-center overflow-hidden" 
            style={{ backgroundImage: "url('/images/hero.png')" }} 
        >
            <div className="absolute inset-0 bg-black/30"></div>
            
            <div className="relative z-10 px-4">
                <motion.h2 /* ... */ className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                    Wujudkan Kota Lebih Baik,
                </motion.h2>
                <motion.h3 /* ... */ className="text-5xl md:text-6xl font-bold mb-8 drop-shadow-lg">
                    Dimulai dari Laporan Anda!
                </motion.h3>
                <motion.p /* ... */ className="text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                    Bergabung dengan ribuan warga yang telah berkontribusi untuk perbaikan kota Malang.
                </motion.p>
                <motion.div /* ... */ className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link to="/lapor" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Lapor Sekarang!
                    </Link>
                    <Link to="/about" className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105">
                        Pelajari Lebih Lanjut
                    </Link>
                </motion.div>
                
                {/* Stats bar */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-16 bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                        {/* 6. Tampilkan data dari state */}
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-300">
                                {loading ? '...' : `${stats.processed}+`}
                            </div>
                            <div className="text-sm uppercase tracking-wider">Laporan Diproses</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-300">
                                {loading ? '...' : `${stats.completedPercentage}%`}
                            </div>
                            <div className="text-sm uppercase tracking-wider">Terselesaikan</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-yellow-300">
                                {loading ? '...' : stats.thisMonth}
                            </div>
                            <div className="text-sm uppercase tracking-wider">Laporan Bulan Ini</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;