import {
  createSolanaToken,
  estimateTokenCreationFees,
  TokenCreationError,
  ERROR_CODES,
  getTokenExplorerUrl,
  getTransactionExplorerUrl
} from '@/utils/solanaTokenService';
import { Connection, PublicKey } from '@solana/web3.js';
import * as splToken from '@solana/spl-token';

// Mock the web3.js and spl-token modules
jest.mock('@solana/web3.js', () => {
  const original = jest.requireActual('@solana/web3.js');
  return {
    ...original,
    Connection: jest.fn().mockImplementation(() => ({
      getBalance: jest.fn().mockResolvedValue(10000000000), // 10 SOL
      getMinimumBalanceForRentExemption: jest.fn().mockResolvedValue(2039280),
    })),
    PublicKey: jest.fn().mockImplementation((key) => ({
      toString: () => key,
    })),
    SystemProgram: {
      createAccount: jest.fn().mockReturnValue({}),
    },
    Transaction: jest.fn().mockImplementation(() => ({
      add: jest.fn(),
    })),
    sendAndConfirmTransaction: jest.fn().mockResolvedValue('mock-signature'),
  };
});

jest.mock('@solana/spl-token', () => ({
  createInitializeMintInstruction: jest.fn(),
  TOKEN_PROGRAM_ID: 'token-program-id',
  MINT_SIZE: 82,
  getMinimumBalanceForRentExemptMint: jest.fn().mockResolvedValue(2039280),
  getMint: jest.fn(),
  createMint: jest.fn(),
  mintTo: jest.fn(),
  getOrCreateAssociatedTokenAccount: jest.fn().mockResolvedValue({
    address: {
      toString: () => 'mock-token-account',
    },
  }),
}));

// Mock the window object
const mockWindow = () => {
  // Mock Phantom wallet
  const mockPhantom = {
    isConnected: true,
    publicKey: { toString: () => 'mock-public-key' },
    signTransaction: jest.fn().mockResolvedValue('signed-transaction'),
    signAllTransactions: jest.fn().mockResolvedValue(['signed-transaction']),
    signAndSendTransaction: jest.fn().mockResolvedValue({ signature: 'mock-signature' }),
  };

  // Mock Solflare wallet
  const mockSolflare = {
    isConnected: false,
    publicKey: { toString: () => 'mock-public-key' },
    signTransaction: jest.fn(),
    signAllTransactions: jest.fn(),
    signAndSendTransaction: jest.fn(),
  };

  Object.defineProperty(global, 'window', {
    value: {
      solana: mockPhantom,
      solflare: mockSolflare,
    },
    writable: true,
  });

  return { mockPhantom, mockSolflare };
};

describe('Solana Token Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWindow();
  });

  describe('estimateTokenCreationFees', () => {
    it('should estimate token creation fees correctly', async () => {
      const connection = new Connection('https://api.devnet.solana.com');
      const decimals = 9;
      
      const fees = await estimateTokenCreationFees(connection, decimals);
      
      // The function should return the sum of rent exemption, tx fee, and token account fee
      expect(fees).toBe(2039280 + 10000 + 2039280);
      expect(splToken.getMinimumBalanceForRentExemptMint).toHaveBeenCalledWith(connection);
    });

    it('should return a default estimate if an error occurs', async () => {
      const connection = new Connection('https://api.devnet.solana.com');
      const decimals = 9;
      
      // Force an error
      (splToken.getMinimumBalanceForRentExemptMint as jest.Mock).mockRejectedValueOnce(new Error('Test error'));
      
      const fees = await estimateTokenCreationFees(connection, decimals);
      
      // Should return the default fallback value
      expect(fees).toBe(5000000);
    });
  });

  describe('getTokenExplorerUrl', () => {
    it('should return correct explorer URL for devnet', () => {
      const tokenAddress = 'mock-token-address';
      const network = 'devnet';
      
      const url = getTokenExplorerUrl(tokenAddress, network);
      
      expect(url).toBe('https://explorer.solana.com/address/mock-token-address?cluster=devnet');
    });

    it('should return correct explorer URL for mainnet', () => {
      const tokenAddress = 'mock-token-address';
      const network = 'mainnet-beta';
      
      const url = getTokenExplorerUrl(tokenAddress, network);
      
      expect(url).toBe('https://explorer.solana.com/address/mock-token-address');
    });
  });

  describe('getTransactionExplorerUrl', () => {
    it('should return correct explorer URL for devnet', () => {
      const signature = 'mock-signature';
      const network = 'devnet';
      
      const url = getTransactionExplorerUrl(signature, network);
      
      expect(url).toBe('https://explorer.solana.com/tx/mock-signature?cluster=devnet');
    });

    it('should return correct explorer URL for mainnet', () => {
      const signature = 'mock-signature';
      const network = 'mainnet-beta';
      
      const url = getTransactionExplorerUrl(signature, network);
      
      expect(url).toBe('https://explorer.solana.com/tx/mock-signature');
    });
  });

  describe('createSolanaToken', () => {
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

    it('should throw an error if no wallet provider is found', async () => {
      // Mock window with no connected wallets
      Object.defineProperty(global, 'window', {
        value: {
          solana: { isConnected: false },
          solflare: { isConnected: false },
        },
        writable: true,
      });

      await expect(createSolanaToken(mockTokenConfig, 'devnet')).rejects.toThrow(
        new TokenCreationError('No wallet provider found. Please install Phantom or Solflare wallet extension.', ERROR_CODES.NO_WALLET)
      );
    });

    it('should throw an error if wallet balance is insufficient', async () => {
      const { mockPhantom } = mockWindow();
      
      // Mock low balance
      const connection = new Connection('https://api.devnet.solana.com');
      (connection.getBalance as jest.Mock).mockResolvedValueOnce(1000); // Very low balance
      
      await expect(createSolanaToken(mockTokenConfig, 'devnet')).rejects.toThrow(
        new TokenCreationError(expect.stringContaining('Insufficient funds'), ERROR_CODES.INSUFFICIENT_FUNDS)
      );
    });

    it('should handle user rejection errors', async () => {
      const { mockPhantom } = mockWindow();
      
      // Mock user rejection
      mockPhantom.signAndSendTransaction.mockRejectedValueOnce({ message: 'User rejected the request' });
      
      await expect(createSolanaToken(mockTokenConfig, 'devnet')).rejects.toThrow(
        new TokenCreationError(expect.stringContaining('Transaction was rejected by the user'), ERROR_CODES.USER_REJECTED)
      );
    });

    it('should successfully create a token', async () => {
      const result = await createSolanaToken(mockTokenConfig, 'devnet');
      
      expect(result).not.toBeNull();
      expect(result?.tokenAddress).toBeDefined();
      expect(result?.signature).toBeDefined();
    });
  });
});
