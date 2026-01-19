import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qzuqovgumnsyfswmhhxg.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error('SUPABASE_KEY is not set');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
