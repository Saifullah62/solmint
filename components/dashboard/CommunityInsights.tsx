'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Globe, 
  Twitter, 
  MessageCircle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface CommunityInsightsProps {
  tokenSymbol: string;
}

export const CommunityInsights = ({ tokenSymbol }: CommunityInsightsProps) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('week');
  
  // Mock data - would be replaced with real data from API
  const socialStats = {
    twitter: {
      followers: 1243,
      change: 5.8,
      engagement: 3.2
    },
    discord: {
      members: 856,
      change: 12.4,
      activeUsers: 312
    },
    telegram: {
      members: 567,
      change: -2.1,
      messageVolume: 1240
    }
  };
  
  const sentimentData = {
    positive: 68,
    neutral: 24,
    negative: 8
  };
  
  return (
    <div className="bg-[#1A1A40] border border-[#1A1A40] rounded-xl overflow-hidden">
      <div className="p-5 border-b border-[#0E0E2C]">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white font-['Sora']">Community Insights</h3>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-md px-3 py-1 text-sm ${timeframe === 'week' ? 'bg-[#8A2BE2]/20 text-[#A35FEA]' : 'text-[#DADADA] hover:bg-[#0E0E2C]'}`}
              onClick={() => setTimeframe('week')}
            >
              7d
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-md px-3 py-1 text-sm ${timeframe === 'month' ? 'bg-[#8A2BE2]/20 text-[#A35FEA]' : 'text-[#DADADA] hover:bg-[#0E0E2C]'}`}
              onClick={() => setTimeframe('month')}
            >
              30d
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-md px-3 py-1 text-sm ${timeframe === 'quarter' ? 'bg-[#8A2BE2]/20 text-[#A35FEA]' : 'text-[#DADADA] hover:bg-[#0E0E2C]'}`}
              onClick={() => setTimeframe('quarter')}
            >
              90d
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Social Media Stats */}
          <div>
            <h4 className="text-white font-medium mb-4">Social Media Performance</h4>
            <div className="space-y-4">
              {/* Twitter */}
              <div className="bg-[#0E0E2C] rounded-lg p-4 border border-[#1A1A40]">
                <div className="flex items-center mb-3">
                  <div className="h-8 w-8 rounded-full bg-[#1DA1F2]/10 flex items-center justify-center mr-3">
                    <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-white font-medium">Twitter</h5>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 rounded-full px-3"
                  >
                    Connect
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#1A1A40] rounded-md p-2">
                    <div className="text-sm text-[#DADADA] mb-1">Followers</div>
                    <div className="text-lg font-bold text-white">{socialStats.twitter.followers}</div>
                    <div className={`text-xs flex items-center justify-center ${socialStats.twitter.change >= 0 ? 'text-[#00FFA3]' : 'text-[#FF3D00]'}`}>
                      {socialStats.twitter.change >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(socialStats.twitter.change)}%
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A40] rounded-md p-2">
                    <div className="text-sm text-[#DADADA] mb-1">Engagement</div>
                    <div className="text-lg font-bold text-white">{socialStats.twitter.engagement}%</div>
                  </div>
                  
                  <div className="bg-[#1A1A40] rounded-md p-2">
                    <div className="text-sm text-[#DADADA] mb-1">Mentions</div>
                    <div className="text-lg font-bold text-white">42</div>
                  </div>
                </div>
              </div>
              
              {/* Discord */}
              <div className="bg-[#0E0E2C] rounded-lg p-4 border border-[#1A1A40]">
                <div className="flex items-center mb-3">
                  <div className="h-8 w-8 rounded-full bg-[#5865F2]/10 flex items-center justify-center mr-3">
                    <MessageCircle className="h-4 w-4 text-[#5865F2]" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-white font-medium">Discord</h5>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20 rounded-full px-3"
                  >
                    Connect
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#1A1A40] rounded-md p-2">
                    <div className="text-sm text-[#DADADA] mb-1">Members</div>
                    <div className="text-lg font-bold text-white">{socialStats.discord.members}</div>
                    <div className={`text-xs flex items-center justify-center ${socialStats.discord.change >= 0 ? 'text-[#00FFA3]' : 'text-[#FF3D00]'}`}>
                      {socialStats.discord.change >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(socialStats.discord.change)}%
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A40] rounded-md p-2">
                    <div className="text-sm text-[#DADADA] mb-1">Active</div>
                    <div className="text-lg font-bold text-white">{socialStats.discord.activeUsers}</div>
                  </div>
                  
                  <div className="bg-[#1A1A40] rounded-md p-2">
                    <div className="text-sm text-[#DADADA] mb-1">Messages</div>
                    <div className="text-lg font-bold text-white">1.2k</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sentiment Analysis */}
          <div>
            <h4 className="text-white font-medium mb-4">Community Sentiment</h4>
            <div className="bg-[#0E0E2C] rounded-lg p-4 border border-[#1A1A40] h-[calc(100%-32px)]">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-5 w-5 text-[#A35FEA] mr-2" />
                <h5 className="text-white font-medium">{tokenSymbol} Sentiment Analysis</h5>
              </div>
              
              <div className="mb-6">
                <div className="h-6 bg-[#1A1A40] rounded-full overflow-hidden flex">
                  <div 
                    className="bg-[#00FFA3] h-full" 
                    style={{ width: `${sentimentData.positive}%` }}
                  ></div>
                  <div 
                    className="bg-[#DADADA] h-full" 
                    style={{ width: `${sentimentData.neutral}%` }}
                  ></div>
                  <div 
                    className="bg-[#FF3D00] h-full" 
                    style={{ width: `${sentimentData.negative}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-2 text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-[#00FFA3] mr-1"></div>
                    <span className="text-[#DADADA]">Positive</span>
                    <span className="text-white ml-1 font-medium">{sentimentData.positive}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-[#DADADA] mr-1"></div>
                    <span className="text-[#DADADA]">Neutral</span>
                    <span className="text-white ml-1 font-medium">{sentimentData.neutral}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-[#FF3D00] mr-1"></div>
                    <span className="text-[#DADADA]">Negative</span>
                    <span className="text-white ml-1 font-medium">{sentimentData.negative}%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h6 className="text-[#DADADA] text-sm font-medium">Top Discussions</h6>
                
                <div className="bg-[#1A1A40] rounded-lg p-3 border border-[#0E0E2C]">
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-[#00FFA3]/10 flex items-center justify-center mr-2 mt-0.5">
                      <TrendingUp className="h-3 w-3 text-[#00FFA3]" />
                    </div>
                    <div>
                      <p className="text-sm text-white">
                        "The new {tokenSymbol} staking rewards are amazing! Getting 12% APY."
                      </p>
                      <div className="flex items-center mt-1 text-xs text-[#DADADA]">
                        <Twitter className="h-3 w-3 mr-1" />
                        <span>2 hours ago</span>
                        <span className="mx-2">•</span>
                        <span className="text-[#00FFA3]">Positive</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#1A1A40] rounded-lg p-3 border border-[#0E0E2C]">
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-[#DADADA]/10 flex items-center justify-center mr-2 mt-0.5">
                      <MessageSquare className="h-3 w-3 text-[#DADADA]" />
                    </div>
                    <div>
                      <p className="text-sm text-white">
                        "When will {tokenSymbol} be listed on more exchanges? Any updates?"
                      </p>
                      <div className="flex items-center mt-1 text-xs text-[#DADADA]">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        <span>5 hours ago</span>
                        <span className="mx-2">•</span>
                        <span className="text-[#DADADA]">Neutral</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
