'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { useAIAssistant } from '../../hooks/useAIAssistant';
import { ChatMessage } from '../../services/openai';
import { FiSend } from 'react-icons/fi';
import { MdOutlineAnalytics } from 'react-icons/md';
import { IoMdRefresh } from 'react-icons/io';
import ReactMarkdown from 'react-markdown';

// Define types for ReactMarkdown component props
interface MarkdownComponentProps {
  children: ReactNode;
  [key: string]: any;
}

interface CodeProps extends MarkdownComponentProps {
  inline?: boolean;
}

export const ChatInterface: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    analyzeCurrentTokenConfig, 
    clearMessages,
    sendWelcomeMessage
  } = useAIAssistant();
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const welcomeMessageSent = useRef(false);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Send welcome message when component mounts
  useEffect(() => {
    // Only send welcome message once during the component's lifetime
    if (!welcomeMessageSent.current) {
      sendWelcomeMessage();
      welcomeMessageSent.current = true;
    }
  }, [sendWelcomeMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await sendMessage(input);
      setInput('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Handle token analysis
  const handleAnalyzeToken = async () => {
    try {
      await analyzeCurrentTokenConfig();
    } catch (err) {
      console.error('Error analyzing token:', err);
    }
  };

  // Add a function to check if token config is available for analysis
  const isTokenConfigAvailable = () => {
    // This function will be called by the UI to determine if the analyze button should be enabled
    return messages.length > 0; // We always enable it if there are messages
  };

  // Format message content with markdown
  const formatMessageContent = (content: string) => {
    return (
      <ReactMarkdown
        components={{
          p: ({ children, ...props }: MarkdownComponentProps) => <p className="mb-2" {...props}>{children}</p>,
          ul: ({ children, ...props }: MarkdownComponentProps) => <ul className="list-disc ml-5 mb-2" {...props}>{children}</ul>,
          ol: ({ children, ...props }: MarkdownComponentProps) => <ol className="list-decimal ml-5 mb-2" {...props}>{children}</ol>,
          li: ({ children, ...props }: MarkdownComponentProps) => <li className="mb-1" {...props}>{children}</li>,
          h1: ({ children, ...props }: MarkdownComponentProps) => <h1 className="text-xl font-bold mb-2" {...props}>{children}</h1>,
          h2: ({ children, ...props }: MarkdownComponentProps) => <h2 className="text-lg font-bold mb-2" {...props}>{children}</h2>,
          h3: ({ children, ...props }: MarkdownComponentProps) => <h3 className="text-md font-bold mb-2" {...props}>{children}</h3>,
          code: ({ children, inline, ...props }: CodeProps) => 
            inline ? 
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded" {...props}>{children}</code> : 
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2 overflow-x-auto" {...props}>{children}</code>,
          pre: ({ children, ...props }: MarkdownComponentProps) => <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2 overflow-x-auto" {...props}>{children}</pre>,
          a: ({ children, ...props }: MarkdownComponentProps) => <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  // Handle clearing messages
  const handleClearMessages = () => {
    clearMessages();
    // Reset welcome message sent flag to allow sending welcome message again
    welcomeMessageSent.current = false;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Chat header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">SOLMINT AI Assistant</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleAnalyzeToken}
            className="flex items-center gap-1 py-1 px-3 rounded-full bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300"
            title="Analyze token configuration for mainnet deployment"
          >
            <MdOutlineAnalytics size={18} />
            <span className="text-sm font-medium">Analyze Token</span>
          </button>
          <button
            onClick={handleClearMessages}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            title="Clear conversation"
          >
            <IoMdRefresh size={20} />
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
              }`}
            >
              {formatMessageContent(message.content)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center">
            <div className="max-w-[80%] p-3 rounded-lg bg-red-100 text-red-800">
              Error: {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Ask about token parameters, compliance, or security</span>
            <button
              type="button"
              onClick={handleAnalyzeToken}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Analyze my token for mainnet
            </button>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`p-2 rounded-lg ${
                isLoading || !input.trim()
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
