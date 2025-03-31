'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className = ''
}) => {
  // Size mapping
  const sizeMap = {
    sm: variant === 'full' ? 'h-6' : 'h-8',
    md: variant === 'full' ? 'h-8' : 'h-10',
    lg: variant === 'full' ? 'h-10' : 'h-12',
    xl: variant === 'full' ? 'h-12' : 'h-16',
  };
  
  // Icon-only version
  if (variant === 'icon') {
    return (
      <div className={`${className} relative ${sizeMap[size]} aspect-square`}>
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto"
        >
          <path 
            d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4Z" 
            fill="#0E0E2C" 
          />
          <path 
            d="M33.5 18C31.567 18 30 19.567 30 21.5C30 23.433 31.567 25 33.5 25C35.433 25 37 23.433 37 21.5C37 19.567 35.433 18 33.5 18Z" 
            fill="#00FFA3" 
          />
          <path 
            d="M14.5 23C12.567 23 11 24.567 11 26.5C11 28.433 12.567 30 14.5 30C16.433 30 18 28.433 18 26.5C18 24.567 16.433 23 14.5 23Z" 
            fill="#00FFA3" 
          />
          <path 
            d="M24 10C21.791 10 20 11.791 20 14C20 16.209 21.791 18 24 18C26.209 18 28 16.209 28 14C28 11.791 26.209 10 24 10Z" 
            fill="#8A2BE2" 
          />
          <path 
            d="M24 30C21.791 30 20 31.791 20 34C20 36.209 21.791 38 24 38C26.209 38 28 36.209 28 34C28 31.791 26.209 30 24 30Z" 
            fill="#8A2BE2" 
          />
          <path 
            d="M33.5 18L24 10M24 10L14.5 23M14.5 23L24 30M24 30L33.5 25M33.5 25L24 38M24 38L14.5 30" 
            stroke="#8A2BE2" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
          <path 
            d="M33.5 18L24 10M24 10L14.5 23M14.5 23L24 30M24 30L33.5 25M33.5 25L24 38M24 38L14.5 30" 
            stroke="#00FFA3" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeDasharray="1 3" 
          />
        </svg>
      </div>
    );
  }
  
  // Full logo with text
  return (
    <div className={`${className} flex items-center`}>
      <div className={`relative ${sizeMap[size]} aspect-square mr-3`}>
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto"
        >
          <path 
            d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4Z" 
            fill="#0E0E2C" 
          />
          <path 
            d="M33.5 18C31.567 18 30 19.567 30 21.5C30 23.433 31.567 25 33.5 25C35.433 25 37 23.433 37 21.5C37 19.567 35.433 18 33.5 18Z" 
            fill="#00FFA3" 
          />
          <path 
            d="M14.5 23C12.567 23 11 24.567 11 26.5C11 28.433 12.567 30 14.5 30C16.433 30 18 28.433 18 26.5C18 24.567 16.433 23 14.5 23Z" 
            fill="#00FFA3" 
          />
          <path 
            d="M24 10C21.791 10 20 11.791 20 14C20 16.209 21.791 18 24 18C26.209 18 28 16.209 28 14C28 11.791 26.209 10 24 10Z" 
            fill="#8A2BE2" 
          />
          <path 
            d="M24 30C21.791 30 20 31.791 20 34C20 36.209 21.791 38 24 38C26.209 38 28 36.209 28 34C28 31.791 26.209 30 24 30Z" 
            fill="#8A2BE2" 
          />
          <path 
            d="M33.5 18L24 10M24 10L14.5 23M14.5 23L24 30M24 30L33.5 25M33.5 25L24 38M24 38L14.5 30" 
            stroke="#8A2BE2" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
          <path 
            d="M33.5 18L24 10M24 10L14.5 23M14.5 23L24 30M24 30L33.5 25M33.5 25L24 38M24 38L14.5 30" 
            stroke="#00FFA3" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeDasharray="1 3" 
          />
        </svg>
      </div>
      <div>
        <h1 className="font-heading font-bold text-2xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#8A2BE2] to-[#00FFA3]">
          SOLMINT
        </h1>
        <p className="text-xs text-gray-400 font-medium leading-tight">
          Create. Launch. Thrive.
        </p>
      </div>
    </div>
  );
};

export default Logo;
