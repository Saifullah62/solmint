// Token creation step type
export type TokenCreationStep = 'configure' | 'review' | 'deploy' | 'create' | 'success';

// Token configuration interface
export interface TokenConfig {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  mintAuthority: string | null;
  freezeAuthority: string | null;
  metadata: {
    uri: string;
    name: string;
    symbol: string;
    description: string;
    image: string;
  };
}

// Network type
export type Network = 'devnet' | 'mainnet-beta';
