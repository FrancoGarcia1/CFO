import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  className?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground',
          'focus:border-primary focus:outline-none',
          'transition-colors duration-200',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = 'Select';
