'use client';

import { MainLayout } from '@/components/layouts/MainLayout';
import { SecurityAuditor } from '@/components/token/SecurityAuditor';
import { ChatInterface } from '@/components/assistant/ChatInterface';
import { useState } from 'react';
import { TokenCreationFlow } from '@/components/token/TokenCreationFlow';

export default function CreatePage() {
  const [showChat, setShowChat] = useState(false);

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400">Create Your SOLMINT Token</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center md:text-left">Configure your token parameters and review the security analysis before deployment.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TokenCreationFlow />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <SecurityAuditor />
            
            {/* AI Assistant Chat Toggle Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowChat(!showChat)}
                className="flex items-center gap-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                {showChat ? 'Hide AI Assistant' : 'Show AI Assistant'}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>
            
            {/* AI Assistant Chat Interface */}
            {showChat && (
              <div className="h-[500px] mt-4">
                <ChatInterface />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
