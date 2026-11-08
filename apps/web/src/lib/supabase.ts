import {createClient} from '@supabase/supabase-js';
import {checkSupabaseConfig} from './check-supabase-config.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const problems = checkSupabaseConfig(supabaseUrl, supabaseKey);

if (problems.length > 0) {
  throw new Error(
    `${problems.join(' ')} Copy apps/web/.env.example to apps/web/.env.local and fill it in.`
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
