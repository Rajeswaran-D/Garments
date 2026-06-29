import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ovopqetlbjnetdgdxpfj.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92b3BxZXRsYmpuZXRkZ2R4cGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MDIwNDcsImV4cCI6MjA5ODI3ODA0N30.2mNycfgd3Ef12cqeqHmdqhNo-zZGPus5cgEZs5BqCmg';

export const supabase = createClient(supabaseUrl, supabaseKey);
