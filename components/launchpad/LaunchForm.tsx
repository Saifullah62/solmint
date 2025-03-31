'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Rocket, Image, AlertCircle } from 'lucide-react';
import { TokenLogoUpload } from './TokenLogoUpload';

interface LaunchFormProps {
  selectedPackage: string | null;
  onComplete: (data: LaunchFormData) => void;
}

export interface LaunchFormData {
  tokenName: string;
  tokenSymbol: string;
  tokenDescription: string;
  websiteUrl: string;
  twitterHandle: string;
  discordUrl: string;
  tokenSupply: string;
  launchDate: string;
  category: string;
  logoFile?: File;
}

export const LaunchForm = ({ selectedPackage, onComplete }: LaunchFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LaunchFormData>({
    tokenName: '',
    tokenSymbol: '',
    tokenDescription: '',
    websiteUrl: '',
    twitterHandle: '',
    discordUrl: '',
    tokenSupply: '',
    launchDate: '',
    category: 'DeFi'
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LaunchFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name as keyof LaunchFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLogoUpload = (file: File) => {
    setFormData(prev => ({
      ...prev,
      logoFile: file
    }));
  };

  const validateStep = (step: number) => {
    const newErrors: Partial<Record<keyof LaunchFormData, string>> = {};
    
    if (step === 1) {
      if (!formData.tokenName) newErrors.tokenName = 'Token name is required';
      if (!formData.tokenSymbol) newErrors.tokenSymbol = 'Token symbol is required';
      if (formData.tokenSymbol && formData.tokenSymbol.length > 6) {
        newErrors.tokenSymbol = 'Token symbol should be 6 characters or less';
      }
      if (!formData.tokenDescription) newErrors.tokenDescription = 'Description is required';
    } else if (step === 2) {
      if (formData.websiteUrl && !formData.websiteUrl.startsWith('http')) {
        newErrors.websiteUrl = 'Website URL must start with http:// or https://';
      }
      if (formData.twitterHandle && !formData.twitterHandle.startsWith('@')) {
        newErrors.twitterHandle = 'Twitter handle should start with @';
      }
    } else if (step === 3) {
      if (!formData.tokenSupply) newErrors.tokenSupply = 'Token supply is required';
      if (!formData.launchDate) newErrors.launchDate = 'Launch date is required';
      if (!formData.category) newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onComplete(formData);
    }
  };

  const packageInfo = {
    basic: {
      title: 'Basic Launch',
      description: 'Get your token listed on SOLMINT with basic community tools.',
      price: 'Free'
    },
    growth: {
      title: 'Growth Launch',
      description: 'Supercharge your launch with AI marketing tools and community features.',
      price: '0.5 SOL'
    },
    premium: {
      title: 'Premium Launch',
      description: 'Full-service launch with custom landing page and featured placement.',
      price: '2 SOL'
    }
  };

  const selectedPackageInfo = selectedPackage ? packageInfo[selectedPackage as keyof typeof packageInfo] : null;

  const categories = [
    'DeFi', 'NFT', 'Gaming', 'Metaverse', 'Social', 'Infrastructure', 
    'DAO', 'Environment', 'AI', 'Privacy', 'Other'
  ];

  return (
    <div className="bg-solmint-blackLight border border-solmint-blackLight rounded-xl p-6">
      {selectedPackageInfo && (
        <div className="mb-6 p-4 bg-solmint-black rounded-lg">
          <h3 className="text-lg font-medium text-white mb-1">
            {selectedPackageInfo.title}
          </h3>
          <p className="text-gray-300 text-sm mb-2">{selectedPackageInfo.description}</p>
          <div className="text-solmint-violet font-bold">{selectedPackageInfo.price}</div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Launch Your Token</h2>
          <div className="text-sm text-gray-400">Step {currentStep} of 3</div>
        </div>
        <div className="w-full bg-solmint-black h-2 rounded-full overflow-hidden">
          <div 
            className="bg-solmint-violet h-full transition-all duration-300 ease-in-out" 
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-2">Token Information</h3>
            
            <div>
              <label htmlFor="tokenName" className="block text-sm font-medium text-gray-300 mb-1">
                Token Name*
              </label>
              <Input
                id="tokenName"
                name="tokenName"
                value={formData.tokenName}
                onChange={handleChange}
                placeholder="e.g. Solana Ecosystem Token"
                className={`bg-solmint-black border-solmint-blackLight text-white ${errors.tokenName ? 'border-red-500' : ''}`}
              />
              {errors.tokenName && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.tokenName}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="tokenSymbol" className="block text-sm font-medium text-gray-300 mb-1">
                Token Symbol*
              </label>
              <Input
                id="tokenSymbol"
                name="tokenSymbol"
                value={formData.tokenSymbol}
                onChange={handleChange}
                placeholder="e.g. SET"
                className={`bg-solmint-black border-solmint-blackLight text-white ${errors.tokenSymbol ? 'border-red-500' : ''}`}
                maxLength={6}
              />
              {errors.tokenSymbol && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.tokenSymbol}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="tokenLogo" className="block text-sm font-medium text-gray-300 mb-1">
                Token Logo
              </label>
              <TokenLogoUpload onUpload={handleLogoUpload} />
            </div>
            
            <div>
              <label htmlFor="tokenDescription" className="block text-sm font-medium text-gray-300 mb-1">
                Token Description*
              </label>
              <textarea
                id="tokenDescription"
                name="tokenDescription"
                value={formData.tokenDescription}
                onChange={handleChange}
                placeholder="Describe your token and its purpose..."
                className={`w-full h-24 rounded-md border bg-solmint-black border-solmint-blackLight text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A2BE2] focus-visible:ring-offset-2 ${errors.tokenDescription ? 'border-red-500' : ''}`}
              />
              {errors.tokenDescription && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.tokenDescription}
                </p>
              )}
            </div>
            
            <div className="pt-4">
              <Button type="button" onClick={handleNext} className="w-full">
                Continue
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-2">Social & Community</h3>
            
            <div>
              <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-300 mb-1">
                Website URL
              </label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://yourtoken.com"
                className={`bg-solmint-black border-solmint-blackLight text-white ${errors.websiteUrl ? 'border-red-500' : ''}`}
              />
              {errors.websiteUrl && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.websiteUrl}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="twitterHandle" className="block text-sm font-medium text-gray-300 mb-1">
                Twitter Handle
              </label>
              <Input
                id="twitterHandle"
                name="twitterHandle"
                value={formData.twitterHandle}
                onChange={handleChange}
                placeholder="@yourtoken"
                className={`bg-solmint-black border-solmint-blackLight text-white ${errors.twitterHandle ? 'border-red-500' : ''}`}
              />
              {errors.twitterHandle && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.twitterHandle}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="discordUrl" className="block text-sm font-medium text-gray-300 mb-1">
                Discord URL
              </label>
              <Input
                id="discordUrl"
                name="discordUrl"
                value={formData.discordUrl}
                onChange={handleChange}
                placeholder="https://discord.gg/yourtoken"
                className="bg-solmint-black border-solmint-blackLight text-white"
              />
            </div>
            
            <div className="pt-4 flex gap-4">
              <Button type="button" variant="outline" onClick={handleBack} className="w-1/2">
                Back
              </Button>
              <Button type="button" onClick={handleNext} className="w-1/2">
                Continue
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-2">Launch Details</h3>
            
            <div>
              <label htmlFor="tokenSupply" className="block text-sm font-medium text-gray-300 mb-1">
                Token Supply*
              </label>
              <Input
                id="tokenSupply"
                name="tokenSupply"
                type="number"
                value={formData.tokenSupply}
                onChange={handleChange}
                placeholder="e.g. 1000000"
                className={`bg-solmint-black border-solmint-blackLight text-white ${errors.tokenSupply ? 'border-red-500' : ''}`}
              />
              {errors.tokenSupply && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.tokenSupply}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="launchDate" className="block text-sm font-medium text-gray-300 mb-1">
                Launch Date*
              </label>
              <Input
                id="launchDate"
                name="launchDate"
                type="date"
                value={formData.launchDate}
                onChange={handleChange}
                className={`bg-solmint-black border-solmint-blackLight text-white ${errors.launchDate ? 'border-red-500' : ''}`}
              />
              {errors.launchDate && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.launchDate}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                Category*
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full h-10 rounded-md border bg-solmint-black border-solmint-blackLight text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A2BE2] focus-visible:ring-offset-2 ${errors.category ? 'border-red-500' : ''}`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.category}
                </p>
              )}
            </div>
            
            <div className="pt-4 flex gap-4">
              <Button type="button" variant="outline" onClick={handleBack} className="w-1/2">
                Back
              </Button>
              <Button type="submit" className="w-1/2 gap-2">
                Complete <Rocket className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
