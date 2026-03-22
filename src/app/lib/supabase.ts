import { createClient } from "@supabase/supabase-js";

const fallbackSupabaseUrl = "https://wjohtvugahrzjkgydwxk.supabase.co";
const fallbackSupabaseAnonKey = "sb_publishable_PU9eQjH2APMfwWeSOj8rqA_ZfNgY0I-";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || fallbackSupabaseUrl;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || fallbackSupabaseAnonKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
