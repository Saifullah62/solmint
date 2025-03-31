'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '../../store/useAppStore';
import { useTokenCreation } from '../../hooks/useTokenCreation';
import { CheckCircle, Copy, ExternalLink } from 'lucide-react';

interface TokenCreationSuccessProps {
  tokenAddress: string;
}

export const TokenCreationSuccess: React.FC<TokenCreationSuccessProps> = ({ tokenAddress }) => {
  const { tokenConfig, network } = useAppStore();
  const { getTokenExplorerUrl } = useTokenCreation();
  const [copied, setCopied] = React.useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(tokenAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const explorerUrl = getTokenExplorerUrl(tokenAddress);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-center mb-6">
        <CheckCircle className="text-green-500 w-12 h-12 mr-3" />
        <h2 className="text-2xl font-bold">Token Created Successfully!</h2>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">Token Details</h3>
          <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <div className="font-medium">Name:</div>
            <div>{tokenConfig.name}</div>
            
            <div className="font-medium">Symbol:</div>
            <div>{tokenConfig.symbol}</div>
            
            <div className="font-medium">Decimals:</div>
            <div>{tokenConfig.decimals}</div>
            
            <div className="font-medium">Initial Supply:</div>
            <div>{tokenConfig.initialSupply}</div>
            
            <div className="font-medium">Network:</div>
            <div className="capitalize">{network.replace('-', ' ')}</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1">Token Address</h3>
          <div className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <code className="text-sm flex-1 break-all">{tokenAddress}</code>
            <button 
              onClick={handleCopyAddress}
              className="ml-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
              aria-label="Copy token address to clipboard"
            >
              {copied ? 
                <CheckCircle className="w-5 h-5 text-green-500" /> : 
                <Copy className="w-5 h-5" />
              }
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          View on Explorer <ExternalLink className="w-4 h-4" />
        </a>
        
        <Link 
          href="/create"
          className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-2 px-4 rounded-md transition-colors"
        >
          Create Another Token
        </Link>
        
        <Link 
          href="/assistant"
          className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Ask AI Assistant
        </Link>
      </div>
    </div>
  );
};

export default TokenCreationSuccess;
