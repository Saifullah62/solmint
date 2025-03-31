'use client';

import * as React from 'react';

export interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value, min = 0, max = 100, step = 1, onValueChange, ...props }, ref) => {
    const trackRef = React.useRef<HTMLDivElement>(null);
    const thumbRef = React.useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const percentage = React.useMemo(() => {
      return ((value[0] - min) / (max - min)) * 100;
    }, [value, min, max]);

    const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (!trackRef.current) return;
      
      const rect = trackRef.current.getBoundingClientRect();
      const position = ((event.clientX - rect.left) / rect.width) * (max - min) + min;
      const newValue = Math.round(position / step) * step;
      const clampedValue = Math.max(min, Math.min(max, newValue));
      
      if (onValueChange) {
        onValueChange([clampedValue]);
      }
    };

    const handleDragStart = () => {
      setIsDragging(true);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    React.useEffect(() => {
      const handleMouseMove = (event: MouseEvent) => {
        if (!isDragging || !trackRef.current) return;
        
        const rect = trackRef.current.getBoundingClientRect();
        const position = ((event.clientX - rect.left) / rect.width) * (max - min) + min;
        const newValue = Math.round(position / step) * step;
        const clampedValue = Math.max(min, Math.min(max, newValue));
        
        if (onValueChange) {
          onValueChange([clampedValue]);
        }
      };

      if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleDragEnd);
      }

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }, [isDragging, min, max, step, onValueChange]);

    return (
      <div
        ref={ref}
        className={`relative h-5 w-full touch-none ${className}`}
        {...props}
      >
        <div
          ref={trackRef}
          className="relative h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700"
          onClick={handleTrackClick}
        >
          <div
            className="absolute h-full rounded-full bg-purple-500 dark:bg-purple-600"
            style={{ width: `${percentage}%` }}
          />
          <div
            ref={thumbRef}
            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-purple-500 ring-2 ring-white dark:bg-purple-600 dark:ring-gray-900"
            style={{ left: `${percentage}%` }}
            onMouseDown={handleDragStart}
          />
        </div>
      </div>
    );
  }
);
Slider.displayName = 'Slider';

export { Slider };
