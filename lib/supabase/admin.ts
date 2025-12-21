import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Note: SUPABASE_SERVICE_ROLE_KEY must be in .env.local
// This client bypasses Row Level Security (RLS) - Use with caution!
export const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);
