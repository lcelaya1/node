import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const fallbackSupabaseUrl = "https://wjohtvugahrzjkgydwxk.supabase.co";
const fallbackSupabaseAnonKey = "sb_publishable_PU9eQjH2APMfwWeSOj8rqA_ZfNgY0I-";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || fallbackSupabaseUrl;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || fallbackSupabaseAnonKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const globalWithSupabase = globalThis as typeof globalThis & {
  __NODE_APP_SUPABASE__?: SupabaseClient;
};

function createSupabaseClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Una sola instancia + más margen reduce NavigatorLockAcquireTimeoutError cuando
      // varias llamadas a getUser/getSession compiten (p. ej. HMR / varias pantallas montadas).
      lockAcquireTimeout: 20_000,
    },
  });
}

/** Un solo cliente por pestaña para no duplicar GoTrueClient ni el candado Web Locks `sb-*-auth-token`. */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? (globalWithSupabase.__NODE_APP_SUPABASE__ ??= createSupabaseClient())
  : null;
