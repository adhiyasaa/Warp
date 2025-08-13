// src/context/AuthContext.jsx (Biarkan seperti ini)
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            setCurrentUser(session?.user ?? null);
            setLoading(false); 
        });
    }, []);

    const value = { currentUser, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}