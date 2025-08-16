import React from 'react';

const FeatureCard = ({ iconSrc, title, description, index }) => (
  <div className="flex flex-col items-center text-center px-4 group">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-md group-hover:blur-lg transition-all duration-500"></div>
      <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
        <img src={iconSrc} alt={title} className="h-12 w-12" />
      </div>
    </div>
    <h3 className="text-2xl font-bold mb-4 text-blue-100">{title}</h3>
    <p className="text-gray-300 leading-relaxed">{description}</p>

    </div>

);

const Features = () => {
  const features = [
    {
      iconSrc: "/images/icon-alert.png",
      title: "Temukan Permasalahan",
      description: "Identifikasi berbagai masalah infrastruktur kota seperti jalan berlubang, lampu jalan rusak, sampah menumpuk, atau fasilitas umum yang membutuhkan perbaikan. Aplikasi kami membantu Anda mengenali masalah dengan mudah."
    },
    {
      iconSrc: "/images/icon-pencil.png",
      title: "Laporkan Masalah",
      description: "Unggah foto beserta deskripsi jelas melalui platform kami. Sistem kami yang user-friendly memandu Anda langkah demi langkah untuk membuat laporan yang efektif dan informatif bagi petugas."
    },
    {
      iconSrc: "/images/icon-progress.png",
      title: "Pantau Proses",
      description: "Setiap laporan Anda akan mendapatkan nomor tracking unik. Anda dapat memantau perkembangan penanganan laporan secara real-time, dari penerimaan hingga penyelesaian."
    }
  ];

  return (
    <section className="pt-20 pb-28 text-white bg-gradient-to-b from-[#001722] to-[#00293C] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-400 blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-blue-500 blur-xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Bagaimana Kami Bekerja
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Sistem pelaporan terintegrasi kami memastikan setiap masalah mendapat perhatian dan penanganan tepat waktu
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              iconSrc={feature.iconSrc}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>

        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center mb-6">
            Laporan Terbaru dari Masyarakat
          </h2>
          <p className="text-xl text-blue-200 text-center max-w-3xl mx-auto ">
            Lihat berbagai masalah yang telah dilaporkan dan status penanganannya
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;