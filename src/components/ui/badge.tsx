import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-border text-muted-foreground',
  success: 'bg-primary/10 text-primary',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
};

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
