import { NextApiRequest, NextApiResponse } from 'next';
import * as nacl from 'tweetnacl';
import bs58 from 'bs58';
import { createServerSupabaseClient } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { wallet, message, signature } = req.body;

    if (!wallet || !message || !signature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert signature to Uint8Array if it's an array
    let signatureBytes: Uint8Array;
    if (Array.isArray(signature)) {
      signatureBytes = Uint8Array.from(signature);
    } else {
      // Assume it's a base58 encoded string
      try {
        signatureBytes = bs58.decode(signature);
      } catch (error) {
        console.error('Error decoding signature:', error);
        return res.status(400).json({ error: 'Invalid signature format' });
      }
    }

    // Convert wallet to Uint8Array
    let publicKeyBytes: Uint8Array;
    try {
      publicKeyBytes = bs58.decode(wallet);
    } catch (error) {
      console.error('Error decoding wallet address:', error);
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    // Verify the signature
    const isValid = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      signatureBytes,
      publicKeyBytes
    );

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    try {
      // Initialize Supabase client
      const supabase = createServerSupabaseClient();

      // Check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('wallet', wallet)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        console.error('Error fetching user:', fetchError);
        
        // If there's a database error but we've verified the signature,
        // we can still authenticate the user with a session cookie
        res.setHeader(
          'Set-Cookie',
          `auth_token=${wallet}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}` // 1 week
        );
        
        return res.status(200).json({ 
          success: true, 
          user: { wallet },
          warning: 'Database error occurred, but authentication succeeded'
        });
      }

      let userData;

      if (!existingUser) {
        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([
            { 
              wallet, 
              last_login: new Date().toISOString() 
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          
          // If we can't create the user but verified the signature,
          // we can still authenticate with a session cookie
          res.setHeader(
            'Set-Cookie',
            `auth_token=${wallet}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}` // 1 week
          );
          
          return res.status(200).json({ 
            success: true, 
            user: { wallet },
            warning: 'User creation failed, but authentication succeeded'
          });
        }

        userData = newUser;
      } else {
        // Update existing user's last login
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('wallet', wallet)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating user:', updateError);
          userData = existingUser;
        } else {
          userData = updatedUser;
        }
      }

      // Set auth cookie
      res.setHeader(
        'Set-Cookie',
        `auth_token=${wallet}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}` // 1 week
      );

      return res.status(200).json({ success: true, user: userData });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // If there's a database error but we've verified the signature,
      // we can still authenticate the user with a session cookie
      res.setHeader(
        'Set-Cookie',
        `auth_token=${wallet}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}` // 1 week
      );
      
      return res.status(200).json({ 
        success: true, 
        user: { wallet },
        warning: 'Database error occurred, but authentication succeeded'
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
