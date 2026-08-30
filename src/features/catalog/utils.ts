import type { FirestoreTimestampLike, GameApp, Genre } from "./types";

export function toDate(value?: FirestoreTimestampLike | null): Date | null {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000);
  return null;
}

/** Um jogo é "novo" se foi publicado nas últimas 24 horas. */
export function isNewApp(app: GameApp): boolean {
  const date = toDate(app.createdAt);
  if (!date) return false;
  return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24) <= 1;
}

/** PRNG com seed — a mesma seed sempre produz a mesma sequência. */
export function mulberry32(seed: number) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Seleção de "Melhores Jogos": 5 jogos sorteados de forma estável, trocando
 * automaticamente a cada 2 dias.
 */
export function getBestGamesSelection(apps: GameApp[], count = 5): GameApp[] {
  if (!apps || apps.length === 0) return [];
  const TWO_DAYS_MS = 1000 * 60 * 60 * 24 * 2;
  const rng = mulberry32(Math.floor(Date.now() / TWO_DAYS_MS));
  const pool = [...apps];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = pool[i]!;
    pool[i] = pool[j]!;
    pool[j] = tmp;
  }

  return pool.slice(0, count);
}

export function filterApps(
  apps: GameApp[],
  activeGenre: string | null,
  searchQuery: string,
): GameApp[] {
  let visible = activeGenre
    ? apps.filter((app) => app.category === activeGenre)
    : apps;
  const q = searchQuery.trim().toLowerCase();
  if (q) {
    visible = visible.filter((app) => (app.title || "").toLowerCase().includes(q));
  }
  return visible;
}

/** Ordena os gêneros seguindo a ordem cadastrada no painel admin. */
export function orderGenresForApps(apps: GameApp[], genres: Genre[]): string[] {
  const genreNames = genres.map((g) => g.name);
  const used = [...new Set(apps.map((a) => a.category).filter(Boolean))] as string[];
  return [
    ...genreNames.filter((name) => used.includes(name)),
    ...used.filter((name) => !genreNames.includes(name)),
  ];
}

export function getRecentApps(apps: GameApp[], count = 12): GameApp[] {
  return [...apps]
    .sort((a, b) => {
      const da = toDate(a.createdAt)?.getTime() ?? 0;
      const db = toDate(b.createdAt)?.getTime() ?? 0;
      return db - da;
    })
    .slice(0, count);
}

export function formatArchitecture(app: GameApp): string {
  return app.architecture && app.architecture.length > 0
    ? `${[...app.architecture].sort().join("/")} bits`
    : "—";
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function validLinks(app: GameApp) {
  return (app.links || []).filter((l) => l && l.url);
}
