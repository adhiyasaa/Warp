import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => (
  <div 
    className="relative bg-cover bg-center h-screen flex items-center justify-center text-white text-center overflow-hidden" 
    style={{ backgroundImage: "url('/images/hero.png')" }} 
  >
    {/* Overlay for better text readability */}
    <div className="absolute inset-0 bg-black/30"></div>
    
    {/* Animated floating elements */}
    <div className="absolute top-20 left-20 w-16 h-16 rounded-full bg-white/10 animate-float1"></div>
    <div className="absolute bottom-40 right-32 w-24 h-24 rounded-full bg-blue-400/20 animate-float2"></div>
    <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-white/15 animate-float3"></div>
    
    <div className="relative z-10 px-4">
      <h2 className="text-6xl font-bold mb-4 drop-shadow-lg shadow-black animate-fadeIn">
        Wujudkan Kota Lebih Baik,
      </h2>
      <h3 className="text-6xl font-bold mb-8 drop-shadow-lg shadow-black animate-fadeIn delay-100">
        Dimulai dari Laporan Anda!
      </h3>
      <p className="text-xl mb-12 max-w-2xl mx-auto animate-fadeIn delay-200">
        Bergabung dengan <span className="font-semibold text-blue-300">5,000+ warga</span> yang telah berkontribusi untuk perbaikan kota ini
      </p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fadeIn delay-300">
        <Link 
          to="/lapor"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Lapor Sekarang!
        </Link>
        <button className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-4 px-8 rounded-full text-2xl transition-all duration-300 transform hover:scale-105">
          Pelajari Lebih Lanjut
        </button>
      </div>
      
      {/* Stats bar */}
      <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto animate-fadeIn delay-500">
        <div className="flex flex-wrap justify-center gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-300">1,250+</div>
            <div className="text-sm uppercase tracking-wider">Laporan Diproses</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-300">85%</div>
            <div className="text-sm uppercase tracking-wider">Terselesaikan</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-300">24</div>
            <div className="text-sm uppercase tracking-wider">Jam Respon</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Hero;