'use client';

interface BarChartProps {
  data: { label: string; value: number; value2?: number }[];
  height?: number;
  color?: string;
  color2?: string | null;
  compact?: boolean;
}

export function BarChart({
  data,
  height: _height,
  color = '#c8a15a',
  color2 = null,
  compact = false,
}: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center aspect-[3/1] text-muted-foreground text-xs font-mono">
        Sin datos
      </div>
    );
  }

  const maxValue = Math.max(...data.flatMap((d) => [d.value, d.value2 ?? 0]), 1);
  const vbH = compact ? 60 : 80;
  const labelH = 12;
  const chartH = vbH - labelH;

  return (
    <svg
      viewBox={`0 0 100 ${vbH}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ aspectRatio: compact ? '5/1' : '3/1' }}
    >
      {/* Subtle grid lines */}
      {[0.25, 0.5, 0.75].map((pct) => (
        <line
          key={pct}
          x1={2}
          y1={chartH - chartH * pct}
          x2={98}
          y2={chartH - chartH * pct}
          stroke="rgba(200,161,90,.1)"
          strokeWidth={0.3}
        />
      ))}

      {data.map((d, i) => {
        const barW = 100 / data.length;
        const x = i * barW;
        const barH1 = (d.value / maxValue) * chartH;
        const barH2 = d.value2 != null ? (d.value2 / maxValue) * chartH : 0;
        const innerW = color2 ? barW * 0.35 : barW * 0.55;
        const gap = barW * 0.05;

        return (
          <g key={i}>
            {/* Main bar */}
            <rect
              x={x + (color2 ? gap : (barW - innerW) / 2)}
              y={chartH - barH1}
              width={innerW}
              height={Math.max(barH1, 0.3)}
              fill={color}
              rx={1.5}
              className="transition-all duration-200"
              opacity={0.85}
            />
            {/* Secondary bar */}
            {color2 && d.value2 != null && barH2 > 0 && (
              <rect
                x={x + barW * 0.5 + gap}
                y={chartH - barH2}
                width={innerW}
                height={barH2}
                fill={color2}
                rx={1.5}
                opacity={0.85}
              />
            )}
            {/* Value on top of bar */}
            {barH1 > 8 && !compact && (
              <text
                x={x + (color2 ? gap + innerW / 2 : barW / 2)}
                y={chartH - barH1 - 2}
                textAnchor="middle"
                fill={color}
                fontSize={2.2}
                fontFamily="JetBrains Mono, monospace"
                opacity={0.6}
              >
                {d.value >= 1000 ? `${(d.value / 1000).toFixed(0)}k` : d.value}
              </text>
            )}
            {/* Label */}
            <text
              x={x + barW / 2}
              y={vbH - 1}
              textAnchor="middle"
              fill="rgba(245,240,232,.5)"
              fontSize={2.8}
              fontFamily="JetBrains Mono, monospace"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
