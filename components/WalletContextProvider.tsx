'use client';

import { FC, ReactNode, createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProvider } from '@/context/UserContext';

// Define the wallet context interface
interface WalletContextState {
  connected: boolean;
  publicKey: string | null;
  connecting: boolean;
  disconnect: () => Promise<void>;
  select: () => void;
  connect: () => Promise<void>;
}

// Create the context with default values
const WalletContext = createContext<WalletContextState>({
  connected: false,
  publicKey: null,
  connecting: false,
  disconnect: async () => {},
  select: () => {},
  connect: async () => {}
});

// Export the hook to use the wallet context
export const useWallet = () => useContext(WalletContext);

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Check if wallet is connected on mount
  useEffect(() => {
    // This is a placeholder for actual wallet connection check
    // In a real implementation, this would check if the wallet is connected
    const checkConnection = async () => {
      try {
        // Check if there's a session cookie
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.user) {
          setConnected(true);
          setPublicKey(data.user.wallet || null);
        } else {
          // Check if there's a wallet connected in the browser
          const phantomProvider = (window as any).solana;
          const solflareProvider = (window as any).solflare;
          
          if (phantomProvider?.isConnected && phantomProvider?.publicKey) {
            setConnected(true);
            setPublicKey(phantomProvider.publicKey.toString());
          } else if (solflareProvider?.isConnected && solflareProvider?.publicKey) {
            setConnected(true);
            setPublicKey(solflareProvider.publicKey.toString());
          }
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    };

    checkConnection();
  }, []);

  // Disconnect from wallet
  const disconnect = useCallback(async () => {
    try {
      // Sign out from the server
      await fetch('/api/auth/signout', {
        method: 'POST',
      });
      
      // Disconnect from wallet providers if they exist
      const phantomProvider = (window as any).solana;
      const solflareProvider = (window as any).solflare;
      
      if (phantomProvider?.disconnect) {
        await phantomProvider.disconnect();
      }
      
      if (solflareProvider?.disconnect) {
        await solflareProvider.disconnect();
      }
      
      setConnected(false);
      setPublicKey(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }, []);

  // Select wallet (in a real implementation, this would show a wallet selection UI)
  const select = useCallback(() => {
    // Redirect to the auth-demo page
    window.location.href = '/auth-demo';
  }, []);

  // Connect to wallet
  const connect = useCallback(async () => {
    try {
      setConnecting(true);
      
      // Try to connect to Phantom wallet
      const phantomProvider = (window as any).solana;
      if (phantomProvider) {
        try {
          await phantomProvider.connect();
          setConnected(true);
          setPublicKey(phantomProvider.publicKey.toString());
          return;
        } catch (phantomError) {
          console.error('Failed to connect to Phantom wallet:', phantomError);
        }
      }
      
      // Try to connect to Solflare wallet if Phantom failed
      const solflareProvider = (window as any).solflare;
      if (solflareProvider) {
        try {
          await solflareProvider.connect();
          setConnected(true);
          setPublicKey(solflareProvider.publicKey.toString());
          return;
        } catch (solflareError) {
          console.error('Failed to connect to Solflare wallet:', solflareError);
        }
      }
      
      // If we get here, no wallet was connected
      console.error('No wallet provider found');
      alert('Please install Phantom or Solflare wallet extension');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  }, []);

  // Create the wallet context value
  const value: WalletContextState = {
    connected,
    publicKey,
    connecting,
    disconnect,
    select,
    connect
  };

  return (
    <WalletContext.Provider value={value}>
      <UserProvider>
        {children}
      </UserProvider>
    </WalletContext.Provider>
  );
};
