// src/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zdapdmmeemgadwlnwnhm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkYXBkbW1lZW1nYWR3bG53bmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MzMyODAsImV4cCI6MjA2OTUwOTI4MH0.jsVOY-ApwVo28GvO74sUklkVIMUFEUVLSZdIrz_rC8w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);