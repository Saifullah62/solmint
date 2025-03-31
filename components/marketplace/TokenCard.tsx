'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ExternalLink, Info, Star } from 'lucide-react';
import { 
  TokenData,
  formatPrice, 
  formatLargeNumber, 
  formatPercentageChange,
  getChangeColorClass
} from '@/services/tokenService';

interface TokenCardProps {
  token: TokenData;
  onViewDetails: (token: TokenData) => void;
  featured?: boolean;
}

export const TokenCard = ({ token, onViewDetails, featured = false }: TokenCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onViewDetails(token);
    }
  };
  
  const handleClick = useCallback(() => {
    onViewDetails(token);
  }, [token, onViewDetails]);
  
  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(token);
  };
  
  return (
    <div 
      ref={cardRef}
      className={`bg-[#1A1A40] border rounded-xl overflow-hidden transition-all duration-200 ${
        featured 
          ? 'border-[#8A2BE2] shadow-lg shadow-[#8A2BE2]/10' 
          : isHovering 
            ? 'border-[#8A2BE2]/50 shadow-lg shadow-[#8A2BE2]/10 transform scale-[1.01]' 
            : 'border-[#1A1A40]'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${token.name} (${token.symbol})`}
    >
      {featured && (
        <div className="bg-gradient-to-r from-[#8A2BE2] to-[#8A2BE2]/70 py-1 px-3 flex items-center justify-center">
          <Star className="h-3 w-3 text-white mr-1 fill-white" />
          <span className="text-xs font-medium text-white">Featured Token</span>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="relative w-10 h-10 mr-3 rounded-full overflow-hidden bg-[#0E0E2C] flex items-center justify-center border border-[#8A2BE2]/20">
            {token.logoUrl ? (
              <Image 
                src={token.logoUrl} 
                alt={`${token.name} logo`} 
                width={40} 
                height={40}
                className="object-contain"
              />
            ) : (
              <span className="text-lg font-bold text-[#8A2BE2]">
                {token.symbol.substring(0, 1)}
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-white font-['Sora']">{token.name}</h3>
            <div className="flex items-center">
              <span className="text-sm text-[#DADADA] mr-2">{token.symbol}</span>
              <span className={`text-xs ${getChangeColorClass(token.change24h)}`}>
                {formatPercentageChange(token.change24h)}
              </span>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full text-[#DADADA] hover:text-white hover:bg-[#0E0E2C] focus:ring-2 focus:ring-[#8A2BE2]/30"
            onClick={handleViewDetailsClick}
            aria-label={`View details for ${token.name}`}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-[#DADADA]">Price</span>
            <span className="font-medium text-white">{formatPrice(token.price)}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-[#DADADA]">Volume (24h)</span>
            <span className="text-white">${formatLargeNumber(token.volume24h)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#DADADA]">Market Cap</span>
            <span className="text-white">${formatLargeNumber(token.marketCap)}</span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <a 
            href={`https://solscan.io/token/${token.contractAddress}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#A35FEA] hover:text-[#8A2BE2] text-sm flex items-center transition-colors"
            onClick={handleExternalLinkClick}
            aria-label={`View ${token.symbol} on Solscan`}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Solscan
          </a>
          <a 
            href={`https://jup.ag/swap/USDC-${token.symbol}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#A35FEA] hover:text-[#8A2BE2] text-sm flex items-center transition-colors"
            onClick={handleExternalLinkClick}
            aria-label={`Trade ${token.symbol} on Jupiter`}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Trade
          </a>
        </div>
        
        {/* Token category tag */}
        <div className="mt-3 flex justify-end">
          <span className="bg-[#8A2BE2]/10 text-[#A35FEA] text-xs px-2 py-0.5 rounded-full">
            {token.category}
          </span>
        </div>
      </div>
    </div>
  );
};
