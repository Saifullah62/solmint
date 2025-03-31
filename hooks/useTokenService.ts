'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/components/WalletContextProvider';
import { TokenData } from '@/services/tokenService';

export function useTokenService() {
  const { connected, publicKey } = useWallet();
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's tokens
  const fetchUserTokens = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // If the user is not connected, return empty array
      if (!connected) {
        setTokens([]);
        setIsLoading(false);
        return;
      }
      
      // Fetch tokens from the API
      const response = await fetch(`/api/user/tokens?wallet=${publicKey}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tokens');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTokens(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch tokens');
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching user tokens:', err);
      setError(err instanceof Error ? err.message : 'Failed to load your tokens. Please try again later.');
      setIsLoading(false);
    }
  }, [connected, publicKey]);

  // Fetch tokens on mount and when wallet connection changes
  useEffect(() => {
    fetchUserTokens();
  }, [fetchUserTokens]);

  // Refresh tokens manually
  const refreshTokens = () => {
    fetchUserTokens();
  };

  // Get token by ID
  const getTokenById = (id: string) => {
    return tokens.find(token => token.id === id);
  };

  // Get token by symbol
  const getTokenBySymbol = (symbol: string) => {
    return tokens.find(token => token.symbol === symbol);
  };

  return {
    tokens,
    isLoading,
    error,
    refreshTokens,
    getTokenById,
    getTokenBySymbol,
    hasTokens: tokens.length > 0
  };
}
