'use client';

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/button';
import { CheckCircle, ExternalLink, Copy, RefreshCw } from 'lucide-react';
import { useTokenCreation } from '@/hooks/useTokenCreation';

export function TokenSuccessForm() {
  const { 
    tokenConfig, 
    resetTokenConfig,
    setTokenCreationStep,
    network,
    transactionSignature
  } = useAppStore();
  
  const { getExplorerUrl, getTransactionUrl } = useTokenCreation();
  const [copied, setCopied] = useState<string | null>(null);
  
  // For demo purposes, we'll extract the token address from the transaction signature
  // In a real app, this would be returned from the token creation process
  const tokenAddress = transactionSignature?.split('_')[0] || `${tokenConfig.symbol.toLowerCase()}${Math.random().toString(36).substring(2, 10)}`;
  
  // Handle copy to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };
  
  // Handle creating a new token
  const createNewToken = () => {
    resetTokenConfig();
    setTokenCreationStep('configure' as any);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-center">Token Created Successfully!</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-center">
          Your {tokenConfig.name} ({tokenConfig.symbol}) token has been created on the {network} network
        </p>
      </div>
      
      <div className="space-y-6 mt-8">
        {/* Token Information */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4">
          <h3 className="font-medium text-lg mb-4">Token Information</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Token Address</p>
              <div className="flex items-center mt-1">
                <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-sm flex-1 overflow-x-auto">
                  {tokenAddress}
                </code>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(tokenAddress, 'tokenAddress')}
                  className="ml-2"
                >
                  <Copy className="h-4 w-4" />
                  {copied === 'tokenAddress' ? 'Copied!' : 'Copy'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => window.open(getExplorerUrl(tokenAddress), '_blank')}
                  className="ml-1"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Transaction Signature</p>
              <div className="flex items-center mt-1">
                <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-sm flex-1 overflow-x-auto">
                  {transactionSignature || 'Unknown'}
                </code>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(transactionSignature || '', 'transactionSignature')}
                  className="ml-2"
                  disabled={!transactionSignature}
                >
                  <Copy className="h-4 w-4" />
                  {copied === 'transactionSignature' ? 'Copied!' : 'Copy'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => transactionSignature && window.open(getTransactionUrl(transactionSignature), '_blank')}
                  className="ml-1"
                  disabled={!transactionSignature}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Token Details */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4">
          <h3 className="font-medium text-lg mb-4">Token Details</h3>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Decimals</p>
              <p className="font-medium">{tokenConfig.decimals}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Initial Supply</p>
              <p className="font-medium">{tokenConfig.initialSupply.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Network</p>
              <p className="font-medium capitalize">{network}</p>
            </div>
          </div>
        </div>
        
        {/* Next Steps */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4">
          <h3 className="font-medium text-lg mb-4">Next Steps</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>View your token on the Solana Explorer</li>
            <li>Add the token to your wallet</li>
            <li>Transfer tokens to other wallets</li>
            <li>Set up token metadata (optional)</li>
            <li>Create a liquidity pool (optional)</li>
          </ul>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={() => window.open(getExplorerUrl(tokenAddress), '_blank')}
            className="flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Explorer
          </Button>
          
          <Button 
            onClick={createNewToken}
            className="bg-purple-600 hover:bg-purple-700 flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Create Another Token
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TokenSuccessForm;
