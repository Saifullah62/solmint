'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useWallet } from '@/components/WalletContextProvider';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { Sparkles, HelpCircle, AlertCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Import the Select components normally
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export const TokenConfigForm: React.FC = () => {
  const { 
    tokenConfig, 
    updateTokenConfig, 
    setTokenCreationStep, 
    network, 
    setNetwork 
  } = useAppStore();
  const { publicKey } = useWallet();
  const { sendMessage, isLoading } = useAIAssistant();
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiSuggestionType, setAiSuggestionType] = useState<'name' | 'symbol' | 'decimals' | 'supply'>('name');
  const [aiPrompt, setAiPrompt] = useState('');
  const [mounted, setMounted] = useState(false);

  // Handle client-side only rendering
  useEffect(() => {
    setMounted(true);
    // Always set network to mainnet-beta
    setNetwork('mainnet-beta');
  }, [setNetwork]);

  // Debug wallet connection
  useEffect(() => {
    console.log("Wallet connection status:", !!publicKey);
    if (publicKey) {
      console.log("Connected wallet address:", publicKey);
    }
  }, [publicKey]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTokenCreationStep('review');
  };

  // Get AI suggestions for token configuration
  const getAISuggestion = async () => {
    if (!aiPrompt) return;
    
    let prompt = '';
    switch (aiSuggestionType) {
      case 'name':
        prompt = `I need help coming up with a good token name for my project. Context: ${aiPrompt}`;
        break;
      case 'symbol':
        prompt = `I need a good token symbol (ticker) for my project. Context: ${aiPrompt}`;
        break;
      case 'decimals':
        prompt = `What's the recommended number of decimals for a token with this use case: ${aiPrompt}`;
        break;
      case 'supply':
        prompt = `What would be an appropriate initial supply for a token with this use case: ${aiPrompt}`;
        break;
    }
    
    await sendMessage(prompt);
    setShowAIDialog(false);
    setAiPrompt('');
  };

  // Tooltips for form fields
  const tooltips = {
    name: "Your token's full name (e.g., 'Bitcoin')",
    symbol: "A short ticker symbol for your token (e.g., 'BTC')",
    decimals: "Number of decimal places for your token. 9 is standard for Solana tokens, 6 for stablecoins",
    supply: "The initial amount of tokens to mint",
    mintAuthority: "Address that can mint additional tokens in the future",
    freezeAuthority: "Address that can freeze token accounts"
  };

  // If not mounted yet, return a placeholder to avoid hydration errors
  if (!mounted) {
    return <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Loading Token Configuration...</h2>
    </div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Configure Your Solana Token</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Network Information - Static Mainnet */}
        <div className="mb-6">
          <Label htmlFor="network" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Network
          </Label>
          {mounted && (
            <>
              <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-medium">Mainnet (Production)</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Mainnet is the production network. Tokens created here can have real value.
              </p>
            </>
          )}
        </div>

        {/* Token Name */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="tokenName" className="block text-sm font-medium text-gray-900 dark:text-white">
              Token Name
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 inline ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700">
                    <p>{tooltips.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setAiSuggestionType('name');
                setShowAIDialog(true);
              }}
              className="text-xs flex items-center text-purple-500"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              AI Suggestion
            </Button>
          </div>
          <Input
            id="tokenName"
            value={tokenConfig.name || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTokenConfig({ name: e.target.value })}
            placeholder="e.g., Solana Gold"
            className="w-full text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Token Symbol */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="tokenSymbol" className="block text-sm font-medium text-gray-900 dark:text-white">
              Token Symbol
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 inline ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700">
                    <p>{tooltips.symbol}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setAiSuggestionType('symbol');
                setShowAIDialog(true);
              }}
              className="text-xs flex items-center text-purple-500"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              AI Suggestion
            </Button>
          </div>
          <Input
            id="tokenSymbol"
            value={tokenConfig.symbol || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTokenConfig({ symbol: e.target.value.toUpperCase() })}
            placeholder="e.g., SGLD"
            className="w-full text-gray-900 dark:text-white"
            maxLength={10}
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Maximum 10 characters, uppercase letters recommended
          </p>
        </div>

        {/* Token Decimals */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="tokenDecimals" className="block text-sm font-medium text-gray-900 dark:text-white">
              Decimals
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 inline ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700">
                    <p>{tooltips.decimals}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setAiSuggestionType('decimals');
                setShowAIDialog(true);
              }}
              className="text-xs flex items-center text-purple-500"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              AI Suggestion
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Slider
              id="tokenDecimals"
              value={[tokenConfig.decimals !== undefined ? tokenConfig.decimals : 9]}
              min={0}
              max={9}
              step={1}
              onValueChange={(value: number[]) => updateTokenConfig({ decimals: value[0] })}
              className="flex-1"
            />
            <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
              {tokenConfig.decimals !== undefined ? tokenConfig.decimals : 9}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {tokenConfig.decimals === 9 && "Standard for most Solana tokens"}
            {tokenConfig.decimals === 6 && "Common for stablecoins"}
            {tokenConfig.decimals === 0 && "No fractional amounts (whole tokens only)"}
          </p>
        </div>

        {/* Initial Supply */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="initialSupply" className="block text-sm font-medium text-gray-900 dark:text-white">
              Initial Supply
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 inline ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700">
                    <p>{tooltips.supply}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setAiSuggestionType('supply');
                setShowAIDialog(true);
              }}
              className="text-xs flex items-center text-purple-500"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              AI Suggestion
            </Button>
          </div>
          <Input
            id="initialSupply"
            type="number"
            value={tokenConfig.initialSupply !== undefined ? tokenConfig.initialSupply : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTokenConfig({ initialSupply: parseInt(e.target.value) })}
            placeholder="e.g., 1000000"
            className="w-full text-gray-900 dark:text-white"
            min={1}
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Actual supply will be: {tokenConfig.initialSupply !== undefined ? tokenConfig.initialSupply : 0} × 10^{tokenConfig.decimals !== undefined ? tokenConfig.decimals : 9}
          </p>
        </div>

        {/* Mint Authority */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="mintAuthority" className="block text-sm font-medium text-gray-900 dark:text-white">
              Mint Authority
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 inline ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700">
                    <p>{tooltips.mintAuthority}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="flex items-center">
              <Switch
                id="hasMintAuthority"
                checked={tokenConfig.mintAuthority !== null}
                onCheckedChange={(checked) => {
                  if (checked) {
                    if (publicKey) {
                      const walletAddress = publicKey;
                      console.log("Setting mint authority to:", walletAddress);
                      updateTokenConfig({ mintAuthority: walletAddress });
                    } else {
                      console.log("No wallet connected, setting empty mint authority");
                      updateTokenConfig({ mintAuthority: "" });
                    }
                  } else {
                    console.log("Disabling mint authority");
                    updateTokenConfig({ mintAuthority: null });
                  }
                }}
              />
              <Label htmlFor="hasMintAuthority" className="ml-2 text-sm text-gray-900 dark:text-white">
                Enable
              </Label>
            </div>
          </div>
          {tokenConfig.mintAuthority !== null && (
            <Input
              id="mintAuthority"
              value={tokenConfig.mintAuthority || ""}
              onChange={(e) => updateTokenConfig({ mintAuthority: e.target.value || "" })}
              placeholder="Solana address"
              className="w-full text-gray-900 dark:text-white"
            />
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {tokenConfig.mintAuthority !== null
              ? "This address will be able to mint additional tokens in the future."
              : "No additional tokens can be minted after creation (fixed supply)."}
          </p>
        </div>

        {/* Freeze Authority */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="freezeAuthority" className="block text-sm font-medium text-gray-900 dark:text-white">
              Freeze Authority
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 inline ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700">
                    <p>{tooltips.freezeAuthority}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="flex items-center">
              <Switch
                id="hasFreezeAuthority"
                checked={tokenConfig.freezeAuthority !== null}
                onCheckedChange={(checked) => {
                  if (checked) {
                    if (publicKey) {
                      const walletAddress = publicKey;
                      console.log("Setting freeze authority to:", walletAddress);
                      updateTokenConfig({ freezeAuthority: walletAddress });
                    } else {
                      console.log("No wallet connected, setting empty freeze authority");
                      updateTokenConfig({ freezeAuthority: "" });
                    }
                  } else {
                    console.log("Disabling freeze authority");
                    updateTokenConfig({ freezeAuthority: null });
                  }
                }}
              />
              <Label htmlFor="hasFreezeAuthority" className="ml-2 text-sm text-gray-900 dark:text-white">
                Enable
              </Label>
            </div>
          </div>
          {tokenConfig.freezeAuthority !== null && (
            <Input
              id="freezeAuthority"
              value={tokenConfig.freezeAuthority || ""}
              onChange={(e) => updateTokenConfig({ freezeAuthority: e.target.value || "" })}
              placeholder="Solana address"
              className="w-full text-gray-900 dark:text-white"
            />
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {tokenConfig.freezeAuthority !== null
              ? "This address will be able to freeze token accounts."
              : "No authority to freeze token accounts (recommended for most tokens)."}
          </p>
          {tokenConfig.freezeAuthority !== null && (
            <div className="flex items-center mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded border border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                Freeze authority may have regulatory implications. Only enable if required for your use case.
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
            Continue to Review
          </Button>
        </div>
      </form>

      {/* AI Suggestion Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Get AI Suggestions</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              {aiSuggestionType === 'name' && "Describe your project to get token name suggestions"}
              {aiSuggestionType === 'symbol' && "Describe your token to get symbol suggestions"}
              {aiSuggestionType === 'decimals' && "Describe your token's use case for decimal recommendations"}
              {aiSuggestionType === 'supply' && "Describe your token's purpose for supply recommendations"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="aiPrompt" className="text-gray-900 dark:text-white">Tell CLIO about your token</Label>
              <textarea
                id="aiPrompt"
                value={aiPrompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAiPrompt(e.target.value)}
                placeholder={
                  aiSuggestionType === 'name' 
                    ? "e.g., My token is for a decentralized gaming platform where users can earn rewards..." 
                    : aiSuggestionType === 'symbol'
                    ? "e.g., My token is called Cosmic Credits for a space-themed metaverse..."
                    : aiSuggestionType === 'decimals'
                    ? "e.g., My token will be used for microtransactions in a gaming ecosystem..."
                    : "e.g., My token will be used as governance for a DAO with about 10,000 expected holders..."
                }
                className="w-full min-h-[100px] p-3 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
              />
            </div>
            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={getAISuggestion} 
                disabled={isLoading || !aiPrompt.trim()}
                className="bg-purple-600 hover:bg-purple-700 flex items-center text-white"
              >
                {isLoading ? (
                  <>Loading...</>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get Suggestions
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TokenConfigForm;
