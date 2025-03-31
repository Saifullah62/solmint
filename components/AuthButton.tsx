'use client';

import React from 'react';
import { useWallet } from '@/components/WalletContextProvider';
import { useUser } from '@/context/UserContext';

const AuthButton = () => {
  const { connected, connect } = useWallet();
  const { user, isLoggedIn, loading, signInWithWallet, signOut } = useUser();

  const handleAuth = async () => {
    if (connected && !isLoggedIn) {
      await signInWithWallet();
    } else if (isLoggedIn) {
      await signOut();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={connected ? () => {} : connect}
        className="px-4 py-2 bg-solmint-violet hover:bg-solmint-violetDark text-white rounded-md transition-colors"
      >
        {connected ? 'Wallet Connected' : 'Connect Wallet'}
      </button>
      
      {connected && !isLoggedIn && (
        <button
          onClick={handleAuth}
          className="px-4 py-2 bg-solmint-violet hover:bg-solmint-violetDark text-white rounded-md transition-colors"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in with Wallet'}
        </button>
      )}
      
      {isLoggedIn && (
        <div className="flex flex-col items-center gap-2">
          <div className="p-4 bg-solmint-black rounded-md">
            <p className="text-white">Signed in as:</p>
            <p className="text-solmint-violet font-mono text-sm truncate max-w-xs">
              {user?.wallet}
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Last login: {user?.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}
            </p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthButton;
