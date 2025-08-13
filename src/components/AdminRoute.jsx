// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile'; // Pastikan hook profil di-import

const AdminRoute = () => {
    const { currentUser, loading: authLoading } = useAuth();
    const { profile, loading: profileLoading } = useProfile(currentUser?.id);

    // Bagian ini sangat penting. Ia memaksa komponen untuk menunggu.
    if (authLoading || profileLoading) {
        return <div className="flex items-center justify-center h-screen">Memverifikasi akses...</div>;
    }

    // Arahkan ke homepage jika tidak login ATAU jika role bukan admin
    if (!currentUser || profile?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // Jika semua syarat terpenuhi, tampilkan halaman admin
    return <Outlet />;
};

export default AdminRoute;