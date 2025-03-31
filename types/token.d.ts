// Token configuration types
export interface TokenMetadata {
  uri: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
}

export interface TokenConfig {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  mintAuthority: string | null;
  freezeAuthority: string | null;
  metadata: TokenMetadata;
}

// Network types
export type Network = 'devnet' | 'mainnet-beta';

// Token creation step types
export type TokenCreationStep = 'configure' | 'review' | 'deploy' | 'create' | 'complete' | 'success';

// Security types
export enum RiskLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface SecurityIssue {
  id: string;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  recommendation: string;
}

export interface SecurityReport {
  issues: SecurityIssue[];
  score: number;
  summary: string;
}
