import { formatCurrency } from "@/lib/format";
import { ColorDot } from "@/components/ui";

type Entry = { name: string; color: string; value: number };

export function CategoryBreakdown({ entries }: { entries: Entry[] }) {
  const max = Math.max(1, ...entries.map((e) => e.value));

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => (
        <div key={entry.name} className="flex items-center gap-3">
          <div className="flex w-32 shrink-0 items-center gap-1.5 text-sm">
            <ColorDot color={entry.color} />
            <span className="truncate">{entry.name}</span>
          </div>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full" style={{ background: "var(--gridline)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${(entry.value / max) * 100}%`, background: entry.color }}
            />
          </div>
          <div className="w-24 shrink-0 text-right text-sm tabular-nums" style={{ color: "var(--foreground-secondary)" }}>
            {formatCurrency(entry.value)}
          </div>
        </div>
      ))}
    </div>
  );
}
