import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { useStore } from "@/features/store/StoreProvider";
import type { SectionId } from "@/features/store/StoreProvider";

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV: { id: SectionId; label: string; icon: string }[] = [
  { id: "home", label: "Início", icon: "home" },
  { id: "favorites", label: "Favoritos", icon: "favorite" },
];

const DISCORD_URL = "https://discord.gg/sZBr22sdzy";

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const { section, setSection, isAdmin, adminUnlocked, logout } = useStore();

  const go = (id: SectionId) => {
    setSection(id);
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          "fixed inset-0 z-60 bg-background/70 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed top-0 left-0 z-70 flex h-full w-[280px] max-w-[85vw] flex-col border-r border-border bg-surface transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-primary to-primary-soft text-sm font-black text-primary-foreground">
              W
            </span>
            <span className="truncate font-display font-extrabold">WhiteZ</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((item) => (
            <SidebarLink
              key={item.id}
              {...item}
              active={section === item.id}
              onClick={() => go(item.id)}
            />
          ))}

          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-3 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/15"
          >
            <Icon name="forum" size={20} />
            Discord
          </a>

          {adminUnlocked || isAdmin ? (
            <SidebarLink
              id="admin"
              label="Painel Admin"
              icon="shield_person"
              active={section === "admin"}
              onClick={() => go("admin")}
            />
          ) : null}
        </nav>

        <div className="border-t border-border p-3">
          {isAdmin ? (
            <button
              type="button"
              onClick={() => {
                void logout();
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-2 hover:text-destructive"
            >
              <Icon name="logout" size={20} />
              Sair da conta
            </button>
          ) : (
            <p className="px-3 py-2 text-[11px] text-muted-foreground">
              WhiteZ Android • Hub de jogos
            </p>
          )}
        </div>
      </aside>
    </>
  );
}

function SidebarLink({
  label,
  icon,
  active,
  onClick,
}: {
  id: string;
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
        active
          ? "bg-primary/12 text-primary"
          : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
      )}
    >
      <Icon name={icon} size={20} filled={active} />
      <span className="truncate">{label}</span>
    </button>
  );
}
