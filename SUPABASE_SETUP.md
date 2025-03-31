# Supabase Setup for SOLMINT

This guide will help you set up your Supabase project for the SOLMINT application's wallet authentication system.

## 1. Create Database Tables

Log in to your Supabase dashboard at [app.supabase.com](https://app.supabase.com) and navigate to your project (`mfefscpqwwitwmjbktbq`).

### Users Table

Run the following SQL in the SQL Editor to create the necessary tables:

```sql
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
```

## 2. Get the Correct Service Role Key

The service role key you provided (`sbp_46786ebf8efab1bb9ba1140f751e0769d65267eb`) is a Supabase Management API key, not the service role JWT needed for database access.

To get the correct service role key:

1. Go to your Supabase project dashboard
2. Navigate to Project Settings → API
3. Under "Project API keys", find the "service_role" key (it starts with "ey...")
4. Copy this key and update your `.env.local` file:

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANT**: The service role key has full access to your database, bypassing Row Level Security. Never expose it to the client or include it in client-side code.

## 3. Testing Your Setup

After setting up the database and updating your service role key:

1. Restart your development server
2. Navigate to `/auth-demo` in your application
3. Try connecting your wallet and signing in
4. Check the Supabase Table Editor to see if user records are being created

## Troubleshooting

If you encounter errors:

- **"Invalid JWT"**: Make sure you're using the JWT token (starts with "ey..."), not the Management API key (starts with "sbp_")
- **"Requested path is invalid"**: Check that your Supabase URL is correct
- **Database errors**: Verify that the users table has been created with the correct schema

The application has been designed to gracefully handle database errors, so authentication will still work even if there are issues with the database connection. However, for full functionality, please set up the database correctly.
