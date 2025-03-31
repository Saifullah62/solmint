import * as React from 'react';

// Input component types
declare module '@/components/ui/input' {
  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
  export const Input: React.ForwardRefExoticComponent<
    InputProps & React.RefAttributes<HTMLInputElement>
  >;
}

// Button component types
declare module '@/components/ui/button' {
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }
  export const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >;
}

// Label component types
declare module '@/components/ui/label' {
  export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
  export const Label: React.ForwardRefExoticComponent<
    LabelProps & React.RefAttributes<HTMLLabelElement>
  >;
}

// Switch component types
declare module '@/components/ui/switch' {
  export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
  export const Switch: React.ForwardRefExoticComponent<
    SwitchProps & React.RefAttributes<HTMLButtonElement>
  >;
}

// Slider component types
declare module '@/components/ui/slider' {
  export interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number[];
    defaultValue?: number[];
    min?: number;
    max?: number;
    step?: number;
    onValueChange?: (value: number[]) => void;
  }
  export const Slider: React.ForwardRefExoticComponent<
    SliderProps & React.RefAttributes<HTMLDivElement>
  >;
}

// Tooltip component types
declare module '@/components/ui/tooltip' {
  export interface TooltipProps {
    children: React.ReactNode;
  }
  export const Tooltip: React.FC<TooltipProps>;
  
  export interface TooltipTriggerProps {
    asChild?: boolean;
    children: React.ReactNode;
  }
  export const TooltipTrigger: React.FC<TooltipTriggerProps>;
  
  export interface TooltipContentProps {
    children: React.ReactNode;
    className?: string;
  }
  export const TooltipContent: React.FC<TooltipContentProps>;
  
  export const TooltipProvider: React.FC<{ children: React.ReactNode }>;
}

// Dialog component types
declare module '@/components/ui/dialog' {
  export interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
  }
  export const Dialog: React.FC<DialogProps>;
  
  export interface DialogTriggerProps {
    asChild?: boolean;
    children: React.ReactNode;
  }
  export const DialogTrigger: React.FC<DialogTriggerProps>;
  
  export interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
  }
  export const DialogContent: React.FC<DialogContentProps>;
  
  export interface DialogHeaderProps {
    children: React.ReactNode;
    className?: string;
  }
  export const DialogHeader: React.FC<DialogHeaderProps>;
  
  export interface DialogTitleProps {
    children: React.ReactNode;
    className?: string;
  }
  export const DialogTitle: React.FC<DialogTitleProps>;
  
  export interface DialogDescriptionProps {
    children: React.ReactNode;
    className?: string;
  }
  export const DialogDescription: React.FC<DialogDescriptionProps>;
}

// Select component types
declare module '@/components/ui/select' {
  export interface SelectProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
  }
  export const Select: React.FC<SelectProps>;
  
  export interface SelectTriggerProps {
    id?: string;
    className?: string;
    children: React.ReactNode;
  }
  export const SelectTrigger: React.FC<SelectTriggerProps>;
  
  export interface SelectValueProps {
    placeholder?: string;
    children?: React.ReactNode;
  }
  export const SelectValue: React.FC<SelectValueProps>;
  
  export interface SelectContentProps {
    className?: string;
    children: React.ReactNode;
  }
  export const SelectContent: React.FC<SelectContentProps>;
  
  export interface SelectItemProps {
    value: string;
    className?: string;
    children: React.ReactNode;
  }
  export const SelectItem: React.FC<SelectItemProps>;
}
