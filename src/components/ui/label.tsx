import { cn } from '@/utils/cn';
import type { LabelHTMLAttributes } from 'react';

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  className?: string;
};

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'block mb-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-dim',
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}
