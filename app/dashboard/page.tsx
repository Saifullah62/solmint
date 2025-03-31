'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { TokenStats } from '@/components/dashboard/TokenStats';
import { GrowthTools } from '@/components/dashboard/GrowthTools';
import { TokenManagement } from '@/components/dashboard/TokenManagement';
import { CommunityInsights } from '@/components/dashboard/CommunityInsights';
import { EventsCalendar } from '@/components/dashboard/EventsCalendar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { WalletConnect } from '@/components/dashboard/WalletConnect';
import { Button } from '@/components/ui/button';
import { Rocket, ChevronRight, ArrowRight, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useTokenService } from '@/hooks/useTokenService';
import { useWallet } from '@/components/WalletContextProvider';

export default function DashboardPage() {
  // Use the token service hook to get real token data
  const { tokens, isLoading, error, refreshTokens, hasTokens } = useTokenService();
  const { connected } = useWallet();
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  
  // Current date for the dashboard
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get the active token
  const activeToken = selectedTokenId 
    ? tokens.find(token => token.id === selectedTokenId) 
    : tokens.length > 0 ? tokens[0] : null;
  
  // Get the active token symbol for the header
  const activeTokenSymbol = activeToken?.symbol || '';
  
  return (
    <MainLayout>
      <DashboardHeader activeTokenSymbol={activeTokenSymbol} />
      
      <div className="container mx-auto py-6 px-4">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-16 bg-solmint-blackLight border border-solmint-blackLight rounded-lg">
            <Loader2 className="h-10 w-10 text-solmint-violet animate-spin mb-4" />
            <span className="text-white text-lg">Loading your dashboard...</span>
            <p className="text-gray-400 text-sm mt-2">Fetching your token data</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 flex flex-col items-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <p className="text-white text-lg mb-2">Unable to load your dashboard</p>
            <p className="text-gray-300 mb-6 text-center">{error}</p>
            <Button onClick={refreshTokens} className="gap-2">
              <ArrowRight className="h-4 w-4" /> Try Again
            </Button>
          </div>
        ) : !connected ? (
          // Not connected state
          <div className="bg-solmint-blackLight border border-solmint-blackLight rounded-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Welcome to SOLMINT</h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Connect your wallet to access your dashboard and manage your tokens. If you don't have any tokens yet, 
                you can create and launch your own token in minutes.
              </p>
              <div className="mt-6">
                <WalletConnect />
              </div>
            </div>
            
            <div className="mt-12 mb-8">
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Getting Started with SOLMINT</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-solmint-black p-6 rounded-lg border border-solmint-blackLight">
                  <div className="bg-solmint-violet/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-solmint-violet font-semibold">1</span>
                  </div>
                  <h3 className="text-white font-medium mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-400 text-sm">Connect your Solana wallet to get started with SOLMINT.</p>
                </div>
                
                <div className="bg-solmint-black p-6 rounded-lg border border-solmint-blackLight">
                  <div className="bg-solmint-violet/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-solmint-violet font-semibold">2</span>
                  </div>
                  <h3 className="text-white font-medium mb-2">Choose a Package</h3>
                  <p className="text-gray-400 text-sm">Select a launch package that fits your project's needs and budget.</p>
                </div>
                
                <div className="bg-solmint-black p-6 rounded-lg border border-solmint-blackLight">
                  <div className="bg-solmint-violet/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-solmint-violet font-semibold">3</span>
                  </div>
                  <h3 className="text-white font-medium mb-2">Launch Your Token</h3>
                  <p className="text-gray-400 text-sm">Fill in your token details and launch it on the Solana blockchain.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Launch Packages</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Basic Package */}
                <div className="bg-solmint-black p-6 rounded-lg border border-solmint-blackLight">
                  <h3 className="text-white font-medium mb-2">Basic</h3>
                  <p className="text-2xl font-bold text-white mb-4">0.2 <span className="text-sm font-normal">SOL</span></p>
                  <ul className="text-gray-400 text-sm space-y-2 mb-6">
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-solmint-violet mr-2 mt-0.5" />
                      Standard token listing
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-solmint-violet mr-2 mt-0.5" />
                      Basic analytics dashboard
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-solmint-violet mr-2 mt-0.5" />
                      Community tools
                    </li>
                  </ul>
                  <Link href="/launchpad?package=basic">
                    <Button className="w-full">Select Basic</Button>
                  </Link>
                </div>
                
                {/* Growth Package */}
                <div className="bg-solmint-black p-6 rounded-lg border border-solmint-violet">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-medium">Growth</h3>
                    <span className="bg-solmint-violet/20 text-solmint-violet text-xs px-2 py-1 rounded">Popular</span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-4">1.5 <span className="text-sm font-normal">SOL</span></p>
                  <ul className="text-gray-400 text-sm space-y-2 mb-6">
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-solmint-violet mr-2 mt-0.5" />
                      Premium token listing
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-solmint-violet mr-2 mt-0.5" />
                      Advanced analytics dashboard
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-solmint-violet mr-2 mt-0.5" />
                      AI-generated marketing content
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-solmint-violet mr-2 mt-0.5" />
                      Community management tools
                    </li>
                  </ul>
                  <Link href="/launchpad?package=growth">
                    <Button className="w-full bg-solmint-violet hover:bg-solmint-violet/90">Select Growth</Button>
                  </Link>
                </div>
                
                {/* Premium Package */}
                <div className="bg-solmint-black p-6 rounded-lg border border-solmint-blackLight">
                  <h3 className="text-white font-medium mb-2">Premium</h3>
                  <p className="text-2xl font-bold text-white mb-4">5 <span className="text-sm font-normal">SOL</span></p>
                  <ul className="text-gray-400 text-sm space-y-2 mb-6">
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-solmint-violet mr-2 mt-0.5" />
                      Featured token placement
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-solmint-violet mr-2 mt-0.5" />
                      Premium analytics dashboard
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-solmint-violet mr-2 mt-0.5" />
                      AI-generated marketing campaign
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-solmint-violet mr-2 mt-0.5" />
                      Advanced community tools
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-solmint-violet mr-2 mt-0.5" />
                      Priority support
                    </li>
                  </ul>
                  <Link href="/launchpad?package=premium">
                    <Button className="w-full">Select Premium</Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link href="/launchpad">
                <Button size="lg" className="bg-solmint-violet hover:bg-solmint-violet/90 gap-2">
                  <Rocket className="h-4 w-4" />
                  Go to Launchpad
                </Button>
              </Link>
            </div>
          </div>
        ) : !hasTokens ? (
          // Connected but no tokens
          <div className="bg-solmint-blackLight border border-solmint-blackLight rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Your Dashboard</h1>
              <WalletConnect />
            </div>
            
            <div className="bg-solmint-black p-8 rounded-lg border border-solmint-blackLight mb-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">Ready to Launch Your First Token?</h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  You haven't launched any tokens yet. Get started by creating your first token on the Solana blockchain.
                </p>
              </div>
              
              <div className="flex justify-center">
                <Link href="/launchpad">
                  <Button size="lg" className="bg-solmint-violet hover:bg-solmint-violet/90 gap-2">
                    <Rocket className="h-4 w-4" />
                    Launch Your First Token
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-12 mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">Getting Started with SOLMINT</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-solmint-black p-6 rounded-lg border border-solmint-blackLight">
                  <div className="bg-solmint-violet/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-solmint-violet font-semibold">1</span>
                  </div>
                  <h3 className="text-white font-medium mb-2">Choose a Package</h3>
                  <p className="text-gray-400 text-sm">Select a launch package that fits your project's needs and budget.</p>
                </div>
                
                <div className="bg-solmint-black p-6 rounded-lg border border-solmint-blackLight">
                  <div className="bg-solmint-violet/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-solmint-violet font-semibold">2</span>
                  </div>
                  <h3 className="text-white font-medium mb-2">Configure Your Token</h3>
                  <p className="text-gray-400 text-sm">Customize your token with a name, symbol, and other details.</p>
                </div>
                
                <div className="bg-solmint-black p-6 rounded-lg border border-solmint-blackLight">
                  <div className="bg-solmint-violet/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-solmint-violet font-semibold">3</span>
                  </div>
                  <h3 className="text-white font-medium mb-2">Launch & Promote</h3>
                  <p className="text-gray-400 text-sm">Launch your token and use our tools to promote it to the community.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-white mb-6">Explore the Marketplace</h2>
              <p className="text-gray-300 mb-6">
                Discover other tokens launched on SOLMINT and get inspiration for your own project.
              </p>
              <Link href="/marketplace">
                <Button variant="outline" className="border-solmint-blackLight text-white hover:bg-solmint-blackLight gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Visit Marketplace
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // User has tokens
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Your Dashboard</h1>
                <p className="text-gray-400">{currentDate}</p>
              </div>
              <WalletConnect />
            </div>
            
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-solmint-black to-solmint-blackLight rounded-lg p-6 mb-8 border border-solmint-blackLight">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">Welcome back!</h2>
                  <p className="text-gray-300 mb-4 md:mb-0">
                    {activeToken ? (
                      <>Your token <span className="text-solmint-violet font-medium">{activeToken.symbol}</span> is performing well today.</>
                    ) : (
                      <>Manage your tokens and track their performance.</>
                    )}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link href="/marketplace">
                    <Button variant="outline" className="border-solmint-blackLight text-white hover:bg-solmint-blackLight">
                      Marketplace
                    </Button>
                  </Link>
                  <Link href="/launchpad">
                    <Button className="bg-solmint-violet hover:bg-solmint-violet/90 gap-2">
                      <Rocket className="h-4 w-4" />
                      Launch New Token
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Token Stats */}
            {activeToken && (
              <div className="mb-8">
                <TokenStats token={activeToken} />
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Token Management */}
              <div className="lg:col-span-2">
                <TokenManagement 
                  tokens={tokens} 
                  onSelectToken={(id) => setSelectedTokenId(id)}
                  selectedTokenId={selectedTokenId || (tokens.length > 0 ? tokens[0].id : null)}
                />
              </div>
              
              {/* Growth Tools */}
              <div>
                <GrowthTools token={activeToken} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Community Insights */}
              <div className="lg:col-span-2">
                <CommunityInsights token={activeToken} />
              </div>
              
              {/* Events Calendar */}
              <div>
                <EventsCalendar />
              </div>
            </div>
            
            {/* Upgrade Banner - only show for non-premium tokens */}
            {activeToken && activeToken.placementTier !== 'premium' && (
              <div className="mt-8 bg-gradient-to-r from-solmint-violet/20 to-solmint-violet/5 rounded-lg p-6 border border-solmint-violet/30">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Upgrade Your Token Package</h2>
                    <p className="text-gray-300 mb-4 md:mb-0">
                      Get more visibility and tools for your token with our Premium package.
                    </p>
                  </div>
                  <Link href="/launchpad?upgrade=true&token=${activeToken.id}">
                    <Button className="bg-solmint-violet hover:bg-solmint-violet/90">
                      Upgrade Now
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
