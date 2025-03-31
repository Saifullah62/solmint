import { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  TransactionInstruction,
  ConfirmOptions
} from '@solana/web3.js';
import {
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  getMint,
  createMint,
  mintTo,
  getOrCreateAssociatedTokenAccount
} from '@solana/spl-token';
import { TokenConfig } from '@/types/token';

// Custom error types for token creation
export class TokenCreationError extends Error {
  code: string;
  details?: Record<string, any>;
  
  constructor(message: string, code: string, details?: Record<string, any>) {
    super(message);
    this.name = 'TokenCreationError';
    this.code = code;
    this.details = details;
  }
}

// Error codes
export const ERROR_CODES = {
  NO_WALLET: 'NO_WALLET',
  WALLET_CONNECTION: 'WALLET_CONNECTION',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  USER_REJECTED: 'USER_REJECTED',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  INVALID_TOKEN_CONFIG: 'INVALID_TOKEN_CONFIG',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Token metadata program ID
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

// Function to estimate token creation fees
export async function estimateTokenCreationFees(
  connection: Connection,
  decimals: number
): Promise<number> {
  try {
    // Calculate the rent for the mint
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    
    // Add estimated transaction fee (this is an approximation)
    const estimatedTxFee = 10000;
    
    // Add fee for associated token account creation
    const estimatedTokenAccountFee = 2039280;
    
    // Total estimated fee in lamports
    const totalEstimatedFee = lamports + estimatedTxFee + estimatedTokenAccountFee;
    
    return totalEstimatedFee;
  } catch (error: unknown) {
    console.error('Error estimating fees:', error);
    return 5000000; // Default fallback estimate (0.005 SOL)
  }
}

// Function to validate token configuration
export function validateTokenConfig(tokenConfig: TokenConfig): { isValid: boolean; errors: string[] } {
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
}

// Function to create a token using Phantom or Solflare wallet
export async function createSolanaToken(
  tokenConfig: TokenConfig,
  network: string
): Promise<{ tokenAddress: string, signature: string } | null> {
  try {
    // Validate token configuration before proceeding
    const validation = validateTokenConfig(tokenConfig);
    if (!validation.isValid) {
      throw new TokenCreationError(
        `Invalid token configuration: ${validation.errors.join(', ')}`,
        ERROR_CODES.INVALID_TOKEN_CONFIG,
        { errors: validation.errors }
      );
    }

    // Get the wallet provider
    const phantomProvider = (window as any).solana;
    const solflareProvider = (window as any).solflare;
    const walletProvider = phantomProvider?.isConnected ? phantomProvider : solflareProvider?.isConnected ? solflareProvider : null;
    
    if (!walletProvider) {
      throw new TokenCreationError('No wallet provider found. Please install Phantom or Solflare wallet extension.', ERROR_CODES.NO_WALLET);
    }

    // Get the connection based on network
    const endpoint = network === 'devnet' 
      ? 'https://api.devnet.solana.com' 
      : 'https://api.mainnet-beta.solana.com';
    
    // Configure connection with better retry and confirmation settings
    const confirmOptions: ConfirmOptions = {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
      skipPreflight: false,
    };
    const connection = new Connection(endpoint, confirmOptions);

    try {
      // Create a new mint account
      const mintKeypair = Keypair.generate();
      console.log('Generated mint keypair:', mintKeypair.publicKey.toString());

      // Get the wallet's public key
      const publicKey = new PublicKey(walletProvider.publicKey.toString());
      console.log('Wallet public key:', publicKey.toString());

      // Calculate the rent for the mint
      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      console.log('Required lamports for rent exemption:', lamports);

      // Check if the wallet has enough SOL
      const walletBalance = await connection.getBalance(publicKey);
      console.log('Wallet balance:', walletBalance);
      
      // Estimate total fees
      const estimatedFees = await estimateTokenCreationFees(connection, tokenConfig.decimals);
      console.log('Estimated fees:', estimatedFees);
      
      if (walletBalance < estimatedFees) {
        throw new TokenCreationError(
          `Insufficient funds. You need at least ${(estimatedFees / 1000000000).toFixed(5)} SOL to create a token.`, 
          ERROR_CODES.INSUFFICIENT_FUNDS,
          { 
            requiredBalance: estimatedFees,
            currentBalance: walletBalance,
            shortfall: estimatedFees - walletBalance
          }
        );
      }

      // Create the transaction
      const transaction = new Transaction();

      // Add instruction to create account for the mint
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID
        })
      );

      // Add instruction to initialize the mint
      transaction.add(
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          tokenConfig.decimals,
          publicKey,
          publicKey,
          TOKEN_PROGRAM_ID
        )
      );

      try {
        // Get the associated token account for the wallet
        const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          {
            publicKey,
            signTransaction: async (tx: Transaction) => {
              try {
                // Sign the transaction with the wallet
                const signedTx = await walletProvider.signTransaction(tx);
                return signedTx;
              } catch (error: unknown) {
                if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string' && error.message?.includes('User rejected')) {
                  throw new TokenCreationError('Transaction was rejected by the user.', ERROR_CODES.USER_REJECTED);
                }
                throw new TokenCreationError('Failed to sign transaction.', ERROR_CODES.WALLET_CONNECTION);
              }
            },
            signAllTransactions: async (txs: Transaction[]) => {
              try {
                // Sign all transactions with the wallet
                const signedTxs = await walletProvider.signAllTransactions(txs);
                return signedTxs;
              } catch (error: unknown) {
                if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string' && error.message?.includes('User rejected')) {
                  throw new TokenCreationError('Transaction was rejected by the user.', ERROR_CODES.USER_REJECTED);
                }
                throw new TokenCreationError('Failed to sign transactions.', ERROR_CODES.WALLET_CONNECTION);
              }
            },
            sendTransaction: async (tx: Transaction) => {
              try {
                // Send the transaction with the wallet
                const { signature } = await walletProvider.signAndSendTransaction(tx);
                return signature;
              } catch (error: unknown) {
                if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string' && error.message?.includes('User rejected')) {
                  throw new TokenCreationError('Transaction was rejected by the user.', ERROR_CODES.USER_REJECTED);
                }
                throw new TokenCreationError('Failed to send transaction.', ERROR_CODES.TRANSACTION_FAILED);
              }
            },
          },
          mintKeypair.publicKey,
          publicKey
        );

        console.log('Associated token account:', associatedTokenAccount.address.toString());

        // Add instruction to mint tokens to the associated token account
        if (tokenConfig.initialSupply > 0) {
          const mintAmount = tokenConfig.initialSupply * Math.pow(10, tokenConfig.decimals);
          transaction.add(
            mintTo(
              connection,
              {
                publicKey,
                signTransaction: async (tx: Transaction) => {
                  try {
                    // Sign the transaction with the wallet
                    const signedTx = await walletProvider.signTransaction(tx);
                    return signedTx;
                  } catch (error: unknown) {
                    if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string' && error.message?.includes('User rejected')) {
                      throw new TokenCreationError('Transaction was rejected by the user.', ERROR_CODES.USER_REJECTED);
                    }
                    throw new TokenCreationError('Failed to sign transaction.', ERROR_CODES.WALLET_CONNECTION);
                  }
                },
              },
              mintKeypair.publicKey,
              associatedTokenAccount.address,
              publicKey,
              BigInt(mintAmount.toString())
            )
          );
        }

        // Add a recent blockhash to the transaction
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;

        // Sign the transaction with the mint keypair
        transaction.partialSign(mintKeypair);

        // Sign and send the transaction with the wallet
        let signature: string;
        try {
          // For mainnet transactions, we should confirm with the user
          if (network === 'mainnet-beta') {
            console.log('This is a mainnet transaction. Please confirm in your wallet.');
          }
          
          // Sign and send the transaction
          signature = await walletProvider.signAndSendTransaction(transaction);
          console.log('Transaction sent with signature:', signature);
          
          // Wait for confirmation with retry logic
          let confirmed = false;
          let retries = 0;
          const maxRetries = 5;
          
          while (!confirmed && retries < maxRetries) {
            try {
              const confirmation = await connection.confirmTransaction(signature, 'confirmed');
              if (confirmation.value.err) {
                throw new TokenCreationError(
                  `Transaction failed: ${JSON.stringify(confirmation.value.err)}`, 
                  ERROR_CODES.TRANSACTION_FAILED,
                  { confirmationError: confirmation.value.err }
                );
              }
              confirmed = true;
            } catch (error) {
              console.error(`Confirmation attempt ${retries + 1} failed:`, error);
              retries++;
              if (retries >= maxRetries) {
                throw new TokenCreationError(
                  'Transaction confirmation failed after multiple attempts. Please check the explorer for the status.', 
                  ERROR_CODES.TRANSACTION_FAILED,
                  { signature }
                );
              }
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
          
          console.log('Transaction confirmed');
          
          // Return the token address and transaction signature
          return {
            tokenAddress: mintKeypair.publicKey.toString(),
            signature
          };
        } catch (error: unknown) {
          console.error('Error signing and sending transaction:', error);
          
          if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
            if (error.message.includes('User rejected')) {
              throw new TokenCreationError('Transaction was rejected by the user.', ERROR_CODES.USER_REJECTED);
            } else if (error.message.includes('timeout')) {
              throw new TokenCreationError('Transaction timed out. The network may be congested.', ERROR_CODES.NETWORK_ERROR);
            } else if (error.message.includes('rate limit')) {
              throw new TokenCreationError('Rate limit exceeded. Please try again later.', ERROR_CODES.RATE_LIMIT_EXCEEDED);
            }
          }
          
          throw new TokenCreationError(
            'Failed to send transaction. Please try again later.', 
            ERROR_CODES.TRANSACTION_FAILED,
            { originalError: error instanceof Error ? error.message : String(error) }
          );
        }
      } catch (error: unknown) {
        console.error('Error in token account creation or minting:', error);
        
        // Re-throw TokenCreationError instances
        if (error instanceof TokenCreationError) {
          throw error;
        }
        
        // Handle other errors
        throw new TokenCreationError(
          'Error creating token account or minting tokens.', 
          ERROR_CODES.UNKNOWN_ERROR,
          { originalError: error instanceof Error ? error.message : String(error) }
        );
      }
    } catch (error: unknown) {
      console.error('Error in token creation process:', error);
      
      // Re-throw TokenCreationError instances
      if (error instanceof TokenCreationError) {
        throw error;
      }
      
      // Handle network errors
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        throw new TokenCreationError(
          'Network error. Please check your internet connection and try again.', 
          ERROR_CODES.NETWORK_ERROR
        );
      }
      
      // Handle other errors
      throw new TokenCreationError(
        'An unexpected error occurred during token creation.', 
        ERROR_CODES.UNKNOWN_ERROR,
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  } catch (error: unknown) {
    console.error('Top level error in createSolanaToken:', error);
    
    // Re-throw TokenCreationError instances
    if (error instanceof TokenCreationError) {
      throw error;
    }
    
    // Handle any other errors
    throw new TokenCreationError(
      'An unexpected error occurred.', 
      ERROR_CODES.UNKNOWN_ERROR,
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
}

// Function to get explorer URL for a token
export function getTokenExplorerUrl(tokenAddress: string, network: string): string {
  const baseUrl = 'https://explorer.solana.com/address/';
  const clusterParam = network === 'devnet' ? '?cluster=devnet' : '';
  return `${baseUrl}${tokenAddress}${clusterParam}`;
}

// Function to get explorer URL for a transaction
export function getTransactionExplorerUrl(signature: string, network: string): string {
  const baseUrl = 'https://explorer.solana.com/tx/';
  const clusterParam = network === 'devnet' ? '?cluster=devnet' : '';
  return `${baseUrl}${signature}${clusterParam}`;
}

// Function to check if a token exists
export async function checkTokenExists(
  connection: Connection,
  tokenAddress: string
): Promise<boolean> {
  try {
    const publicKey = new PublicKey(tokenAddress);
    const tokenInfo = await getMint(connection, publicKey);
    return !!tokenInfo;
  } catch (error) {
    console.error('Error checking if token exists:', error);
    return false;
  }
}
