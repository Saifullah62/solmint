'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface TokenConfig {
  name?: string;
  symbol?: string;
  decimals?: number;
  initialSupply?: number;
  mintAuthority?: string;
  freezeAuthority?: string;
  network?: string;
  metadata?: {
    uri?: string;
    name?: string;
    symbol?: string;
    description?: string;
    image?: string;
  };
}

export const useTokenConfig = () => {
  // Initialize with local storage to persist token configuration
  const [storedConfig, setStoredConfig] = useLocalStorage<TokenConfig>('token-config', {});
  const [tokenConfig, setTokenConfig] = useState<TokenConfig>(storedConfig);
  
  // Update local storage when token configuration changes
  useEffect(() => {
    setStoredConfig(tokenConfig);
  }, [tokenConfig, setStoredConfig]);

  // Update token configuration
  const updateTokenConfig = (newConfig: Partial<TokenConfig>) => {
    setTokenConfig(prevConfig => ({
      ...prevConfig,
      ...newConfig,
      // If metadata is provided, merge it with existing metadata
      metadata: newConfig.metadata
        ? { ...prevConfig.metadata, ...newConfig.metadata }
        : prevConfig.metadata,
    }));
  };

  // Reset token configuration
  const resetTokenConfig = () => {
    setTokenConfig({});
  };

  // Validate token configuration
  const validateTokenConfig = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check required fields
    if (!tokenConfig.name) errors.push('Token name is required');
    if (!tokenConfig.symbol) errors.push('Token symbol is required');
    if (tokenConfig.decimals === undefined) errors.push('Decimals are required');
    if (tokenConfig.initialSupply === undefined) errors.push('Initial supply is required');

    // Validate field formats
    if (tokenConfig.name && tokenConfig.name.length > 30) {
      errors.push('Token name should be 30 characters or less');
    }
    
    if (tokenConfig.symbol && (tokenConfig.symbol.length > 10 || !/^[A-Z0-9]+$/.test(tokenConfig.symbol))) {
      errors.push('Token symbol should be 10 characters or less and contain only uppercase letters and numbers');
    }
    
    if (tokenConfig.decimals !== undefined && (tokenConfig.decimals < 0 || tokenConfig.decimals > 9)) {
      errors.push('Decimals should be between 0 and 9');
    }
    
    if (tokenConfig.initialSupply !== undefined && tokenConfig.initialSupply <= 0) {
      errors.push('Initial supply should be greater than 0');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  return {
    tokenConfig,
    updateTokenConfig,
    resetTokenConfig,
    validateTokenConfig,
  };
};
