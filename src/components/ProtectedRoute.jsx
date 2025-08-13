// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { currentUser } = useAuth();

    // Jika user tidak login, arahkan ke halaman login
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // Jika user login, tampilkan halaman yang diminta
    return <Outlet />;
};

export default ProtectedRoute;