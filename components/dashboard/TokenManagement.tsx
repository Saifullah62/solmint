'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, ExternalLink, Settings, MoreHorizontal } from 'lucide-react';

interface Token {
  id: string;
  name: string;
  symbol: string;
  logoUrl: string | null;
  contractAddress: string;
  launchDate: string;
  status: 'active' | 'pending' | 'paused';
}

export const TokenManagement = () => {
  // Mock data - would be replaced with real data from API
  const [tokens, setTokens] = useState<Token[]>([
    {
      id: '1',
      name: 'SOLMINT Demo Token',
      symbol: 'SDEMO',
      logoUrl: null,
      contractAddress: '7KVJjYJxQPcUFwEpgMkwTBM2SiAm5FXCxR9Vye5SLxHy',
      launchDate: '2025-02-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Test Governance Token',
      symbol: 'TGOV',
      logoUrl: null,
      contractAddress: '3XysA6Qw3E2muBEXEkgqGDN1VgKEjUMhxTMSzxMKxLq2',
      launchDate: '2025-03-01',
      status: 'active'
    }
  ]);
  
  const getStatusBadge = (status: Token['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-[#00FFA3]/10 text-[#00FFA3]">Active</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-[#FFD600]/10 text-[#FFD600]">Pending</span>;
      case 'paused':
        return <span className="px-2 py-1 text-xs rounded-full bg-[#FF3D00]/10 text-[#FF3D00]">Paused</span>;
      default:
        return null;
    }
  };
  
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <div className="bg-[#1A1A40] border border-[#1A1A40] rounded-xl overflow-hidden">
      <div className="p-5 border-b border-[#0E0E2C] flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white font-['Sora']">Your Tokens</h3>
          <p className="text-[#DADADA] text-sm mt-1">
            Manage your launched tokens
          </p>
        </div>
        <Button className="bg-[#8A2BE2] hover:bg-[#6A1CB0] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create New Token
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0E0E2C] text-[#DADADA] text-sm">
              <th className="py-3 px-4 text-left font-medium">Token</th>
              <th className="py-3 px-4 text-left font-medium">Contract</th>
              <th className="py-3 px-4 text-left font-medium">Launch Date</th>
              <th className="py-3 px-4 text-left font-medium">Status</th>
              <th className="py-3 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0E0E2C]">
            {tokens.map((token) => (
              <tr key={token.id} className="hover:bg-[#0E0E2C]/50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#0E0E2C] border border-[#8A2BE2]/20 flex items-center justify-center mr-3">
                      {token.logoUrl ? (
                        <Image 
                          src={token.logoUrl} 
                          alt={`${token.name} logo`} 
                          width={32} 
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-bold text-[#8A2BE2]">
                          {token.symbol.substring(0, 1)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">{token.name}</div>
                      <div className="text-sm text-[#DADADA]">{token.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <code className="text-sm text-[#DADADA] font-mono">
                      {truncateAddress(token.contractAddress)}
                    </code>
                    <a 
                      href={`https://solscan.io/token/${token.contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-[#A35FEA] hover:text-[#8A2BE2]"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </td>
                <td className="py-4 px-4 text-[#DADADA]">
                  {new Date(token.launchDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(token.status)}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full text-[#DADADA] hover:text-white hover:bg-[#0E0E2C]"
                      aria-label="Edit token"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full text-[#DADADA] hover:text-white hover:bg-[#0E0E2C]"
                      aria-label="Token settings"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full text-[#DADADA] hover:text-[#FF3D00] hover:bg-[#FF3D00]/10"
                      aria-label="Delete token"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {tokens.length === 0 && (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#8A2BE2]/10 flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-[#8A2BE2]" />
          </div>
          <h4 className="text-lg font-medium text-white mb-2">No tokens yet</h4>
          <p className="text-[#DADADA] text-sm max-w-md mb-6">
            You haven't created any tokens yet. Launch your first token to get started.
          </p>
          <Button className="bg-[#8A2BE2] hover:bg-[#6A1CB0] text-white">
            Create Your First Token
          </Button>
        </div>
      )}
    </div>
  );
};
