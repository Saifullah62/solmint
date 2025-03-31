'use client';

import { useWallet } from '@/components/WalletContextProvider';
import { useUser } from '@/context/UserContext';
import { Sun, Moon, Menu, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from '../brand/Logo';

export const TopNav = () => {
  const { connected, connect, disconnect, publicKey } = useWallet();
  const { user, isLoggedIn } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Only show the UI after component has mounted to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    // In a real implementation, this would toggle a class on the html element
    // and update localStorage
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light');
  };

  return (
    <header className="sticky top-0 z-20 w-full h-16 border-b border-border bg-[#0E0E2C]/90 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="md:hidden">
          <button className="p-2 text-white rounded-md hover:bg-[#1A1A40]">
            <Menu className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center">
          <Logo size="md" variant="full" className="hidden md:flex" />
          <Logo size="sm" variant="icon" className="md:hidden" />
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-[#DADADA] hover:bg-[#1A1A40]"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          {mounted && (
            <div className="relative z-10">
              {connected && isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="px-4 py-2 rounded-md bg-solmint-violet hover:bg-solmint-violet/80 text-white transition-colors flex items-center gap-2"
                  >
                    <span className="font-mono text-sm">
                      {user?.wallet ? `${user.wallet.substring(0, 4)}...${user.wallet.substring(user.wallet.length - 4)}` : 'Connected'}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-solmint-blackLight rounded-md shadow-lg overflow-hidden z-20">
                      <div className="p-3 border-b border-gray-700">
                        <p className="text-white text-sm font-medium">Wallet</p>
                        <p className="text-gray-400 text-xs font-mono truncate">{user?.wallet || publicKey}</p>
                      </div>
                      <button
                        onClick={() => {
                          disconnect();
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white hover:bg-solmint-violet/20 transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={connect}
                  className="px-4 py-2 rounded-md bg-solmint-violet hover:bg-solmint-violet/80 text-white transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
