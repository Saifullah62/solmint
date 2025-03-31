import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get auth token from cookies
    const authToken = req.cookies.auth_token;

    if (!authToken) {
      return res.status(200).json({ user: null });
    }

    try {
      // Initialize Supabase client
      const supabase = createServerSupabaseClient();

      // Get user data from Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet', authToken)
        .single();

      if (error) {
        console.warn('Error fetching user data:', error);
        // Return minimal user data based on wallet address
        return res.status(200).json({ 
          user: { wallet: authToken },
          warning: 'Limited user data available due to database error'
        });
      }

      return res.status(200).json({ user: data });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Return minimal user data based on wallet address
      return res.status(200).json({ 
        user: { wallet: authToken },
        warning: 'Limited user data available due to database error'
      });
    }
  } catch (error) {
    console.error('Session error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
