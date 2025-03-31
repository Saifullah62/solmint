'use client';

import * as React from 'react';

// TooltipProvider component
interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
}

const TooltipProvider: React.FC<TooltipProviderProps> = ({ 
  children,
  delayDuration = 700,
  skipDelayDuration = 300,
  disableHoverableContent = false
}) => {
  return <>{children}</>;
};

// Tooltip component
interface TooltipProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  children,
  open,
  defaultOpen,
  onOpenChange
}) => {
  return <>{children}</>;
};

// TooltipTrigger component
interface TooltipTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, asChild = false, ...props }, ref) => {
    if (asChild) {
      return React.cloneElement(children as React.ReactElement, {
        ref,
        ...props,
        onMouseEnter: (e: React.MouseEvent) => {
          const originalOnMouseEnter = (children as React.ReactElement).props.onMouseEnter;
          if (originalOnMouseEnter) originalOnMouseEnter(e);
          if (props.onMouseEnter) props.onMouseEnter(e);
        },
        onMouseLeave: (e: React.MouseEvent) => {
          const originalOnMouseLeave = (children as React.ReactElement).props.onMouseLeave;
          if (originalOnMouseLeave) originalOnMouseLeave(e);
          if (props.onMouseLeave) props.onMouseLeave(e);
        },
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        {...props}
      >
        {children}
      </button>
    );
  }
);
TooltipTrigger.displayName = 'TooltipTrigger';

// TooltipContent component
interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  arrowPadding?: number;
  collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
  sticky?: 'partial' | 'always';
  hideWhenDetached?: boolean;
  avoidCollisions?: boolean;
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const triggerRef = React.useRef<HTMLElement | null>(null);

    React.useEffect(() => {
      const handleMouseEnter = () => {
        setIsVisible(true);
      };

      const handleMouseLeave = () => {
        setIsVisible(false);
      };

      const trigger = triggerRef.current;
      if (trigger) {
        trigger.addEventListener('mouseenter', handleMouseEnter);
        trigger.addEventListener('mouseleave', handleMouseLeave);
      }

      return () => {
        if (trigger) {
          trigger.removeEventListener('mouseenter', handleMouseEnter);
          trigger.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }, []);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        role="tooltip"
        className={`z-50 overflow-hidden rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-950 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
