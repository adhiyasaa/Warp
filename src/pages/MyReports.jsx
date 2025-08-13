import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const ReportCard = ({ report }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row mb-4">
        <img src={report.image_url} alt={report.title} className="w-full sm:w-48 h-48 sm:h-auto object-cover" />
        <div className="p-4 flex flex-col justify-between">
            <div>
                <h3 className="font-bold text-xl mb-2 text-gray-800">{report.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{report.description}</p>
                <p className="text-gray-500 text-xs">Tanggal Kejadian: {report.event_date}</p>
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
                console.error("Error fetching user reports: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [currentUser]);

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Daftar Laporan Anda</h1>
                {loading ? (
                    <p>Memuat laporan...</p>
                ) : reports.length > 0 ? (
                    <div>
                        {reports.map(report => <ReportCard key={report.id} report={report} />)}
                    </div>
                ) : (
                    <p className="text-gray-600">Anda belum pernah mengirim laporan.</p>
                )}
            </div>
        </div>
    );
};

export default MyReports;