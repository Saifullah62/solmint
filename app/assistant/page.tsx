'use client';

import { MainLayout } from '@/components/layouts/MainLayout';
import { ChatInterface } from '../../components/assistant/ChatInterface';
import { useState } from 'react';

// Create a simple wrapper component to ensure ChatInterface is only rendered once
const ChatInterfaceWrapper = () => {
  // Use state to ensure the component is only rendered once
  const [mounted] = useState(true);
  
  if (!mounted) return null;
  return <ChatInterface />;
};

export default function AssistantPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-white">AI Assistant</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChatInterfaceWrapper />
          </div>
          <div className="lg:col-span-1">
            <div className="bg-solmint-blackLight border border-solmint-blackLight rounded-lg p-6">
              <h3 className="text-xl font-medium mb-4 text-white">About the AI Assistant</h3>
              <p className="text-gray-300 mb-4">
                The SOLMINT AI assistant helps you create Solana tokens. It can help you:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-solmint-mint">•</span>
                  <span className="text-gray-300">Understand technical concepts like decimals and authorities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-solmint-mint">•</span>
                  <span className="text-gray-300">Configure your token based on your specific use case</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-solmint-mint">•</span>
                  <span className="text-gray-300">Provide best practices for token creation and distribution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-solmint-mint">•</span>
                  <span className="text-gray-300">Explain security considerations for your token</span>
                </li>
              </ul>
              <h4 className="font-medium mb-2 text-white">Example Questions</h4>
              <div className="space-y-2 text-sm">
                <p className="p-2 bg-solmint-black rounded-md text-gray-300">"What does freeze authority mean?"</p>
                <p className="p-2 bg-solmint-black rounded-md text-gray-300">"Help me create a token called Cosmic Coin with symbol CSMC"</p>
                <p className="p-2 bg-solmint-black rounded-md text-gray-300">"What are decimals and how many should I use?"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
