import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { WzModal } from "@/components/ui/wz-modal";
import { WzButton, wzButtonClass } from "@/components/ui/wz-button";
import type { GameApp } from "../types";
import { formatArchitecture, validLinks } from "../utils";

interface AppDetailsModalProps {
  app: GameApp | null;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
}

export function AppDetailsModal({
  app,
  isFavorite,
  onToggleFavorite,
  onClose,
}: AppDetailsModalProps) {
  const [linksOpen, setLinksOpen] = useState(false);

  if (!app) return null;

  const links = validLinks(app);

  const shareApp = () => {
    const fullUrl = `${window.location.origin}${window.location.pathname}#/app/${app.id}`;
    if (navigator.share) {
      navigator.share({ title: app.title, url: fullUrl }).catch(() => {});
    } else {
      void navigator.clipboard.writeText(fullUrl);
      toast.success("Link direto copiado para a área de transferência!");
    }
  };

  return (
    <WzModal open onClose={onClose} labelledBy="app-details-title">
      <div className="max-h-[88vh] overflow-y-auto">
        <div className="relative aspect-video w-full overflow-hidden bg-surface-2">
          <img
            src={
              app.banner ||
              app.icon ||
              "https://placehold.co/1280x720/1a181c/dc143c?text=WhiteZ"
            }
            alt={`Banner de ${app.title}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/25 to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              type="button"
              onClick={shareApp}
              aria-label="Compartilhar"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur-md transition-colors hover:bg-surface-3"
            >
              <Icon name="share" size={19} />
            </button>
            <button
              type="button"
              onClick={() => onToggleFavorite(app.id)}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? "Remover dos favoritos" : "Favoritar"}
              className={`grid h-10 w-10 place-items-center rounded-full border border-border bg-background/70 backdrop-blur-md transition-colors hover:bg-surface-3 ${
                isFavorite ? "text-primary" : "text-foreground"
              }`}
            >
              <Icon name="favorite" size={19} filled={isFavorite} />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-8">
          <div className="flex items-center gap-4">
            <img
              src={app.icon || "https://placehold.co/200x200/1a181c/dc143c?text=WZ"}
              alt={`Ícone de ${app.title}`}
              className="h-20 w-20 shrink-0 rounded-2xl border border-border-strong bg-surface object-cover shadow-lift sm:h-24 sm:w-24"
            />
            <div className="min-w-0 pb-1">
              <h2 id="app-details-title" className="break-words text-xl font-extrabold sm:text-2xl">
                {app.title}
              </h2>
              {app.category ? (
                <span className="mt-1 inline-block text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
                  {app.category}
                </span>
              ) : null}
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
            <Stat label="Versão" value={app.version || "—"} />
            <Stat label="Tamanho" value={app.size || "—"} />
            <Stat label="Arquitetura" value={formatArchitecture(app)} />
          </dl>

          <section>
            <h3 className="mb-2 text-sm font-bold tracking-wide text-muted-foreground uppercase">
              Descrição
            </h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground/90">
              {app.description || "Sem descrição informada."}
            </p>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold tracking-wide text-muted-foreground uppercase">
              Downloads
            </h3>

            {links.length <= 1 ? (
              <a
                href={links[0]?.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={wzButtonClass("download", "lg")}
              >
                <Icon name="download" size={20} />
                Baixar APK
              </a>
            ) : (
              <div className="space-y-2">
                <WzButton
                  variant="download"
                  size="lg"
                  aria-expanded={linksOpen}
                  onClick={() => setLinksOpen((v) => !v)}
                >
                  <Icon name="format_list_bulleted" size={20} />
                  Mostrar + Links ({links.length})
                </WzButton>
                {linksOpen ? (
                  <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                    {links.map((link, i) => (
                      <a
                        key={`${link.url}-${i}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-sm font-medium transition-colors last:border-0 hover:bg-surface-2"
                      >
                        <span className="truncate">{link.name || `Opção ${i + 1}`}</span>
                        <Icon name="download" size={18} className="shrink-0 text-primary" />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </section>
        </div>
      </div>
    </WzModal>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-4 py-3">
      <dt className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm font-bold">{value}</dd>
    </div>
  );
}
