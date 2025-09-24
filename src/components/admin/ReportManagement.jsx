// src/components/admin/ReportManagement.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { motion } from 'framer-motion';

const statusColors = {
  'Menunggu Verifikasi': 'bg-yellow-100 text-yellow-800',
  'Diproses': 'bg-blue-100 text-blue-800',
  'Selesai': 'bg-green-100 text-green-800'
};

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setReports(data);
        } catch (error) {
            alert('Error fetching reports: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleFieldChange = async (reportId, field, value) => {
        const { error } = await supabase
            .from('reports')
            .update({ [field]: value })
            .eq('id', reportId);
        
        if (error) {
            alert(`Gagal mengubah ${field}: ` + error.message);
        } else {
            setReports(reports.map(r => r.id === reportId ? { ...r, [field]: value } : r));
        }
    };

    const handleDelete = async (reportId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini secara permanen?')) {
            const { error } = await supabase.from('reports').delete().eq('id', reportId);
            if (error) {
                alert('Gagal menghapus laporan: ' + error.message);
            } else {
                setReports(reports.filter(r => r.id !== reportId));
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manajemen Laporan</h2>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Total: {reports.length} Laporan
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelapor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tingkat Kerusakan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reports.map((report) => (
                            <motion.tr 
                                key={report.id}
                                whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
                                className="transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900 line-clamp-1">{report.title}</div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select 
                                        value={report.damage_level || 'Tidak diketahui'} 
                                        onChange={(e) => handleFieldChange(report.id, 'damage_level', e.target.value)}
                                        className={`p-2 rounded-md text-sm font-medium border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${statusColors[report.status] || 'bg-gray-100 text-gray-800'}`}
                                    >
                                        <option value="Tidak diketahui">Tidak diketahui</option>
                                        <option value="Ringan">Ringan</option>
                                        <option value="Sedang">Sedang</option>
                                        <option value="Berat">Berat</option>
                                        <option value="Tidak ada kerusakan">Tidak ada kerusakan</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select 
                                        value={report.status} 
                                        onChange={(e) => handleFieldChange(report.id, 'status', e.target.value)}
                                        className={`p-2 rounded-md text-sm font-medium border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${statusColors[report.status] || 'bg-gray-100 text-gray-800'}`}
                                    >
                                        <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                        <option value="Diproses">Diproses</option>
                                        <option value="Selesai">Selesai</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <motion.button 
                                        onClick={() => handleDelete(report.id)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </motion.button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <div className="text-yellow-800 font-medium">Menunggu Verifikasi</div>
                    <div className="text-2xl font-bold text-yellow-600">
                        {reports.filter(r => r.status === 'Menunggu Verifikasi').length}
                    </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="text-blue-800 font-medium">Sedang Diproses</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {reports.filter(r => r.status === 'Diproses').length}
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="text-green-800 font-medium">Selesai</div>
                    <div className="text-2xl font-bold text-green-600">
                        {reports.filter(r => r.status === 'Selesai').length}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportManagement;
