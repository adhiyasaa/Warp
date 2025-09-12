// src/components/Footer.jsx
import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About Column */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <img src="/images/logo.png" alt="warp Logo" className="h-10 w-auto mb-4" />
            <p className="text-gray-400 mb-6 leading-relaxed">
              Memberdayakan warga Malang untuk membangun kota yang lebih baik melalui laporan yang cepat dan transparan.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaInstagram size={20} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-xl font-bold mb-6 text-white">Navigasi Cepat</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/lapor" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Buat Laporan
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/semua-laporan" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Laporan Terkini
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-xl font-bold mb-6 text-white">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 text-blue-400 mr-4 flex-shrink-0" />
                <span className="text-gray-400">Jl. Veteran, Malang, Jawa Timur, Indonesia</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-blue-400 mr-4 flex-shrink-0" />
                <a href="mailto:kontak@warp.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                  warp@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-blue-400 mr-4 flex-shrink-0" />
                <a href="tel:+621234567890" className="text-gray-400 hover:text-blue-400 transition-colors">
                  (+62) 123-4567-890
                </a>
              </li>
            </ul>
          </motion.div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-500 text-sm"
          >
            &copy; {new Date().getFullYear()} warp. All rights reserved. | 
            <a href="#" className="hover:text-blue-400 ml-2 transition-colors">Kebijakan Privasi</a> | 
            <a href="#" className="hover:text-blue-400 ml-2 transition-colors">Syarat & Ketentuan</a>
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-gray-600 text-xs mt-2"
          >
            warga aduan realtime & percaya
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;