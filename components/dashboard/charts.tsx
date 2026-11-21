"use client";

import { useId, useMemo, useState } from "react";

export interface Point {
  key: string;
  label: string;
  value: number;
}

const W = 560;
const H = 250;
const PAD = { top: 16, right: 12, bottom: 28, left: 44 };

// Round, human steps (1, 2, 5 × 10^n) with at most ~5 gridlines
function niceStep(max: number, integer = false) {
  if (max <= 0) return 1;
  const raw = max / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const n = raw / pow;
  const step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
  return integer ? Math.max(1, Math.round(step)) : step;
}

function ticksFor(max: number, integer = false) {
  const step = niceStep(max, integer);
  const out = [0];
  while (out[out.length - 1] < max) out.push(out[out.length - 1] + step);
  if (out.length === 1) out.push(step);
  return out;
}

function every(n: number) {
  return n > 60 ? 15 : n > 20 ? 5 : n > 10 ? 2 : 1;
}

// Single-series area chart with a crosshair tooltip (earnings over time)
export function AreaChart({ data, format, valueLabel }: { data: Point[]; format: (v: number) => string; valueLabel: string }) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 0);
  const ticks = ticksFor(max);
  const top = ticks[ticks.length - 1];
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (data.length <= 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v: number) => PAD.top + ih - (v / top) * ih;

  const { line, area } = useMemo(() => {
    const pts = data.map((d, i) => [x(i), y(d.value)] as const);
    const l = pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
    const a = `${l} L${x(data.length - 1)},${PAD.top + ih} L${x(0)},${PAD.top + ih} Z`;
    return { line: l, area: a };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, top]);

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((px - PAD.left) / iw) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  }

  const h = hover !== null ? data[hover] : null;
  const step = every(data.length);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full touch-none" role="img" aria-label={`${valueLabel} over time`} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        <defs>
          <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8735c" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#c8735c" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#e4e0d4" strokeDasharray={t === 0 ? "" : "3 4"} />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="fill-muted text-[11px]">
              {format(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) =>
          i % step === 0 || i === data.length - 1 ? (
            <text key={d.key} x={x(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"} className="fill-muted text-[11px]">
              {d.label}
            </text>
          ) : null,
        )}
        <path d={area} fill={`url(#fill-${id})`} />
        <path d={line} fill="none" stroke="#c8735c" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {h && hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + ih} stroke="#13231e" strokeOpacity="0.25" />
            <circle cx={x(hover)} cy={y(h.value)} r="5" fill="#c8735c" stroke="#fff" strokeWidth="2" />
          </g>
        )}
      </svg>
      {h && hover !== null && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-xs whitespace-nowrap text-cream shadow-lift"
          style={{ left: `${(x(hover) / W) * 100}%` }}
        >
          <p className="text-cream/60">{h.label}</p>
          <p className="font-semibold">
            {valueLabel}: {format(h.value)}
          </p>
        </div>
      )}
    </div>
  );
}

// Single-series column chart with a per-bar tooltip (bookings over time)
export function ColumnChart({ data, valueLabel }: { data: Point[]; valueLabel: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 0);
  const ticks = ticksFor(max, true);
  const top = ticks[ticks.length - 1];
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  const slot = iw / Math.max(1, data.length);
  const bw = Math.max(2, Math.min(28, slot - 2));
  const y = (v: number) => PAD.top + ih - (v / top) * ih;
  const step = every(data.length);
  const h = hover !== null ? data[hover] : null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${valueLabel} over time`} onPointerLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#e4e0d4" strokeDasharray={t === 0 ? "" : "3 4"} />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="fill-muted text-[11px]">
              {Math.round(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = PAD.left + slot * i + slot / 2;
          const bh = Math.max(d.value > 0 ? 3 : 0, (d.value / top) * ih);
          return (
            <g key={d.key}>
              {/* full-height hit area, bigger than the bar */}
              <rect x={PAD.left + slot * i} y={PAD.top} width={slot} height={ih} fill="transparent" onPointerEnter={() => setHover(i)} />
              <path
                d={`M${cx - bw / 2},${PAD.top + ih} V${PAD.top + ih - bh + Math.min(4, bh)} Q${cx - bw / 2},${PAD.top + ih - bh} ${cx - bw / 2 + Math.min(4, bw / 2)},${PAD.top + ih - bh} H${cx + bw / 2 - Math.min(4, bw / 2)} Q${cx + bw / 2},${PAD.top + ih - bh} ${cx + bw / 2},${PAD.top + ih - bh + Math.min(4, bh)} V${PAD.top + ih} Z`}
                fill="#c8735c"
                opacity={hover === null || hover === i ? 1 : 0.45}
                className="pointer-events-none transition-opacity"
              />
              {(i % step === 0 || i === data.length - 1) && (
                <text x={cx} y={H - 8} textAnchor="middle" className="pointer-events-none fill-muted text-[11px]">
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {h && hover !== null && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-xs whitespace-nowrap text-cream shadow-lift"
          style={{ left: `${((PAD.left + slot * hover + slot / 2) / W) * 100}%` }}
        >
          <p className="text-cream/60">{h.label}</p>
          <p className="font-semibold">
            {valueLabel}: {h.value}
          </p>
        </div>
      )}
    </div>
  );
}
