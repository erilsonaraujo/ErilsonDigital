import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Key missing. Check .env');
}

// Fallback for build time or missing env vars
const isBuildTime = typeof window === 'undefined' && (!supabaseUrl || !supabaseAnonKey);

export const supabase = isBuildTime
    ? {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
            signOut: () => Promise.resolve()
        },
        from: () => ({ select: () => Promise.resolve({ data: [], error: null }) })
    } as any
    : createClient(supabaseUrl, supabaseAnonKey);
