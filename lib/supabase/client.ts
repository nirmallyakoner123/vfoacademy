
import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Supabase client for client-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

// Use createBrowserClient to automatically handle cookies
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

// Admin client with service role key (server-side only)
export const getSupabaseAdmin = () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
    }

    return createClient<Database>(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};
