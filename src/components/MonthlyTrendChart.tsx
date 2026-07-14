"use client";

import { useState } from "react";
import { formatCurrency, formatMonthLabel, formatShortMonthLabel } from "@/lib/format";

type Point = { month: string; income: number; expense: number };

const WIDTH = 640;
const HEIGHT = 220;
const PADDING_LEFT = 48;
const PADDING_BOTTOM = 28;
const PADDING_TOP = 16;
const BAR_WIDTH = 20;
const BAR_GAP = 3;

export function MonthlyTrendChart({ data }: { data: Point[] }) {
  const [hover, setHover] = useState<{ month: string; income: number; expense: number; x: number } | null>(
    null,
  );

  const max = Math.max(1, ...data.flatMap((d) => [d.income, d.expense]));
  const niceMax = Math.ceil(max / 500) * 500 || 500;
  const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const plotWidth = WIDTH - PADDING_LEFT - 16;
  const groupWidth = plotWidth / data.length;

  const yFor = (value: number) => PADDING_TOP + plotHeight - (value / niceMax) * plotHeight;
  const ticks = [0, niceMax / 2, niceMax];

  return (
    <div className="relative">
      <div className="mb-3 flex items-center gap-4 text-xs" style={{ color: "var(--foreground-secondary)" }}>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--good)" }} />
          Einnahmen
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--critical)" }} />
          Ausgaben
        </span>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Einnahmen und Ausgaben der letzten 6 Monate">
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PADDING_LEFT}
              x2={WIDTH - 8}
              y1={yFor(t)}
              y2={yFor(t)}
              stroke="var(--gridline)"
              strokeWidth={1}
            />
            <text x={PADDING_LEFT - 8} y={yFor(t) + 4} textAnchor="end" fontSize={10} fill="var(--foreground-muted)">
              {t >= 1000 ? `${(t / 1000).toFixed(t % 1000 === 0 ? 0 : 1)}k` : t}
            </text>
          </g>
        ))}
        <line
          x1={PADDING_LEFT}
          x2={WIDTH - 8}
          y1={PADDING_TOP + plotHeight}
          y2={PADDING_TOP + plotHeight}
          stroke="var(--baseline, var(--gridline))"
          strokeWidth={1}
        />
        {data.map((d, i) => {
          const groupX = PADDING_LEFT + i * groupWidth + groupWidth / 2;
          const incomeH = (d.income / niceMax) * plotHeight;
          const expenseH = (d.expense / niceMax) * plotHeight;
          const isHovered = hover?.month === d.month;
          return (
            <g
              key={d.month}
              onMouseEnter={() => setHover({ ...d, x: groupX })}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            >
              <rect x={groupX - BAR_GAP / 2 - BAR_WIDTH} y={0} width={BAR_WIDTH * 2 + BAR_GAP} height={HEIGHT} fill="transparent" />
              <rect
                x={groupX - BAR_GAP / 2 - BAR_WIDTH}
                y={yFor(d.income)}
                width={BAR_WIDTH}
                height={Math.max(incomeH, d.income > 0 ? 2 : 0)}
                rx={4}
                fill="var(--good)"
                opacity={isHovered || !hover ? 1 : 0.5}
              />
              <rect
                x={groupX + BAR_GAP / 2}
                y={yFor(d.expense)}
                width={BAR_WIDTH}
                height={Math.max(expenseH, d.expense > 0 ? 2 : 0)}
                rx={4}
                fill="var(--critical)"
                opacity={isHovered || !hover ? 1 : 0.5}
              />
              <text
                x={groupX}
                y={HEIGHT - 8}
                textAnchor="middle"
                fontSize={10}
                fill="var(--foreground-muted)"
              >
                {formatShortMonthLabel(d.month)}
              </text>
            </g>
          );
        })}
      </svg>
      {hover && (
        <div
          className="pointer-events-none absolute top-0 rounded-lg border px-3 py-2 text-xs shadow-sm"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            left: `min(${(hover.x / WIDTH) * 100}%, 78%)`,
            transform: "translateX(-4%)",
          }}
        >
          <div className="mb-1 font-medium">{formatMonthLabel(hover.month)}</div>
          <div style={{ color: "var(--good)" }}>Einnahmen: {formatCurrency(hover.income)}</div>
          <div style={{ color: "var(--critical)" }}>Ausgaben: {formatCurrency(hover.expense)}</div>
        </div>
      )}
    </div>
  );
}
