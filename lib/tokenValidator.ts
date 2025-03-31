import { PublicKey } from '@solana/web3.js';

// Define the token configuration interface
interface TokenConfig {
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

// Define the security risk levels
export enum RiskLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Define the security issue interface
export interface SecurityIssue {
  id: string;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  recommendation: string;
}

/**
 * Validates a token configuration and returns security issues
 */
export function validateTokenSecurity(config: TokenConfig): SecurityIssue[] {
  const issues: SecurityIssue[] = [];

  // Check for missing metadata
  if (!config.metadata.description) {
    issues.push({
      id: 'missing-description',
      title: 'Missing Token Description',
      description: 'Your token does not have a description, which reduces transparency and trust.',
      riskLevel: RiskLevel.LOW,
      recommendation: 'Add a clear description explaining the purpose and utility of your token.',
    });
  }

  if (!config.metadata.image) {
    issues.push({
      id: 'missing-image',
      title: 'Missing Token Image',
      description: 'Your token does not have an image, which makes it harder to recognize in wallets and exchanges.',
      riskLevel: RiskLevel.LOW,
      recommendation: 'Add a distinctive image or logo for your token.',
    });
  }

  // Check mint authority configuration
  if (config.mintAuthority) {
    try {
      // Validate that the mint authority is a valid public key
      new PublicKey(config.mintAuthority);
    } catch (error) {
      issues.push({
        id: 'invalid-mint-authority',
        title: 'Invalid Mint Authority',
        description: 'The mint authority address is not a valid Solana public key.',
        riskLevel: RiskLevel.CRITICAL,
        recommendation: 'Enter a valid Solana address for the mint authority.',
      });
    }
  } else {
    // No mint authority specified, will default to the creator's wallet
    issues.push({
      id: 'default-mint-authority',
      title: 'Default Mint Authority',
      description: 'You are using your wallet as the mint authority. This means you will be able to mint more tokens in the future.',
      riskLevel: RiskLevel.MEDIUM,
      recommendation: 'Consider setting a null mint authority after initial distribution to create a fixed supply token.',
    });
  }

  // Check freeze authority configuration
  if (config.freezeAuthority) {
    try {
      // Validate that the freeze authority is a valid public key
      new PublicKey(config.freezeAuthority);
    } catch (error) {
      issues.push({
        id: 'invalid-freeze-authority',
        title: 'Invalid Freeze Authority',
        description: 'The freeze authority address is not a valid Solana public key.',
        riskLevel: RiskLevel.CRITICAL,
        recommendation: 'Enter a valid Solana address for the freeze authority.',
      });
    }
  } else {
    // No freeze authority specified, will default to the creator's wallet
    issues.push({
      id: 'default-freeze-authority',
      title: 'Default Freeze Authority',
      description: 'You are using your wallet as the freeze authority. This means you will be able to freeze token accounts in the future.',
      riskLevel: RiskLevel.LOW,
      recommendation: 'This is generally acceptable, but consider if your use case requires this capability.',
    });
  }

  // Check decimals
  if (config.decimals === 0) {
    issues.push({
      id: 'zero-decimals',
      title: 'Zero Decimals',
      description: 'Your token has 0 decimals, making it non-divisible (whole units only).',
      riskLevel: RiskLevel.NONE,
      recommendation: 'This is appropriate for NFT-like tokens or whole-unit items, but not for typical cryptocurrencies.',
    });
  } else if (config.decimals < 6) {
    issues.push({
      id: 'low-decimals',
      title: 'Low Decimal Precision',
      description: `Your token has ${config.decimals} decimals, which is lower than the standard 6-9 decimals used by most tokens.`,
      riskLevel: RiskLevel.LOW,
      recommendation: 'Consider using 6 decimals (like USDC) or 9 decimals (like SOL) for better compatibility.',
    });
  } else if (config.decimals > 9) {
    issues.push({
      id: 'high-decimals',
      title: 'High Decimal Precision',
      description: `Your token has ${config.decimals} decimals, which is higher than the standard 9 decimals used by most tokens.`,
      riskLevel: RiskLevel.MEDIUM,
      recommendation: 'Use 9 decimals (like SOL) for standard compatibility. Higher values may cause display issues in some wallets.',
    });
  }

  // Check initial supply
  if (config.initialSupply > 1_000_000_000_000) {
    issues.push({
      id: 'very-high-supply',
      title: 'Very High Initial Supply',
      description: 'Your token has an extremely high initial supply, which may affect perception of token value.',
      riskLevel: RiskLevel.MEDIUM,
      recommendation: 'Consider reducing the initial supply or adjusting decimals to achieve desired per-token pricing.',
    });
  }

  return issues;
}

/**
 * Generates a security report for a token configuration
 */
export function generateSecurityReport(config: TokenConfig): {
  issues: SecurityIssue[];
  score: number;
  summary: string;
} {
  const issues = validateTokenSecurity(config);
  
  // Calculate security score (0-100)
  let score = 100;
  
  for (const issue of issues) {
    switch (issue.riskLevel) {
      case RiskLevel.LOW:
        score -= 5;
        break;
      case RiskLevel.MEDIUM:
        score -= 10;
        break;
      case RiskLevel.HIGH:
        score -= 20;
        break;
      case RiskLevel.CRITICAL:
        score -= 40;
        break;
      default:
        break;
    }
  }
  
  // Ensure score is within 0-100 range
  score = Math.max(0, Math.min(100, score));
  
  // Generate summary based on score
  let summary = '';
  
  if (score >= 90) {
    summary = 'Excellent security configuration. Your token is well-configured with minimal security concerns.';
  } else if (score >= 70) {
    summary = 'Good security configuration. Your token has some minor security considerations to address.';
  } else if (score >= 50) {
    summary = 'Moderate security configuration. Your token has several security issues that should be addressed.';
  } else if (score >= 30) {
    summary = 'Poor security configuration. Your token has significant security issues that must be addressed.';
  } else {
    summary = 'Critical security issues detected. Your token configuration has severe problems that must be fixed before deployment.';
  }
  
  return {
    issues,
    score,
    summary,
  };
}
