import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDb } from "@/lib/firebase";

interface Promo {
  id: string;
  bannerUrl: string;
  linkUrl: string;
  order?: number;
}

function usePromos(): { promos: Promo[]; error: string | null; loaded: boolean } {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const q = query(collection(getDb(), "promos"), orderBy("order", "asc"));
    return onSnapshot(
      q,
      (snap) => {
        const next: Promo[] = [];
        snap.forEach((d) => next.push({ id: d.id, ...(d.data() as object) } as Promo));
        setPromos(next);
        setLoaded(true);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoaded(true);
      },
    );
  }, []);

  return { promos, error, loaded };
}

/** Banners promocionais avulsos — não são jogos, só imagem+link. */
export function PromoBanners() {
  const { promos, error, loaded } = usePromos();

  if (error) {
    return (
      <div className="mb-10 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        Erro ao carregar /promos: {error}
      </div>
    );
  }

  if (loaded && promos.length === 0) {
    return (
      <div className="mb-10 rounded-2xl border border-border bg-surface p-4 text-xs text-muted-foreground">
        (debug) /promos carregou, mas veio vazio — confira o campo "order" nos documentos.
      </div>
    );
  }

  if (promos.length === 0) return null;

  return (
    <div className="mb-10 grid gap-4 sm:grid-cols-2">
      {promos.map((promo) => (
        <a
          key={promo.id}
          href={promo.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-2xl border border-border bg-surface transition-transform hover:scale-[1.01]"
        >
          <img
            src={promo.bannerUrl}
            alt="Promo"
            loading="lazy"
            className="aspect-[16/7] w-full object-cover"
          />
        </a>
      ))}
    </div>
  );
}
