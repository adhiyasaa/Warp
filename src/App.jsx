
// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import Halaman
import Homepage from './pages/Homepage';
import Register from './pages/Register';
import Login from './pages/Login';
import AboutUs from './pages/AboutUs';
import ReportDetail from './pages/ReportDetail';
import MyReports from './pages/MyReports';
import ReportPage from './pages/ReportPage';
import AdminDashboard from './pages/AdminDashboard';
import AllReports from './pages/AllReports';
// Import Komponen
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';

// Komponen baru untuk mengatur layout
function AppContent() {
    const location = useLocation();
    // Daftar halaman di mana footer akan disembunyikan
    const hideFooterOnPages = ['/login', '/register'];
    const shouldShowFooter = !hideFooterOnPages.includes(location.pathname);

    return (
        <>
            <main>
                <Routes>
                    {/* Rute Publik */}
                    <Route path="/" element={<Homepage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/laporan/:id" element={<ReportDetail />} />
 <Route path="/semua-laporan" element={<AllReports />} />
                    {/* Rute yang Dilindungi */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/lapor" element={<ReportPage />} />
                        <Route path="/laporan-saya" element={<MyReports />} />
                    </Route>
                    
                    {/* Rute Khusus Admin */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Route>
                </Routes>
            </main>
            {shouldShowFooter && <Footer />}
        </>
    );
}

function App() {
    const { loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Memuat...</div>;
    }

    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
