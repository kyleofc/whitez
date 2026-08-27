import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  count?: number;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, icon, count, action }: SectionHeaderProps) {
  return (
    <header className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          {icon ? <Icon name={icon} size={20} className="shrink-0 text-primary" filled /> : null}
          <h2 className="truncate text-lg font-bold sm:text-xl">{title}</h2>
          {typeof count === "number" ? (
            <span className="shrink-0 rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
              {count}
            </span>
          ) : null}
        </div>
        {subtitle ? (
          <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
