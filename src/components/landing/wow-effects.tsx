'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Text Scramble Effect (inspired by codepen.io/soulwire/pen/mEMPrK)
 * Characters decode from random symbols to the final text.
 */
export function TextScramble({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState('');
  const chars = '!@#$%^&*()_+{}|:<>?/\\=-.';

  useEffect(() => {
    const timeout = setTimeout(() => {
      let iteration = 0;
      const interval = setInterval(() => {
        setDisplayed(
          text
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' ';
              if (i < iteration) return text[i];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );
        iteration += 1 / 2;
        if (iteration >= text.length) {
          clearInterval(interval);
          setDisplayed(text);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, chars]);

  return <span ref={ref} className={className}>{displayed || text}</span>;
}

/**
 * Animated Counter (inspired by codepen.io/Amaik/pen/ExaaLgE)
 * Counts from 0 to target value smoothly.
 */
export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2000,
  className,
  delay = 0,
  style,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setTimeout(() => {
            const start = performance.now();
            const animate = (now: number) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              setCount(Math.round(eased * value));
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }, delay);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration, delay]);

  return (
    <div ref={ref} className={className} style={style}>
      {prefix}{count}{suffix}
    </div>
  );
}

/**
 * Magnetic Button (inspired by codepen.io/tdesero/pen/RmoxQg)
 * Button that follows cursor within its bounds.
 */
export function MagneticButton({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el!.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    }

    function handleLeave() {
      el!.style.transform = 'translate(0, 0)';
    }

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <a ref={ref} href={href} className={className} style={{ transition: 'transform 0.2s ease-out', display: 'inline-flex' }}>
      {children}
    </a>
  );
}

/**
 * SVG Morphing Blob (inspired by codepen.io/xaddict/pen/epddwr)
 * Organic shape that slowly morphs behind content.
 */
export function MorphingBlob({ color = '#ff6b35', size = 400, className }: { color?: string; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} style={{ opacity: 0.15 }}>
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
        </filter>
      </defs>
      <g filter="url(#goo)">
        <circle cx="80" cy="80" r="40" fill={color}>
          <animate attributeName="cx" values="80;120;80" dur="8s" repeatCount="indefinite" />
          <animate attributeName="cy" values="80;110;80" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx="120" cy="120" r="35" fill={color}>
          <animate attributeName="cx" values="120;80;120" dur="7s" repeatCount="indefinite" />
          <animate attributeName="cy" values="120;85;120" dur="9s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="100" r="45" fill={color}>
          <animate attributeName="r" values="45;38;45" dur="5s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

/**
 * Spotlight cursor follow (inspired by codepen.io/Marichka94/pen/zewmpQ)
 * Subtle radial gradient that follows the cursor.
 */
export function SpotlightHero({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el!.style.setProperty('--spot-x', `${x}%`);
      el!.style.setProperty('--spot-y', `${y}%`);
    }

    el.addEventListener('mousemove', handleMove);
    return () => el.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: 'relative',
        background: `radial-gradient(600px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(212, 165, 116, 0.05), transparent 60%)`,
      }}
    >
      {children}
    </div>
  );
}
