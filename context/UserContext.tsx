'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { useWallet } from "@/components/WalletContextProvider";
import bs58 from "bs58";
import nacl from 'tweetnacl';

type User = {
  wallet: string;
  last_login?: string;
  preferences?: any;
  ai_history?: any;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  signInWithWallet: () => Promise<void>;
  signOut: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  isLoggedIn: false,
  signInWithWallet: async () => {},
  signOut: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { publicKey, connected, disconnect } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to check session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Sign in with wallet
  const signInWithWallet = async () => {
    if (!connected || !publicKey) {
      console.error("Wallet not connected");
      return;
    }

    setLoading(true);

    try {
      // For our simplified implementation, we'll redirect to the auth-demo page
      // where the user can connect their real wallet
      window.location.href = '/auth-demo';
      return;
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
      });
      
      setUser(null);
      if (disconnect) {
        await disconnect();
      }
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        loading, 
        isLoggedIn: !!user,
        signInWithWallet,
        signOut
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
