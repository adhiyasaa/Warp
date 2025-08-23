// src/pages/MyReports.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- 1. Import Link
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const ReportCard = ({ report }) => (
    // 2. Bungkus seluruh kartu dengan komponen Link
    <Link to={`/laporan/${report.id}`} className="block group">
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col sm:flex-row mb-4">
            <img src={report.image_url} alt={report.title} className="w-full sm:w-48 h-48 sm:h-auto object-cover" />
            <div className="p-4 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">{report.title}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{report.description}</p>
                    <p className="text-gray-500 text-xs">Tanggal Kejadian: {new Date(report.event_date).toLocaleDateString('id-ID')}</p>
                </div>
                <div className="mt-4">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        report.status === 'Selesai' ? 'bg-green-200 text-green-800' :
                        report.status === 'Diproses' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                    }`}>
                        {report.status}
                    </span>
                </div>
            </div>
        </div>
    </Link>
);

const MyReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchReports = async () => {
            if (!currentUser) return;

            try {
                const { data, error } = await supabase
                    .from('reports')
                    .select('*')
                    .eq('user_id', currentUser.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) setReports(data);

            } catch (error) {
                console.error("Error fetching user reports: ", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [currentUser]);

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="container mx-auto px-4 pt-28 pb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Laporan Saya</h1>
                {loading ? (
                    <p>Memuat laporan...</p>
                ) : reports.length > 0 ? (
                    <div className="space-y-6">
                        {reports.map(report => <ReportCard key={report.id} report={report} />)}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-medium text-gray-600">Anda belum pernah mengirim laporan.</h3>
                        <Link 
                            to="/lapor" 
                            className="mt-4 inline-block bg-blue-600 text-white font-medium py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
                        >
                            Buat Laporan Pertama
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReports;