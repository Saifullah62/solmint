import { useState } from 'react';
import { useWallet } from '@/components/WalletContextProvider';
import { useAppStore } from '../store/useAppStore';
import { useSolanaConnection } from './useSolanaConnection';
import { createSolanaToken, getTokenExplorerUrl, getTransactionExplorerUrl, TokenCreationError, ERROR_CODES } from '@/utils/solanaTokenService';
import { 
  trackTokenCreationStarted, 
  trackTokenCreationSuccess, 
  trackTokenCreationError 
} from '@/services/analyticsService';

export function useTokenCreation() {
  const { publicKey, connected } = useWallet();
  const connection = useSolanaConnection();
  const { tokenConfig, setTransactionSignature, setIsLoading, network } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  // Function to create a new token
  const createToken = async () => {
    if (!publicKey || !connected) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('Creating token with the following configuration:', tokenConfig);
      console.log('Network:', network);
      
      // Track token creation started
      await trackTokenCreationStarted(tokenConfig, network);
      
      // Create the token using the Solana web3.js library
      const result = await createSolanaToken(tokenConfig, network);
      
      if (!result) {
        const errorMessage = 'Failed to create token';
        setError(errorMessage);
        await trackTokenCreationError(
          tokenConfig, 
          network, 
          ERROR_CODES.UNKNOWN_ERROR, 
          errorMessage
        );
        return null;
      }
      
      const { tokenAddress, signature } = result;
      
      console.log(`Token created with address: ${tokenAddress}`);
      console.log(`Transaction signature: ${signature}`);
      
      // Store the transaction signature
      setTransactionSignature(signature);

      // Track token creation success
      await trackTokenCreationSuccess(tokenConfig, network, tokenAddress, signature);

      // Return the mint address
      return tokenAddress;
    } catch (err) {
      console.error('Error creating token:', err);
      
      let errorCode = ERROR_CODES.UNKNOWN_ERROR;
      let errorMessage = 'Unknown error occurred';
      let errorDetails = {};
      
      if (err instanceof TokenCreationError) {
        errorCode = err.code;
        errorMessage = err.message;
        errorDetails = err.details || {};
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Track token creation error
      await trackTokenCreationError(
        tokenConfig, 
        network, 
        errorCode, 
        errorMessage,
        errorDetails
      );
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to validate token configuration
  const validateTokenConfig = () => {
    const errors: string[] = [];

    if (!tokenConfig.name) {
      errors.push('Token name is required');
    }

    if (!tokenConfig.symbol) {
      errors.push('Token symbol is required');
    } else if (tokenConfig.symbol.length > 10) {
      errors.push('Token symbol must be 10 characters or less');
    }

    if (tokenConfig.decimals < 0 || tokenConfig.decimals > 9) {
      errors.push('Decimals must be between 0 and 9');
    }

    if (tokenConfig.initialSupply <= 0) {
      errors.push('Initial supply must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Function to get explorer URL for a token
  const getExplorerUrl = (tokenAddress: string) => {
    return getTokenExplorerUrl(tokenAddress, network);
  };

  // Function to get explorer URL for a transaction
  const getTransactionUrl = (signature: string) => {
    return getTransactionExplorerUrl(signature, network);
  };

  return {
    createToken,
    validateTokenConfig,
    error,
    getExplorerUrl,
    getTransactionUrl
  };
}
