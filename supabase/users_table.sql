-- Create users table for wallet authentication
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet TEXT UNIQUE NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferences JSONB DEFAULT '{}'::jsonb,
  ai_history JSONB DEFAULT '{}'::jsonb
);

-- Create index on wallet for faster lookups
CREATE INDEX IF NOT EXISTS users_wallet_idx ON public.users (wallet);

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own data
CREATE POLICY user_read_own_data ON public.users
  FOR SELECT
  USING (wallet = current_user);

-- Create policy for users to update their own data
CREATE POLICY user_update_own_data ON public.users
  FOR UPDATE
  USING (wallet = current_user);

-- Allow the service role to manage all users
CREATE POLICY service_role_manage_users ON public.users
  FOR ALL
  TO service_role
  USING (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.users TO anon, authenticated, service_role;
