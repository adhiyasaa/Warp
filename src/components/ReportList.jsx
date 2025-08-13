// src/components/ReportList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import ReportCard from './ReportCard'; // <-- Import komponen baru

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Query sederhana tanpa filter, hanya 8 laporan terbaru
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;
        if (data) setReports(data);
      } catch (error) {
        console.error("Error fetching reports: ", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-t-3xl -mt-10 relative z-10 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Memuat laporan terbaru...</p>
        </div>
      </div>
    );
  }

return (
    <section className="bg-white rounded-t-3xl -mt-10 relative z-10 py-16">
      <div className="container mx-auto px-6">
        {/* Tombol filter sudah dihapus */}
        {reports.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">Tidak ada laporan ditemukan</h3>
            <p className="text-gray-500 mb-6">Tidak ada laporan dengan status ini saat ini</p>
            <Link 
              to="/lapor" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
            >
              Buat Laporan Pertama
            </Link>
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            to="/semua-laporan" 
            className="inline-flex items-center text-cyan-800 font-medium hover:text-cyan-900 transition-colors"
          >
            Lihat Semua Laporan
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReportList;