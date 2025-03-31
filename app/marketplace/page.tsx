'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { TokenCard } from '@/components/marketplace/TokenCard';
import { TokenDetailsDialog } from '@/components/marketplace/TokenDetailsDialog';
import { TokenFilters, FilterOptions } from '@/components/marketplace/TokenFilters';
import { Button } from '@/components/ui/button';
import { TOKEN_CATEGORIES, filterAndSortTokens, TokenData } from '@/services/tokenService';
import { Loader2, AlertCircle, RefreshCw, Search, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function MarketplacePage() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<TokenData[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    sortBy: 'volume',
    sortDirection: 'desc',
    priceRange: [0, 1000],
    categories: []
  });

  // This would normally fetch from an API
  // For now, we'll create some sample data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // In a real implementation, this would be an API call
        // const response = await fetch('/api/tokens');
        // const data = await response.json();
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Sample data for demonstration
        const sampleTokens: TokenData[] = [
          {
            id: 'solana',
            name: 'Solana',
            symbol: 'SOL',
            price: 142.58,
            change24h: 3.45,
            volume24h: 1_250_000_000,
            marketCap: 65_000_000_000,
            holders: 1_200_000,
            logoUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png',
            contractAddress: 'So11111111111111111111111111111111111111112',
            description: 'Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale.',
            category: 'Infrastructure',
            placementTier: 'premium'
          },
          {
            id: 'jupiter',
            name: 'Jupiter',
            symbol: 'JUP',
            price: 1.23,
            change24h: -2.15,
            volume24h: 120_000_000,
            marketCap: 1_500_000_000,
            holders: 450_000,
            logoUrl: 'https://cryptologos.cc/logos/jupiter-jup-logo.png',
            contractAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
            description: 'Jupiter is the key liquidity aggregator for Solana, offering the widest range of tokens and best route discovery between any token pair.',
            category: 'DeFi',
            placementTier: 'premium'
          },
          {
            id: 'bonk',
            name: 'Bonk',
            symbol: 'BONK',
            price: 0.00002458,
            change24h: 5.67,
            volume24h: 85_000_000,
            marketCap: 1_200_000_000,
            holders: 650_000,
            logoUrl: 'https://cryptologos.cc/logos/bonk-bonk-logo.png',
            contractAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
            description: 'BONK is the first Solana dog coin for the people, by the people.',
            category: 'Meme',
            placementTier: 'growth'
          },
          {
            id: 'pyth',
            name: 'Pyth Network',
            symbol: 'PYTH',
            price: 0.58,
            change24h: 1.23,
            volume24h: 45_000_000,
            marketCap: 750_000_000,
            holders: 280_000,
            logoUrl: 'https://cryptologos.cc/logos/pyth-network-pyth-logo.png',
            contractAddress: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
            description: 'Pyth delivers real-time market data for equities, FX, and crypto to enable DeFi applications.',
            category: 'Infrastructure',
            placementTier: 'growth'
          },
          {
            id: 'render',
            name: 'Render Network',
            symbol: 'RNDR',
            price: 7.85,
            change24h: -1.05,
            volume24h: 65_000_000,
            marketCap: 3_200_000_000,
            holders: 180_000,
            logoUrl: 'https://cryptologos.cc/logos/render-token-rndr-logo.png',
            contractAddress: 'rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof',
            description: 'Render Network connects GPU compute power with artists seeking to render their work.',
            category: 'AI',
            placementTier: 'basic'
          },
          {
            id: 'mango',
            name: 'Mango Markets',
            symbol: 'MNGO',
            price: 0.085,
            change24h: 2.34,
            volume24h: 12_000_000,
            marketCap: 85_000_000,
            holders: 95_000,
            logoUrl: 'https://cryptologos.cc/logos/mango-markets-mngo-logo.png',
            contractAddress: 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac',
            description: 'Mango offers decentralized, cross-margin trading with up to 5x leverage for spot and perpetual futures.',
            category: 'DeFi',
            placementTier: 'basic'
          }
        ];
        
        setTokens(sampleTokens);
        setFilteredTokens(sampleTokens);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching token data:', err);
        setError('Failed to load token data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    if (tokens.length > 0) {
      const filtered = filterAndSortTokens(tokens, {
        search: filters.search,
        categories: filters.categories,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection
      });
      setFilteredTokens(filtered);
    }
  }, [filters, tokens]);
  
  const handleViewDetails = (token: TokenData) => {
    setSelectedToken(token);
    setIsDetailsOpen(true);
  };
  
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    // Simulate fetching data again
    setTimeout(() => {
      // Sample data for demonstration (same as above)
      // In a real implementation, this would call the API again
      setIsLoading(false);
    }, 1500);
  };

  // Group tokens by placement tier
  const premiumTokens = filteredTokens.filter(token => token.placementTier === 'premium');
  const growthTokens = filteredTokens.filter(token => token.placementTier === 'growth');
  const basicTokens = filteredTokens.filter(token => token.placementTier === 'basic');
  const otherTokens = filteredTokens.filter(token => !token.placementTier);
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-white">Token Marketplace</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              {!isLoading && (
                <>
                  <span>Showing {filteredTokens.length} of {tokens.length} tokens</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 hover:bg-solmint-black rounded-full"
                    onClick={handleRetry}
                    aria-label="Refresh token data"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            
            <Link href="/launchpad">
              <Button className="gap-2">
                <Rocket className="h-4 w-4" />
                Launch Your Token
              </Button>
            </Link>
          </div>
        </div>
        
        <TokenFilters 
          onFilterChange={handleFilterChange}
          availableCategories={TOKEN_CATEGORIES}
        />
        
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-16 bg-solmint-blackLight border border-solmint-blackLight rounded-lg">
            <Loader2 className="h-10 w-10 text-solmint-violet animate-spin mb-4" />
            <span className="text-white text-lg">Loading tokens...</span>
            <p className="text-gray-400 text-sm mt-2">Fetching the latest token data</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 flex flex-col items-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <p className="text-white text-lg mb-2">Unable to load tokens</p>
            <p className="text-gray-300 mb-6 text-center">{error}</p>
            <Button onClick={handleRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Try Again
            </Button>
          </div>
        ) : filteredTokens.length === 0 ? (
          <div className="bg-solmint-blackLight border border-solmint-blackLight rounded-lg p-8 text-center">
            <div className="flex flex-col items-center">
              <Search className="h-10 w-10 text-gray-500 mb-4" />
              <p className="text-white text-lg mb-2">No tokens found</p>
              <p className="text-gray-300 mb-6">
                {filters.search 
                  ? `No results found for "${filters.search}"`
                  : filters.categories.length > 0 
                    ? `No tokens found in the selected categories`
                    : `No tokens match your current filters`
                }
              </p>
              <Button 
                onClick={() => setFilters({
                  search: '',
                  sortBy: 'volume',
                  sortDirection: 'desc',
                  priceRange: [0, 1000],
                  categories: []
                })}
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Premium Tier Tokens - Featured Placement */}
            {premiumTokens.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold text-white">Featured Tokens</h2>
                  <span className="bg-solmint-violet/20 text-solmint-violet text-xs px-2 py-1 rounded-full">
                    Premium
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {premiumTokens.map(token => (
                    <TokenCard 
                      key={token.id} 
                      token={token} 
                      onViewDetails={handleViewDetails}
                      featured={true}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Growth Tier Tokens */}
            {growthTokens.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-bold text-white">Premium Listings</h2>
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                    Growth
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {growthTokens.map(token => (
                    <TokenCard 
                      key={token.id} 
                      token={token} 
                      onViewDetails={handleViewDetails}
                      featured={false}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Basic Tier and Other Tokens */}
            {(basicTokens.length > 0 || otherTokens.length > 0) && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">All Tokens</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...basicTokens, ...otherTokens].map(token => (
                    <TokenCard 
                      key={token.id} 
                      token={token} 
                      onViewDetails={handleViewDetails}
                      featured={false}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Show pagination UI if we had more tokens */}
            {tokens.length > 9 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="default" size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Token details dialog */}
        <TokenDetailsDialog 
          token={selectedToken}
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
        />
      </div>
    </MainLayout>
  );
}
