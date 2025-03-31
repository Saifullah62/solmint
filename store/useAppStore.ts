'use client';

import { create } from 'zustand';
import { TokenConfig, Network, TokenCreationStep } from '../types/token';

// Default token configuration
const DEFAULT_TOKEN_CONFIG: TokenConfig = {
  name: '',
  symbol: '',
  decimals: 9,
  initialSupply: 1000000000,
  mintAuthority: null,
  freezeAuthority: null,
  metadata: {
    uri: '',
    name: '',
    symbol: '',
    description: '',
    image: '',
  },
};

// Define placement tier types
export type PlacementTier = 'premium' | 'growth' | 'basic';

// Define the app state interface
interface AppState {
  // Network state
  network: Network;
  setNetwork: (network: Network) => void;
  
  // Token configuration state
  tokenConfig: TokenConfig;
  updateTokenConfig: (config: Partial<TokenConfig>) => void;
  resetTokenConfig: () => void;
  
  // Token creation step state
  tokenCreationStep: TokenCreationStep;
  setTokenCreationStep: (step: TokenCreationStep) => void;
  
  // Transaction state
  transactionSignature: string | null;
  setTransactionSignature: (signature: string | null) => void;
  
  // UI state
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  
  // Marketplace placement tier
  placementTier: PlacementTier;
  setPlacementTier: (tier: PlacementTier) => void;
  
  // Assistant state
  assistantMessages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  addAssistantMessage: (message: { role: 'user' | 'assistant' | 'system'; content: string }) => void;
  clearAssistantMessages: () => void;
}

// Create the store
export const useAppStore = create<AppState>((set) => ({
  // Initial network state - default to mainnet-beta
  network: 'mainnet-beta',
  setNetwork: (network) => set({ network }),
  
  // Initial token configuration state
  tokenConfig: DEFAULT_TOKEN_CONFIG,
  updateTokenConfig: (config) => {
    console.log("Updating token config with:", config);
    set((state) => {
      const newConfig = { 
        ...state.tokenConfig, 
        ...config,
        metadata: {
          ...state.tokenConfig.metadata,
          ...(config.metadata || {}),
        },
        mintAuthority: config.mintAuthority !== undefined ? config.mintAuthority : state.tokenConfig.mintAuthority,
        freezeAuthority: config.freezeAuthority !== undefined ? config.freezeAuthority : state.tokenConfig.freezeAuthority,
      };
      console.log("New token config:", newConfig);
      return { tokenConfig: newConfig };
    });
  },
  resetTokenConfig: () => set({ tokenConfig: DEFAULT_TOKEN_CONFIG }),
  
  // Initial token creation step state
  tokenCreationStep: 'configure',
  setTokenCreationStep: (step) => set({ tokenCreationStep: step }),
  
  // Initial transaction state
  transactionSignature: null,
  setTransactionSignature: (signature) => set({ transactionSignature: signature }),
  
  // Initial UI state
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  
  // Initial marketplace placement tier
  placementTier: 'basic',
  setPlacementTier: (tier) => set({ placementTier: tier }),
  
  // Initial assistant state
  assistantMessages: [],
  addAssistantMessage: (message) => 
    set((state) => ({ 
      assistantMessages: [...state.assistantMessages, message] 
    })),
  clearAssistantMessages: () => set({ assistantMessages: [] }),
}));
