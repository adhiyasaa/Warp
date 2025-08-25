import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';

const NavLink = ({ to, children }) => (
    <Link to={to} className="text-white hover:text-cyan-400 transition-colors relative group">
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
    </Link>
);

const Navbar = () => {
    const { currentUser } = useAuth();
    const { profile, loading: profileLoading } = useProfile(currentUser?.id);
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const reportDropdownTimeoutRef = useRef(null);
    const profileDropdownTimeoutRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const handleReportMouseEnter = () => {
        clearTimeout(reportDropdownTimeoutRef.current);
        setReportDropdownOpen(true);
    };
    const handleReportMouseLeave = () => {
        reportDropdownTimeoutRef.current = setTimeout(() => setReportDropdownOpen(false), 200);
    };

    const handleProfileMouseEnter = () => {
        clearTimeout(profileDropdownTimeoutRef.current);
        setProfileDropdownOpen(true);
    };
    const handleProfileMouseLeave = () => {
        profileDropdownTimeoutRef.current = setTimeout(() => setProfileDropdownOpen(false), 200);
    };

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#001722] shadow-lg' : 'bg-gradient-to-b from-black/70 to-transparent'}`}>
            <div className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="text-3xl font-bold text-white font-serif hover:text-cyan-400 transition-colors">
                            <img src="/WARP_LOGO.png" alt="" />
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/lapor">Buat Laporan</NavLink>
                        
                        <div className="relative" onMouseEnter={handleReportMouseEnter} onMouseLeave={handleReportMouseLeave}>
                            <button className="text-white hover:text-cyan-400 transition-colors relative group flex items-center">
                                Laporan
                                <svg className={`w-4 h-4 ml-1 transition-transform duration-300 ${reportDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                <span className={`absolute bottom-0 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ${reportDropdownOpen ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </button>
                            {reportDropdownOpen && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#001722] rounded-md shadow-lg border border-cyan-400/20">
                                    <Link to="/semua-laporan" className="block px-4 py-3 text-white hover:bg-cyan-900/50 rounded-t-md">Laporan Terkini</Link>
                                </motion.div>
                            )}
                        </div>
                        
                        <NavLink to="/about">Tentang Kami</NavLink>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* User Actions */}
                    <div className="hidden md:flex space-x-6 items-center">
                        {currentUser ? (
                            <div className="relative" onMouseEnter={handleProfileMouseEnter} onMouseLeave={handleProfileMouseLeave}>
                                <div className="flex items-center space-x-3 cursor-pointer p-2">
                                    <div className="w-8 h-8 rounded-full bg-[#00293C] flex items-center justify-center text-white font-bold ring-2 ring-transparent group-hover:ring-cyan-400 transition-all">
                                        {profile?.username?.charAt(0).toUpperCase() || currentUser.email.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-white text-sm font-medium">
                                        {profileLoading ? '...' : profile?.username || currentUser.email}
                                    </span>
                                </div>
                                {profileDropdownOpen && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full right-0 mt-2 w-56 bg-[#001722] rounded-md shadow-lg border border-cyan-400/20">
                                        <div className="p-4 border-b border-gray-700">
                                            <p className="font-bold text-white truncate">{profile?.username || 'Pengguna'}</p>
                                            <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <Link to="/laporan-saya" className="block px-4 py-2 text-white hover:bg-cyan-900/50">Laporan Saya</Link>
                                            {profile?.role === 'admin' && (
                                                <Link to="/admin" className="block px-4 py-2 text-white hover:bg-cyan-900/50">Dashboard Admin</Link>
                                            )}
                                        </div>
                                        <div className="p-2 border-t border-gray-700">
                                            <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-md">
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-white hover:text-cyan-400 transition-colors">Masuk</Link>
                                <Link to="/register" className="bg-cyan-800 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition-colors">
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="md:hidden mt-4 space-y-2 pb-4">
                        <Link to="/" className="block text-white hover:text-cyan-400 transition-colors py-2">Home</Link>
                        <Link to="/lapor" className="block text-white hover:text-cyan-400 transition-colors py-2">Buat Laporan</Link>
                        <Link to="/semua-laporan" className="block text-white hover:text-cyan-400 transition-colors py-2">Laporan Terkini</Link>
                        <Link to="/about" className="block text-white hover:text-cyan-400 transition-colors py-2">Tentang Kami</Link>
                        
                        <div className="pt-4 border-t border-gray-700">
                            {currentUser ? (
                                <>
                                    <div className="flex items-center space-x-3 mb-4 px-2">
                                        <div className="w-8 h-8 rounded-full bg-[#005D88] flex items-center justify-center text-white font-bold">
                                            {profile?.username?.charAt(0).toUpperCase() || currentUser.email.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-white">
                                            {profileLoading ? '...' : profile?.username || currentUser.email}
                                        </span>
                                    </div>
                                    <Link to="/laporan-saya" className="block text-white hover:text-cyan-400 transition-colors py-2">Laporan Saya</Link>
                                    {profile?.role === 'admin' && (
                                        <Link to="/admin" className="block text-white hover:text-cyan-400 transition-colors py-2">Dashboard Admin</Link>
                                    )}
                                    <button onClick={handleLogout} className="w-full mt-2 text-left border-2 border-red-500 text-white px-4 py-2 rounded-md hover:bg-red-500 transition-colors">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to="/login" className="text-center text-white hover:text-cyan-400 transition-colors py-2">Masuk</Link>
                                    <Link to="/register" className="bg-cyan-800 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition-colors text-center">
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;