// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

function useProfile(userId) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true); // <-- Kita akan gunakan ini

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, role')
                    .eq('id', userId)
                    .single();
                
                if (error) throw error;
                
                setProfile(data);
            } catch (error) {
                console.error("Hook useProfile gagal mengambil data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    return { profile, loading }; // <-- Pastikan loading di-return
}

export default useProfile;