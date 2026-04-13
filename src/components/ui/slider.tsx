'use client';

import { cn } from '@/utils/cn';

interface SliderProps {
  label?: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  accentColor?: string;
  className?: string;
}

export function Slider({
  label,
  min,
  max,
  value,
  onChange,
  accentColor = '#00e5a0',
  className,
}: SliderProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-dim">
            {label}
          </span>
          <span className="text-xs font-mono text-foreground">{value}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full bg-border appearance-none cursor-pointer"
        style={{ accentColor }}
      />
    </div>
  );
}
