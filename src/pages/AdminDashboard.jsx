// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import UserManagement from '../components/admin/UserManagement';
import ReportManagement from '../components/admin/ReportManagement';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('reports');

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Kelola laporan dan pengguna sistem</p>
                </motion.div>

                {/* Tab Navigation */}
                <div className="mb-8">
                    <nav className="flex space-x-2" aria-label="Tabs">
                        <motion.button
                            onClick={() => setActiveTab('reports')}
                            className={`${
                                activeTab === 'reports'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:text-gray-800'
                            } px-4 py-2 rounded-lg font-medium text-sm relative`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Manajemen Laporan
                            {activeTab === 'reports' && (
                                <motion.div 
                                    layoutId="tabIndicator"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 rounded-b-lg"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </motion.button>
                        <motion.button
                            onClick={() => setActiveTab('users')}
                            className={`${
                                activeTab === 'users'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:text-gray-800'
                            } px-4 py-2 rounded-lg font-medium text-sm relative`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Manajemen Pengguna
                            {activeTab === 'users' && (
                                <motion.div 
                                    layoutId="tabIndicator"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 rounded-b-lg"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    </nav>
                </div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'reports' && <ReportManagement />}
                    {activeTab === 'users' && <UserManagement />}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;