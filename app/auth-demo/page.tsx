'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import bs58 from 'bs58';

const AuthDemoPage = () => {
  const { user, isLoggedIn } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  // Check if the user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      setMessage('You are already logged in!');
    }
  }, [isLoggedIn]);

  // Function to connect wallet using Phantom
  const connectPhantom = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if Phantom is installed
      const provider = (window as any).solana;
      
      if (!provider?.isPhantom) {
        setError('Phantom wallet is not installed. Please install it from https://phantom.app/');
        return;
      }
      
      // Connect to Phantom
      await provider.connect();
      const publicKey = provider.publicKey.toString();
      
      // Generate a message to sign
      const message = `SOLMINT Login\n\nSign this message to verify you own wallet:\n${publicKey}\n\nTimestamp: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      
      // Request signature from user
      const signedMessage = await provider.signMessage(encodedMessage, 'utf8');
      
      // Convert signature to appropriate format
      let signature;
      if (signedMessage.signature) {
        // For newer versions of Phantom
        signature = Array.from(signedMessage.signature);
      } else if (Buffer.isBuffer(signedMessage)) {
        // For older versions that return a buffer
        signature = bs58.encode(signedMessage);
      } else if (typeof signedMessage === 'string') {
        // For versions that return a base58 string
        signature = signedMessage;
      } else {
        // For versions that return Uint8Array
        signature = bs58.encode(signedMessage);
      }
      
      // Verify the signature on the server
      const response = await fetch('/api/auth/verify-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: publicKey,
          message,
          signature,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Authentication successful! Redirecting...');
        // Redirect to home page after successful authentication
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  // Function to connect wallet using Solflare
  const connectSolflare = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if Solflare is installed
      const provider = (window as any).solflare;
      
      if (!provider) {
        setError('Solflare wallet is not installed. Please install it from https://solflare.com/');
        return;
      }
      
      // Connect to Solflare
      await provider.connect();
      const publicKey = provider.publicKey.toString();
      
      // Generate a message to sign
      const message = `SOLMINT Login\n\nSign this message to verify you own wallet:\n${publicKey}\n\nTimestamp: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      
      // Request signature from user
      const signedMessage = await provider.signMessage(encodedMessage);
      
      // Convert signature to appropriate format
      let signature;
      if (Buffer.isBuffer(signedMessage)) {
        // For versions that return a buffer
        signature = bs58.encode(signedMessage);
      } else if (typeof signedMessage === 'string') {
        // For versions that return a base58 string
        signature = signedMessage;
      } else {
        // For versions that return Uint8Array
        signature = Array.from(signedMessage);
      }
      
      // Verify the signature on the server
      const response = await fetch('/api/auth/verify-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: publicKey,
          message,
          signature,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Authentication successful! Redirecting...');
        // Redirect to home page after successful authentication
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-solmint-blackDark flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-solmint-blackLight p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Wallet Authentication</h1>
        
        <div className="flex flex-col items-center gap-6">
          {message && (
            <div className="bg-green-900/50 border border-green-500 text-green-200 p-4 rounded-md w-full text-center">
              {message}
            </div>
          )}
          
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-md w-full text-center">
              {error}
            </div>
          )}
          
          <p className="text-gray-300 text-center">
            Connect your Solana wallet and sign a message to authenticate with SOLMINT.
          </p>
          
          <div className="flex flex-col w-full gap-4">
            <button
              onClick={connectPhantom}
              disabled={loading || isLoggedIn}
              className="flex items-center justify-center gap-2 bg-[#AB9FF2] hover:bg-[#9D8CE0] text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connecting...' : 'Connect with Phantom'}
            </button>
            
            <button
              onClick={connectSolflare}
              disabled={loading || isLoggedIn}
              className="flex items-center justify-center gap-2 bg-[#FE8F4F] hover:bg-[#E67F3F] text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connecting...' : 'Connect with Solflare'}
            </button>
          </div>
          
          <div className="mt-4 text-gray-400 text-sm text-center">
            <p>Your wallet address will be securely stored in our database.</p>
            <p>We never store your private keys.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDemoPage;
