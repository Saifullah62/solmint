'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, Zap, Megaphone, Users, ChevronRight, CheckCircle2, Activity } from 'lucide-react';

interface GrowthToolsProps {
  tokenSymbol: string;
}

export const GrowthTools = ({ tokenSymbol }: GrowthToolsProps) => {
  const [activeTab, setActiveTab] = useState<'marketing' | 'community' | 'analytics'>('marketing');
  
  return (
    <div className="bg-[#1A1A40] border border-[#1A1A40] rounded-xl overflow-hidden">
      <div className="p-5 border-b border-[#0E0E2C]">
        <h3 className="text-xl font-bold text-white font-['Sora']">Growth Tools</h3>
        <p className="text-[#DADADA] text-sm mt-1">
          AI-powered tools to help grow your token's reach and community
        </p>
      </div>
      
      <div className="flex border-b border-[#0E0E2C]">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === 'marketing' 
              ? 'text-white border-b-2 border-[#8A2BE2]' 
              : 'text-[#DADADA] hover:text-white hover:bg-[#0E0E2C]'
          }`}
          onClick={() => setActiveTab('marketing')}
        >
          Marketing
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === 'community' 
              ? 'text-white border-b-2 border-[#8A2BE2]' 
              : 'text-[#DADADA] hover:text-white hover:bg-[#0E0E2C]'
          }`}
          onClick={() => setActiveTab('community')}
        >
          Community
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === 'analytics' 
              ? 'text-white border-b-2 border-[#8A2BE2]' 
              : 'text-[#DADADA] hover:text-white hover:bg-[#0E0E2C]'
          }`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>
      
      <div className="p-5">
        {activeTab === 'marketing' && (
          <div className="space-y-4">
            <div className="bg-[#0E0E2C] rounded-lg p-4 border border-[#1A1A40] hover:border-[#8A2BE2]/30 transition-colors group cursor-pointer">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-lg bg-[#8A2BE2]/10 flex items-center justify-center mr-4 text-[#A35FEA] group-hover:bg-[#8A2BE2]/20 transition-colors">
                  <Rocket className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1 group-hover:text-[#A35FEA] transition-colors">AI Content Generator</h4>
                  <p className="text-[#DADADA] text-sm">
                    Generate professional marketing content for your {tokenSymbol} token with one click
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#DADADA] group-hover:text-[#A35FEA] transition-transform group-hover:translate-x-1" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-[#8A2BE2]/10 text-[#A35FEA] px-2 py-1 rounded-full">Twitter Posts</span>
                <span className="text-xs bg-[#8A2BE2]/10 text-[#A35FEA] px-2 py-1 rounded-full">Medium Articles</span>
                <span className="text-xs bg-[#8A2BE2]/10 text-[#A35FEA] px-2 py-1 rounded-full">Discord Announcements</span>
              </div>
            </div>
            
            <div className="bg-[#0E0E2C] rounded-lg p-4 border border-[#1A1A40] hover:border-[#8A2BE2]/30 transition-colors group cursor-pointer">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-lg bg-[#00FFA3]/10 flex items-center justify-center mr-4 text-[#00FFA3] group-hover:bg-[#00FFA3]/20 transition-colors">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1 group-hover:text-[#00FFA3] transition-colors">Promotion Booster</h4>
                  <p className="text-[#DADADA] text-sm">
                    Amplify your token's visibility across the Solana ecosystem
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#DADADA] group-hover:text-[#00FFA3] transition-transform group-hover:translate-x-1" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-[#00FFA3]/10 text-[#00FFA3] px-2 py-1 rounded-full">Featured Listings</span>
                <span className="text-xs bg-[#00FFA3]/10 text-[#00FFA3] px-2 py-1 rounded-full">Partner Networks</span>
                <span className="text-xs bg-[#00FFA3]/10 text-[#00FFA3] px-2 py-1 rounded-full">Influencer Outreach</span>
              </div>
            </div>
            
            <div className="bg-[#0E0E2C] rounded-lg p-4 border border-[#1A1A40] hover:border-[#8A2BE2]/30 transition-colors group cursor-pointer">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-lg bg-[#2196F3]/10 flex items-center justify-center mr-4 text-[#2196F3] group-hover:bg-[#2196F3]/20 transition-colors">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1 group-hover:text-[#2196F3] transition-colors">Announcement Scheduler</h4>
                  <p className="text-[#DADADA] text-sm">
                    Schedule and automate your {tokenSymbol} announcements across multiple platforms
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#DADADA] group-hover:text-[#2196F3] transition-transform group-hover:translate-x-1" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-[#2196F3]/10 text-[#2196F3] px-2 py-1 rounded-full">Multi-platform</span>
                <span className="text-xs bg-[#2196F3]/10 text-[#2196F3] px-2 py-1 rounded-full">Analytics</span>
                <span className="text-xs bg-[#2196F3]/10 text-[#2196F3] px-2 py-1 rounded-full">A/B Testing</span>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'community' && (
          <div className="space-y-4">
            <div className="bg-[#0E0E2C] rounded-lg p-4 border border-[#1A1A40] hover:border-[#8A2BE2]/30 transition-colors group cursor-pointer">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-lg bg-[#A35FEA]/10 flex items-center justify-center mr-4 text-[#A35FEA] group-hover:bg-[#A35FEA]/20 transition-colors">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1 group-hover:text-[#A35FEA] transition-colors">Community Manager</h4>
                  <p className="text-[#DADADA] text-sm">
                    AI-powered tools to engage and grow your {tokenSymbol} community
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#DADADA] group-hover:text-[#A35FEA] transition-transform group-hover:translate-x-1" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-[#A35FEA]/10 text-[#A35FEA] px-2 py-1 rounded-full">Discord Moderation</span>
                <span className="text-xs bg-[#A35FEA]/10 text-[#A35FEA] px-2 py-1 rounded-full">FAQ Automation</span>
                <span className="text-xs bg-[#A35FEA]/10 text-[#A35FEA] px-2 py-1 rounded-full">Community Insights</span>
              </div>
            </div>
            
            <div className="bg-[#0E0E2C] rounded-lg p-4 border border-[#1A1A40] hover:border-[#8A2BE2]/30 transition-colors group cursor-pointer">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-lg bg-[#00FFA3]/10 flex items-center justify-center mr-4 text-[#00FFA3] group-hover:bg-[#00FFA3]/20 transition-colors">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1 group-hover:text-[#00FFA3] transition-colors">Holder Rewards</h4>
                  <p className="text-[#DADADA] text-sm">
                    Create and manage rewards programs for {tokenSymbol} holders
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#DADADA] group-hover:text-[#00FFA3] transition-transform group-hover:translate-x-1" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-[#00FFA3]/10 text-[#00FFA3] px-2 py-1 rounded-full">Airdrops</span>
                <span className="text-xs bg-[#00FFA3]/10 text-[#00FFA3] px-2 py-1 rounded-full">Staking Rewards</span>
                <span className="text-xs bg-[#00FFA3]/10 text-[#00FFA3] px-2 py-1 rounded-full">Loyalty Programs</span>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="bg-[#0E0E2C] rounded-lg p-4 border border-[#1A1A40] hover:border-[#8A2BE2]/30 transition-colors group cursor-pointer">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-lg bg-[#2196F3]/10 flex items-center justify-center mr-4 text-[#2196F3] group-hover:bg-[#2196F3]/20 transition-colors">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1 group-hover:text-[#2196F3] transition-colors">Performance Insights</h4>
                  <p className="text-[#DADADA] text-sm">
                    Detailed analytics on your {tokenSymbol} token's performance and holder behavior
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#DADADA] group-hover:text-[#2196F3] transition-transform group-hover:translate-x-1" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-[#2196F3]/10 text-[#2196F3] px-2 py-1 rounded-full">Holder Analysis</span>
                <span className="text-xs bg-[#2196F3]/10 text-[#2196F3] px-2 py-1 rounded-full">Trading Patterns</span>
                <span className="text-xs bg-[#2196F3]/10 text-[#2196F3] px-2 py-1 rounded-full">Wallet Insights</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <Button className="bg-[#8A2BE2] hover:bg-[#6A1CB0] text-white">
            Explore All Tools
          </Button>
        </div>
      </div>
    </div>
  );
};
