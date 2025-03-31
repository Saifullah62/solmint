declare module '@solana/wallet-adapter-react' {
  import { PublicKey } from '@solana/web3.js';
  
  export interface WalletContextState {
    wallet: any | null;
    adapter: any | null;
    publicKey: PublicKey | null;
    connecting: boolean;
    connected: boolean;
    disconnecting: boolean;
    select(walletName: string): void;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  }
  
  export function useWallet(): WalletContextState;
}

declare module '@solana/wallet-adapter-base' {
  import { PublicKey } from '@solana/web3.js';
  
  export interface WalletAdapterProps {
    publicKey: PublicKey | null;
    connecting: boolean;
    connected: boolean;
    disconnecting: boolean;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: any, connection: any): Promise<string>;
  }
}

declare module '@solana/wallet-adapter-wallets' {
  export function getPhantomWallet(): any;
  export function getSolflareWallet(): any;
  export function getSolletWallet(): any;
  export function getLedgerWallet(): any;
  export function getSlopeWallet(): any;
}

declare module '@solana/wallet-adapter-react-ui' {
  export const WalletModalProvider: React.FC<{
    children: React.ReactNode;
  }>;
  export const WalletMultiButton: React.FC;
  export const WalletDisconnectButton: React.FC;
}
