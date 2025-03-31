'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check, Search } from 'lucide-react';

interface Token {
  id: string;
  name: string;
  symbol: string;
  logoUrl: string | null;
}

interface TokenSelectorProps {
  activeToken: Token;
  tokens: Token[];
  onTokenSelect: (token: Token) => void;
}

export const TokenSelector = ({ activeToken, tokens, onTokenSelect }: TokenSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="relative">
      <Button 
        className="bg-[#0E0E2C] hover:bg-[#1A1A40] text-white border border-[#1A1A40] flex items-center gap-2 min-w-[160px] justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <div className="w-5 h-5 rounded-full bg-[#8A2BE2]/20 flex items-center justify-center mr-2">
            <span className="text-xs font-bold text-[#8A2BE2]">
              {activeToken.symbol.substring(0, 1)}
            </span>
          </div>
          <span>{activeToken.symbol}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[#0E0E2C] border border-[#1A1A40] rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-[#1A1A40]">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#DADADA]" />
              <input
                type="text"
                placeholder="Search tokens..."
                className="w-full bg-[#1A1A40] border-none rounded-md py-2 pl-8 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#8A2BE2]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredTokens.length > 0 ? (
              filteredTokens.map(token => (
                <button
                  key={token.id}
                  className={`w-full text-left px-3 py-2 flex items-center hover:bg-[#1A1A40] transition-colors ${
                    token.id === activeToken.id ? 'bg-[#1A1A40]' : ''
                  }`}
                  onClick={() => {
                    onTokenSelect(token);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-[#8A2BE2]/20 flex items-center justify-center mr-2">
                    <span className="text-xs font-bold text-[#8A2BE2]">
                      {token.symbol.substring(0, 1)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{token.symbol}</div>
                    <div className="text-xs text-[#DADADA]">{token.name}</div>
                  </div>
                  {token.id === activeToken.id && (
                    <Check className="h-4 w-4 text-[#8A2BE2]" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-[#DADADA] text-sm">
                No tokens found matching "{searchQuery}"
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-[#1A1A40]">
            <Button 
              className="w-full bg-[#8A2BE2] hover:bg-[#6A1CB0] text-white text-sm"
              onClick={() => {
                setIsOpen(false);
                setSearchQuery('');
                // This would navigate to token creation page
              }}
            >
              Create New Token
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
