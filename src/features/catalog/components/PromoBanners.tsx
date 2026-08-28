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

/** Banners promocionais avulsos — mesmo visual do carrossel de fixados. */
export function PromoBanners() {
  const { promos, error } = usePromos();

  if (error || promos.length === 0) return null;

  return (
    <div className="scrollbar-none mb-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
      {promos.map((promo) => (
        <a
          key={promo.id}
          href={promo.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative aspect-[16/10] w-full shrink-0 snap-center overflow-hidden rounded-3xl border border-border bg-surface shadow-lift transition-transform hover:scale-[1.01] sm:aspect-[21/8]"
        >
          <img
            src={promo.bannerUrl}
            alt="Promo"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </a>
      ))}
    </div>
  );
}
