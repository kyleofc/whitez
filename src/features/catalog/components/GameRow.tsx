import { HorizontalCarousel } from "@/components/ui/horizontal-carousel";
import { GameCard } from "./GameCard";
import { SectionHeader } from "./SectionHeader";
import type { GameApp } from "../types";
import type { ReactNode } from "react";

interface GameRowProps {
  title: string;
  subtitle?: string;
  icon?: string;
  apps: GameApp[];
  isFavorite: (id: string) => boolean;
  onOpen: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  renderAdminActions?: (app: GameApp) => ReactNode;
  showCount?: boolean;
}

/** Trilha horizontal reutilizável (Melhores Jogos, Recentes, por gênero). */
export function GameRow({
  title,
  subtitle,
  icon,
  apps,
  isFavorite,
  onOpen,
  onToggleFavorite,
  renderAdminActions,
  showCount,
}: GameRowProps) {
  if (apps.length === 0) return null;

  return (
    <section className="mb-10">
      <SectionHeader
        title={title}
        {...(subtitle ? { subtitle } : {})}
        {...(icon ? { icon } : {})}
        {...(showCount ? { count: apps.length } : {})}
      />
      <HorizontalCarousel ariaLabel={title}>
        {apps.map((app) => (
          <GameCard
            key={app.id}
            app={app}
            isFavorite={isFavorite(app.id)}
            onOpen={onOpen}
            onToggleFavorite={onToggleFavorite}
            {...(renderAdminActions ? { adminActions: renderAdminActions(app) } : {})}
          />
        ))}
      </HorizontalCarousel>
    </section>
  );
}
