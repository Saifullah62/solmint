'use client';

import { useWallet } from '@/components/WalletContextProvider';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export const WalletConnect = () => {
  const { connected, publicKey, connect, disconnect } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connect();
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div>
      {connected && publicKey ? (
        <div className="flex items-center gap-2">
          <div className="bg-solmint-blackLight px-3 py-1.5 rounded-md border border-solmint-blackLight text-sm text-solmint-silver">
            {truncateAddress(publicKey)}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDisconnect}
            className="text-solmint-silver border-solmint-blackLight hover:bg-solmint-blackLight"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </div>
      ) : (
        <Button 
          onClick={handleConnect} 
          disabled={isConnecting}
          className="bg-solmint-violet hover:bg-solmint-violet/90"
        >
          <Wallet className="h-4 w-4 mr-2" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
};
