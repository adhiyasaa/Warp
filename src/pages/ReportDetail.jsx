// src/pages/ReportDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';

const ReportDetail = () => {
    const { id } = useParams(); // Mengambil ID dari URL
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const { data, error } = await supabase
                    .from('reports')
                    .select('*')
                    .eq('id', id)
                    .single(); // .single() untuk mengambil satu baris saja

                if (error) throw error;
                if (data) setReport(data);
            } catch (error) {
                console.error('Error fetching report detail:', error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchReport();
    }, [id]);

    if (loading) {
        return <div className="text-center py-40">Memuat detail laporan...</div>;
    }

    if (!report) {
        return <div className="text-center py-40">Laporan tidak ditemukan.</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    <img src={report.image_url} alt={report.title} className="w-full h-96 object-cover" />
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{report.title}</h1>
                        <p className="text-sm text-gray-500 mb-4">
                            Dilaporkan oleh {report.username} pada {new Date(report.created_at).toLocaleDateString('id-ID')}
                        </p>
                        <p className="text-gray-700 mb-6">{report.description}</p>
                        
                        <div className="flex items-center space-x-4">
                            <span className="font-semibold text-gray-800">Status:</span>
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
            </div>
        </div>
    );
};

export default ReportDetail;