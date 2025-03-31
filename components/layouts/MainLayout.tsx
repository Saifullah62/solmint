'use client';

import React, { ReactNode } from 'react';
import { Sidebar } from '../layouts/Sidebar';
import { TopNav } from '../layouts/TopNav';
import { Footer } from '../layouts/Footer';
import { Toaster } from '@/components/ui/toaster';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-solmint-black text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <Footer />
      </div>
      <Toaster />
    </div>
  );
};
