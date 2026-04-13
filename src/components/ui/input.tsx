import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full bg-surface border-0 border-b border-border rounded-none px-0 py-2.5 text-sm text-foreground',
          'placeholder:text-darker',
          'focus:border-primary focus:outline-none focus:shadow-none',
          'transition-all duration-200',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
