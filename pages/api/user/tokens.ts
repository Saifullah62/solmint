import { NextApiRequest, NextApiResponse } from 'next';
import { TokenData } from '@/services/tokenService';

// Sample token data that can be used for any wallet
const sampleTokens: TokenData[] = [
  {
    id: 'solmint-demo',
    name: 'SOLMINT Demo Token',
    symbol: 'SDEMO',
    price: 1.42,
    change24h: 5.2,
    volume24h: 45620,
    marketCap: 1420000,
    holders: 1243,
    logoUrl: null,
    contractAddress: '7KVJjYJxQPcUFwEpgMkwTBM2SiAm5FXCxR9Vye5SLxHy',
    description: 'SOLMINT Demo Token for testing the platform features',
    category: 'Utility',
    placementTier: 'premium'
  },
  {
    id: 'test-governance',
    name: 'Test Governance Token',
    symbol: 'TGOV',
    price: 0.75,
    change24h: -2.1,
    volume24h: 23450,
    marketCap: 750000,
    holders: 856,
    logoUrl: null,
    contractAddress: '3XysA6Qw3E2muBEXEkgqGDN1VgKEjUMhxTMSzxMKxLq2',
    description: 'A governance token for community voting and decision making',
    category: 'Governance',
    placementTier: 'growth'
  }
];

// In-memory storage for development/testing
// In production, this would be replaced with a database query
const userTokens: Record<string, TokenData[]> = {
  // Sample user with wallet address as key
  "7KVJjYJxQPcUFwEpgMkwTBM2SiAm5FXCxR9Vye5SLxHy": [
    {
      id: 'solmint-demo',
      name: 'SOLMINT Demo Token',
      symbol: 'SDEMO',
      price: 1.42,
      change24h: 5.2,
      volume24h: 45620,
      marketCap: 1420000,
      holders: 1243,
      logoUrl: null,
      contractAddress: '7KVJjYJxQPcUFwEpgMkwTBM2SiAm5FXCxR9Vye5SLxHy',
      description: 'SOLMINT Demo Token for testing the platform features',
      category: 'Utility',
      placementTier: 'premium'
    }
  ],
  // Another sample user
  "3XysA6Qw3E2muBEXEkgqGDN1VgKEjUMhxTMSzxMKxLq2": [
    {
      id: 'test-governance',
      name: 'Test Governance Token',
      symbol: 'TGOV',
      price: 0.75,
      change24h: -2.1,
      volume24h: 23450,
      marketCap: 750000,
      holders: 856,
      logoUrl: null,
      contractAddress: '3XysA6Qw3E2muBEXEkgqGDN1VgKEjUMhxTMSzxMKxLq2',
      description: 'A governance token for community voting and decision making',
      category: 'Governance',
      placementTier: 'growth'
    }
  ],
  // Default user for testing (no wallet)
  "default": [
    {
      id: 'solmint-demo',
      name: 'SOLMINT Demo Token',
      symbol: 'SDEMO',
      price: 1.42,
      change24h: 5.2,
      volume24h: 45620,
      marketCap: 1420000,
      holders: 1243,
      logoUrl: null,
      contractAddress: '7KVJjYJxQPcUFwEpgMkwTBM2SiAm5FXCxR9Vye5SLxHy',
      description: 'SOLMINT Demo Token for testing the platform features',
      category: 'Utility',
      placementTier: 'premium'
    }
  ]
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // In a real implementation, you would get the user's wallet address from the session
      // For now, we'll use the wallet address from the query params or a default
      const walletAddress = req.query.wallet as string || 'default';
      
      // Get the user's tokens or use sample tokens if none exist
      // This ensures any connected wallet will see the example tokens
      let tokens = userTokens[walletAddress] || [];
      
      // If no tokens found for this wallet, provide the sample tokens
      // This ensures any wallet will see the example tokens
      if (tokens.length === 0 && walletAddress !== 'default') {
        tokens = sampleTokens;
      }
      
      // Return the tokens
      return res.status(200).json({
        success: true,
        data: tokens
      });
    } catch (error) {
      console.error('Error fetching user tokens:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Internal server error' 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
