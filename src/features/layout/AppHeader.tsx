import { Icon } from "@/components/ui/icon";
import { GenreFilter } from "@/features/catalog/components/GenreFilter";
import { useStore } from "@/features/store/StoreProvider";
import { useState } from "react";

interface AppHeaderProps {
  onOpenSidebar: () => void;
}

export function AppHeader({ onOpenSidebar }: AppHeaderProps) {
  const { genres, activeGenre, setActiveGenre, search, setSearch, setSection } = useStore();
  const [genreOpen, setGenreOpen] = useState(false);

  return (
    <header className="glass-bar sticky top-0 z-50">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Abrir menu"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <Icon name="menu" size={22} />
          </button>

          <button
            type="button"
            onClick={() => setSection("home")}
            className="flex min-w-0 items-center gap-2.5"
            aria-label="Ir para o início"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-primary to-primary-soft text-sm font-black text-primary-foreground shadow-glow">
              W
            </span>
            <span className="hidden min-w-0 flex-col text-left sm:flex">
              <span className="truncate font-display text-sm leading-tight font-extrabold">
                WhiteZ
              </span>
              <span className="truncate text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                Android
              </span>
            </span>
          </button>
        </div>

        <div className="relative min-w-0">
          <Icon
            name="search"
            size={19}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar jogos…"
            aria-label="Buscar jogos"
            className="h-11 w-full rounded-full border border-border bg-surface pr-4 pl-11 text-sm transition-colors placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setSection("favorites")}
            aria-label="Meus favoritos"
            className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-primary sm:hidden"
          >
            <Icon name="favorite" size={20} />
          </button>
          <div className="hidden sm:block">
            <GenreFilter
              genres={genres}
              active={activeGenre}
              onChange={setActiveGenre}
              open={genreOpen}
              onOpenChange={setGenreOpen}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1400px] items-center gap-2 px-4 pb-3 sm:hidden">
        <GenreFilter
          genres={genres}
          active={activeGenre}
          onChange={setActiveGenre}
          open={genreOpen}
          onOpenChange={setGenreOpen}
        />
      </div>
    </header>
  );
}
