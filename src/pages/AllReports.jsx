// src/pages/AllReports.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import ReportCard from '../components/ReportCard'; 

const AllReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllReports = async () => {
            try {
                const { data, error } = await supabase
                    .from('reports')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) setReports(data);
            } catch (error) {
                console.error("Error fetching all reports:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAllReports();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="container mx-auto px-4 pt-28 pb-16">
                <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">Laporan Terkini</h1>
                <p className="text-gray-600 mb-12 text-center">Semua laporan yang telah dikirim oleh warga Malang.</p>
                
                {loading ? (
                    <p className="text-center">Memuat semua laporan...</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {reports.map(report => (
                            <ReportCard key={report.id} report={report} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllReports;