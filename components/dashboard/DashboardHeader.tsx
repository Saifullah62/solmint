'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, ChevronDown, Settings, LogOut } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { QuickHelp } from './QuickHelp';
import { TokenSelector } from './TokenSelector';

interface Token {
  id: string;
  name: string;
  symbol: string;
  logoUrl: string | null;
}

interface DashboardHeaderProps {
  activeTokenSymbol: string;
}

export const DashboardHeader = ({ activeTokenSymbol }: DashboardHeaderProps) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Mock data - would be replaced with real data from API
  const tokens: Token[] = [
    {
      id: '1',
      name: 'SOLMINT Demo Token',
      symbol: 'SDEMO',
      logoUrl: null
    },
    {
      id: '2',
      name: 'Test Governance Token',
      symbol: 'TGOV',
      logoUrl: null
    }
  ];
  
  const activeToken = tokens.find(token => token.symbol === activeTokenSymbol) || tokens[0];
  
  const [selectedToken, setSelectedToken] = useState<Token>(activeToken);
  
  return (
    <div className="bg-[#0E0E2C] border-b border-[#1A1A40] sticky top-0 z-10">
      <div className="container mx-auto py-4 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white font-['Sora']">Creator Dashboard</h1>
            <p className="text-[#DADADA] text-sm md:text-base mt-1">
              Manage your tokens, track performance, and grow your community
            </p>
          </div>
          
          <div className="flex items-center gap-3 self-end md:self-auto">
            <TokenSelector 
              activeToken={selectedToken}
              tokens={tokens}
              onTokenSelect={setSelectedToken}
            />
            
            <Button 
              className="bg-[#8A2BE2] hover:bg-[#6A1CB0] text-white hidden md:flex"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Launch New Token
            </Button>
            
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <QuickHelp />
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-[#8A2BE2]/10 text-white hover:bg-[#8A2BE2]/20"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User menu"
                >
                  <span className="text-sm font-medium">JD</span>
                </Button>
                
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#0E0E2C] border border-[#1A1A40] rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="p-3 border-b border-[#1A1A40]">
                      <div className="text-sm font-medium text-white">John Doe</div>
                      <div className="text-xs text-[#DADADA]">john.doe@example.com</div>
                    </div>
                    
                    <div className="py-1">
                      <button className="w-full text-left px-3 py-2 flex items-center text-[#DADADA] hover:bg-[#1A1A40] hover:text-white transition-colors">
                        <Settings className="h-4 w-4 mr-2" />
                        <span className="text-sm">Account Settings</span>
                      </button>
                      <button className="w-full text-left px-3 py-2 flex items-center text-[#DADADA] hover:bg-[#1A1A40] hover:text-white transition-colors">
                        <LogOut className="h-4 w-4 mr-2" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
