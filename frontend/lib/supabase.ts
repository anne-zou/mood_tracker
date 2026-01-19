import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

// Configure WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

const supabaseUrl = 'https://qzuqovgumnsyfswmhhxg.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // For web, detect session in URL; for mobile, use expo-web-browser
    detectSessionInUrl: Platform.OS === 'web',
    // PKCE is the recommended secure flow for both web and mobile
    flowType: 'pkce',
  },
});
