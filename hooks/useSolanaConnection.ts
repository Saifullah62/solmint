import { Connection, clusterApiUrl } from '@solana/web3.js';
import { useAppStore } from '../store/useAppStore';
import { useMemo } from 'react';

export function useSolanaConnection() {
  const { network } = useAppStore();
  
  // Create a connection to the Solana cluster
  const connection = useMemo(() => {
    const endpoint = clusterApiUrl(network);
    return new Connection(endpoint, 'confirmed');
  }, [network]);
  
  return connection;
}
