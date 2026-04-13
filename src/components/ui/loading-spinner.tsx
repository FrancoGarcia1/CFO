import { cn } from '@/utils/cn';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex justify-center', className)}>
      <div className={cn(sizeStyles[size], 'border-2 border-border border-t-primary rounded-full animate-spin')} />
    </div>
  );
}
