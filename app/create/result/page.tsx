'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import TokenCreationSuccess from '../../../components/token/TokenCreationSuccess';
import { useAppStore } from '../../../store/useAppStore';

export default function TokenCreationResultPage() {
  const searchParams = useSearchParams();
  const tokenAddress = searchParams?.get('address') || '';
  
  // If there's no token address, redirect to create page
  if (!tokenAddress) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">No Token Address Found</h2>
          <p className="mb-6">No token address was provided. Please create a token first.</p>
          <a 
            href="/create" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Go to Token Creation
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <TokenCreationSuccess tokenAddress={tokenAddress} />
    </div>
  );
}
