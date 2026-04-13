import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

type CardElevation = 'flat' | 'raised' | 'floating';

interface CardProps {
  className?: string;
  children: ReactNode;
  elevation?: CardElevation;
  interactive?: boolean;
}

const elevationMap: Record<CardElevation, string> = {
  flat: 'card-flat',
  raised: 'card-raised',
  floating: 'card-floating',
};

export function Card({
  className,
  children,
  elevation = 'flat',
  interactive = false,
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg p-5',
        elevationMap[elevation],
        interactive && 'card-interactive cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  );
}
