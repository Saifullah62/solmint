'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ExternalLink, Copy, Check, X } from 'lucide-react';
import { 
  TokenData, 
  formatPrice, 
  formatLargeNumber, 
  formatPercentageChange, 
  getChangeColorClass,
  formatContractAddress
} from '@/services/tokenService';

interface TokenDetailsDialogProps {
  token: TokenData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TokenDetailsDialog = ({ token, isOpen, onClose }: TokenDetailsDialogProps) => {
  const [copied, setCopied] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  
  // Focus the close button when dialog opens
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Handle escape key to close dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogContentRef.current && 
        !dialogContentRef.current.contains(event.target as Node) && 
        isOpen
      ) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (!token) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="bg-solmint-black border-solmint-blackLight text-solmint-silver p-0 max-w-3xl w-full overflow-hidden rounded-xl shadow-xl"
      >
        <div ref={dialogContentRef} className="relative">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-solmint-violet to-solmint-violet/70 p-6 pb-16">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="relative w-12 h-12 mr-4 rounded-full overflow-hidden bg-solmint-black flex items-center justify-center border border-white/20">
                  {token.logoUrl ? (
                    <Image 
                      src={token.logoUrl} 
                      alt={`${token.name} logo`} 
                      width={48} 
                      height={48}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-xl font-bold text-solmint-violet">
                      {token.symbol.substring(0, 1)}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-['Sora'] text-white">{token.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-white/90">{token.symbol}</span>
                    <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full">
                      {token.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button
                ref={closeButtonRef}
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/10 text-white hover:text-white focus:ring-2 focus:ring-white/50"
                onClick={onClose}
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Token price card (overlapping the header) */}
          <div className="absolute left-6 right-6 -bottom-12">
            <div className="bg-solmint-blackLight border border-solmint-violet/20 rounded-xl p-4 shadow-lg">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-solmint-silver/70 text-sm mb-1">Price</div>
                  <div className="text-xl font-bold font-['Sora'] text-solmint-silverLight">{formatPrice(token.price)}</div>
                  <div className={`text-sm ${getChangeColorClass(token.change24h)}`}>
                    {formatPercentageChange(token.change24h)}
                  </div>
                </div>
                <div>
                  <div className="text-solmint-silver/70 text-sm mb-1">Market Cap</div>
                  <div className="text-lg font-medium text-solmint-silverLight">${formatLargeNumber(token.marketCap)}</div>
                </div>
                <div>
                  <div className="text-solmint-silver/70 text-sm mb-1">Holders</div>
                  <div className="text-lg font-medium text-solmint-silverLight">{formatLargeNumber(token.holders)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="p-6 pt-16">
          {/* Contract address */}
          <div className="mb-6">
            <div className="text-solmint-violet font-medium text-sm mb-2 bg-solmint-blackLight py-1 px-3 rounded-md inline-block">Contract Address</div>
            <div className="flex items-center">
              <div className="bg-solmint-blackLight border border-solmint-blackLight rounded-lg py-2 px-3 flex-1 font-mono text-sm overflow-hidden text-ellipsis text-solmint-silver">
                {token.contractAddress}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 hover:bg-solmint-blackLight text-solmint-silver/70 hover:text-solmint-mint transition-colors"
                onClick={() => copyToClipboard(token.contractAddress)}
                aria-label={copied ? "Copied to clipboard" : "Copy contract address to clipboard"}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-solmint-mint" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <div className="text-solmint-violet font-medium text-sm mb-2 bg-solmint-blackLight py-1 px-3 rounded-md inline-block">About</div>
            <p className="text-solmint-silverLight leading-relaxed font-['Inter'] bg-solmint-blackLight p-3 rounded-lg border border-solmint-blackLight">
              {token.description}
            </p>
          </div>
          
          {/* External links */}
          <div>
            <div className="text-solmint-violet font-medium text-sm mb-2 bg-solmint-blackLight py-1 px-3 rounded-md inline-block">Links</div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://solscan.io/token/${token.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-solmint-blackLight hover:bg-solmint-violet/10 border border-solmint-blackLight hover:border-solmint-violet/20 rounded-lg py-2 px-4 text-sm flex items-center gap-2 transition-colors text-solmint-silver hover:text-solmint-silverLight"
                aria-label={`View ${token.symbol} on Solscan`}
              >
                <ExternalLink className="h-4 w-4" />
                Solscan
              </a>
              
              <a
                href={`https://jup.ag/swap/USDC-${token.symbol}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-solmint-blackLight hover:bg-solmint-violet/10 border border-solmint-blackLight hover:border-solmint-violet/20 rounded-lg py-2 px-4 text-sm flex items-center gap-2 transition-colors text-solmint-silver hover:text-solmint-silverLight"
                aria-label={`Trade ${token.symbol} on Jupiter`}
              >
                <ExternalLink className="h-4 w-4" />
                Trade on Jupiter
              </a>
              
              <a
                href={`https://dexscreener.com/solana/${token.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-solmint-blackLight hover:bg-solmint-violet/10 border border-solmint-blackLight hover:border-solmint-violet/20 rounded-lg py-2 px-4 text-sm flex items-center gap-2 transition-colors text-solmint-silver hover:text-solmint-silverLight"
                aria-label={`View ${token.symbol} on DexScreener`}
              >
                <ExternalLink className="h-4 w-4" />
                DexScreener
              </a>
            </div>
          </div>
          
          {/* Buy button */}
          <div className="mt-6 flex justify-center">
            <a 
              href={`https://jup.ag/swap/USDC-${token.symbol}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs bg-solmint-violet hover:bg-solmint-violet/90 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 no-underline"
              aria-label={`Buy ${token.symbol}`}
            >
              Buy {token.symbol}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
