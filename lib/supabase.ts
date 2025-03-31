import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with public environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a Supabase client for use on the client-side
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to create a Supabase client with service role key for server-side operations
export const createServerSupabaseClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // If service role key is not available, fall back to anon key with warning
  if (!serviceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to anon key with limited permissions.');
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  
  return createClient(supabaseUrl, serviceRoleKey);
};
