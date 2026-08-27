import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { Genre } from "@/features/catalog/types";

interface GenreFilterProps {
  genres: Genre[];
  active: string | null;
  onChange: (genre: string | null) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenreFilter({
  genres,
  active,
  onChange,
  open,
  onOpenChange,
}: GenreFilterProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open, onOpenChange]);

  const select = (genre: string | null) => {
    onChange(genre);
    onOpenChange(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
        className={cn(
          "inline-flex h-11 max-w-[160px] items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-semibold transition-colors hover:border-border-strong hover:bg-surface-2",
          active && "border-primary/50 text-primary",
        )}
      >
        <Icon name="sports_esports" size={18} className="shrink-0" />
        <span className="truncate">{active || "Gêneros"}</span>
        <Icon
          name="expand_more"
          size={16}
          className={cn("shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          className="absolute left-0 z-50 mt-2 max-h-72 w-56 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-border bg-popover p-1.5 shadow-lift sm:right-0 sm:left-auto"
        >
          <GenreOption label="Todos os gêneros" selected={active === null} onClick={() => select(null)} />
          {genres.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">Nenhum gênero cadastrado.</p>
          ) : (
            genres.map((g) => (
              <GenreOption
                key={g.id}
                label={g.name}
                selected={active === g.name}
                onClick={() => select(g.name)}
              />
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

function GenreOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-surface-2",
        selected ? "bg-primary/12 font-semibold text-primary" : "text-foreground",
      )}
    >
      <span className="truncate">{label}</span>
      {selected ? <Icon name="check" size={16} className="shrink-0" /> : null}
    </button>
  );
}
