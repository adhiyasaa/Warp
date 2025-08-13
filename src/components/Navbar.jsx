// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { currentUser } = useAuth();
  const { profile, loading: profileLoading } = useProfile(currentUser?.id);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#001722] shadow-lg' : 'bg-gradient-to-b from-black/70 to-transparent'}`}>
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-white font-serif hover:text-[#005D88] transition-colors"
            >
              LaporCepat
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-white hover:text-[#005D88] transition-colors relative group">Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#005D88] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/lapor" className="text-white hover:text-[#005D88] transition-colors relative group">Buat Laporan
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#005D88] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/semua-laporan" className="text-white hover:text-[#005D88] transition-colors relative group">Laporan Terkini
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#005D88] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/about" className="text-white hover:text-[#005D88] transition-colors relative group">Tentang Kami
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#005D88] group-hover:w-full transition-all duration-300"></span>
            </Link>
            {profile?.role === 'admin' && (
                <Link to="/admin" className="text-white hover:text-[#005D88] transition-colors relative group">Dashboard Admin
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#005D88] group-hover:w-full transition-all duration-300"></span>
                </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none"
            >
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
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#00293C] flex items-center justify-center text-white font-bold">
                    {profile?.username?.charAt(0).toUpperCase() || currentUser.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white text-sm">
                    {profileLoading ? '...' : profile?.username || currentUser.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="border-2 border-red-500 text-white px-4 py-1 rounded-md hover:bg-red-500 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-[#005D88] transition-colors">Masuk</Link>
                <Link
                  to="/register"
                  className="bg-[#00293C] hover:bg-[#005D88] text-white px-4 py-2 rounded-md transition-colors"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 space-y-4 pb-4"
          >
            <Link to="/" className="block text-white hover:text-[#005D88] transition-colors py-2">Home</Link>
            <Link to="/lapor" className="block text-white hover:text-[#005D88] transition-colors py-2">Buat Laporan</Link>
            <Link to="/semua-laporan" className="block text-white hover:text-[#005D88] transition-colors py-2">Laporan Terkini</Link>
            <Link to="/about" className="block text-white hover:text-[#005D88] transition-colors py-2">Tentang Kami</Link>
            {profile?.role === 'admin' && (
                <Link to="/admin" className="block text-white hover:text-[#005D88] transition-colors py-2">Dashboard Admin</Link>
            )}
            
            <div className="pt-4 border-t border-gray-700">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#005D88] flex items-center justify-center text-white font-bold">
                      {profile?.username?.charAt(0).toUpperCase() || currentUser.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white">
                      {profileLoading ? '...' : profile?.username || currentUser.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full border-2 border-red-500 text-white px-4 py-2 rounded-md hover:bg-red-500 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/login" className="text-center text-white hover:text-[#005D88] transition-colors py-2">Masuk</Link>
                  <Link
                    to="/register"
                    className="bg-[#00293C] hover:bg-[#005D88] text-white px-4 py-2 rounded-md transition-colors text-center"
                  >
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