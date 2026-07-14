import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${className}`}
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm" style={{ color: "var(--foreground-secondary)" }}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatTile({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "good" | "critical";
}) {
  const color =
    tone === "good" ? "var(--good)" : tone === "critical" ? "var(--critical)" : "var(--foreground)";
  return (
    <Card>
      <div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold" style={{ color }}>
        {value}
      </div>
    </Card>
  );
}

export function ColorDot({ color, size = 10 }: { color: string; size?: number }) {
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{ background: color, width: size, height: size }}
    />
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-xl border border-dashed p-8 text-center text-sm"
      style={{ color: "var(--foreground-muted)", borderColor: "var(--border)" }}
    >
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  type = "submit",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      style={{ background: "var(--accent)" }}
      {...rest}
    >
      {children}
    </button>
  );
}

export function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
      style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
    >
      {children}
    </a>
  );
}
