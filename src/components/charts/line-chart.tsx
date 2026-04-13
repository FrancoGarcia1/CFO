'use client';

interface LineChartProps {
  data: { label: string; value: number }[];
  data2?: { label: string; value: number }[];
  height?: number;
  compact?: boolean;
}

export function LineChart({ data, data2, compact = false }: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center aspect-[3/1] text-muted-foreground text-xs font-mono">
        Sin datos
      </div>
    );
  }

  const vbH = compact ? 55 : 70;
  const allValues = [...data.map((d) => d.value), ...(data2?.map((d) => d.value) ?? [])];
  const maxV = Math.max(...allValues);
  const minV = Math.min(...allValues);
  const range = maxV - minV || 1;

  const labelH = 11;
  const chartH = vbH - labelH;
  const pad = 3;
  const usableW = 100 - pad * 2;

  function pt(i: number, v: number, total: number) {
    const x = total > 1 ? pad + (i / (total - 1)) * usableW : 50;
    const y = chartH - ((v - minV) / range) * (chartH - 6) - 3;
    return { x, y };
  }

  function polyline(series: { value: number }[]) {
    return series.map((d, i) => {
      const { x, y } = pt(i, d.value, series.length);
      return `${x},${y}`;
    }).join(' ');
  }

  // Smooth area fill
  const areaPath = (() => {
    if (data.length < 2) return '';
    const points = data.map((d, i) => pt(i, d.value, data.length));
    const first = points[0];
    const last = points[points.length - 1];
    return `M${first.x},${chartH} L${points.map(p => `${p.x},${p.y}`).join(' ')} L${last.x},${chartH} Z`;
  })();

  return (
    <svg
      viewBox={`0 0 100 ${vbH}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ aspectRatio: compact ? '5/1' : '3/1' }}
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#45ffbc" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#45ffbc" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Subtle grid lines */}
      {[0.25, 0.5, 0.75].map((pct) => (
        <line
          key={pct}
          x1={pad}
          y1={chartH - chartH * pct}
          x2={100 - pad}
          y2={chartH - chartH * pct}
          stroke="#1a1a1a"
          strokeWidth={0.3}
        />
      ))}

      {/* Area fill */}
      {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}

      {/* Primary line */}
      <polyline
        points={polyline(data)}
        fill="none"
        stroke="#45ffbc"
        strokeWidth={0.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {data.map((d, i) => {
        const { x, y } = pt(i, d.value, data.length);
        return (
          <g key={`p-${i}`}>
            <circle cx={x} cy={y} r={1.2} fill="#45ffbc" />
            {/* Hover hitbox */}
            <circle cx={x} cy={y} r={3} fill="transparent" className="cursor-pointer" />
          </g>
        );
      })}

      {/* Secondary line */}
      {data2 && data2.length > 0 && (
        <>
          <polyline
            points={polyline(data2)}
            fill="none"
            stroke="#f5a623"
            strokeWidth={0.6}
            strokeDasharray="2,1.5"
            strokeLinejoin="round"
          />
          {data2.map((d, i) => {
            const { x, y } = pt(i, d.value, data2.length);
            return <circle key={`s-${i}`} cx={x} cy={y} r={1} fill="#f5a623" />;
          })}
        </>
      )}

      {/* Labels */}
      {data.map((d, i) => {
        const { x } = pt(i, d.value, data.length);
        return (
          <text
            key={`l-${i}`}
            x={x}
            y={vbH - 1}
            textAnchor="middle"
            fill="#969593"
            fontSize={2.5}
            fontFamily="JetBrains Mono, monospace"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
