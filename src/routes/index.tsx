import { createFileRoute } from "@tanstack/react-router";
import { StoreProvider } from "@/features/store/StoreProvider";
import { AppShell } from "@/features/layout/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WhiteZ Android — Hub premium de jogos Android" },
      {
        name: "description",
        content:
          "Descubra, favorite e baixe os melhores jogos Android em um catálogo curado com destaques, lançamentos e filtros por gênero.",
      },
      { property: "og:title", content: "WhiteZ Android — Hub premium de jogos Android" },
      {
        property: "og:description",
        content:
          "Catálogo curado de jogos Android com destaques, lançamentos recentes, favoritos e download direto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
