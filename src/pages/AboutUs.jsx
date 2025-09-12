// src/pages/AboutUs.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { FaBullseye, FaLightbulb, FaChartLine, FaHandsHelping, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { supabase } from '../supabase';

const TeamMember = ({ name, role, imageUrl, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl shadow-xl p-6 text-center transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
    >
      <div className="relative mx-auto w-32 h-32 mb-6">
        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-md group-hover:blur-lg transition-all duration-500"></div>
        <img
          src={imageUrl}
          alt={name}
          className="relative w-full h-full rounded-full object-cover ring-4 ring-blue-500 z-10"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-800">{name}</h3>
      <p className="text-blue-600 font-semibold mt-1">{role}</p>
      <div className="mt-4 flex justify-center space-x-4">
        <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
        </a>
        <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" clipRule="evenodd" /></svg>
        </a>
      </div>
    </motion.div>
);

const ValueCard = ({ icon, title, children, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
  >
    <div className="flex items-start mb-6">
      <div className="p-4 bg-blue-100 rounded-xl mr-6 text-blue-600">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mt-1">{title}</h3>
    </div>
    <p className="text-gray-600 leading-relaxed">{children}</p>
  </motion.div>
);

const AboutUs = () => {
    const [stats, setStats] = useState({
        processed: 0,
        completedPercentage: 0,
        totalReports: 0,
        totalUsers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutStats = async () => {
            try {
                const [
                    totalReportsRes, 
                    completedReportsRes, 
                    processedReportsRes,
                    totalUsersRes
                ] = await Promise.all([
                    supabase.from('reports').select('*', { count: 'exact', head: true }),
                    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'Selesai'),
                    supabase.from('reports').select('*', { count: 'exact', head: true }).neq('status', 'Menunggu Verifikasi'),
                    supabase.from('profiles').select('*', { count: 'exact', head: true })
                ]);
                
                const totalCount = totalReportsRes.count || 0;
                const completedCount = completedReportsRes.count || 0;
                const completedPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                setStats({
                    processed: processedReportsRes.count || 0,
                    completedPercentage: completedPercentage,
                    totalReports: totalCount,
                    totalUsers: totalUsersRes.count || 0
                });
            } catch (error) {
                console.error("Gagal mengambil statistik About Us:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAboutStats();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <header className="relative text-white text-center py-32 bg-gradient-to-b from-[#001722] to-[#00293C] overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-20 left-20 w-16 h-16 rounded-full bg-white/10 animate-float1"></div>
                <div className="absolute bottom-40 right-32 w-24 h-24 rounded-full bg-blue-400/20 animate-float2"></div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="container mx-auto px-4 relative z-10"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">Tentang warp</h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                        warga aduan realtime & percaya. Inisiatif dari Malang untuk Indonesia.
                    </p>
                </motion.div>
            </header>

            <main className="container mx-auto px-4 py-16 -mt-16">
                <motion.section 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl mb-16 relative z-10"
                >
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Apa itu warp?</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                <span className="font-bold text-blue-600">warp</span> lahir dari sebuah gagasan sederhana: setiap warga adalah mata dan telinga bagi kotanya. Kami melihat adanya kesenjangan antara masalah fasilitas umum yang terjadi di lapangan—seperti jalan berlubang, lampu penerangan yang padam, atau tumpukan sampah—dengan kecepatan respons dari pihak berwenang.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Platform kami hadir sebagai solusi digital untuk menjembatani kesenjangan tersebut. Dengan aplikasi web yang intuitif, warga <span className="font-semibold">Malang</span> dapat dengan mudah mengirimkan laporan lengkap dengan foto dan lokasi. Laporan ini kemudian diteruskan dan dapat dipantau progresnya secara transparan, menciptakan siklus partisipasi dan akuntabilitas yang positif.
                            </p>
                        </div>
                        <div className="space-y-8">
                            <ValueCard icon={<FaBullseye size={28} />} title="Visi Kami" delay={0.2}>
                                Menjadi platform pelaporan andalan yang mengintegrasikan partisipasi warga dengan sistem tata kelola kota, dimulai dari <span className="font-semibold">Malang</span> hingga menginspirasi kota-kota lain di Indonesia.
                            </ValueCard>
                            <ValueCard icon={<FaLightbulb size={28} />} title="Misi Kami" delay={0.4}>
                                Menyediakan teknologi yang mudah diakses untuk pelaporan masalah, mempercepat alur informasi ke pihak berwenang, dan mendorong transparansi dalam setiap penanganan masalah publik.
                            </ValueCard>
                        </div>
                    </div>
                </motion.section>

                <motion.section 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <div className="bg-gradient-to-b from-[#001722] to-[#00293C] rounded-2xl p-8 text-white shadow-xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="p-4">
                                <div className="text-4xl font-bold mb-2">{loading ? '...' : `${stats.processed}+`}</div>
                                <div className="text-blue-200">Laporan Diproses</div>
                            </div>
                            <div className="p-4">
                                <div className="text-4xl font-bold mb-2">{loading ? '...' : `${stats.completedPercentage}%`}</div>
                                <div className="text-blue-200">Terselesaikan</div>
                            </div>
                            <div className="p-4">
                                <div className="text-4xl font-bold mb-2">{loading ? '...' : stats.totalReports}</div>
                                <div className="text-blue-200">Total Laporan</div>
                            </div>
                            <div className="p-4">
                                <div className="text-4xl font-bold mb-2">{loading ? '...' : `${stats.totalUsers}+`}</div>
                                <div className="text-blue-200">Pengguna Terdaftar</div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <motion.section 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Tim Kami</h2>
                    <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
                        Kami adalah sekelompok individu yang bersemangat dalam memanfaatkan teknologi untuk menciptakan dampak sosial yang nyata.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <TeamMember name="Muhammad Adhiyasa" role="Fullstack Developer" imageUrl="/images/adhiyasa.jpg" delay={0.1} />
                        <TeamMember name="Varel Antoni" role="Machine Learning Developer" imageUrl="/images/varel.jpg" delay={0.3} />
                        <TeamMember name="Rivaro Farrelino" role="Machine Learning Developer" imageUrl="/images/rivaro.jpg" delay={0.5} />
                    </div>
                </motion.section>

                <motion.section 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Nilai-Nilai Kami</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <ValueCard icon={<FaHandsHelping size={28} />} title="Kolaborasi" delay={0.1}>
                            Kami percaya solusi terbaik datang dari kerja sama antara warga, pemerintah, dan berbagai pemangku kepentingan.
                        </ValueCard>
                        <ValueCard icon={<FaChartLine size={28} />} title="Transparansi" delay={0.3}>
                            Setiap laporan dan proses penanganannya dapat dipantau oleh publik untuk memastikan akuntabilitas.
                        </ValueCard>
                        <ValueCard icon={<FaUsers size={28} />} title="Inklusivitas" delay={0.5}>
                            Platform kami dirancang untuk dapat diakses dan digunakan oleh semua lapisan masyarakat.
                        </ValueCard>
                    </div>
                </motion.section>
            </main>
        </div>
    );
};

export default AboutUs;