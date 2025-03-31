'use client';

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useWallet } from '@/components/WalletContextProvider';
import { Button } from '../ui/button';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useTokenCreation } from '../../hooks/useTokenCreation';

export function TokenCreationForm() {
  const { 
    tokenConfig, 
    setTokenCreationStep, 
    network,
    setTransactionSignature
  } = useAppStore();
  const { publicKey } = useWallet();
  const { createToken } = useTokenCreation();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  
  // Handle token creation
  const handleCreateToken = async () => {
    if (!publicKey) {
      setError('Wallet not connected');
      return;
    }
    
    try {
      setIsCreating(true);
      setError(null);
      
      // Use the real token creation logic
      const mintAddress = await createToken();
      
      if (mintAddress) {
        setTokenAddress(mintAddress);
        // Move to complete step
        setTokenCreationStep('complete' as any);
      } else {
        setError('Failed to create token');
      }
    } catch (err) {
      console.error('Error creating token:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Your Token</h2>
      
      <div className="space-y-6">
        {/* Network Warning */}
        {network === 'mainnet-beta' && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-md border border-yellow-200 dark:border-yellow-800 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-400">Mainnet Transaction</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  You are about to create a token on Solana Mainnet. This transaction will require a small amount of SOL for fees.
                  Please confirm that you want to proceed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Token Summary */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4">
          <h3 className="font-medium text-lg mb-4">Token Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Token Name</p>
              <p className="font-medium">{tokenConfig.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Token Symbol</p>
              <p className="font-medium">{tokenConfig.symbol}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Network</p>
              <p className="font-medium capitalize">{network}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Initial Supply</p>
              <p className="font-medium">{tokenConfig.initialSupply.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Creation Status */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4">
          <h3 className="font-medium text-lg mb-4">Creation Status</h3>
          
          {isCreating ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-purple-500 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Creating your token...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a few moments</p>
            </div>
          ) : tokenAddress ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 font-medium">Token created successfully!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Your token has been created on the {network} network</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
              <p className="text-red-600 dark:text-red-400 font-medium">Error creating token</p>
              <p className="text-sm text-red-500 dark:text-red-300 mt-2">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-600 dark:text-gray-300">Ready to create your token</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Click the button below to proceed</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setTokenCreationStep('review')}
            disabled={isCreating}
          >
            Back to Review
          </Button>
          
          <Button 
            type="button" 
            onClick={handleCreateToken}
            disabled={!publicKey || isCreating || !!tokenAddress}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Token'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TokenCreationForm;
