import { useMemo } from "react";
import { FeaturedHero } from "@/features/catalog/components/FeaturedHero";
import { PromoBanners } from "@/features/catalog/components/PromoBanners";
import { GameRow } from "@/features/catalog/components/GameRow";
import { GameCard } from "@/features/catalog/components/GameCard";
import { SectionHeader } from "@/features/catalog/components/SectionHeader";
import { EmptyState } from "@/features/catalog/components/EmptyState";
import { AdminCardActions } from "@/features/catalog/components/AdminCardActions";
import { HeroSkeleton, RowSkeleton } from "@/components/ui/wz-skeleton";
import { useStore } from "@/features/store/StoreProvider";
import { setFeatured } from "@/features/catalog/api";
import {
  filterApps,
  getBestGamesSelection,
  getRecentApps,
  orderGenresForApps,
} from "@/features/catalog/utils";
import type { GameApp } from "@/features/catalog/types";
import { toast } from "sonner";
import { deleteApp } from "@/features/catalog/api";

export function DiscoverPage() {
  const {
    apps,
    genres,
    loading,
    search,
    activeGenre,
    isFavorite,
    toggleFavorite,
    openApp,
    isAdmin,
    setEditingApp,
    setSection,
  } = useStore();

  const filtered = useMemo(
    () => filterApps(apps, activeGenre, search),
    [apps, search, activeGenre],
  );


  const featured = useMemo(() => apps.filter((a) => a.isFeatured), [apps]);
  const best = useMemo(() => getBestGamesSelection(apps), [apps]);
  const recent = useMemo(() => getRecentApps(apps), [apps]);
  const genreNames = useMemo(() => orderGenresForApps(apps, genres), [apps, genres]);

  const isSearching = search.trim().length > 0 || activeGenre !== null;

  const adminActions = isAdmin
    ? (app: GameApp) => (
        <AdminCardActions
          app={app}
          onTogglePin={(a) => void setFeatured(a.id, !a.isFeatured)}
          onEdit={(a) => {
            setEditingApp(a);
            setSection("admin");
          }}
          onDelete={(a) => {
            if (!confirm(`Excluir "${a.title}"?`)) return;
            void deleteApp(a.id)
              .then(() => toast.success("Jogo excluído."))
              .catch(() => toast.error("Não foi possível excluir."));
          }}
        />
      )
    : undefined;

  if (loading) {
    return (
      <div className="space-y-10">
        <HeroSkeleton />
        <RowSkeleton />
        <RowSkeleton />
      </div>
    );
  }

  if (isSearching) {
    return (
      <section>
        <SectionHeader
          title={search.trim() ? `Resultados para “${search.trim()}”` : activeGenre || "Resultados"}
          icon="search"
          count={filtered.length}
        />
        {filtered.length === 0 ? (
          <EmptyState
            icon="search_off"
            title="Nenhum jogo encontrado"
            description="Tente outro termo de busca ou selecione um gênero diferente."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((app) => (
              <GameCard
                key={app.id}
                app={app}
                isFavorite={isFavorite(app.id)}
                onOpen={openApp}
                onToggleFavorite={toggleFavorite}
                {...(adminActions ? { adminActions: adminActions(app) } : {})}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  if (apps.length === 0) {
    return (
      <EmptyState
        icon="sports_esports"
        title="Catálogo vazio"
        description="Ainda não há jogos publicados no WhiteZ Android."
      />
    );
  }

  return (
    <div>
      {featured.length > 0 ? (
        <section className="mb-10">
          <FeaturedHero apps={featured} onOpen={openApp} />
        </section>
      ) : null}

      <PromoBanners />

      <GameRow
        title="Melhores Jogos"
        subtitle="Seleção que muda a cada 2 dias"
        icon="trophy"
        apps={best}
        isFavorite={isFavorite}
        onOpen={openApp}
        onToggleFavorite={toggleFavorite}
        {...(adminActions ? { renderAdminActions: adminActions } : {})}
      />

      <GameRow
        title="Lançamentos recentes"
        subtitle="Adicionados por último ao catálogo"
        icon="schedule"
        apps={recent}
        isFavorite={isFavorite}
        onOpen={openApp}
        onToggleFavorite={toggleFavorite}
        {...(adminActions ? { renderAdminActions: adminActions } : {})}
      />

      {genreNames.map((name) => (
        <GameRow
          key={name}
          title={name}
          icon="category"
          showCount
          apps={apps.filter((a) => a.category === name)}
          isFavorite={isFavorite}
          onOpen={openApp}
          onToggleFavorite={toggleFavorite}
          {...(adminActions ? { renderAdminActions: adminActions } : {})}
        />
      ))}
    </div>
  );
}
