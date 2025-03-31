'use client';

import React, { useState, useEffect } from 'react';
import TokenAnalytics from '@/components/admin/TokenAnalytics';
import { useWallet } from '@/components/WalletContextProvider';
import { useAppStore } from '@/store/useAppStore';

export default function AdminDashboard() {
  const { connected, publicKey } = useWallet();
  const { network, setNetwork } = useAppStore();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Check if the connected wallet is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!connected || !publicKey) {
        setIsAdmin(false);
        return;
      }
      
      try {
        // In production, this would be an API call to verify admin status
        // Example:
        // const response = await fetch(`/api/admin/verify?wallet=${publicKey.toString()}`);
        // const { isAdmin } = await response.json();
        // setIsAdmin(isAdmin);
        
        // For now, we'll use environment variables to check admin status
        const adminAddresses = process.env.NEXT_PUBLIC_ADMIN_WALLETS 
          ? process.env.NEXT_PUBLIC_ADMIN_WALLETS.split(',') 
          : [];
          
        setIsAdmin(adminAddresses.includes(publicKey.toString()));
      } catch (error) {
        console.error('Error verifying admin status:', error);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [connected, publicKey]);
  
  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <p className="mb-6">Please connect your wallet to access the admin dashboard.</p>
          
          <div className="flex justify-center">
            <button 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                // This will trigger the wallet modal to open
                const event = new CustomEvent('open-wallet-modal');
                window.dispatchEvent(event);
              }}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You do not have permission to access the admin dashboard.</p>
          <p className="text-sm text-gray-500 mt-2">Connected as: {publicKey?.toString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor token creation metrics and system performance</p>
      </div>
      
      {/* Network Selector */}
      <div className="mb-8 flex items-center">
        <span className="mr-4 font-medium">Network:</span>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md ${
              network === 'devnet' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setNetwork('devnet')}
          >
            Devnet
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              network === 'mainnet-beta' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setNetwork('mainnet-beta')}
          >
            Mainnet
          </button>
        </div>
      </div>
      
      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 gap-8">
        <TokenAnalytics />
        
        {/* System Health Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">System Health</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SystemHealthIndicator 
              title="API Status" 
              status="operational" 
            />
            
            <SystemHealthIndicator 
              title="Solana RPC" 
              status="connected" 
            />
            
            <SystemHealthIndicator 
              title="Database" 
              status="healthy" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SystemHealthIndicatorProps {
  title: string;
  status: 'operational' | 'degraded' | 'down' | 'connected' | 'disconnected' | 'healthy' | 'unhealthy';
}

const SystemHealthIndicator: React.FC<SystemHealthIndicatorProps> = ({ title, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'operational':
      case 'connected':
      case 'healthy':
        return {
          bg: 'bg-green-50',
          text: 'text-green-800',
          dot: 'bg-green-500'
        };
      case 'degraded':
      case 'disconnected':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-800',
          dot: 'bg-yellow-500'
        };
      case 'down':
      case 'unhealthy':
        return {
          bg: 'bg-red-50',
          text: 'text-red-800',
          dot: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-800',
          dot: 'bg-gray-500'
        };
    }
  };
  
  const { bg, text, dot } = getStatusColor();
  
  return (
    <div className={`${bg} p-4 rounded-lg`}>
      <h3 className={`text-lg font-semibold ${text}`}>{title}</h3>
      <div className="flex items-center mt-2">
        <div className={`w-3 h-3 rounded-full ${dot} mr-2`}></div>
        <span className="font-medium capitalize">{status}</span>
      </div>
    </div>
  );
};
