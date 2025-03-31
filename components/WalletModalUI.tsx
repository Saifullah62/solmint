'use client';

import React, { FC } from 'react';

interface WalletModalUIProps {
  onClose: () => void;
  onConnect: (publicKey: string) => void;
}

const WalletModalUI: FC<WalletModalUIProps> = ({ onClose, onConnect }) => {
  // Mock wallet connections
  const mockWallets = [
    { name: 'Phantom', icon: '👻' },
    { name: 'Solflare', icon: '🔆' },
  ];

  // Generate a mock public key
  const generateMockPublicKey = () => {
    return 'mock-public-key-' + Math.random().toString(36).substring(2, 15);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md p-6 rounded-lg bg-solmint-blackLight border border-solmint-blackLight">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Connect Wallet</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-3">
          {mockWallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => onConnect(generateMockPublicKey())}
              className="flex items-center w-full p-3 rounded-md bg-solmint-black hover:bg-solmint-violet transition-colors"
            >
              <span className="mr-3 text-xl">{wallet.icon}</span>
              <span className="text-white">{wallet.name}</span>
            </button>
          ))}
        </div>
        
        <p className="mt-4 text-sm text-gray-400">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default WalletModalUI;
