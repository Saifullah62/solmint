'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useWallet } from '@/components/WalletContextProvider';
import { Button } from '../ui/button';
import { useAIAssistant } from '../../hooks/useAIAssistant';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useTokenCreation } from '@/hooks/useTokenCreation';
import { trackTokenCreationStarted } from '@/services/analyticsService';

export const TokenReviewForm: React.FC = () => {
  const { 
    tokenConfig, 
    setTokenCreationStep, 
    network,
    isLoading,
    setIsLoading,
    placementTier
  } = useAppStore();
  const { publicKey } = useWallet();
  const { analyzeCurrentTokenConfig } = useAIAssistant();
  const { validateTokenConfig } = useTokenCreation();
  
  // Validate token configuration on component mount
  useEffect(() => {
    const { isValid, errors } = validateTokenConfig();
    if (!isValid) {
      console.error('Invalid token configuration:', errors);
      setTokenCreationStep('configure');
    }
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      console.error('Wallet not connected');
      return;
    }
    
    const { isValid, errors } = validateTokenConfig();
    if (!isValid) {
      console.error('Invalid token configuration:', errors);
      setTokenCreationStep('configure');
      return;
    }
    
    setIsLoading(true);
    try {
      // Track token creation started event
      await trackTokenCreationStarted(tokenConfig, network);
      
      // Proceed to deployment step
      setTokenCreationStep('deploy');
    } catch (error) {
      console.error('Error preparing token creation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get AI analysis of the token configuration
  const getAIAnalysis = async () => {
    setIsLoading(true);
    try {
      await analyzeCurrentTokenConfig();
    } catch (error) {
      console.error('Error getting AI analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate actual supply with decimals
  const actualSupply = tokenConfig.initialSupply * Math.pow(10, tokenConfig.decimals);
  const formattedActualSupply = actualSupply.toLocaleString();
  
  // Get placement tier information
  const getTierInfo = () => {
    switch (placementTier) {
      case 'premium':
        return {
          name: 'Premium',
          cost: '5 SOL',
          description: 'Featured placement with special highlighting and "Featured Token" badge'
        };
      case 'growth':
        return {
          name: 'Growth',
          cost: '1.5 SOL',
          description: 'Premium listing section with blue badge'
        };
      case 'basic':
      default:
        return {
          name: 'Basic',
          cost: '0.2 SOL',
          description: 'Standard listing in the "All Tokens" section'
        };
    }
  };
  
  const tierInfo = getTierInfo();

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Review Your Token Configuration</h2>
      
      <div className="space-y-6">
        {/* Network Warning */}
        {network === 'mainnet-beta' && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-md border border-yellow-200 dark:border-yellow-800 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-400">Mainnet Token Creation</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  You are about to create a token on Solana Mainnet. This will require a small amount of SOL for transaction fees.
                  Tokens created on mainnet are permanent and cannot be removed from the blockchain.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Token Information */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4">
          <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">Token Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Token Name</p>
              <p className="font-medium text-gray-900 dark:text-white">{tokenConfig.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Token Symbol</p>
              <p className="font-medium text-gray-900 dark:text-white">{tokenConfig.symbol}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Decimals</p>
              <p className="font-medium text-gray-900 dark:text-white">{tokenConfig.decimals}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Initial Supply</p>
              <p className="font-medium text-gray-900 dark:text-white">{tokenConfig.initialSupply.toLocaleString()}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Actual Supply (with decimals)</p>
              <p className="font-medium text-gray-900 dark:text-white">{formattedActualSupply}</p>
            </div>
          </div>
        </div>

        {/* Authority Settings */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4">
          <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">Authority Settings</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mr-2">Mint Authority</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Address that can mint additional tokens</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center mt-1">
                {tokenConfig.mintAuthority ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <p className="font-mono text-sm truncate text-gray-900 dark:text-white">{tokenConfig.mintAuthority}</p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    <p className="text-sm text-gray-900 dark:text-white">No mint authority (fixed supply)</p>
                  </>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mr-2">Freeze Authority</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Address that can freeze token accounts</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center mt-1">
                {tokenConfig.freezeAuthority ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <p className="font-mono text-sm truncate text-gray-900 dark:text-white">{tokenConfig.freezeAuthority}</p>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <p className="text-sm text-gray-900 dark:text-white">No freeze authority (recommended)</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Marketplace Placement */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4">
          <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">Marketplace Placement</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Selected Tier</p>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                placementTier === 'premium' 
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                  : placementTier === 'growth'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {tierInfo.name}
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{tierInfo.description}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Cost</p>
              <p className="font-medium text-gray-900 dark:text-white">{tierInfo.cost}</p>
            </div>
          </div>
        </div>

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
              <p className="font-mono text-sm truncate text-gray-900 dark:text-white">{publicKey || 'Not connected'}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setTokenCreationStep('configure')}
            className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
          >
            Back to Configuration
          </Button>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={getAIAnalysis}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Get AI Analysis
            </Button>
            <Button 
              type="button" 
              variant="default" 
              onClick={handleSubmit}
              disabled={isLoading || !publicKey}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? 'Processing...' : 'Create Token'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenReviewForm;
