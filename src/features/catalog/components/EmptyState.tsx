import { Icon } from "@/components/ui/icon";
import type { ReactNode } from "react";

export function EmptyState({
  icon = "sentiment_dissatisfied",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-surface-2 text-primary">
        <Icon name={icon} size={26} />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
