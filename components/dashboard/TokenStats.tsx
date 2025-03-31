'use client';

import { useState } from 'react';
import { BarChart, LineChart, ArrowUp, ArrowDown, Users, DollarSign, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TokenStatsProps {
  tokenSymbol: string;
}

export const TokenStats = ({ tokenSymbol }: TokenStatsProps) => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  
  // Mock data - would be replaced with real data from API
  const stats = {
    price: 1.42,
    priceChange: 5.2,
    holders: 1243,
    holdersChange: 12,
    volume: 45620,
    volumeChange: -3.1,
    marketCap: 1420000,
    marketCapChange: 5.2
  };
  
  return (
    <div className="bg-[#1A1A40] border border-[#1A1A40] rounded-xl overflow-hidden">
      <div className="p-5 border-b border-[#0E0E2C]">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white font-['Sora']">{tokenSymbol} Performance</h3>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-md px-3 py-1 text-sm ${timeframe === 'day' ? 'bg-[#8A2BE2]/20 text-[#A35FEA]' : 'text-[#DADADA] hover:bg-[#0E0E2C]'}`}
              onClick={() => setTimeframe('day')}
            >
              24h
            </Button>
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
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Price Card */}
          <div className="bg-[#0E0E2C] rounded-lg p-4 border border-[#1A1A40]">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[#DADADA] text-sm">Current Price</span>
              <DollarSign className="h-4 w-4 text-[#00FFA3]" />
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-white mr-2 font-['Sora']">${stats.price}</span>
              <div className={`flex items-center text-sm ${stats.priceChange >= 0 ? 'text-[#00FFA3]' : 'text-[#FF3D00]'}`}>
                {stats.priceChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {Math.abs(stats.priceChange)}%
              </div>
            </div>
          </div>
          
          {/* Holders Card */}
          <div className="bg-[#0E0E2C] rounded-lg p-4 border border-[#1A1A40]">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[#DADADA] text-sm">Total Holders</span>
              <Users className="h-4 w-4 text-[#A35FEA]" />
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-white mr-2 font-['Sora']">{stats.holders.toLocaleString()}</span>
              <div className={`flex items-center text-sm ${stats.holdersChange >= 0 ? 'text-[#00FFA3]' : 'text-[#FF3D00]'}`}>
                {stats.holdersChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {Math.abs(stats.holdersChange)}%
              </div>
            </div>
          </div>
          
          {/* Volume Card */}
          <div className="bg-[#0E0E2C] rounded-lg p-4 border border-[#1A1A40]">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[#DADADA] text-sm">Trading Volume</span>
              <Activity className="h-4 w-4 text-[#2196F3]" />
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-white mr-2 font-['Sora']">${stats.volume.toLocaleString()}</span>
              <div className={`flex items-center text-sm ${stats.volumeChange >= 0 ? 'text-[#00FFA3]' : 'text-[#FF3D00]'}`}>
                {stats.volumeChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {Math.abs(stats.volumeChange)}%
              </div>
            </div>
          </div>
          
          {/* Market Cap Card */}
          <div className="bg-[#0E0E2C] rounded-lg p-4 border border-[#1A1A40]">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[#DADADA] text-sm">Market Cap</span>
              <DollarSign className="h-4 w-4 text-[#FFD600]" />
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-white mr-2 font-['Sora']">${(stats.marketCap / 1000000).toFixed(2)}M</span>
              <div className={`flex items-center text-sm ${stats.marketCapChange >= 0 ? 'text-[#00FFA3]' : 'text-[#FF3D00]'}`}>
                {stats.marketCapChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {Math.abs(stats.marketCapChange)}%
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price Chart */}
          <div className="bg-[#0E0E2C] rounded-lg p-4 border border-[#1A1A40]">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-white">Price History</h4>
              <LineChart className="h-4 w-4 text-[#DADADA]" />
            </div>
            <div className="h-48 flex items-center justify-center border-t border-[#1A1A40] pt-4">
              <div className="w-full h-32 relative">
                {/* Mock chart - would be replaced with actual chart component */}
                <div className="absolute inset-0 flex items-end">
                  <div className="w-1/12 h-[20%] bg-[#8A2BE2]/20 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[30%] bg-[#8A2BE2]/20 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[25%] bg-[#8A2BE2]/20 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[40%] bg-[#8A2BE2]/20 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[35%] bg-[#8A2BE2]/20 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[50%] bg-[#8A2BE2]/20 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[60%] bg-[#8A2BE2]/20 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[55%] bg-[#8A2BE2]/20 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[70%] bg-[#8A2BE2]/20 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[65%] bg-[#8A2BE2]/20 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[80%] bg-[#8A2BE2]/20 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[90%] bg-[#8A2BE2]/20 mx-0.5 rounded-t"></div>
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#8A2BE2]/10 to-transparent rounded"></div>
                {/* Line chart */}
                <div className="absolute inset-0 flex items-end">
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    <path 
                      d="M0,80 L40,70 L80,75 L120,60 L160,65 L200,50 L240,40 L280,45 L320,30 L360,35 L400,20 L440,10" 
                      fill="none" 
                      stroke="#8A2BE2" 
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Holders Chart */}
          <div className="bg-[#0E0E2C] rounded-lg p-4 border border-[#1A1A40]">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-white">Holder Growth</h4>
              <BarChart className="h-4 w-4 text-[#DADADA]" />
            </div>
            <div className="h-48 flex items-center justify-center border-t border-[#1A1A40] pt-4">
              <div className="w-full h-32 relative">
                {/* Mock chart - would be replaced with actual chart component */}
                <div className="absolute inset-0 flex items-end">
                  <div className="w-1/12 h-[30%] bg-[#A35FEA]/30 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[35%] bg-[#A35FEA]/30 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[40%] bg-[#A35FEA]/30 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[38%] bg-[#A35FEA]/30 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[45%] bg-[#A35FEA]/30 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[50%] bg-[#A35FEA]/30 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[55%] bg-[#A35FEA]/30 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[60%] bg-[#A35FEA]/30 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[65%] bg-[#A35FEA]/30 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[70%] bg-[#A35FEA]/30 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[75%] bg-[#A35FEA]/30 mx-0.5 rounded-t"></div>
                  <div className="w-1/12 h-[80%] bg-[#A35FEA]/30 mx-0.5 rounded-t"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
