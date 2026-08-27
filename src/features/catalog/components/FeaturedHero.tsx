import { Icon } from "@/components/ui/icon";
import { WzButton } from "@/components/ui/wz-button";
import type { GameApp } from "../types";

interface FeaturedHeroProps {
  apps: GameApp[];
  onOpen: (id: string) => void;
}

/** Banner grande de destaques em carrossel horizontal com snap. */
export function FeaturedHero({ apps, onOpen }: FeaturedHeroProps) {
  if (apps.length === 0) return null;

  return (
    <div className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
      {apps.map((app) => (
        <article
          key={app.id}
          className="relative aspect-[16/10] w-full shrink-0 snap-center overflow-hidden rounded-3xl border border-border bg-surface shadow-lift sm:aspect-[21/8]"
        >
          <img
            src={
              app.banner ||
              app.icon ||
              "https://placehold.co/1600x700/1a181c/dc143c?text=WhiteZ"
            }
            alt={`Banner de ${app.title}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-background/95 via-transparent to-transparent" />

          <div className="relative flex h-full flex-col justify-end gap-3 p-5 sm:max-w-lg sm:justify-center sm:p-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-primary uppercase">
                <Icon name="local_fire_department" size={13} filled />
                Destaque
              </span>
              {app.category ? (
                <span className="rounded-full border border-border bg-surface/70 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase backdrop-blur-sm">
                  {app.category}
                </span>
              ) : null}
            </div>

            <h2 className="text-2xl leading-tight font-extrabold text-balance sm:text-4xl">
              {app.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:text-sm">
              {app.version ? <span>{app.version}</span> : null}
              {app.size ? (
                <span className="inline-flex items-center gap-1">
                  <Icon name="sd_card" size={15} />
                  {app.size}
                </span>
              ) : null}
            </div>

            <div className="mt-1">
              <WzButton size="md" onClick={() => onOpen(app.id)}>
                <Icon name="play_arrow" size={18} filled />
                Ver detalhes
              </WzButton>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
