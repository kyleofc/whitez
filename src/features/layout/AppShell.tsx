import { useMemo, useState } from "react";
import { AppHeader } from "@/features/layout/AppHeader";
import { AppSidebar } from "@/features/layout/AppSidebar";
import { DiscoverPage } from "@/features/catalog/pages/DiscoverPage";
import { FavoritesPage } from "@/features/favorites/FavoritesPage";
import { AdminDashboard } from "@/features/admin/components/AdminDashboard";
import { AppDetailsModal } from "@/features/catalog/components/AppDetailsModal";
import { useStore } from "@/features/store/StoreProvider";

export function AppShell() {
  const { section, apps, selectedAppId, closeApp, isFavorite, toggleFavorite } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedApp = useMemo(
    () => apps.find((app) => app.id === selectedAppId) ?? null,
    [apps, selectedAppId],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader onOpenSidebar={() => setSidebarOpen(true)} />
      <AppSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
        {section === "home" ? <DiscoverPage /> : null}
        {section === "favorites" ? <FavoritesPage /> : null}
        {section === "admin" ? <AdminDashboard /> : null}
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        WhiteZ Android — hub de jogos para Android.
      </footer>

      <AppDetailsModal
        app={selectedApp}
        isFavorite={selectedApp ? isFavorite(selectedApp.id) : false}
        onToggleFavorite={toggleFavorite}
        onClose={closeApp}
      />
    </div>
  );
}
