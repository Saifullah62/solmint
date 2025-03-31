'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface Account {
  address: string;
  balance: number;
  network: string;
}

export const useAccount = () => {
  const { publicKey, connected } = useWallet();
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!publicKey || !connected) {
        setAccount(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // In a real implementation, you would fetch the balance from the Solana network
        // For now, we'll just set a placeholder value
        const address = publicKey.toString();
        const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
        
        setAccount({
          address,
          balance: 0, // Placeholder
          network,
        });
      } catch (err) {
        console.error('Error fetching account details:', err);
        setError('Failed to load account details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountDetails();
  }, [publicKey, connected]);

  return {
    account,
    isLoading,
    error,
  };
};
