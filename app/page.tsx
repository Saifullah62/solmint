'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layouts/MainLayout';
import { ArrowRight, Shield, Zap, Rocket, Users } from 'lucide-react';
import Logo from '@/components/brand/Logo';

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-solmint-black via-solmint-blackLight to-solmint-violet/20 z-0" />
        
        {/* Hero content */}
        <div className="relative z-10 px-6 py-24 mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <div className="inline-block mb-4">
                <Logo size="lg" variant="full" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                Create. Launch. <span className="text-solmint-mint">Thrive.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
                Your Token, Zero Code. The easiest way to launch your SPL token on Solana.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/launchpad" 
                  className="px-8 py-4 rounded-lg bg-solmint-violet text-white font-medium hover:bg-solmint-violet/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-solmint-violet/20"
                >
                  Launch Token <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
                <Link 
                  href="/assistant" 
                  className="px-8 py-4 rounded-lg bg-transparent border border-solmint-mint/30 text-solmint-mint font-medium hover:bg-solmint-mint/10 transition-colors flex items-center justify-center"
                >
                  Ask AI Assistant
                </Link>
              </div>
            </div>
            
            {/* Hero image/graphic */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                {/* Abstract graphic representation */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-solmint-violet to-solmint-mint opacity-20 blur-3xl" />
                <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-solmint-violet to-solmint-mint opacity-30 animate-pulse" />
                <div className="absolute inset-16 rounded-full bg-gradient-to-r from-solmint-violet/80 to-solmint-mint/80 opacity-50" />
                <div className="absolute inset-24 rounded-full bg-solmint-black flex items-center justify-center">
                  <Logo size="md" variant="icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-solmint-blackLight py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose SOLMINT?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A powerful platform designed for creators and builders in the Solana ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-gradient-to-br from-solmint-black to-solmint-blackLight border border-solmint-blackLight hover:border-solmint-violet/30 transition-all group">
              <div className="w-14 h-14 rounded-lg bg-solmint-violet/20 flex items-center justify-center mb-6 group-hover:bg-solmint-violet/30 transition-colors">
                <Zap className="h-7 w-7 text-solmint-mint" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Zero-Code Creation</h3>
              <p className="text-gray-400">Create tokens visually or through natural language with our AI assistant. No coding knowledge required.</p>
            </div>
            
            <div className="p-8 rounded-xl bg-gradient-to-br from-solmint-black to-solmint-blackLight border border-solmint-blackLight hover:border-solmint-violet/30 transition-all group">
              <div className="w-14 h-14 rounded-lg bg-solmint-violet/20 flex items-center justify-center mb-6 group-hover:bg-solmint-violet/30 transition-colors">
                <Shield className="h-7 w-7 text-solmint-mint" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Security Validated</h3>
              <p className="text-gray-400">AI-powered security checks and best practice recommendations to ensure your token is safe and reliable.</p>
            </div>
            
            <div className="p-8 rounded-xl bg-gradient-to-br from-solmint-black to-solmint-blackLight border border-solmint-blackLight hover:border-solmint-violet/30 transition-all group">
              <div className="w-14 h-14 rounded-lg bg-solmint-violet/20 flex items-center justify-center mb-6 group-hover:bg-solmint-violet/30 transition-colors">
                <Rocket className="h-7 w-7 text-solmint-mint" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Launch Tools</h3>
              <p className="text-gray-400">Generate social campaigns, community tools, and monitor your token performance all in one place.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto rounded-2xl bg-gradient-to-r from-solmint-violet/20 to-solmint-mint/20 p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Create Your Token?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the community of creators and builders who are launching their tokens with SOLMINT.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/launchpad" 
              className="px-8 py-4 rounded-lg bg-solmint-violet text-white font-medium hover:bg-solmint-violet/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-solmint-violet/20"
            >
              Get Started <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
            <Link 
              href="/marketplace" 
              className="px-8 py-4 rounded-lg bg-transparent border border-solmint-mint/30 text-solmint-mint font-medium hover:bg-solmint-mint/10 transition-colors flex items-center justify-center"
            >
              View Marketplace
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
