import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { WzModal } from "@/components/ui/wz-modal";
import { WzButton } from "@/components/ui/wz-button";
import { MetricCard } from "./MetricCard";
import { AppForm } from "./AppForm";
import { GenreManager } from "./GenreManager";
import { AdminLogin } from "./AdminLogin";
import { useStore } from "@/features/store/StoreProvider";
import { deleteApp, setFeatured } from "@/features/catalog/api";
import { announceOnDiscord } from "@/features/admin/discordWebhook";
import type { GameApp } from "@/features/catalog/types";

export function AdminDashboard() {
  const { isAdmin, apps, genres, editingApp, setEditingApp, logout } = useStore();
  const [formOpen, setFormOpen] = useState(false);

  if (!isAdmin) return <AdminLogin />;

  const featuredCount = apps.filter((a) => a.isFeatured).length;

  const openNewForm = () => {
    setEditingApp(null);
    setFormOpen(true);
  };

  const openEditForm = (app: GameApp) => {
    setEditingApp(app);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingApp(null);
  };

  const removeApp = async (app: GameApp) => {
    if (!confirm(`Excluir "${app.title}"?`)) return;
    try {
      await deleteApp(app.id);
      toast.success("Jogo excluído.");
    } catch {
      toast.error("Não foi possível excluir o jogo.");
    }
  };

  const resendApp = async (app: GameApp) => {
    const result = await announceOnDiscord(app);
    if (result.ok) {
      toast.success("Aviso reenviado para o Discord!");
    } else {
      toast.error(result.error || "Não foi possível reenviar.");
    }
  };

  return (
    <div className="space-y-8">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-extrabold">Painel administrativo</h1>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            Gerencie catálogo e gêneros do WhiteZ.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-semibold text-muted-foreground transition-colors hover:text-destructive"
        >
          <Icon name="logout" size={18} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <MetricCard icon="sports_esports" label="Jogos" value={apps.length} />
        <MetricCard icon="category" label="Gêneros" value={genres.length} />
        <MetricCard icon="local_fire_department" label="Em destaque" value={featuredCount} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-6">
          <WzButton size="md" onClick={openNewForm}>
            <Icon name="add" size={18} />
            Publicar novo jogo
          </WzButton>

          <section className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
              <Icon name="list" size={18} className="text-primary" />
              Catálogo
              <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground">
                {apps.length}
              </span>
            </h3>
            <ul className="space-y-2">
              {apps.map((app) => (
                <li
                  key={app.id}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-surface-2 p-2.5"
                >
                  <img
                    src={app.icon || "https://placehold.co/80x80/1a181c/dc143c?text=WZ"}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{app.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {app.category || "Sem gênero"}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <IconBtn
                      icon="push_pin"
                      label={app.isFeatured ? "Desafixar" : "Fixar"}
                      active={!!app.isFeatured}
                      onClick={() => void setFeatured(app.id, !app.isFeatured)}
                    />
                    <IconBtn
                      icon="campaign"
                      label="Reenviar aviso no Discord"
                      onClick={() => void resendApp(app)}
                    />
                    <IconBtn icon="edit" label="Editar" onClick={() => openEditForm(app)} />
                    <IconBtn
                      icon="delete"
                      label="Excluir"
                      danger
                      onClick={() => void removeApp(app)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          <GenreManager genres={genres} />
        </div>
      </div>

      <WzModal open={formOpen} onClose={closeForm} labelledBy="app-form-title">
        <div className="max-h-[88vh] overflow-y-auto p-5 sm:p-8">
          <h2 id="app-form-title" className="mb-5 text-xl font-extrabold">
            {editingApp ? `Editando: ${editingApp.title}` : "Publicar novo jogo"}
          </h2>
          <AppForm genres={genres} editing={editingApp} onDone={closeForm} />
        </div>
      </WzModal>
    </div>
  );
}

function IconBtn({
  icon,
  label,
  onClick,
  active,
  danger,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-surface-3 ${
        active ? "text-primary" : danger ? "text-muted-foreground hover:text-destructive" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon name={icon} size={17} filled={!!active} />
    </button>
  );
}
