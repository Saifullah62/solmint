'use client';

import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'destructive':
          return 'bg-red-500 text-white hover:bg-red-600';
        case 'outline':
          return 'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800';
        case 'secondary':
          return 'bg-[#00FFA3] text-[#0E0E2C] hover:bg-[#33FFB7] dark:bg-[#00CC82] dark:text-white dark:hover:bg-[#00FFA3]';
        case 'ghost':
          return 'bg-transparent hover:bg-gray-100 text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800';
        case 'link':
          return 'bg-transparent underline-offset-4 hover:underline text-[#8A2BE2] dark:text-[#A35FEA]';
        default:
          return 'bg-[#8A2BE2] text-white hover:bg-[#A35FEA] dark:bg-[#6A1CB0] dark:hover:bg-[#8A2BE2]';
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'h-8 px-3 text-xs';
        case 'lg':
          return 'h-12 px-6 text-base';
        case 'icon':
          return 'h-9 w-9';
        default:
          return 'h-10 px-4 py-2 text-sm';
      }
    };

    return (
      <button
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A2BE2] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${getVariantClasses()} ${getSizeClasses()} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
