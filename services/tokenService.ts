// Token service for handling token data, filtering, and sorting

export const TOKEN_CATEGORIES = [
  'DeFi',
  'Infrastructure',
  'Meme',
  'Gaming',
  'NFT',
  'AI',
  'Social',
  'Metaverse'
];

interface SortOptions {
  sortBy: 'price' | 'volume' | 'marketCap' | 'change';
  sortDirection: 'asc' | 'desc';
}

interface FilterCriteria {
  search?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy: 'price' | 'volume' | 'marketCap' | 'change';
  sortDirection: 'asc' | 'desc';
}

export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  holders: number;
  logoUrl: string | null;
  contractAddress: string;
  description: string;
  category: string;
  placementTier?: 'premium' | 'growth' | 'basic';
}

/**
 * Filter and sort tokens based on provided criteria
 * @param tokens Array of token data
 * @param criteria Filter and sort criteria
 * @returns Filtered and sorted array of tokens
 */
export const filterAndSortTokens = (tokens: TokenData[], criteria: FilterCriteria): TokenData[] => {
  // Apply filters
  let filteredTokens = [...tokens];
  
  // Filter by search term
  if (criteria.search && criteria.search.trim() !== '') {
    const searchTerm = criteria.search.toLowerCase().trim();
    filteredTokens = filteredTokens.filter(token => 
      token.name.toLowerCase().includes(searchTerm) || 
      token.symbol.toLowerCase().includes(searchTerm) ||
      token.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by categories
  if (criteria.categories && criteria.categories.length > 0) {
    filteredTokens = filteredTokens.filter(token => 
      criteria.categories!.includes(token.category)
    );
  }
  
  // Filter by price range
  if (criteria.minPrice !== undefined) {
    filteredTokens = filteredTokens.filter(token => token.price >= criteria.minPrice!);
  }
  
  if (criteria.maxPrice !== undefined) {
    filteredTokens = filteredTokens.filter(token => token.price <= criteria.maxPrice!);
  }
  
  // Apply sorting
  return sortTokens(filteredTokens, {
    sortBy: criteria.sortBy,
    sortDirection: criteria.sortDirection
  });
};

/**
 * Sort tokens based on sort options
 * @param tokens Array of token data
 * @param options Sort options
 * @returns Sorted array of tokens
 */
export const sortTokens = (tokens: TokenData[], options: SortOptions): TokenData[] => {
  const { sortBy, sortDirection } = options;
  
  return [...tokens].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'volume':
        comparison = a.volume24h - b.volume24h;
        break;
      case 'marketCap':
        comparison = a.marketCap - b.marketCap;
        break;
      case 'change':
        comparison = a.change24h - b.change24h;
        break;
      default:
        comparison = a.volume24h - b.volume24h;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
};

/**
 * Format price with appropriate precision based on value
 * @param price Price value
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  if (price === 0) return '$0.00';
  
  if (price < 0.0001) {
    return `$${price.toExponential(2)}`;
  } else if (price < 0.01) {
    return `$${price.toFixed(6)}`;
  } else if (price < 1) {
    return `$${price.toFixed(4)}`;
  } else if (price < 1000) {
    return `$${price.toFixed(2)}`;
  } else if (price < 1000000) {
    return `$${(price / 1000).toFixed(2)}K`;
  } else if (price < 1000000000) {
    return `$${(price / 1000000).toFixed(2)}M`;
  } else {
    return `$${(price / 1000000000).toFixed(2)}B`;
  }
};

/**
 * Format large numbers with K, M, B suffixes
 * @param value Numeric value
 * @returns Formatted string
 */
export const formatLargeNumber = (value: number): string => {
  if (value === 0) return '0';
  
  if (value < 1000) {
    return value.toString();
  } else if (value < 1000000) {
    return `${(value / 1000).toFixed(1)}K`;
  } else if (value < 1000000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
};

/**
 * Format percentage change with + or - sign
 * @param change Percentage change value
 * @returns Formatted percentage string
 */
export const formatPercentageChange = (change: number): string => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
};

/**
 * Get CSS color class based on percentage change
 * @param change Percentage change value
 * @returns CSS class name
 */
export const getChangeColorClass = (change: number): string => {
  if (change > 0) {
    return 'text-green-500';
  } else if (change < 0) {
    return 'text-red-500';
  } else {
    return 'text-gray-400';
  }
};

/**
 * Truncate text with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format contract address for display
 * @param address Contract address
 * @returns Formatted address string
 */
export const formatContractAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};
