import { renderHook, act } from '@testing-library/react';
import { useTokenCreation } from '@/hooks/useTokenCreation';
import { useWallet } from '@/components/WalletContextProvider';
import { useAppStore } from '@/store/useAppStore';
import { useSolanaConnection } from '@/hooks/useSolanaConnection';
import { createSolanaToken, getTokenExplorerUrl, getTransactionExplorerUrl } from '@/utils/solanaTokenService';

// Mock dependencies
jest.mock('@/components/WalletContextProvider', () => ({
  useWallet: jest.fn(),
}));

jest.mock('@/store/useAppStore', () => ({
  useAppStore: jest.fn(),
}));

jest.mock('@/hooks/useSolanaConnection', () => ({
  useSolanaConnection: jest.fn(),
}));

jest.mock('@/utils/solanaTokenService', () => ({
  createSolanaToken: jest.fn(),
  getTokenExplorerUrl: jest.fn(),
  getTransactionExplorerUrl: jest.fn(),
}));

describe('useTokenCreation', () => {
  // Setup default mock values
  const mockPublicKey = { toString: () => 'mock-public-key' };
  const mockConnection = {};
  const mockTokenConfig = {
    name: 'Test Token',
    symbol: 'TEST',
    decimals: 9,
    initialSupply: 1000000000,
    mintAuthority: null,
    freezeAuthority: null,
    metadata: {
      uri: '',
      name: 'Test Token',
      symbol: 'TEST',
      description: 'A test token',
      image: '',
    },
  };
  const mockSetTransactionSignature = jest.fn();
  const mockSetIsLoading = jest.fn();
  const mockNetwork = 'devnet';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mocks
    (useWallet as jest.Mock).mockReturnValue({
      publicKey: mockPublicKey,
      connected: true,
    });
    
    (useSolanaConnection as jest.Mock).mockReturnValue(mockConnection);
    
    (useAppStore as jest.Mock).mockReturnValue({
      tokenConfig: mockTokenConfig,
      setTransactionSignature: mockSetTransactionSignature,
      setIsLoading: mockSetIsLoading,
      network: mockNetwork,
    });
    
    (createSolanaToken as jest.Mock).mockResolvedValue({
      tokenAddress: 'mock-token-address',
      signature: 'mock-signature',
    });
    
    (getTokenExplorerUrl as jest.Mock).mockReturnValue('https://explorer.solana.com/address/mock-token-address?cluster=devnet');
    (getTransactionExplorerUrl as jest.Mock).mockReturnValue('https://explorer.solana.com/tx/mock-signature?cluster=devnet');
  });

  describe('createToken', () => {
    it('should return null if wallet is not connected', async () => {
      (useWallet as jest.Mock).mockReturnValue({
        publicKey: null,
        connected: false,
      });
      
      const { result } = renderHook(() => useTokenCreation());
      
      const tokenAddress = await result.current.createToken();
      
      expect(tokenAddress).toBeNull();
      expect(result.current.error).toBe('Wallet not connected');
      expect(mockSetIsLoading).not.toHaveBeenCalled();
    });

    it('should create a token successfully', async () => {
      const { result } = renderHook(() => useTokenCreation());
      
      const tokenAddress = await result.current.createToken();
      
      expect(tokenAddress).toBe('mock-token-address');
      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
      expect(mockSetTransactionSignature).toHaveBeenCalledWith('mock-signature');
      expect(createSolanaToken).toHaveBeenCalledWith(mockTokenConfig, mockNetwork);
    });

    it('should handle errors during token creation', async () => {
      const mockError = new Error('Test error');
      (createSolanaToken as jest.Mock).mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useTokenCreation());
      
      const tokenAddress = await result.current.createToken();
      
      expect(tokenAddress).toBeNull();
      expect(result.current.error).toBe('Test error');
      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });

    it('should handle null result from createSolanaToken', async () => {
      (createSolanaToken as jest.Mock).mockResolvedValue(null);
      
      const { result } = renderHook(() => useTokenCreation());
      
      const tokenAddress = await result.current.createToken();
      
      expect(tokenAddress).toBeNull();
      expect(result.current.error).toBe('Failed to create token');
      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('validateTokenConfig', () => {
    it('should validate a valid token config', () => {
      const { result } = renderHook(() => useTokenCreation());
      
      const validation = result.current.validateTokenConfig();
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should return errors for invalid token name', () => {
      (useAppStore as jest.Mock).mockReturnValue({
        tokenConfig: { ...mockTokenConfig, name: '' },
        setTransactionSignature: mockSetTransactionSignature,
        setIsLoading: mockSetIsLoading,
        network: mockNetwork,
      });
      
      const { result } = renderHook(() => useTokenCreation());
      
      const validation = result.current.validateTokenConfig();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Token name is required');
    });

    it('should return errors for invalid token symbol', () => {
      (useAppStore as jest.Mock).mockReturnValue({
        tokenConfig: { ...mockTokenConfig, symbol: '' },
        setTransactionSignature: mockSetTransactionSignature,
        setIsLoading: mockSetIsLoading,
        network: mockNetwork,
      });
      
      const { result } = renderHook(() => useTokenCreation());
      
      const validation = result.current.validateTokenConfig();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Token symbol is required');
    });

    it('should return errors for token symbol that is too long', () => {
      (useAppStore as jest.Mock).mockReturnValue({
        tokenConfig: { ...mockTokenConfig, symbol: 'TOOLONGSYMBOL' },
        setTransactionSignature: mockSetTransactionSignature,
        setIsLoading: mockSetIsLoading,
        network: mockNetwork,
      });
      
      const { result } = renderHook(() => useTokenCreation());
      
      const validation = result.current.validateTokenConfig();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Token symbol must be 10 characters or less');
    });

    it('should return errors for invalid decimals', () => {
      (useAppStore as jest.Mock).mockReturnValue({
        tokenConfig: { ...mockTokenConfig, decimals: 10 },
        setTransactionSignature: mockSetTransactionSignature,
        setIsLoading: mockSetIsLoading,
        network: mockNetwork,
      });
      
      const { result } = renderHook(() => useTokenCreation());
      
      const validation = result.current.validateTokenConfig();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Decimals must be between 0 and 9');
    });

    it('should return errors for invalid initial supply', () => {
      (useAppStore as jest.Mock).mockReturnValue({
        tokenConfig: { ...mockTokenConfig, initialSupply: 0 },
        setTransactionSignature: mockSetTransactionSignature,
        setIsLoading: mockSetIsLoading,
        network: mockNetwork,
      });
      
      const { result } = renderHook(() => useTokenCreation());
      
      const validation = result.current.validateTokenConfig();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Initial supply must be greater than 0');
    });
  });

  describe('getExplorerUrl', () => {
    it('should return the correct explorer URL for a token', () => {
      const { result } = renderHook(() => useTokenCreation());
      
      const url = result.current.getExplorerUrl('mock-token-address');
      
      expect(url).toBe('https://explorer.solana.com/address/mock-token-address?cluster=devnet');
      expect(getTokenExplorerUrl).toHaveBeenCalledWith('mock-token-address', mockNetwork);
    });
  });

  describe('getTransactionUrl', () => {
    it('should return the correct explorer URL for a transaction', () => {
      const { result } = renderHook(() => useTokenCreation());
      
      const url = result.current.getTransactionUrl('mock-signature');
      
      expect(url).toBe('https://explorer.solana.com/tx/mock-signature?cluster=devnet');
      expect(getTransactionExplorerUrl).toHaveBeenCalledWith('mock-signature', mockNetwork);
    });
  });
});
