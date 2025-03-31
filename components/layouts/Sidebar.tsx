'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  PlusCircle, 
  MessageSquare, 
  Rocket, 
  Store, 
  LayoutDashboard, 
  Menu, 
  X 
} from 'lucide-react';
import { useState } from 'react';
import Logo from '../brand/Logo';

export const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    {
      name: 'Create Token',
      href: '/create',
      icon: <PlusCircle className="h-5 w-5" />
    },
    {
      name: 'AI Assistant',
      href: '/assistant',
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      name: 'Launchpad',
      href: '/launchpad',
      icon: <Rocket className="h-5 w-5" />
    },
    {
      name: 'Marketplace',
      href: '/marketplace',
      icon: <Store className="h-5 w-5" />
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Mobile menu button */}
      <button
        className="fixed bottom-4 right-4 p-3 rounded-full bg-solmint-violet text-white shadow-lg z-40 md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-full w-64 transform transition-transform duration-300 ease-in-out bg-solmint-blackLight border-r border-solmint-blackLight md:translate-x-0 md:static md:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-solmint-blackLight">
            <Link href="/">
              <Logo size="md" variant="full" />
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => {
                // Check if current path starts with the nav item's href
                // This handles nested routes properly
                const isActive = pathname === item.href || 
                  (pathname?.startsWith(item.href) && item.href !== '/');
                  
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                        isActive 
                          ? 'bg-solmint-violet text-white' 
                          : 'text-gray-300 hover:bg-solmint-blackLight hover:text-white'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.name}</span>
                      {isActive && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-solmint-mint" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-solmint-blackLight">
            <div className="px-4 py-2 rounded-md bg-gradient-to-r from-solmint-violet/20 to-solmint-mint/20 text-center">
              <p className="text-xs text-gray-300">
                Your Token, Zero Code.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
