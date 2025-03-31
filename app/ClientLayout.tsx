'use client';

import React, { ReactNode } from 'react';
import { WalletContextProvider } from '../components/WalletContextProvider';

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <WalletContextProvider>
      {children}
    </WalletContextProvider>
  );
};

export default ClientLayout;
