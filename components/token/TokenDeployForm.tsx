'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useWallet } from '@/components/WalletContextProvider';
import { Button } from '@/components/ui/button';
import { createSolanaToken } from '@/utils/solanaTokenService';
import { trackTokenCreationSuccess, trackTokenCreationError } from '@/services/analyticsService';
import { Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Create local Alert components since @/components/ui/alert is missing
const Alert = ({ 
  children, 
  variant = 'default', 
  className = '' 
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'destructive'; 
  className?: string;
}) => {
  const baseClasses = "p-4 rounded-md flex gap-3";
  const variantClasses = variant === 'destructive' 
    ? "bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-200" 
    : "bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200";
  
  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </div>
  );
};

const AlertTitle = ({ children }: { children: React.ReactNode }) => (
  <h5 className="font-medium text-sm">{children}</h5>
);

const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm">{children}</div>
);

export const TokenDeployForm: React.FC = () => {
  const { 
    tokenConfig, 
    setTokenCreationStep, 
    network,
    isLoading,
    setIsLoading,
    setTransactionSignature,
    placementTier
  } = useAppStore();
  const { publicKey, connected } = useWallet();
  
  const [error, setError] = useState<string | null>(null);
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');
  
  // Get the explorer URL based on network
  const getExplorerUrl = (type: 'tx' | 'address', value: string) => {
    const baseUrl = network === 'devnet' 
      ? 'https://explorer.solana.com/?cluster=devnet' 
      : 'https://explorer.solana.com';
    
    return `${baseUrl}/${type}/${value}`;
  };
  
  // Get the marketplace tier cost in SOL
  const getTierCost = () => {
    switch (placementTier) {
      case 'premium': return 5;
      case 'growth': return 1.5;
      case 'basic': return 0.2;
      default: return 0.2;
    }
  };
  
  // Deploy the token - using useCallback to safely use in useEffect
  const deployToken = useCallback(async () => {
    if (!connected || !publicKey) {
      setError('Wallet not connected. Please connect your wallet to continue.');
      setDeploymentStatus('error');
      return;
    }
    
    setIsLoading(true);
    setDeploymentStatus('processing');
    setError(null);
    
    try {
      // Create the token
      const result = await createSolanaToken(tokenConfig, network);
      
      if (!result) {
        throw new Error('Token creation failed');
      }
      
      // Set the transaction signature and token address
      setTransactionSignature(result.signature);
      setTokenAddress(result.tokenAddress);
      
      // Track successful token creation
      await trackTokenCreationSuccess(tokenConfig, network, result.tokenAddress, result.signature);
      
      // Update status
      setDeploymentStatus('success');
      
      // Move to success step after a short delay
      setTimeout(() => {
        setTokenCreationStep('success');
      }, 2000);
    } catch (err: unknown) {
      console.error('Error deploying token:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const errorCode = (err as { code?: string }).code || 'UNKNOWN_ERROR';
      
      // Track error with correct argument format
      await trackTokenCreationError(
        tokenConfig,
        network,
        errorCode,
        errorMessage
      );
      
      // Set error message
      setError(errorMessage || 'An error occurred while creating your token. Please try again.');
      setDeploymentStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, [
    connected, 
    publicKey, 
    tokenConfig, 
    network, 
    setIsLoading, 
    setTransactionSignature, 
    setTokenCreationStep,
    placementTier // Added placementTier to dependency array
  ]);
  
  // Auto-deploy on component mount if wallet is connected
  useEffect(() => {
    if (deploymentStatus === 'pending' && connected) {
      deployToken();
    }
  }, [deploymentStatus, connected, deployToken]);
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Deploying Your Token</h2>
      
      <div className="space-y-6">
        {/* Network Information */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4">
          <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">Network Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Network</p>
              <p className="font-medium capitalize text-gray-900 dark:text-white">{network}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Token Owner</p>
              <p className="font-mono text-sm truncate text-gray-900 dark:text-white">{publicKey?.toString() || 'Not connected'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Marketplace Tier</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {placementTier.charAt(0).toUpperCase() + placementTier.slice(1)} ({getTierCost()} SOL)
              </p>
            </div>
          </div>
        </div>
        
        {/* Deployment Status */}
        <div className="flex flex-col items-center justify-center py-8">
          {deploymentStatus === 'pending' && (
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                Ready to deploy your token
              </p>
              <Button 
                onClick={deployToken}
                disabled={isLoading || !connected}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                  </>
                ) : 'Deploy Token'}
              </Button>
            </div>
          )}
          
          {deploymentStatus === 'processing' && (
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Creating your token on {network}...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Please wait and keep this window open. This process may take up to a minute.
              </p>
            </div>
          )}
          
          {deploymentStatus === 'success' && tokenAddress && (
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3 mx-auto mb-4 w-fit">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Token successfully created!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">
                Your token has been successfully created on the {network} network.
              </p>
              <div className="flex flex-col space-y-2 items-center">
                <Link 
                  href={getExplorerUrl('address', tokenAddress)}
                  target="_blank"
                  className="flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  View Token on Explorer
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
          
          {deploymentStatus === 'error' && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error || 'An error occurred while creating your token. Please try again.'}
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setTokenCreationStep('review')}
            disabled={isLoading}
            className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
          >
            Back to Review
          </Button>
          
          {deploymentStatus === 'error' && (
            <Button 
              type="button" 
              variant="default" 
              onClick={deployToken}
              disabled={isLoading || !connected}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
