// src/pages/ReportDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const separateDescriptionAndDamageLevel = (text) => {
    const s = String(text).trim();

    const re = /^(.*?)(?:\s*Tingkat\s*Kerusakan\s*:\s*([A-Za-zÀ-ÖØ-öø-ÿ\s-]+))\s*\.?\s*$/i;
    const m = s.match(re);

    if (m) {
        const description = m[1].trim().replace(/\s+/g, ' ');
        const damageLevel = m[2].trim();
        return { description, damageLevel };
    }

    return { description: s, damageLevel: null};
};

const ReportDetail = () => {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const { data, error } = await supabase
                    .from('reports')
                    .select('*')
                    .eq('id', id)
                    .single();

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
        return (
            <div className="bg-gray-100 min-h-screen">
                <Navbar />
                <div className="text-center py-40">Memuat detail laporan...</div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="bg-gray-100 min-h-screen">
                <Navbar />
                <div className="text-center py-40">Laporan tidak ditemukan.</div>
            </div>
        );
    }
    
    const position = [report.latitude, report.longitude];

    const leftSectionText = separateDescriptionAndDamageLevel(report.description);

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Pastikan Navbar dirender agar z-index nya tetap bekerja */}
            <Navbar />
            <div className="container mx-auto px-4 pt-28 pb-12">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    <img src={report.image_url} alt={report.title} className="w-full h-96 object-cover" />
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{report.title}</h1>
                        <p className="text-sm text-gray-500 mb-6">
                            Dilaporkan oleh {report.username} pada {new Date(report.created_at).toLocaleDateString('id-ID')}
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-700 mb-2 border-b pb-2">Deskripsi Laporan</h2>
                                    <p className="text-gray-600 leading-relaxed">{leftSectionText.description || "Tidak ada deskripsi."}</p>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-700 mb-2 border-b pb-2">Tingkat Kerusakan</h2>
                                    <p className="text-gray-600 leading-relaxed">{leftSectionText.damageLevel || "Tidak ada data tingkat kerusakan."}</p>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Status</h2>
                                    <div className="flex items-center space-x-4">
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
                            
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">Lokasi Kejadian</h2>
                                {report.latitude && report.longitude ? (
                                    // Beri class 'relative' dan 'z-0' agar berada di bawah Navbar
                                    <div className="h-64 rounded-lg overflow-hidden relative z-0">
                                        <MapContainer center={position} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            />
                                            <Marker position={position}>
                                                <Popup>Lokasi laporan.</Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Data lokasi tidak tersedia untuk laporan ini.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetail;