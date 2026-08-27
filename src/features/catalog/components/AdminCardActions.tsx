import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { GameApp } from "../types";

interface AdminCardActionsProps {
  app: GameApp;
  onTogglePin: (app: GameApp) => void;
  onEdit: (app: GameApp) => void;
  onDelete: (app: GameApp) => void;
}

const btn =
  "grid h-8 w-8 place-items-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur-md transition-colors hover:bg-surface-3 hover:text-foreground";

export function AdminCardActions({
  app,
  onTogglePin,
  onEdit,
  onDelete,
}: AdminCardActionsProps) {
  return (
    <>
      <button
        type="button"
        title={app.isFeatured ? "Desafixar dos destaques" : "Fixar nos destaques"}
        aria-label={app.isFeatured ? "Desafixar dos destaques" : "Fixar nos destaques"}
        onClick={() => onTogglePin(app)}
        className={cn(btn, app.isFeatured && "text-primary")}
      >
        <Icon name="push_pin" size={16} filled={app.isFeatured} />
      </button>
      <button
        type="button"
        title="Editar"
        aria-label={`Editar ${app.title}`}
        onClick={() => onEdit(app)}
        className={btn}
      >
        <Icon name="edit" size={16} />
      </button>
      <button
        type="button"
        title="Excluir"
        aria-label={`Excluir ${app.title}`}
        onClick={() => onDelete(app)}
        className={cn(btn, "hover:text-destructive")}
      >
        <Icon name="delete" size={16} />
      </button>
    </>
  );
}
