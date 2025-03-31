'use client';

import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { TokenConfigForm } from './TokenConfigForm';
import { TokenReviewForm } from './TokenReviewForm';
import { TokenCreationForm } from './TokenCreationForm';
import { TokenSuccessForm } from './TokenSuccessForm';

export const TokenCreationPage: React.FC = () => {
  const { tokenCreationStep } = useAppStore();
  
  // Render the appropriate form based on the current step
  const renderStep = () => {
    switch (tokenCreationStep) {
      case 'configure':
        return <TokenConfigForm />;
      case 'review':
        return <TokenReviewForm />;
      case 'create':
        return <TokenCreationForm />;
      case 'success':
        return <TokenSuccessForm />;
      default:
        return <TokenConfigForm />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              tokenCreationStep === 'configure' 
                ? 'bg-purple-600 text-white' 
                : 'bg-purple-100 text-purple-600'
            }`}>
              1
            </div>
            <span className="text-xs mt-1">Configure</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${
            tokenCreationStep === 'configure' 
              ? 'bg-gray-200' 
              : 'bg-purple-200'
          }`} />
          
          <div className="flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              tokenCreationStep === 'review' 
                ? 'bg-purple-600 text-white' 
                : tokenCreationStep === 'configure'
                ? 'bg-gray-200 text-gray-500'
                : 'bg-purple-100 text-purple-600'
            }`}>
              2
            </div>
            <span className="text-xs mt-1">Review</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${
            tokenCreationStep === 'configure' || tokenCreationStep === 'review'
              ? 'bg-gray-200' 
              : 'bg-purple-200'
          }`} />
          
          <div className="flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              tokenCreationStep === 'create' 
                ? 'bg-purple-600 text-white' 
                : tokenCreationStep === 'success'
                ? 'bg-purple-100 text-purple-600'
                : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <span className="text-xs mt-1">Create</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${
            tokenCreationStep === 'success'
              ? 'bg-purple-200' 
              : 'bg-gray-200'
          }`} />
          
          <div className="flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              tokenCreationStep === 'success' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              4
            </div>
            <span className="text-xs mt-1">Success</span>
          </div>
        </div>
      </div>
      
      {/* Current Step Form */}
      {renderStep()}
    </div>
  );
};

export default TokenCreationPage;
