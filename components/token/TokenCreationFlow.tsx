'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { TokenConfigForm } from './TokenConfigForm';
import { TokenReviewForm } from './TokenReviewForm';
import { TokenCreationForm } from './TokenCreationForm';
import { TokenSuccessForm } from './TokenSuccessForm';
import { TokenCreationStep } from '@/types/token';

export const TokenCreationFlow: React.FC = () => {
  const { tokenCreationStep, setTokenCreationStep } = useAppStore();

  // Debug the current step
  useEffect(() => {
    console.log("Current token creation step:", tokenCreationStep);
  }, [tokenCreationStep]);

  // Helper function to check if the current step is one of the specified steps
  const isCurrentStep = (steps: string[]): boolean => {
    return steps.includes(tokenCreationStep);
  };

  // Render the appropriate component based on the current step
  const renderStep = () => {
    const step = tokenCreationStep as string;
    switch (step) {
      case 'configure':
        return <TokenConfigForm />;
      case 'review':
        return <TokenReviewForm />;
      case 'deploy':
      case 'create': // Support both 'deploy' and 'create' for backward compatibility
        return <TokenCreationForm />;
      case 'complete':
      case 'success': // Support both 'complete' and 'success' for backward compatibility
        return <TokenSuccessForm />;
      default:
        return <TokenConfigForm />;
    }
  };

  return (
    <div className="w-full">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div 
            className={`flex flex-col items-center ${isCurrentStep(['configure']) ? 'text-purple-600' : 'text-gray-500'}`}
            onClick={() => !isCurrentStep(['configure']) && setTokenCreationStep('configure' as TokenCreationStep)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCurrentStep(['configure']) ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <span className="text-xs mt-1">Configure</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${isCurrentStep(['configure']) ? 'bg-gray-200' : 'bg-purple-600'}`}></div>
          
          <div 
            className={`flex flex-col items-center ${isCurrentStep(['review']) ? 'text-purple-600' : 'text-gray-500'}`}
            onClick={() => isCurrentStep(['configure', 'review']) && setTokenCreationStep('review' as TokenCreationStep)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCurrentStep(['review']) ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <span className="text-xs mt-1">Review</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${isCurrentStep(['configure', 'review']) ? 'bg-gray-200' : 'bg-purple-600'}`}></div>
          
          <div 
            className={`flex flex-col items-center ${isCurrentStep(['deploy', 'create']) ? 'text-purple-600' : 'text-gray-500'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCurrentStep(['deploy', 'create']) ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              3
            </div>
            <span className="text-xs mt-1">Deploy</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${isCurrentStep(['complete', 'success']) ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
          
          <div 
            className={`flex flex-col items-center ${isCurrentStep(['complete', 'success']) ? 'text-purple-600' : 'text-gray-500'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCurrentStep(['complete', 'success']) ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              4
            </div>
            <span className="text-xs mt-1">Success</span>
          </div>
        </div>
      </div>

      {/* Current step content */}
      <div className="mt-6">
        {renderStep()}
      </div>
    </div>
  );
};

export default TokenCreationFlow;
