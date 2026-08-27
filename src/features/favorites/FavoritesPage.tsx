import { useMemo } from "react";
import { GameCard } from "@/features/catalog/components/GameCard";
import { SectionHeader } from "@/features/catalog/components/SectionHeader";
import { EmptyState } from "@/features/catalog/components/EmptyState";
import { WzButton } from "@/components/ui/wz-button";
import { Icon } from "@/components/ui/icon";
import { useStore } from "@/features/store/StoreProvider";

export function FavoritesPage() {
  const { apps, favorites, isFavorite, toggleFavorite, openApp, setSection } = useStore();

  const favoriteApps = useMemo(
    () => apps.filter((app) => favorites.includes(app.id)),
    [apps, favorites],
  );

  return (
    <section>
      <SectionHeader
        title="Meus favoritos"
        subtitle="Jogos que você salvou neste dispositivo"
        icon="favorite"
        count={favoriteApps.length}
        action={
          <button
            type="button"
            onClick={() => setSection("home")}
            aria-label="Voltar para o início"
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:border-border-strong hover:bg-surface-2"
          >
            <Icon name="arrow_back" size={18} />
            Voltar
          </button>
        }
      />

      {favoriteApps.length === 0 ? (
        <EmptyState
          icon="favorite_border"
          title="Nenhum favorito ainda"
          description="Toque no coração de qualquer jogo para salvá-lo aqui."
          action={
            <WzButton className="mt-2" onClick={() => setSection("home")}>
              Explorar catálogo
            </WzButton>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {favoriteApps.map((app) => (
            <GameCard
              key={app.id}
              app={app}
              isFavorite={isFavorite(app.id)}
              onOpen={openApp}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
}
