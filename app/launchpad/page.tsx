'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Rocket, Users, MessageSquare, Share2, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { LaunchForm, LaunchFormData } from '@/components/launchpad/LaunchForm';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';

// Service pricing for real production use
const launchPackages = [
  {
    id: 'basic',
    name: 'Basic Launch',
    price: '0.2 SOL',
    features: [
      'Token listing on SOLMINT',
      'Basic social media templates',
      'Community forum access',
      'Standard support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth Launch',
    price: '1.5 SOL',
    features: [
      'Token listing on SOLMINT',
      'Premium placement in marketplace',
      'Advanced social media kit',
      'Community management tools',
      'Priority support',
      'Launch promotion to existing users',
    ],
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium Launch',
    price: '5 SOL',
    features: [
      'Token listing on SOLMINT',
      'Featured placement in marketplace',
      'Complete marketing package',
      'Dedicated community manager',
      'VIP support',
      'Launch promotion to all users',
      'Custom token analytics dashboard',
      'Security audit report',
    ],
  },
];

export default function LaunchpadPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [showLaunchForm, setShowLaunchForm] = useState(false);
  const [launchComplete, setLaunchComplete] = useState(false);
  const [launchedToken, setLaunchedToken] = useState<LaunchFormData | null>(null);

  const handleStartLaunch = () => {
    if (!selectedPackage) {
      // If no package is selected, default to "growth" (the recommended one)
      setSelectedPackage('growth');
    }
    setShowLaunchForm(true);
    
    // Scroll to the form
    setTimeout(() => {
      document.getElementById('launch-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLaunchComplete = async (data: LaunchFormData) => {
    try {
      // Submit the data to the API
      const response = await fetch('/api/launchpad/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          packageType: selectedPackage
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit launch data');
      }
      
      const responseData = await response.json();
      
      // Set the launched token data from the form
      setLaunchedToken(data);
      setLaunchComplete(true);
      
      // Show success toast
      toast({
        title: "Launch Initiated!",
        description: `Your token ${data.tokenName} (${data.tokenSymbol}) has been submitted successfully.`,
        variant: "default",
      });
      
      // Scroll to the success message
      setTimeout(() => {
        document.getElementById('launch-success')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Error submitting launch:', error);
      toast({
        title: "Launch Failed",
        description: error instanceof Error ? error.message : "There was an error processing your launch. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleResetLaunch = () => {
    setShowLaunchForm(false);
    setLaunchComplete(false);
    setLaunchedToken(null);
    setSelectedPackage(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-solmint-violet to-solmint-violet/70 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Launch Your Token to the Moon</h1>
              <p className="text-xl text-white/90 mb-6">
                Supercharge your token launch with AI-powered marketing tools, community building features, and direct access to the SOLMINT ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2" onClick={handleStartLaunch}>
                  Start Your Launch <Rocket className="h-5 w-5" />
                </Button>
                <Link href="/marketplace">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2">
                    Explore Marketplace <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Launch Success Message */}
        {launchComplete && launchedToken && (
          <section id="launch-success" className="mb-12 animate-fadeIn">
            <div className="bg-solmint-blackLight border border-solmint-violet rounded-xl p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-solmint-violet/20 mb-4">
                  <CheckCircle className="h-8 w-8 text-solmint-violet" />
                </div>
                <h2 className="text-3xl font-bold mb-2 text-white">Launch Initiated!</h2>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Congratulations! Your token <span className="text-solmint-violet font-bold">{launchedToken.tokenName} ({launchedToken.tokenSymbol})</span> is now being processed for launch. You'll receive further instructions via email.
                </p>
                <div className="bg-solmint-black rounded-lg p-6 mb-6 max-w-md mx-auto">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Token Name:</span>
                    <span className="text-white font-medium">{launchedToken.tokenName}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Symbol:</span>
                    <span className="text-white font-medium">{launchedToken.tokenSymbol}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Supply:</span>
                    <span className="text-white font-medium">{parseInt(launchedToken.tokenSupply).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Launch Date:</span>
                    <span className="text-white font-medium">{new Date(launchedToken.launchDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white font-medium">{launchedToken.category}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={handleResetLaunch}>
                    Start Another Launch
                  </Button>
                  <Link href="/dashboard">
                    <Button>
                      View Launch Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Launch Form Section */}
        {showLaunchForm && !launchComplete && (
          <section id="launch-form-section" className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">Create Your Launch</h2>
            <LaunchForm 
              selectedPackage={selectedPackage} 
              onComplete={handleLaunchComplete} 
            />
          </section>
        )}

        {/* Launch Packages */}
        {!showLaunchForm && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">Launch Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {launchPackages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className={`bg-solmint-blackLight border ${pkg.recommended ? 'border-solmint-violet' : 'border-solmint-blackLight'} rounded-xl p-6 relative ${pkg.recommended ? 'ring-2 ring-solmint-violet' : ''}`}
                >
                  {pkg.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-solmint-violet text-white text-sm font-medium py-1 px-3 rounded-full">
                      Recommended
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-2xl font-bold text-solmint-violet mb-4">{pkg.price}</p>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Zap className="h-5 w-5 text-solmint-violet flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={pkg.recommended ? 'default' : 'outline'} 
                    className="w-full"
                    onClick={() => {
                      setSelectedPackage(pkg.id);
                      handleStartLaunch();
                    }}
                  >
                    {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Features Section */}
        {!showLaunchForm && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">Launch Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-solmint-blackLight border border-solmint-blackLight rounded-xl p-6">
                <div className="bg-solmint-violet/20 p-3 rounded-full w-fit mb-4">
                  <MessageSquare className="h-6 w-6 text-solmint-violet" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI-Generated Content</h3>
                <p className="text-gray-300">
                  Create professional marketing materials, social posts, and community updates with our AI assistant.
                </p>
              </div>
              
              <div className="bg-solmint-blackLight border border-solmint-blackLight rounded-xl p-6">
                <div className="bg-solmint-violet/20 p-3 rounded-full w-fit mb-4">
                  <Users className="h-6 w-6 text-solmint-violet" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Community Tools</h3>
                <p className="text-gray-300">
                  Discord bot templates, community forums, and engagement tools to build a thriving token community.
                </p>
              </div>
              
              <div className="bg-solmint-blackLight border border-solmint-blackLight rounded-xl p-6">
                <div className="bg-solmint-violet/20 p-3 rounded-full w-fit mb-4">
                  <Share2 className="h-6 w-6 text-solmint-violet" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Launch Promotion</h3>
                <p className="text-gray-300">
                  Get featured in the SOLMINT marketplace and reach thousands of potential token holders.
                </p>
              </div>
            </div>
          </section>
        )}
        
        {/* Launch Your Token CTA */}
        {!showLaunchForm && (
          <section>
            <div className="bg-solmint-blackLight border border-solmint-blackLight rounded-xl p-8">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4 text-white">Ready to Launch Your Token?</h2>
                <p className="text-gray-300 mb-6">
                  Join the hundreds of projects that have successfully launched with SOLMINT's powerful tools and supportive community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  <Input 
                    placeholder="Enter your token symbol" 
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    className="max-w-xs bg-solmint-black border-solmint-blackLight text-white"
                  />
                  <Button className="gap-2" onClick={handleStartLaunch}>
                    Start Launch Process <Rocket className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-sm text-gray-400">
                  Already have a token? <Link href="/dashboard" className="text-solmint-violet hover:underline">Import your existing token</Link>
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
