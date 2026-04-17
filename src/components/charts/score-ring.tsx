'use client';

interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md';
}

function getScoreColor(score: number): string {
  if (score >= 70) return '#a8c47a';  // verde oliva suave
  if (score >= 45) return '#d9925a';  // terracota
  return '#ef4444';                    // crítico
}

function getScoreLabel(score: number): string {
  if (score >= 70) return 'SALUDABLE';
  if (score >= 45) return 'EN RIESGO';
  return 'CR\u00CDTICO';
}

export function ScoreRing({ score, size = 'md' }: ScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const color = getScoreColor(clamped);
  const label = getScoreLabel(clamped);

  const isSm = size === 'sm';
  const svgSize = isSm ? 80 : 100;
  const r = isSm ? 30 : 36;
  const center = svgSize / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (clamped / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="rgba(200,161,90,.15)"
          strokeWidth={isSm ? 4 : 5}
        />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={isSm ? 4 : 5}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease',
          }}
        />
        <text
          x={center}
          y={center - (isSm ? 2 : 4)}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={isSm ? 16 : 20}
          fontWeight={700}
          fontFamily="JetBrains Mono, monospace"
        >
          {clamped}
        </text>
        <text
          x={center}
          y={center + (isSm ? 12 : 14)}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={isSm ? 5 : 6}
          fontWeight={600}
          letterSpacing={2}
        >
          {label}
        </text>
      </svg>
      <span className="text-[8px] font-semibold uppercase tracking-[2px] text-muted-foreground font-mono">
        HEALTH SCORE
      </span>
    </div>
  );
}
