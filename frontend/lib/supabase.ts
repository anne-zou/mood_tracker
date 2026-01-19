import { createClient } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';

// Configure WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

const supabaseUrl = 'https://qzuqovgumnsyfswmhhxg.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use expo-web-browser for OAuth redirects
    detectSessionInUrl: false,
  },
});
