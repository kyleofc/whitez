import { Icon } from "@/components/ui/icon";

export function MetricCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: string;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-border-strong">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon name={icon} size={18} className="shrink-0 text-primary" />
        <span className="truncate text-[11px] font-semibold tracking-[0.12em] uppercase">
          {label}
        </span>
      </div>
      <p className="mt-2 text-2xl font-extrabold">{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
