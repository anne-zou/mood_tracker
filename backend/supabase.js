import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qzuqovgumnsyfswmhhxg.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const requireSupabase = () => {
  if (!supabase) {
    throw new Error('SUPABASE_KEY is not set');
  }
  return supabase;
};

export { requireSupabase };
export default supabase;
