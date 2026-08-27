import { memo } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { GameApp } from "../types";
import { isNewApp } from "../utils";

interface GameCardProps {
  app: GameApp;
  isFavorite: boolean;
  onOpen: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  adminActions?: React.ReactNode;
  className?: string;
}

/** Card padrão do catálogo — reutilizado em todas as trilhas e grades. */
export const GameCard = memo(function GameCard({
  app,
  isFavorite,
  onOpen,
  onToggleFavorite,
  adminActions,
  className,
}: GameCardProps) {
  return (
    <article
      className={cn(
        "group relative w-[168px] shrink-0 snap-start text-left sm:w-[196px]",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(app.id)}
        aria-label={`Ver detalhes de ${app.title}`}
        className="block w-full text-left"
      >
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-[transform,box-shadow,border-color] duration-200 group-hover:-translate-y-1 group-hover:border-border-strong group-hover:shadow-lift">
          <img
            src={app.icon || "https://placehold.co/400x400/1a181c/dc143c?text=WZ"}
            alt={`Ícone de ${app.title}`}
            loading="lazy"
            className="aspect-square w-full bg-surface-2 object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          {isNewApp(app) ? (
            <span className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary-foreground uppercase">
              Novo
            </span>
          ) : null}
        </div>

        <div className="mt-3 space-y-1.5">
          {app.category ? (
            <span className="block truncate text-[10px] font-bold tracking-[0.14em] text-primary uppercase">
              {app.category}
            </span>
          ) : null}
          <h3 className="truncate text-sm font-semibold text-foreground">{app.title}</h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {app.version ? <span className="truncate">{app.version}</span> : null}
            {app.size ? (
              <span className="inline-flex min-w-0 items-center gap-1">
                <Icon name="sd_card" size={14} className="shrink-0" />
                <span className="truncate">{app.size}</span>
              </span>
            ) : null}
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onToggleFavorite(app.id)}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Remover ${app.title} dos favoritos` : `Favoritar ${app.title}`}
        className={cn(
          "absolute top-2 right-2 grid h-9 w-9 place-items-center rounded-full border border-border bg-background/70 backdrop-blur-md transition-colors duration-150 hover:bg-background",
          isFavorite ? "text-primary" : "text-muted-foreground",
        )}
      >
        <Icon name="favorite" size={18} filled={isFavorite} />
      </button>

      {adminActions ? (
        <div className="absolute top-12 right-2 flex flex-col gap-1.5">{adminActions}</div>
      ) : null}
    </article>
  );
});
