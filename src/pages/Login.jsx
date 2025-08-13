import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

// Background elements component
const BackgroundElements = () => {
  const elements = [
    { size: '20vw', top: '5%', left: '10%', color: 'rgba(0, 180, 216, 0.15)', delay: 0 },
    { size: '15vw', top: '70%', left: '25%', color: 'rgba(48, 104, 142, 0.2)', delay: 0.5 },
    { size: '25vw', top: '15%', left: '70%', color: 'rgba(0, 119, 182, 0.2)', delay: 1 },
    { size: '12vw', top: '80%', left: '80%', color: 'rgba(72, 202, 228, 0.15)', delay: 1.5 },
    { size: '18vw', top: '30%', left: '40%', color: 'rgba(3, 4, 94, 0.1)', delay: 2 },
    { size: '22vw', top: '60%', left: '60%', color: 'rgba(0, 150, 199, 0.15)', delay: 2.5 }
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full filter blur-[60px]"
          style={{
            width: el.size,
            height: el.size,
            top: el.top,
            left: el.left,
            backgroundColor: el.color
          }}
          initial={{ y: 0, x: 0 }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0]
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: el.delay
          }}
        />
      ))}
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGgyMHYyMEgwek0yMCAyMGgyMHYyMEgyMHpNMjAgMjBoMjB2MjBIMjB6TTAgMjBoMjB2MjBIMHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-10" />
    </div>
  );
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError(error.message);
        } else {
            navigate('/');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#001722] to-[#003F5C] relative overflow-hidden">
            <Navbar />
            
            {/* Enhanced background */}
            <BackgroundElements />
            
            {/* Floating particles */}
            <div className="absolute inset-0 z-0">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white/5"
                        style={{
                            width: `${Math.random() * 5 + 2}px`,
                            height: `${Math.random() * 5 + 2}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0, 0.5, 0],
                            y: `${Math.random() * 100 - 50}px`,
                            x: `${Math.random() * 100 - 50}px`
                        }}
                        transition={{
                            duration: Math.random() * 20 + 10,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            <div className="min-h-screen flex items-center justify-center pt-16 px-4">
                <motion.div 
                    className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md relative z-10 border border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                >
                    <motion.div 
                        className="text-center mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                            Login LaporCepat
                        </h1>
                        <motion.p 
                            className="text-blue-200/80"
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            Silakan masuk untuk melanjutkan
                        </motion.p>
                    </motion.div>
                    
                    {error && (
                        <motion.div 
                            className="bg-red-500/30 border border-red-400 text-red-100 px-4 py-3 rounded-lg mb-6 text-center"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <label className="block text-white/80 text-sm font-medium" htmlFor="email">
                                Email
                            </label>
                            <motion.input 
                                id="email" 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Masukkan email" 
                                required 
                                className="w-full p-4 bg-[#E8F0FE] text-gray-800 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 placeholder-gray-500" 
                                whileFocus={{ scale: 1.01 }}
                            />
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <label className="block text-white/80 text-sm font-medium" htmlFor="password">
                                Password
                            </label>
                            <motion.input 
                                id="password" 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="Masukkan password" 
                                required 
                                className="w-full p-4 bg-[#E8F0FE] text-gray-800 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 placeholder-gray-500" 
                                whileFocus={{ scale: 1.01 }}
                            />
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <motion.button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full p-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg flex justify-center items-center disabled:opacity-80"
                                whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading ? (
                                    <>
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="inline-block mr-3"
                                        >
                                            ↻
                                        </motion.span>
                                        Memverifikasi...
                                    </>
                                ) : 'Login'}
                            </motion.button>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="text-center text-sm text-white/70 pt-4 border-t border-white/10"
                        >
                            Belum punya akun?{' '}
                            <Link 
                                to="/register" 
                                className="font-semibold text-blue-300 hover:text-white transition-colors duration-200"
                            >
                                Daftar di sini
                            </Link>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;