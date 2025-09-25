// src/components/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { motion } from 'framer-motion';

const UserManagement = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProfile, setEditingProfile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProfiles = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('profiles').select('*').order('username');
            if (error) throw error;
            setProfiles(data);
        } catch (error) {
            console.error('Error fetching profiles:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const handleEditClick = (profile) => {
        setEditingProfile(profile);
        setIsModalOpen(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const { error } = await supabase
            .from('profiles')
            .update({ username: editingProfile.username, role: editingProfile.role })
            .eq('id', editingProfile.id);

        if (error) {
            alert('Gagal mengupdate profil: ' + error.message);
        } else {
            alert('Profil berhasil diupdate!');
            setIsModalOpen(false);
            fetchProfiles();
        }
    };

    const handleDeleteUser = async (profileId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus profil pengguna ini? Ini tidak bisa dibatalkan.')) {
            const { error } = await supabase.from('profiles').delete().eq('id', profileId);
            if (error) {
                alert('Gagal menghapus profil: ' + error.message);
            } else {
                fetchProfiles();
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
        <>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h2>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Total: {profiles.length} Pengguna
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {profiles.map((profile) => (
                                <motion.tr 
                                    key={profile.id}
                                    whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
                                    className="transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {profile.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{profile.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${profile.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {profile.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{profile.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <motion.button 
                                            onClick={() => handleEditClick(profile)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </motion.button>
                                        <motion.button 
                                            onClick={() => handleDeleteUser(profile.id)}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="text-blue-800 font-medium">Admin</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {profiles.filter(p => p.role === 'admin').length}
                        </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <div className="text-green-800 font-medium">User Biasa</div>
                        <div className="text-2xl font-bold text-green-600">
                            {profiles.filter(p => p.role === 'user').length}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Modal Edit */}
            {isModalOpen && editingProfile && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Edit Profil Pengguna</h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdateUser}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Username</label>
                                <input 
                                    type="text"
                                    value={editingProfile.username}
                                    onChange={(e) => setEditingProfile({ ...editingProfile, username: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">Role</label>
                                <select 
                                    value={editingProfile.role}
                                    onChange={(e) => setEditingProfile({ ...editingProfile, role: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <motion.button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium"
                                >
                                    Batal
                                </motion.button>
                                <motion.button 
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium"
                                >
                                    Simpan Perubahan
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
};

export default UserManagement;
